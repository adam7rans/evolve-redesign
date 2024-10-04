import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

// Server-side initialization
let serverStripe: Stripe | null = null;
if (typeof window === 'undefined') {
  // Check if running on the server
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
  }
  // Initialize server-side Stripe instance
  serverStripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
}

// Client-side initialization
let clientStripe: Promise<StripeJS | null>;
if (typeof window !== 'undefined') {
  // Check if running in the browser
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in the environment variables');
  }
  // Initialize client-side Stripe instance
  clientStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

/**
 * Fetches products with their associated prices from Stripe
 * @returns An array of products with their prices
 * @throws Error if server-side Stripe is not initialized or if called on client-side
 */
export async function getProductsWithPrices() {
  if (!serverStripe) {
    throw new Error('Stripe instance is not initialized');
  }

  console.log("Fetching products from Stripe...");
  const products = await serverStripe.products.list({
    expand: ['data.default_price'],
    active: true,
  });

  const productsWithPrices = await Promise.all(products.data.map(async (product) => {
    const prices = await serverStripe!.prices.list({
      product: product.id,
      active: true,
    });
    return {
      ...product,
      prices: prices.data,
    };
  }));

  console.log("Products fetched:", productsWithPrices);
  return productsWithPrices;
}

export { serverStripe, clientStripe };