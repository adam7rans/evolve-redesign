'use client';

import Link from 'next/link';

export default function PaymentConfirmationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Payment Successful</h1>
      <p className="mb-4 text-black dark:text-white">
        Your payment was successful! A receipt has been sent to your email address.
      </p>
      <Link href="/dashboard" className="text-blue-500 hover:underline">
        Go to Dashboard
      </Link>
    </div>
  );
}