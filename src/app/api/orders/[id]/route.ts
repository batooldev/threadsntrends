import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import orders from "@/lib/orders";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const orderData = await request.json();

        await connectDB();

        const updatedOrder = await orders.findOneAndUpdate(
            { orderID: id },
            orderData,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}