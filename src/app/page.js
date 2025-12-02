import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Feather, Zap, ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'VGC News Agency | Global Editorial Workspace',
  description: 'The standard for modern digital journalism.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-black selection:text-white flex flex-col">

      {/* --- GLOBAL STYLES FOR ANIMATION --- */}
      <style>{`
        @keyframes reveal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-reveal {
          animation: reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; /* Initial state */
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        /* Grid Background Pattern */
        .bg-grid-pattern {
            background-image: linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                              linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
            background-size: 40px 40px;
        }
      `}</style>

      {/* --- HEADER / NAV --- */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 mix-blend-difference text-white">
        <div className="text-xs font-bold tracking-[0.3em] uppercase">VGC Agency</div>
        <div className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase">
          <span>Editorial</span>
          <span>Analytics</span>
          <span>System</span>
        </div>
        <Link href="/login" className="text-xs font-bold border-b border-transparent hover:border-white transition-colors uppercase tracking-widest">
          Login
        </Link>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow relative flex flex-col justify-center items-center pt-20 pb-20 overflow-hidden">

        {/* Background Decorative Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <h1 className="text-[20vw] lg:text-[25vw] leading-none font-serif font-bold text-neutral-50 opacity-[0.04] tracking-tighter whitespace-nowrap">
            VGC NEWS
          </h1>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

          {/* Tagline */}
          <div className="overflow-hidden mb-6">
            <span className="block text-xs md:text-sm font-bold tracking-[0.4em] text-neutral-400 uppercase animate-reveal">
              The Architecture of Truth
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif font-medium tracking-tighter leading-[0.9] mb-12 mix-blend-multiply">
            <div className="overflow-hidden"><span className="block animate-reveal delay-100">Global.</span></div>
            <div className="overflow-hidden"><span className="block animate-reveal delay-200">Timeless.</span></div>
            <div className="overflow-hidden"><span className="block animate-reveal delay-300 italic text-neutral-500">Essential.</span></div>
          </h2>

          {/* Description */}
          <p className="max-w-xl text-neutral-600 text-sm md:text-base leading-relaxed mb-12 animate-reveal delay-300">
            Welcome to the VGC workspace. A premium content management ecosystem designed for elite journalists, editors, and creators who demand precision.
          </p>

          {/* CTA Button */}
          <div className="animate-reveal delay-300">
            <Link
              href="/signin"
              className="group relative inline-flex items-center gap-4 px-12 py-5 bg-black text-white overflow-hidden transition-all hover:pr-16"
            >
              <span className="relative z-10 text-xs font-bold tracking-[0.25em] uppercase">Start Now</span>
              <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-2" />

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
            </Link>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce duration-[2000ms]">
          <ChevronDown size={24} className="text-neutral-300" />
        </div>
      </main>

      {/* --- FEATURE STRIP (Footer-like) --- */}
      <div className="border-t border-neutral-200 bg-neutral-50">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">

            {/* Feature 1 */}
            <div className="py-8 md:py-0 md:px-8 flex flex-col items-center text-center group">
              <div className="mb-4 p-4 rounded-full border border-neutral-200 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                <Globe size={24} strokeWidth={1} />
              </div>
              <h3 className="text-lg font-serif font-bold mb-2">Global Reach</h3>
              <p className="text-xs text-neutral-500 leading-5 max-w-xs">
                Seamlessly distribute content across borders with our multi-tenant architecture.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="py-8 md:py-0 md:px-8 flex flex-col items-center text-center group">
              <div className="mb-4 p-4 rounded-full border border-neutral-200 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                <Feather size={24} strokeWidth={1} />
              </div>
              <h3 className="text-lg font-serif font-bold mb-2">Editorial Flow</h3>
              <p className="text-xs text-neutral-500 leading-5 max-w-xs">
                Distraction-free writing environment tailored for high-focus journalism.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="py-8 md:py-0 md:px-8 flex flex-col items-center text-center group">
              <div className="mb-4 p-4 rounded-full border border-neutral-200 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                <Zap size={24} strokeWidth={1} />
              </div>
              <h3 className="text-lg font-serif font-bold mb-2">Instant Publish</h3>
              <p className="text-xs text-neutral-500 leading-5 max-w-xs">
                Real-time synchronization ensures your stories break as they happen.
              </p>
            </div>

          </div>
        </div>

        {/* Real Footer */}
        <div className="border-t border-neutral-200 py-6 text-center">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
            © 2024 VGC News Agency. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}