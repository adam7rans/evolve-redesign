import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Creating PaymentIntent...');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000, // amount in cents
        currency: "usd",
        payment_method_types: ['card', 'link', 'paypal'],
      });
      console.log('PaymentIntent created successfully');

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Error creating PaymentIntent:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}