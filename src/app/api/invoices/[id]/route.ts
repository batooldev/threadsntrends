import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import dbConnect from '@/lib/db'; // your db connection utility
import Order from '@/lib/orders'; // your order model

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const order = await Order.findById(params.id);
  if (!order) return new NextResponse('Order not found', { status: 404 });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 800;

  const drawText = (text: string, x: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    y -= 20;
  };

  drawText(`INVOICE - Order ${order.orderID}`, 50, 18);
  drawText(`Date: ${new Date(order.createdAt).toDateString()}`, 50);
  drawText(`Customer: ${order.customerName}`, 50);
  drawText(`Email: ${order.customerEmail}`, 50);
  drawText(`Phone: ${order.shippingAddress.phone}`, 50);
  drawText(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 50);

  drawText(`\nShipping Address:`, 50);
  drawText(`${order.shippingAddress.address}, ${order.shippingAddress.city}`, 60);
  drawText(`Postal Code: ${order.shippingAddress.postalCode}`, 60);

  drawText(`\nProducts:`, 50);
  order.products.forEach((item: any, i: number) => {
    drawText(`${i + 1}. ${item.name} - ${item.size} - Qty: ${item.quantity} - PKR ${item.price}`, 60);
  });

  drawText(`\nSubtotal: PKR ${order.totalAmount - order.shippingCost}`, 50);
  drawText(`Shipping: PKR ${order.shippingCost}`, 50);
  drawText(`Total: PKR ${order.totalAmount}`, 50, 14);

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${order.orderID}.pdf`,
    },
  });
}
