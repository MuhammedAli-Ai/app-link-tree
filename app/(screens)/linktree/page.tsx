"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import useRouter
import { signOut, User } from 'firebase/auth';
import { ref, push, onValue, remove, getDatabase, DatabaseReference, DataSnapshot } from 'firebase/database';

// Corrected import path for your initialized Firebase auth and database instances
import { auth, rtdb } from '@/firebase/config'; 

// --- TypeScript Interfaces ---

// Interface for a single link item
interface LinkItem {
    id: string;
    title: string;
    url: string;
    timestamp: number;
}

// Interface for the form input state
interface FormState {
    title: string;
    url: string;
}

// Interface for the component status
interface StatusMessage {
    type: 'info' | 'error' | 'success';
    text: string;
}

// Helper to determine the database path
const getLinksPath = (userId: string): DatabaseReference => {
    // Structure: /links/{userId}
    return ref(rtdb, `links/${userId}`);
};

export default function Dashboard () {
    const router = useRouter(); // 2. Initialize the router
    const [user, setUser] = useState<User | null>(null);
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [form, setForm] = useState<FormState>({ title: '', url: '' });
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<StatusMessage | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    // 1. Authentication Check and Realtime Data Listener
    useEffect(() => {
        // Simple listener to check if the user is logged in
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser:any) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                // User is signed in, set up RTDB listener
                const linksRef = getLinksPath(currentUser.uid);

                const listener = onValue(linksRef, (snapshot: DataSnapshot) => {
                    const data = snapshot.val();
                    const loadedLinks: LinkItem[] = [];

                    if (data) {
                        // Firebase returns data as an object of objects. We convert it to an array.
                        Object.keys(data).forEach(key => {
                            loadedLinks.push({
                                id: key,
                                title: data[key].title,
                                url: data[key].url,
                                timestamp: data[key].timestamp || 0,
                            });
                        });
                    }
                    
                    // Sort links by timestamp (newest first)
                    loadedLinks.sort((a, b) => b.timestamp - a.timestamp);
                    setLinks(loadedLinks);
                }, (error) => {
                    console.error("RTDB Error:", error);
                    setStatus({ type: 'error', text: 'Failed to load links: ' + error.message });
                });

                // Clean up RTDB listener on component unmount or user change
                return () => listener();
            } else {
                // No user, clear links
                setLinks([]);
            }
        });

        // Clean up auth listener on component unmount
        return () => unsubscribeAuth();
    }, []); 

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 2. Add Link Function
    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            setStatus({ type: 'error', text: 'You must be logged in to add links.' });
            return;
        }

        if (!form.title.trim() || !form.url.trim()) {
            setStatus({ type: 'error', text: 'Both Title and URL are required.' });
            return;
        }
        
        const validUrl = form.url.startsWith('http') ? form.url : `https://${form.url}`;
        
        const newLinkData = {
            title: form.title.trim(),
            url: validUrl,
            timestamp: Date.now(),
        };

        try {
            const linksRef = getLinksPath(user.uid);
            
            // Push a new object to the RTDB reference
            await push(linksRef, newLinkData);
            
            setStatus({ type: 'success', text: 'Link added successfully!' });
            setForm({ title: '', url: '' }); // Clear form

        } catch (error) {
            console.error("Error adding link:", error);
            setStatus({ type: 'error', text: 'Failed to add link. Try again.' });
        }
    };

    // 3. Delete Link Function
    const handleDeleteLink = async (linkId: string) => {
        if (!user) return;

        try {
            // Get a reference to the specific link to delete: /links/{userId}/{linkId}
            const linkRef = ref(rtdb, `links/${user.uid}/${linkId}`);
            await remove(linkRef);
            
            setStatus({ type: 'info', text: 'Link deleted.' });
        } catch (error) {
            console.error("Error deleting link:", error);
            setStatus({ type: 'error', text: 'Failed to delete link.' });
        }
    };

    // 4. Logout Function
    const handleLogout = async () => {
        setIsLoggingOut(true);
        setStatus(null);
        try {
            await signOut(auth);
            // On successful sign out, the auth listener in useEffect will fire, 
            // setting user to null and clearing the dashboard.
            setStatus({ type: 'info', text: 'You have been logged out successfully.' });
            router.push('/'); // Optional: Redirect home immediately on logout
        } catch (error) {
            console.error("Logout Error:", error);
            setStatus({ type: 'error', text: 'Logout failed. Please try again.' });
        } finally {
            setIsLoggingOut(false);
        }
    };
    
    // --- Render Logic ---

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <p className="text-white text-xl">Loading authentication...</p>
            </div>
        );
    }

    if (!user) {
        // If not logged in, show a minimal message
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/10 text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
                    <p className="text-gray-300 mb-6">
                        You must be logged in to view your dashboard.
                    </p>
                    
                    {/* 3. Updated Button with router.push('/') */}
                    <button 
                        onClick={() => router.push('/')} 
                        className="w-full py-2 rounded-lg text-lg font-semibold bg-[#2CA3BC] text-white hover:bg-[#A0D2EB] hover:text-slate-900 transition"
                    >
                        Go to Home
                    </button>

                    {status && status.text && (
                        <div className={`mt-4 p-2 rounded text-center text-sm ${status.type === 'info' ? 'bg-blue-500/10 text-blue-300' : 'text-red-300'}`}>
                            {status.text}
                        </div>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header and Logout */}
                <header className="flex justify-between items-center pb-6 border-b border-white/10">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        <span className="text-[#2CA3BC]">AQUAFLOW</span> Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition duration-200 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    >
                        {isLoggingOut ? 'Logging Out...' : 'Logout'}
                    </button>
                </header>

                {/* Status Message Display */}
                {status && status.text && (
                    <div className={`p-3 rounded-lg border text-center font-medium transition duration-300 ${
                        status.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-300' : 
                        status.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-300' :
                        'bg-blue-500/10 border-blue-500 text-blue-300'
                    }`}>
                        {status.text}
                    </div>
                )}
                
                {/* 5. Link Addition Form */}
                <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-4">Add a New Link</h2>
                    <form onSubmit={handleAddLink} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Link Title (e.g., My Portfolio)"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2CA3BC] transition duration-200"
                        />
                         <input
                            type="url"
                            name="url"
                            placeholder="Link URL (e.g., https://example.com)"
                            value={form.url}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2CA3BC] transition duration-200"
                        />
                        <button
                            type="submit"
                            disabled={!form.title || !form.url}
                            className={`w-full py-3 rounded-lg text-lg font-semibold transition duration-300 shadow-lg active:scale-[0.99] bg-[#2CA3BC] text-white hover:bg-[#A0D2EB] hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Save Link
                        </button>
                    </form>
                </div>
                
                {/* 6. Current Links List */}
                <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Current Links ({links.length})</h2>
                    {links.length === 0 ? (
                        <p className="text-gray-400">No links added yet. Use the form above to start building your Link Tree!</p>
                    ) : (
                        <div className="space-y-3">
                            {links.map((link) => (
                                <div 
                                    key={link.id} 
                                    className="flex justify-between items-center bg-slate-800 p-4 rounded-lg shadow transition duration-200 hover:shadow-md border border-slate-700"
                                >
                                    <div className="flex flex-col">
                                        <p className="text-white font-medium">{link.title}</p>
                                        <a 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#A0D2EB] hover:text-[#2CA3BC] truncate w-64 sm:w-auto"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteLink(link.id)}
                                        className="ml-4 p-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition duration-200"
                                        title="Delete Link"
                                    >
                                        {/* Lucide Trash Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}