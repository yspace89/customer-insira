// app/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Middleware handles auth redirection, but this is a solid client fallback
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#060913] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
          Menghubungkan Portal...
        </span>
      </div>
    </div>
  );
}
