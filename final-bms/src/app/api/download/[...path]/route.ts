import { createClient } from "@/lib/supabase/server";
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const filePath = resolvedParams.path.join('/');

  const { data, error } = await supabase.storage.from("blueprints").download(filePath);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(data, {
    headers: {
      "Content-Type": data.type,
      "Content-Disposition": `attachment; filename="${filePath.split('/').pop()}"`,
    },
  });
}
