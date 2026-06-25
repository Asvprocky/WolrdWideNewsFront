"use client";

import Link from "next/link";

export default function RadarHeader() {
  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-[9999] flex items-center gap-3 px-4 py-2 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-lg hover:bg-[#1a2335]/90 transition-all duration-200 cursor-pointer"
    >
      <span className="animate-ping h-1.5 w-1.5 rounded-full bg-indigo-500"></span>

      <h1 className="text-[11px] font-bold tracking-wider text-slate-200 font-mono">WWN</h1>
    </Link>
  );
}
