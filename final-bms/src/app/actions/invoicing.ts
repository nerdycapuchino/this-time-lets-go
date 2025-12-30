"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { renderToStream } from '@react-pdf/renderer';
import InvoiceDocument from "@/components/invoices/InvoiceDocument";
import { Readable } from 'stream';

async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

export async function generateInvoiceForMilestone(milestoneId: number) {
    const supabase = createClient();

    // 1. Fetch data
    const { data: milestone, error: milestoneError } = await supabase
        .from("project_milestones")
        .select(`*, projects(*, profiles(*))`)
        .eq("id", milestoneId)
        .single();

    if (milestoneError || !milestone || !milestone.projects || !milestone.projects.profiles) {
        return { error: "Could not fetch milestone details." };
    }
    
    // 2. Calculate amount by summing time logs for this milestone
    const { data: cards, error: cardsError } = await supabase
        .from("kanban_cards")
        .select("id")
        .eq("milestone_id", milestoneId);

    if (cardsError) return { error: "Could not fetch tasks for milestone." };

    const cardIds = cards.map(c => c.id);
    const { data: timeLogs, error: timeLogsError } = await supabase
        .from("time_logs")
        .select("cost")
        .in("kanban_card_id", cardIds);

    if (timeLogsError) return { error: "Could not fetch time logs for milestone." };

    const amount = timeLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
    const projectCurrency = milestone.projects.currency;

    // 3. Create invoice record in 'draft' state
    const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
            project_id: milestone.project_id,
            milestone_id: milestone.id,
            client_id: milestone.projects.client_id,
            amount: amount,
            status: 'draft',
            currency: projectCurrency, // Set the currency
            due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            organization_id: milestone.projects.organization_id
        })
        .select()
        .single();
        
    if (invoiceError) return { error: `Could not create invoice: ${invoiceError.message}` };

    // 4. Render PDF
    const pdfStream = await renderToStream(
        <InvoiceDocument 
            invoice={invoice} 
            project={milestone.projects} 
            client={milestone.projects.profiles}
        />
    );
    const pdfBuffer = await streamToBuffer(pdfStream as Readable);

    // 5. Upload PDF to storage
    const filePath = `invoices/${milestone.project_id}/invoice-${invoice.id}.pdf`;
    const { error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(filePath, pdfBuffer, { contentType: 'application/pdf' });

    if (uploadError) return { error: `Could not upload PDF: ${uploadError.message}` };

    // 6. Update invoice with PDF path
    const { error: updateError } = await supabase
        .from("invoices")
        .update({ pdf_storage_path: filePath })
        .eq("id", invoice.id);
        
    if (updateError) return { error: `Could not update invoice path: ${updateError.message}` };

    // 7. (TODO) Send email

    revalidatePath(`/dashboard/projects/${milestone.project_id}`);
    revalidatePath(`/dashboard/invoices`);

    return { success: `Invoice #${invoice.id} generated for ${amount.toFixed(2)} ${projectCurrency}.` };
}
