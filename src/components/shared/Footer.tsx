'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CodexLogo from '@/components/icons/CodexLogo';
import { FaInstagram, FaYoutube, FaTiktok, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle email submission logic here
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <footer className="text-black dark:text-white py-12 px-4 mt-24 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="mb-8 md:mb-0">
          <CodexLogo className="h-8 w-auto mb-6 fill-current text-black dark:text-white" />
        </div>
        
        <div className="mb-8 md:mb-0">
          <nav className="flex flex-col space-y-3">
            <Link href="#" className="hover:underline">Features</Link>
            <Link href="#" className="hover:underline">Pricing</Link>
            <Link href="#" className="hover:underline">About</Link>
            <Link href="#" className="hover:underline">Blog</Link>
          </nav>
        </div>

        <div className="mb-8 md:mb-0">
          <nav className="grid grid-cols-2 gap-4">
            <Link href="#" className="hover:text-blue-500 transition-colors">
              <FaInstagram className="w-6 h-6" />
            </Link>
            <Link href="#" className="hover:text-red-500 transition-colors">
              <FaYoutube className="w-6 h-6" />
            </Link>
            <Link href="#" className="hover:text-pink-500 transition-colors">
              <FaTiktok className="w-6 h-6" />
            </Link>
            <Link href="#" className="hover:text-blue-400 transition-colors">
              <FaXTwitter className="w-6 h-6" />
            </Link>
          </nav>
        </div>
        
        <div className="w-full md:w-auto">
          <h3 className="text-lg font-semibold mb-4">Get early access to CODEX</h3>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Early Access
            </button>
          </form>
        </div>
      </div>
      
      <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
          <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 CODEX. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
