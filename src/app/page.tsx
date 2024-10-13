import { getProductsWithPrices } from '@/lib/stripe';
import HomePageClient from './HomePageClient';
import { cookies } from 'next/headers'

export default async function HomePage() {
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

  // Read the cookie
  const cookieStore = cookies()
  const selectedPlanCookie = cookieStore.get('selectedPlan')
  const selectedPlan = selectedPlanCookie ? JSON.parse(selectedPlanCookie.value) : null

  return (
    <HomePageClient plans={plans} initialSelectedPlan={selectedPlan} />
  );
}
