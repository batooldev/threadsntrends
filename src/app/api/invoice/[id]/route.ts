import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import dbConnect from '@/lib/db';
import Order from '@/lib/orders';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  // Change from findById to findOne with orderID
  console.log("Fetching order with ID:", params.id);
  const order = await Order.findOne({ orderID: params.id });
  if (!order) {
    return new NextResponse('Order not found', { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 780;

  const drawText = (text: string, x: number, size = 12, f = font) => {
    page.drawText(text, { x, y, size, font: f, color: rgb(0, 0, 0) });
  };

  const drawLine = () => {
    y -= 5;
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 15;
  };

  // Header
  drawText('ThreadsNTrends', 50, 20, boldFont);
  drawText('Invoice', 350, 20, boldFont);
  y -= 25;
  drawText('Invoice #:', 350, 12, boldFont);
  drawText(`${order.orderID}`, 430);
  y -= 15;
  drawText('Date:', 350, 12, boldFont);
  drawText(`${new Date(order.createdAt).toDateString()}`, 400);
  y -= 30;

  // Bill To Section
  drawText('Bill To:', 50, 12, boldFont);
  y -= 15;
  drawText('Name:', 50, 12, boldFont);
  drawText(`${order.customerName}`, 110);
  y -= 15;
  drawText('Email:', 50, 12, boldFont);
  drawText(`${order.customerEmail}`, 110);
  y -= 15;
  drawText('Address:', 50, 12, boldFont);
  drawText(`${order.shippingAddress.address}`, 110);
  y -= 15;
  drawText('City/Zip:', 50, 12, boldFont);
  drawText(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 110);
  y -= 15;
  drawText('Phone:', 50, 12, boldFont);
  drawText(`${order.shippingAddress.phone}`, 110);
  y -= 25;

  // Table Header
  drawText('No.', 50, 12, boldFont);
  drawText('Item', 80, 12, boldFont);
  drawText('Size', 250, 12, boldFont);
  drawText('Qty', 310, 12, boldFont);
  drawText('Price (PKR)', 380, 12, boldFont);
  drawText('Total (PKR)', 470, 12, boldFont);
  drawLine();

  // Table Body
  order.products.forEach((item: any, i: number) => {
    drawText(`${i + 1}`, 50);
    drawText(item.name, 80);
    drawText(item.size || '-', 250);
    drawText(`${item.quantity}`, 310);
    drawText(`${item.price.toFixed(2)}`, 380);
    drawText(`${(item.price * item.quantity).toFixed(2)}`, 470);
    y -= 20;
  });

  drawLine();

  // Totals Section
  drawText('Subtotal:', 380, 12, boldFont);
  drawText(`PKR ${(order.totalAmount - order.shippingCost).toFixed(2)}`, 470);
  y -= 20;

  drawText('Shipping:', 380, 12, boldFont);
  drawText(`PKR ${order.shippingCost.toFixed(2)}`, 470);
  y -= 20;

  drawText('Total:', 380, 14, boldFont);
  drawText(`PKR ${order.totalAmount.toFixed(2)}`, 470, 14, boldFont);
  y -= 30;

  // Terms Section
  drawText('Terms & Conditions', 50, 12, boldFont);
  y -= 20;
  drawText('- Payment is due upon receipt.', 60);
  y -= 20;
  drawText('- Late payments may incur charges.', 60);
  y -= 20;
  drawText('- Make payments to ThreadsNTrends.', 60);
  y -= 30;

  drawText('Payment Method:', 50, 12, boldFont);
  drawText(order.paymentMethod.toUpperCase(), 170);
  y -= 20;

  drawText('Thank you for shopping with ThreadsNTrends!', 50, 12);
  drawLine();

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${order.orderID}.pdf`,
    },
  });
}
