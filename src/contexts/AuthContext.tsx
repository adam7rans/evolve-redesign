'use client';

import React, { createContext, useContext } from 'react';

// Define the shape of our authentication context
interface AuthContextType {
  user: null;
  hasPaid: boolean;
  signOut: () => Promise<void>;
  checkPaymentStatus: () => Promise<boolean>;
}

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  hasPaid: false,
  signOut: async () => {},
  checkPaymentStatus: async () => false,
});

// Simplified AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authValue = {
    user: null,
    hasPaid: false,
    signOut: async () => {},
    checkPaymentStatus: async () => false,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};