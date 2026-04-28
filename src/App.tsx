import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Terminal, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              <Zap className="w-6 h-6 text-black" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter italic">SYNTH_SNAKE <span className="text-cyan-400">v1.0</span></h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-mono tracking-widest text-white/40">
            <span className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-cyan-500" /> System: Online
            </span>
            <span className="flex items-center gap-2">
              <Terminal className="w-3 h-3 text-pink-500" /> Kernel: 0xf42
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar / Music Player Section */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1">
          <div className="space-y-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">
              Now Playing List
            </h2>
            <MusicPlayer />
          </div>

          <div className="bg-white/5 rounded-lg p-5 border border-white/10">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 mb-3">Live Visualizer</h3>
            <div className="flex items-end gap-1 h-12">
              <div className="flex-1 bg-cyan-500 h-2/3"></div>
              <div className="flex-1 bg-cyan-500 h-1/2"></div>
              <div className="flex-1 bg-cyan-500 h-full animate-pulse"></div>
              <div className="flex-1 bg-cyan-500 h-3/4"></div>
              <div className="flex-1 bg-cyan-500 h-1/4 animate-pulse"></div>
              <div className="flex-1 bg-cyan-500 h-2/3"></div>
              <div className="flex-1 bg-cyan-500 h-5/6"></div>
            </div>
          </div>
          
          <div className="p-4 border-2 border-pink-500/30 rounded-lg bg-pink-500/5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-pink-400 mb-2 flex items-center gap-2">
              Transmission Log
            </h3>
            <div className="space-y-2 font-mono text-[10px] text-white/40 uppercase leading-relaxed">
              <div className="flex gap-2">
                <span className="text-cyan-400">[SYS]</span>
                <span className="truncate">Neural link synchronized.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">[SYS]</span>
                <span className="truncate">Streams synthesized...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">[AI]</span>
                <span className="text-white/60 italic truncate">Dopamine optimized.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Center Section */}
        <div className="lg:flex-1 w-full flex flex-col items-center gap-6 order-1 lg:order-2">
          <SnakeGame />
        </div>
      </main>

      <footer className="h-24 bg-white/5 border-t border-white/10 px-8 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest text-center md:text-left">
            &copy; 2026 Neural Arcade Systems. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            {['Twitter', 'Discord', 'Terminal'].map((link) => (
              <a 
                key={link}
                href="#"
                className="text-[10px] font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                id={`footer-link-${link.toLowerCase()}`}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
