import React from 'react';
import { Key } from 'lucide-react';

export function LoginButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="relative w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#003b7a] to-[#002b5c] hover:from-[#004894] hover:to-[#00336b] text-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] border border-blue-900/40 overflow-hidden group cursor-pointer disabled:opacity-75 disabled:cursor-wait"
    >
      {/* Cinta tricolor institucional de la identidad de Gobierno de Chile */}
      <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col">
        <div className="flex-1 bg-[#003b7a]"></div>
        <div className="flex-1 bg-[#ef4444]"></div>
        <div className="flex-1 bg-[#f59e0b]"></div>
      </div>

      <div className="flex items-center gap-3.5 pl-1.5">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#003b7a] group-hover:scale-105 transition-transform duration-200">
          <Key size={16} strokeWidth={2.5} className="animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
        <div className="text-left">
          <p className="text-[0.88rem] font-black tracking-wide leading-none">ClaveÚnica</p>
          <p className="text-[0.68rem] text-blue-200/90 font-bold mt-1">Ingresa con tu identidad del Estado</p>
        </div>
      </div>

      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
