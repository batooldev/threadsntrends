import { headers } from 'next/headers';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req: Request) {
  const sig = headers().get('stripe-signature');
  let event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook error: ${err}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('Payment successful:', event.data.object);
  }

  return new Response(null, { status: 200 });
}
