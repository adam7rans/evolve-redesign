'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaInstagram, FaYoutube, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <footer className="text-black dark:text-white pt-12 pb-4 px-4 mt-24 md:px-24 bg-background overflow-visible">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start mb-8 overflow-visible">
        {/* Logo and Description */}
        <div className="mb-8 md:mb-0 overflow-visible">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground overflow-visible">
            Building the future of decentralized AI
          </p>
        </div>
        
        {/* Product Links */}
        <div className="mb-8 md:mb-0 overflow-visible">
          <h4 className="font-semibold mb-4 overflow-visible">Product</h4>
          <nav className="flex flex-col space-y-3 overflow-visible">
            <Link href="/docs" className="text-muted-foreground hover:text-primary overflow-visible">Documentation</Link>
            <Link href="/agents" className="text-muted-foreground hover:text-primary overflow-visible">Agents</Link>
            <Link href="/network" className="text-muted-foreground hover:text-primary overflow-visible">Network</Link>
            <Link href="/roadmap" className="text-muted-foreground hover:text-primary overflow-visible">Roadmap</Link>
          </nav>
        </div>

        {/* Company Links */}
        <div className="mb-8 md:mb-0 overflow-visible">
          <h4 className="font-semibold mb-4 overflow-visible">Company</h4>
          <nav className="flex flex-col space-y-3 overflow-visible">
            <Link href="/about" className="text-muted-foreground hover:text-primary overflow-visible">About</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary overflow-visible">Contact</Link>
          </nav>
        </div>

        {/* Social Media Icons */}
        <div className="mb-8 md:mb-0 overflow-visible">
          <h4 className="font-semibold mb-4 overflow-visible">Connect</h4>
          <nav className="grid grid-cols-2 gap-4 overflow-visible">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors overflow-visible">
              <FaInstagram className="w-6 h-6 overflow-visible" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors overflow-visible">
              <FaYoutube className="w-6 h-6 overflow-visible" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors overflow-visible">
              <FaTiktok className="w-6 h-6 overflow-visible" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors overflow-visible">
              <FaXTwitter className="w-6 h-6 overflow-visible" />
            </Link>
          </nav>
        </div>
        
        {/* Email Signup Form */}
        <div className="w-full md:w-auto overflow-visible">
          <h3 className="text-lg font-semibold mb-4 overflow-visible">Join the Network</h3>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 overflow-visible">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background overflow-visible"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors overflow-visible"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="pt-8 flex flex-col md:flex-row justify-between items-center overflow-visible">
        <div className="flex space-x-4 mb-4 md:mb-0 overflow-visible">
          <Link href="/privacy" className="text-sm text-muted-foreground no-underline hover:underline overflow-visible">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground no-underline hover:underline overflow-visible">Terms of Service</Link>
        </div>
        <div className="flex items-center space-x-4 mb-4 md:mb-0 overflow-visible">
          <ThemeToggle />
          <p className="text-sm text-muted-foreground overflow-visible"> 2024 Evolve Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
