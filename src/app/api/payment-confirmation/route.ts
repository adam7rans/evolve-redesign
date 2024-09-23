import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // TODO: Implement actual payment verification logic
  const paymentData = await request.json();
  const paymentWasSuccessful = paymentData.status === 'succeeded'; // Example condition

  if (paymentWasSuccessful) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ has_paid: true })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
      }

      console.log('Payment status updated successfully for user:', user.id);
      return NextResponse.json({ success: true });
    }
  }

  return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
}