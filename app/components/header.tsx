"use client";

import Link from "next/link"; 

const navLinks = [
    { name: "Home", href: "#" },
    { name: "Login", href: "/Login" },
    { name: "SignUp", href: "/Signup" },
    { name: "Contact", href: "#" },
];


export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav className="bg-slate-900/30 backdrop-blur-md shadow-lg shadow-slate-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        
                        <div className="flex-shrink-0">
                            {/* Standard <a> for the logo/brand link */}
                            <a href="#" className="text-2xl font-bold text-cyan-300 tracking-wider transition duration-300 ease-in-out transform hover:text-white hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                AQUAFLOW
                            </a>
                        </div>
                        
                        <div className="flex items-center">
                            <ul className="flex space-x-8">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        {/* Use <Link> for internal routes and <a> for fragment routes */}
                                        {link.href.startsWith('/') && link.href !== '#' ? (
                                            <Link
                                                href={link.href}
                                                className="inline-flex items-center px-1 pt-1 text-base font-medium text-gray-100 border-b-2 border-transparent hover:border-[#2CA3BC] hover:text-white transition duration-200"
                                            >
                                                {link.name}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                className="inline-flex items-center px-1 pt-1 text-base font-medium text-gray-100 border-b-2 border-transparent hover:border-[#2CA3BC] hover:text-white transition duration-200"
                                            >
                                                {link.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}