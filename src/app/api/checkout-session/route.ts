import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error creating checkout session', message: error }, { status: 500 });
  }
}