import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const { amount, userId } = await req.json();
    console.log('Received payment intent request:', { amount, userId });

    if (!amount || !userId || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid parameters:', { amount, userId });
      return NextResponse.json({ error: 'Invalid or missing parameters' }, { status: 400 });
    }

    console.log('Creating payment intent');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      payment_method_types: ['card', 'paypal'],
      metadata: { userId },
    });

    console.log('Payment intent created:', paymentIntent.id);
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Error creating payment intent' }, { status: 500 });
  }
}
