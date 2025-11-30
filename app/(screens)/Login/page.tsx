"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/firebase/config'; // Correctly import auth

export default function LoginPage() {
  const router = useRouter();
  
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for loading, errors, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 

  // Function to handle the login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setLoading(true);

    try {
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful! User ID:", userCredential.user.uid);
      
      // On successful login, show success message and navigate to Linktree
      setSuccess("Login Successful! Redirecting to Linktree dashboard...");
      
      setTimeout(() => {
          router.push('/linktree');
      }, 2000);
      
    } catch (err: any) {
      console.error("Login Error:", err);
      // Display user-friendly error messages
      let errorMessage = "An unexpected error occurred during login.";
      
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "Invalid email or password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Access temporarily blocked due to too many failed attempts. Try again later.";
          break;
        default:
          errorMessage = err.message || "Login failed. Please check your credentials.";
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[#193d6e] flex flex-col items-center p-4">
      
      {/* --- Header --- */}
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/10 border-b border-white/20 z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wider">
            <span className="text-[#4a90e2]">AQUA</span>FLOW
          </h1>
          <button 
            className="text-white text-sm font-medium hover:text-[#4a90e2] transition duration-200"
            onClick={() => handleNavigation("/")}
          >
            Home
          </button>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="grow flex items-center justify-center w-full pt-20">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-lg rounded-3xl shadow-[0_20px_50px_rgba(74,144,226,0.3)] p-8 space-y-8 border border-white/20">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Sign In to <span className="text-[#4a90e2]">AQUA</span>FLOW
            </h2>
            <p className="text-gray-400">
              Access your digital flow
            </p>
          </div>

          {/* Success Message Display */}
          {success && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500 text-green-300 text-sm font-medium text-center shadow-lg">
              {success}
            </div>
          )}

          {/* Error Message Display */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-300 text-sm font-medium text-center shadow-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading} 
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition duration-200 disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] transition duration-200 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* --- Action Buttons --- */}
            <div className="space-y-4 pt-2">
                
              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-lg border-2 bg-[#4a90e2] border-[#4a90e2] text-white hover:bg-white hover:text-[#4a90e2] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging In...' : 'Login'}
              </button>

              {/* Sign Up Option */}
              <div className="text-center text-sm text-gray-400">
                Don't have an account?
                <button
                  type="button" 
                  className="ml-1 font-semibold text-[#4a90e2] hover:text-white transition duration-200 focus:outline-none"
                  onClick={() => handleNavigation("/signup")}
                >
                  Sign Up
                </button>
              </div>
              
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}
