import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function getProductsWithPrices() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  const productsWithPrices = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        metadata: product.metadata,
        prices: prices.data.map((price) => ({
          id: price.id,
          recurring: price.recurring,
          unit_amount: price.unit_amount,
        })),
      };
    })
  );

  return productsWithPrices;
}

export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  customerId,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: customerId,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}
