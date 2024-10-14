import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Add this line at the top of the file
export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface GoogleAccountInfoProps {
  user: GoogleUser;
  onChooseAnotherAccount: () => void;
}

export default function GoogleAccountInfo({ user, onChooseAnotherAccount }: GoogleAccountInfoProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  console.log('GoogleAccountInfo rendered with user:', user);
  
  const handleClick = async () => {
    if (!isProcessing) {
      setIsProcessing(true);
      setError(null);
      console.log('Choose another account button clicked');
      try {
        // Sign out locally
        console.log('Attempting to sign out...');
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Error signing out:', signOutError);
          throw signOutError;
        }

        console.log('User signed out successfully');
        onChooseAnotherAccount();
      } catch (err) {
        console.error('Error choosing another account:', err);
        setError('Failed to process request. Please try again.');
      } finally {
        setIsProcessing(false);
        console.log('Sign out process completed');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src={user.picture}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={handleClick}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Choose another account'}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
