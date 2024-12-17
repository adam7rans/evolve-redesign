import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'
import { AppHeader } from '@/components/shared/AppHeader'

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log('Dashboard: No session found, redirecting to login')
    redirect('/login')
  }

  console.log('Dashboard: Session found, fetching user data')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (searchParams.payment_success === 'true' && !profile.has_paid) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ has_paid: true })
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error updating payment status:', error)
    } else {
      profile.has_paid = true
    }
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', session.user.id)

  console.log('Dashboard: User data fetched, rendering dashboard')

  return (
    <>
      <AppHeader />
      <div className="flex">
        <main className="flex-1 ml-[70px]">
          <DashboardClient 
            user={session.user} 
            profile={profile} 
            projects={projects || []} 
            paymentSuccess={searchParams.payment_success === 'true'}
          />
        </main>
      </div>
    </>
  )
}
