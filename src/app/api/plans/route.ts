import { getProductsWithPrices } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function GET() {
  const stripeProducts = await getProductsWithPrices();
  const plans = stripeProducts.map(product => ({
    id: product.id,
    name: product.name,
    prices: product.prices.map(price => ({
      id: price.id,
      interval: price.recurring?.interval === 'month' ? 'month' : 'year',
      unit_amount: price.unit_amount || 0
    })),
    features: product.metadata.features ? JSON.parse(product.metadata.features) : []
  }));

  return NextResponse.json(plans);
}