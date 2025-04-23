import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import dbConnect from '@/lib/db';
import Order from '@/lib/orders';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  console.log("Fetching order with ID:", params.id);
  const order = await Order.findOne({ orderID: params.id });
  if (!order) {
    return new NextResponse('Order not found', { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size
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

  // Improved text wrapping function
  const wrapText = (text: string, maxChars = 30): string[] => {
    if (!text) return [''];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + word).length <= maxChars) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const addPageIfNeeded = () => {
    if (y < 100) {
      page = pdfDoc.addPage([595, 842]);
      y = 780;
      // Column positions with increased spacing between Size and Qty
      drawText('No.', 50, 12, boldFont);
      drawText('Item', 80, 12, boldFont);
      drawText('Size', 310, 12, boldFont); 
      drawText('Qty', 390, 12, boldFont);   // Moved further right
      drawText('Price (PKR)', 440, 12, boldFont); // Adjusted
      drawText('Total (PKR)', 510, 12, boldFont); // Adjusted
      drawLine();
    }
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
  drawText('Bill To', 50, 12, boldFont);
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

  // Table Header - Adjusted column positions with more space between Size and Qty
  drawText('No.', 50, 12, boldFont);
  drawText('Item', 80, 12, boldFont);
  drawText('Size', 310, 12, boldFont);
  drawText('Qty', 390, 12, boldFont);   // Moved further right
  drawText('Price (PKR)', 440, 12, boldFont); // Adjusted
  drawText('Total (PKR)', 510, 12, boldFont); // Adjusted
  drawLine();

  // Table Body
  order.products.forEach((item: any, i: number) => {
    const nameLines = wrapText(item.name, 30); // Reduced max chars to fit better
    addPageIfNeeded();

    drawText(`${i + 1}`, 50);
    
    // Draw item name with proper wrapping
    nameLines.forEach((line, idx) => {
      const lineY = y - idx * 15;
      page.drawText(line, { x: 80, y: lineY, size: 12, font, color: rgb(0, 0, 0) });
    });

    // Draw other columns at the same height as the first line of the item name
    drawText(item.size || '-', 310);
    drawText(`${item.quantity}`, 390);  // Adjusted
    drawText(`${item.price.toFixed(2)}`, 440);  // Adjusted
    drawText(`${(item.price * item.quantity).toFixed(2)}`, 510);  // Adjusted
    
    // Adjust y position based on number of lines in item name
    y -= Math.max(nameLines.length * 15, 15);
    y -= 5; // Add a little extra spacing between rows
  });

  drawLine();

  // Totals Section - Fixed alignment and added PKR consistently
  drawText('Subtotal:', 415, 12, boldFont);  
  drawText(`${(order.totalAmount - order.shippingCost).toFixed(2)}`, 480);  
  y -= 20;

  drawText('Shipping:', 415, 12, boldFont);  
  drawText(`${order.shippingCost.toFixed(2)}`, 480);  
  y -= 20;

  drawText('Total:', 415, 14, boldFont);  
  drawText(`PKR ${order.totalAmount.toFixed(2)}`, 480, 14, boldFont);  
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