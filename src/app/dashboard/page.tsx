'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AppHeader } from '@/components/AppHeader';

type WrittenItem = {
  id: string;
  content: string;
  createdAt: Date;
};

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [writtenContent, setWrittenContent] = useState('');
  const [writtenItems, setWrittenItems] = useState<WrittenItem[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkUserAndWelcome = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const welcome = searchParams?.get('welcome');
      if (welcome === 'true') {
        setShowWelcome(true);
        router.replace('/dashboard');
      }
    };

    checkUserAndWelcome();
  }, [router, searchParams]);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setWrittenContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = () => {
    if (writtenContent.trim()) {
      const newItem: WrittenItem = {
        id: Date.now().toString(),
        content: writtenContent.trim(),
        createdAt: new Date(),
      };
      setWrittenItems(prevItems => [newItem, ...prevItems]);
      setWrittenContent('');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        {showWelcome && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p className="font-bold">Welcome to your dashboard!</p>
            <p>You've successfully registered, confirmed your email, and purchased a subscription.</p>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Dashboard</h1>
        
        {/* Codex Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Codex</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Written Column */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Written</h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                  <textarea
                    value={writtenContent}
                    onChange={handleTextareaChange}
                    placeholder="Type your content here..."
                    className="w-full p-2 mb-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md resize-none overflow-hidden"
                    rows={1}
                    style={{ minHeight: '2.5rem' }}
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
                {/* Written Items List */}
                <div className="mt-4 space-y-2">
                  {writtenItems.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow">
                      <p className="text-gray-800 dark:text-gray-200">{item.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.createdAt.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sigils & Mantras Column */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Sigils & Mantras</h3>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
                  <p className="text-gray-700 dark:text-gray-300">
                    Your sigils and mantras will appear here.
                  </p>
                  {/* Add more content for the Sigils & Mantras section */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}