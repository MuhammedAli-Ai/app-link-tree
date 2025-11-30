"use client";

import { useRouter } from "next/navigation";

export default function homepage(props:any) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-[#193d6e] flex flex-col items-center p-4">
        
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/10 border-b border-white/20 z-10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wider">
            <span className="text-[#4a90e2]">AQUA</span>FLOW
          </h1>
        </div>
      </header>

      <main className="grow flex items-center justify-center w-full pt-20">
        <div className="w-full max-w-lg bg-white/5 backdrop-blur-lg rounded-3xl shadow-[0_20px_50px_rgba(74,144,226,0.3)] p-10 space-y-10 border border-white/20 animate-fadeIn">
            
          <div className="text-center space-y-4">
            <p className="text-[#A0D2EB] font-mono tracking-widest text-sm uppercase">Welcome to the future of links</p>
            <h2 className="text-6xl font-extrabold text-white tracking-tight leading-tight">
              Your Personal <br />
              <span className="text-[#4a90e2] drop-shadow-lg">AQUAFLOW</span>
            </h2>
            <p className="text-gray-300 text-xl pt-2">
              Manage all your digital identities and resources with unparalleled simplicity and style.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <button 
              className="w-full py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-lg border-2 bg-[#4a90e2] border-[#4a90e2] text-white hover:bg-white hover:text-[#4a90e2]"
            onClick={() => {
    window.location.href = "/Login";
  }}
            >
              login
            </button>

            <button 
              className="w-full py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-lg border-2 bg-transparent border-white/50 text-white hover:bg-white/10"
             onClick={() => {
    window.location.href = "/signup"; 
  }}
            >
              signup
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
