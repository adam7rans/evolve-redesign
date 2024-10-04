import { NextResponse } from 'next/server';
import { getProductsWithPrices } from '@/lib/stripe';

export async function GET() {
  try {
    const productsWithPrices = await getProductsWithPrices();
    return NextResponse.json(productsWithPrices);
  } catch (error) {
    console.error('Error fetching products with prices:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}