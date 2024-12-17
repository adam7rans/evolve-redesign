'use client';

import { User } from '@supabase/auth-helpers-nextjs';
import { SubHeader } from './subheader';
import ProjectsTable from './projects-table';
import CreateProjectForm from './project-creation-form';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface DashboardClientProps {
  user: User;
  profile: any; // Replace 'any' with your profile type
  projects: any[]; // Replace 'any[]' with your project type
  paymentSuccess: boolean;
}

export default function DashboardClient({ user, profile, projects, paymentSuccess }: DashboardClientProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (paymentSuccess) {
      toast.success('Payment successful! Welcome to your premium dashboard.')
    }
  }, [paymentSuccess]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Toaster position="top-right" />
      <SubHeader
        title="Projects"
        buttonLabel={showCreateForm ? "View Projects" : "Create New Project"}
        buttonLink="#"
        onButtonClick={() => setShowCreateForm(!showCreateForm)}
      />
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Welcome to your dashboard, {user.email}</h1>
        {showCreateForm ? (
          <CreateProjectForm />
        ) : (
          <ProjectsTable projects={projects} />
        )}
      </main>
    </div>
  );
}
