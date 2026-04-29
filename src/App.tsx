import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-cyber-black flex flex-col items-center justify-center p-4 relative overflow-hidden cyber-grid">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="mb-8 text-center relative z-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <Zap className="text-neon-yellow w-6 h-6 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-white neon-text-cyan">
            NEON<span className="text-neon-pink">SNAKE</span>
          </h1>
          <Activity className="text-neon-green w-6 h-6" />
        </motion.div>
        <p className="text-xs font-display tracking-[0.3em] uppercase text-gray-500">
          Neural Interface • System Online
        </p>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-center relative z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-8 items-center lg:items-start"
        >
          <div className="w-full">
            <h2 className="text-xs font-display font-bold text-neon-cyan mb-4 uppercase tracking-widest pl-2">
              Neural Audio Stream
            </h2>
            <MusicPlayer />
          </div>

          <div className="hidden lg:block w-full p-6 rounded-2xl bg-cyber-gray/20 border border-white/5 backdrop-blur-sm">
            <h3 className="text-xs font-display font-bold text-gray-400 mb-4 uppercase tracking-widest">System Diagnostics</h3>
            <div className="space-y-3">
              {[
                { label: 'Latency', value: '1.2ms', color: 'text-neon-green' },
                { label: 'Uptime', value: '99.9%', color: 'text-neon-cyan' },
                { label: 'Sync Status', value: 'OPTIMAL', color: 'text-neon-yellow' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-[10px] font-display uppercase tracking-wider">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={item.color}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-12 text-[10px] font-display text-gray-600 uppercase tracking-widest relative z-10">
        © 2026 CYBER_CORE INDUSTRIES • V 2.4.0
      </footer>
    </div>
  );
}

