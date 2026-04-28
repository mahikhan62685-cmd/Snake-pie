import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Synth Neuron Alpha",
    artist: "AI Gen: Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "Cyber Pulse v2",
    artist: "AI Gen: Glitch Stream",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "Neon Echoes",
    artist: "AI Gen: Vapor Engine",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-lime)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onEnded = () => {
    handleSkipForward();
  };

  return (
    <div className="bg-white/5 border-l-4 border-cyan-500 p-4 w-full text-white">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center border border-white/5">
          <Music className="w-6 h-6 text-white/40 animate-pulse" />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="font-bold text-sm truncate">{currentTrack.title}</p>
          <p className="text-xs text-white/40 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleSkipBack}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button 
            onClick={handleSkipForward}
            className="text-white/60 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/40">
            {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) : '0'}:{audioRef.current ? Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '00'}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 bottom-0 left-0 bg-white shadow-[0_0_10px_white]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/40">
             {audioRef.current && audioRef.current.duration ? Math.floor(audioRef.current.duration / 60) : '0'}:{audioRef.current && audioRef.current.duration ? Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0') : '00'}
          </span>
        </div>
      </div>
    </div>
  );
}
