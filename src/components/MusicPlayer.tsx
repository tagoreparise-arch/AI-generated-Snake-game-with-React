import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber City Drift',
    artist: 'AI Weaver',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Synth Mind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: '3',
    title: 'Midnight Hack',
    artist: 'Digital Shadow',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Playback blocked or failed', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Playback blocked', e));
      }
    }
  }, [currentTrackIndex, isPlaying, currentTrack.url]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-cyber-gray/40 backdrop-blur-md rounded-2xl p-6 neon-border-cyan/30">
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 flex-shrink-0 group">
          <motion.img
            key={currentTrack.coverUrl}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-lg neon-border-cyan/50"
          />
          {isPlaying && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute -inset-1 border border-dashed border-neon-cyan/30 rounded-full pointer-events-none"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg truncate neon-text-cyan">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm truncate uppercase tracking-widest">{currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={skipBack} className="text-gray-400 hover:text-neon-cyan transition-colors">
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-neon-cyan flex items-center justify-center text-cyber-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.5)]"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <button onClick={skipForward} className="text-gray-400 hover:text-neon-cyan transition-colors">
                <SkipForward size={20} />
              </button>
            </div>
            <Volume2 size={18} className="text-gray-500" />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="h-1 w-full bg-cyber-gray rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-cyan"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-display text-gray-500 uppercase tracking-tighter">
          <span>AI STREAMING</span>
          <div className="flex items-center gap-1">
             <Music size={10} className="animate-pulse" />
             <span>NEON WAVE</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
    </div>
  );
};
