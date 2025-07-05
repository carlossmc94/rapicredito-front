import React from "react";

export default function BotonPrincipal({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative group overflow-hidden font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-700 text-[#002F6C] bg-[#FFD600] shadow-md ${className || "w-full"}`}
    >
      <span className="z-10 group-hover:text-white transition-all duration-700 flex items-center gap-2">
        {children}
      </span>

      <span className="absolute inset-0 bg-[#002F6C] scale-0 group-hover:scale-100 transition-transform duration-700 origin-center z-0 rounded-md" />
    </button>
  );
}
