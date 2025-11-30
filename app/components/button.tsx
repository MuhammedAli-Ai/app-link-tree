"use client";

export default function Button (props:any) {
    return (
        <>
            <button 
               className= "py-1 px-3 sm:py-1.5 sm:px-4 md:py-2 md:px-5 rounded-full text-center cursor-pointer select-none flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out bg-[#1a73e8] text-sm sm:text-base md:text-lg text-gray-200 font-sans font-normal shadow-xl shadow-black/40 hover:bg-[#3a8bf7] hover:shadow-2xl hover:shadow-black/60 active:scale-[0.98] appearance-none border-none focus:outline-none focus:ring-4 focus:ring-blue-400/50 hover:text-white"
            >
                {props.label}
            </button>
        </>
    );
}