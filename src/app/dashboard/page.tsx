import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'
import { AppHeader } from '@/components/shared/AppHeader'
import { Sidebar } from './Sidebar'

export default async function DashboardPage() {
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

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', session.user.id)

  console.log('Dashboard: User data fetched, rendering dashboard')

  return (
    <>
      <AppHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-[70px]">
          <DashboardClient user={session.user} profile={profile} projects={projects || []} />
        </main>
      </div>
    </>
  )
}