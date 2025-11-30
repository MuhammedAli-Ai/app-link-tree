"use client"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
// import { updateProfile } from 'firebase/auth'; 

import { auth } from '@/firebase/config'; 
import { useRouter } from 'next/navigation'; // UPDATED: Use the correct hook for Next.js App Router

// Define a type for the status message state
interface StatusMessage {
    type: 'success' | 'error' | '';
    text: string;
}

export default function Signup() { 
    const router = useRouter(); // Initialize the router hook

    // New state for the Name field
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); 
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage>({ type: '', text: '' });

    // Signup Function with Try-Catch Error Handling
    const handleSignup = async (e: React.FormEvent) => { 
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' }); 

        // Basic validation: Check if passwords match
        if (password !== confirmPassword) {
            setStatusMessage({ type: 'error', text: 'Passwords do not match!' });
            setLoading(false);
            return; 
        }
        
        // Basic validation: Password strength
        if (password.length < 6) {
            setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            setLoading(false);
            return;
        }

        try {
            // 1. Create the user account using email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // 2. (Optional) Update Profile here if needed
            // if (user && fullName) { ... }

            // Success Message
            setStatusMessage({ 
                type: 'success', 
                text: `Account created successfully for ${fullName}! Redirecting...` 
            });

            // --- REDIRECT LOGIC HERE ---
            // We wait a brief moment so the user sees the success message, then push to linktree
            setTimeout(() => {
                router.push("/linktree");
            }, 1500); // 1.5 second delay for better UX

        } catch (error) {
            // Error Handling
            const firebaseError = error as { code: string }; 
            const errorCode = firebaseError.code;
            let errorMessage = "An unexpected error occurred. Please try again.";

            if (errorCode === 'auth/email-already-in-use') {
                errorMessage = "This email address is already in use.";
            } else if (errorCode === 'auth/invalid-email') {
                errorMessage = "The email address is badly formatted.";
            } else if (errorCode === 'auth/weak-password') {
                errorMessage = "The password is too weak.";
            } else {
                console.error("Firebase Auth Error:", error);
            }

            setStatusMessage({ 
                type: 'error', 
                text: errorMessage 
            });
            setLoading(false); // Only stop loading here if there is an error
        }
        // Note: We don't stop loading on success so the button doesn't flash back to "Sign Up" before redirection
    };

    // Helper for status message styling
    const getStatusClasses = (type: StatusMessage['type']): string => {
        if (type === 'error') return 'bg-red-500/10 border-red-500 text-red-300';
        if (type === 'success') return 'bg-green-500/10 border-green-500 text-green-300';
        return '';
    };

    // Component RENDER
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-8 border border-white/10">
                <h2 className="text-4xl font-extrabold text-white text-center tracking-tight">
                    Join <span className="text-[#4a90e2] drop-shadow-lg">AQUAFLOW</span>
                </h2>
                
                <p className="text-center text-gray-400">
                    Create your account to get started.
                </p>

                {statusMessage.text && (
                    <div className={`p-3 rounded-lg border text-center font-medium ${getStatusClasses(statusMessage.type)}`}>
                        {statusMessage.text}
                    </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSignup}>
                    {/* FULL NAME Input */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            name="fullName" 
                            type="text"
                            required
                            value={fullName} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2CA3BC] transition duration-200"
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email" 
                            type="email"
                            required
                            value={email} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2CA3BC] transition duration-200"
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
                            name="password" 
                            type="password"
                            required
                            value={password} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2CA3BC] transition duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword" 
                            type="password"
                            required
                            value={confirmPassword} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2CA3BC] transition duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        // NOTE: onClick removed here. The logic is now inside handleSignup
                        disabled={loading} 
                        className={`w-full py-3 rounded-lg text-lg font-semibold transition duration-300 shadow-lg shadow-[#2CA3BC]/30 active:scale-[0.99] ${
                            loading 
                                ? 'bg-[#4a90e2] cursor-not-allowed' 
                                : 'bg-[#4a90e2] text-white hover:bg-[#ffffff] hover:text-[#4a90e2]'
                        }`}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center text-sm mt-4">
                    <a href="/Login" className="font-medium text-[#4a90e2] hover:text-white transition duration-200">
                        Already have an account? Sign in.
                    </a>
                </div>
            </div>
        </div>
    );
}