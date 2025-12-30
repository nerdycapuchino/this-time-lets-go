import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface InvoiceData {
  invoiceNumber: string
  date: string
  clientName: string
  projectName: string
  items: { description: string; amount: number }[]
  total: number
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const doc = new jsPDF()

  // -- Header --
  doc.setFontSize(20)
  doc.text('INVOICE', 14, 22)
  
  doc.setFontSize(10)
  doc.text('Architectural Firm Name', 14, 30)
  doc.text('123 Design Street', 14, 35)
  doc.text('City, State, Zip', 14, 40)

  // -- Invoice Details --
  doc.text(`Invoice #: ${data.invoiceNumber}`, 140, 30)
  doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 140, 35)
  
  // -- Bill To --
  doc.text('Bill To:', 14, 55)
  doc.setFont('helvetica', 'bold')
  doc.text(data.clientName, 14, 60)
  doc.setFont('helvetica', 'normal')
  doc.text(`Project: ${data.projectName}`, 14, 65)

  // -- Table --
  autoTable(doc, {
    startY: 75,
    head: [['Description', 'Amount']],
    body: data.items.map(item => [
      item.description, 
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount)
    ]),
    foot: [['Total', new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.total)]],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }, // Blue header
  })

  // -- Footer --
  const finalY = (doc as any).lastAutoTable.finalY || 150
  doc.text('Thank you for your business.', 14, finalY + 20)
  doc.text('Payment due within 14 days.', 14, finalY + 25)

  return doc
}