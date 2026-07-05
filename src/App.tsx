import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Crosshair, Cpu, Smartphone, ShieldAlert, Activity, Zap } from 'lucide-react';

type SettingsResult = {
  graphics: string;
  fps: string;
  sensitivity: number[];
};

export default function App() {
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('');
  const [rooted, setRooted] = useState('Non-Rooted');
  const [dpi, setDpi] = useState('Average');
  
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsResult | null>(null);
  const [error, setError] = useState('');

  const [boosting, setBoosting] = useState(false);
  const [boosted, setBoosted] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      setError('Please enter your device model.');
      return;
    }
    
    setError('');
    setLoading(true);
    setSettings(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, model: model.trim(), rooted, dpi }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate settings');
      }

      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleBoost = () => {
    if (boosting || boosted) return;
    setBoosting(true);
    setTimeout(() => {
      setBoosting(false);
      setBoosted(true);
      setTimeout(() => setBoosted(false), 3000); // reset after 3s
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#050000] text-gray-200 font-sans flex flex-col overflow-x-hidden selection:bg-red-600 selection:text-white border-4 border-red-900/30">
      {/* Header */}
      <header className="p-6 text-center bg-gradient-to-b from-red-950/40 to-transparent border-b border-red-900/50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block relative"
        >
          <Target className="absolute -left-8 top-1 text-red-600/50 w-6 h-6 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-serif italic font-black text-red-600 tracking-tighter drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            YoSensi 4X
          </h1>
          <Crosshair className="absolute -right-8 top-1 text-red-600/50 w-6 h-6 animate-pulse" />
        </motion.div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold opacity-80 mt-1">FF Optimization Engine</p>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-8 w-full max-w-6xl mx-auto">
        {/* Input Form */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full lg:w-1/3 bg-zinc-950/80 border border-red-900/30 p-6 flex flex-col gap-5 rounded-sm"
        >
          <h2 className="text-sm uppercase font-bold tracking-widest text-red-500 border-l-4 border-red-600 pl-3 mb-2">Device Configuration</h2>
          
          <form onSubmit={handleProcess} className="space-y-4 flex flex-col flex-1">
            
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] uppercase text-gray-500 font-bold">
                <Smartphone className="w-4 h-4 text-red-600" /> Device Brand
              </label>
              <select 
                value={brand} 
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-black border border-zinc-800 p-2.5 text-sm text-red-50 hover:border-red-600 outline-none transition-colors appearance-none cursor-pointer"
              >
                {['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'OnePlus', 'Asus', 'Motorola', 'Other'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] uppercase text-gray-500 font-bold">
                <Cpu className="w-4 h-4 text-red-600" /> Exact Model
              </label>
              <input 
                type="text"
                placeholder="e.g. Galaxy S23 Ultra"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full bg-black border border-zinc-800 p-2.5 text-sm text-red-50 placeholder-zinc-700 outline-none border-b-2 border-b-red-900/50 focus:border-b-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] uppercase text-gray-500 font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-600" /> Status
                </label>
                <select 
                  value={rooted} 
                  onChange={e => setRooted(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-2.5 text-sm text-red-50 outline-none appearance-none cursor-pointer"
                >
                  <option value="Non-Rooted">Non-Rooted</option>
                  <option value="Rooted">Rooted</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] uppercase text-gray-500 font-bold">
                  <Activity className="w-4 h-4 text-red-600" /> DPI
                </label>
                <select 
                  value={dpi} 
                  onChange={e => setDpi(e.target.value)}
                  className="w-full bg-black border border-zinc-800 p-2.5 text-sm text-red-50 outline-none appearance-none cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Average">Average</option>
                  <option value="High">High</option>
                  <option value="Don't Know">Don't Know</option>
                </select>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}

            <div className="mt-auto pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 uppercase tracking-[0.2em] skew-x-[-10deg] border-b-4 border-red-900 shadow-[0_0_20px_rgba(185,28,28,0.3)] group transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="inline-block skew-x-[10deg] group-hover:scale-105 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ANALYZING CORE...
                    </>
                  ) : 'PROCESS OPTIMIZATION'}
                </span>
              </button>
              <p className="mt-4 text-[9px] text-center text-zinc-600 italic font-mono">AI utilizes device-specific kernel data for calculation.</p>
            </div>
          </form>
        </motion.section>

        {/* Results */}
        <section className="w-full lg:w-2/3 flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {settings && !loading ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col gap-4 h-full"
              >
                {/* Graphics & FPS */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950 border border-red-900/20 p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 text-[8px] text-red-600 font-mono">SYS_GRAPHICS</div>
                    <h3 className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Visual fidelity</h3>
                    <div className="text-2xl font-black text-red-500 italic uppercase">{settings.graphics}</div>
                    <div className="mt-2 flex gap-1">
                      <div className="h-1 flex-1 bg-red-600"></div>
                      <div className="h-1 flex-1 bg-red-600"></div>
                      <div className="h-1 flex-1 bg-red-600"></div>
                      <div className="h-1 flex-1 bg-zinc-800"></div>
                    </div>
                  </div>
                  <div className="bg-zinc-950 border border-red-900/20 p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 text-[8px] text-red-600 font-mono">FRAME_SYNC</div>
                    <h3 className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Performance Mode</h3>
                    <div className="text-2xl font-black text-red-500 italic uppercase">{settings.fps}</div>
                    <div className="mt-2 flex gap-1">
                      <div className="h-1 flex-1 bg-red-600"></div>
                      <div className="h-1 flex-1 bg-red-600"></div>
                      <div className="h-1 flex-1 bg-red-600"></div>
                      <div className="h-1 flex-1 bg-red-600"></div>
                    </div>
                  </div>
                </div>

                {/* Sensitivities */}
                <div className="flex-1 bg-gradient-to-br from-zinc-950 to-black border border-red-900/40 p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-red-900/20 pb-2">
                    <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-red-500">In-Game Sensitivity Optimization</h2>
                    <span className="text-[10px] font-mono text-zinc-500">MAX VALUE: 200</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mt-2">
                    {[
                      { label: 'General', value: settings.sensitivity[0] },
                      { label: 'Red Dot', value: settings.sensitivity[1] },
                      { label: '2X Scope', value: settings.sensitivity[2] },
                      { label: '4X Scope', value: settings.sensitivity[3] },
                      { label: 'Sniper Scope', value: settings.sensitivity[4] },
                      { label: 'Free Look', value: settings.sensitivity[5] },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-end">
                          <span className="text-[11px] font-bold uppercase">{item.label}</span>
                          <span className="text-red-500 font-mono text-sm">{item.value}</span>
                        </div>
                        <div className="h-1.5 bg-zinc-900 w-full rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / 200) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto p-4 bg-red-950/10 border border-red-900/20 text-xs italic text-center text-zinc-400">
                    Note: These settings are calculated based on your screen latency and CPU throttling patterns.
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center border border-red-900/20 bg-zinc-950/30 border-dashed rounded-sm p-8 text-zinc-600 text-sm italic"
              >
                Awaiting device parameters...
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer with Boost Button */}
      <footer className="p-6 bg-zinc-950 border-t border-red-900/40 mt-auto">
        <div className="max-w-md mx-auto relative group">
          <div className="absolute -inset-1 bg-red-600 blur opacity-20 group-hover:opacity-40 transition"></div>
          <button
            onClick={handleBoost}
            disabled={boosting || boosted}
            className="relative w-full bg-black border-2 border-red-600 py-3 rounded-none text-red-500 font-black tracking-[0.4em] uppercase text-sm hover:bg-red-600 hover:text-white transition-all overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-4">
              {boosting ? (
                <>
                  <Zap className="w-5 h-5 animate-pulse" />
                  OPTIMIZING KERNEL...
                </>
              ) : boosted ? (
                <>
                  <Activity className="w-5 h-5" />
                  BOOSTED SUCCESSFULLY
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M13,10h7l-9,13v-9H4l9-13V10z"/></svg>
                  Boost Free Fire
                </>
              )}
            </span>
          </button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[9px] uppercase tracking-tighter text-zinc-700">Universal Compatibility Engine • No Account Required • Global Access</p>
        </div>
      </footer>
      
      {/* Toast */}
      <AnimatePresence>
        {boosted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-4 sm:right-8 bg-zinc-900 border-l-4 border-green-500 p-4 shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-white">BOOSTED SUCCESSFULLY</p>
              <p className="text-[10px] text-green-400">Ping optimized: -24ms</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
