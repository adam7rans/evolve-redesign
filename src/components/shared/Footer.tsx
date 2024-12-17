'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { ThemeToggle } from './ThemeToggle';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <footer className="text-black dark:text-white pt-12 pb-4 px-4 mt-24 md:px-24 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start mb-8">
        {/* Logo and Description */}
        <div className="mb-8 md:mb-0">
          <Link href="/" className="flex items-center space-x-2 text-foreground">
            <Image
              src="/Evolve Network Logo.svg"
              alt="Evolve Network Logo"
              width={60}
              height={60}
              className="h-15 w-15"
              style={{ color: 'inherit' }}
            />
            <span className="font-bold text-lg">Evolve Network</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Building the future of decentralized AI
          </p>
        </div>
        
        {/* Product Links */}
        <div className="mb-8 md:mb-0">
          <h4 className="font-semibold mb-4">Product</h4>
          <nav className="flex flex-col space-y-3">
            <Link href="/docs" className="text-muted-foreground hover:text-primary">Documentation</Link>
            <Link href="/agents" className="text-muted-foreground hover:text-primary">Agents</Link>
            <Link href="/network" className="text-muted-foreground hover:text-primary">Network</Link>
            <Link href="/roadmap" className="text-muted-foreground hover:text-primary">Roadmap</Link>
          </nav>
        </div>

        {/* Company Links */}
        <div className="mb-8 md:mb-0">
          <h4 className="font-semibold mb-4">Company</h4>
          <nav className="flex flex-col space-y-3">
            <Link href="/about" className="text-muted-foreground hover:text-primary">About</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
          </nav>
        </div>

        {/* Social Media Icons */}
        <div className="mb-8 md:mb-0">
          <h4 className="font-semibold mb-4">Connect</h4>
          <nav className="grid grid-cols-2 gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FaInstagram className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FaYoutube className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FaTiktok className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FaXTwitter className="w-6 h-6" />
            </Link>
          </nav>
        </div>
        
        {/* Email Signup Form */}
        <div className="w-full md:w-auto">
          <h3 className="text-lg font-semibold mb-4">Join the Network</h3>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <Link href="/privacy" className="text-sm text-muted-foreground no-underline hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground no-underline hover:underline">Terms of Service</Link>
        </div>
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <ThemeToggle />
          <p className="text-sm text-muted-foreground"> 2024 Evolve Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
