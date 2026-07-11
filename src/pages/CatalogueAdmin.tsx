// ════════════════════════════════════════════════════════════════════════════
// src/pages/CatalogueAdmin.tsx
// YOUR secret link generator — password protected, never share this URL
// Access it at: yoursite.com/srj-admin-catalogue
// ════════════════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Lock, Link as LinkIcon, Clock, Diamond, Eye, EyeOff } from 'lucide-react';

const ADMIN_PASSWORD = 'srj@2025';   // ← CHANGE THIS to your own secret password

const C = {
  bg:       '#FFF5F7',
  gold:     '#C2185B',
  goldDk:   '#880E4F',
  goldPale: '#F8BBD9',
  text:     '#1A0010',
  textMid:  '#6D1B4E',
  textLight:'#AD6888',
  border:   'rgba(194,24,91,0.15)',
};

const CATEGORIES = [
  { key:'bangles',   label:'Bangles',   icon:'📿' },
  { key:'rings',     label:'Rings',     icon:'💍' },
  { key:'necklaces', label:'Necklaces', icon:'✨' },
  { key:'earrings',  label:'Earrings',  icon:'🌸' },
  { key:'bridal',    label:'Bridal',    icon:'👑' },
  { key:'chains',    label:'Chains',    icon:'⛓️' },
  { key:'antique',   label:'Antique',   icon:'🏛️' },
];

const DURATIONS = [
  { label:'10 minutes',  value: 10 * 60 * 1000  },
  { label:'20 minutes',  value: 20 * 60 * 1000  },
  { label:'30 minutes',  value: 30 * 60 * 1000  },
  { label:'1 hour',      value: 60 * 60 * 1000  },
  { label:'2 hours',     value: 2 * 60 * 60 * 1000 },
  { label:'6 hours',     value: 6 * 60 * 60 * 1000 },
  { label:'24 hours',    value: 24 * 60 * 60 * 1000 },
];

// ── Token generate ────────────────────────────────────────────────────────────
function generateToken(category: string, durationMs: number): string {
  const expiry  = Date.now() + durationMs;
  const payload = `${category}|${expiry}`;
  return btoa(payload);
}

function buildLink(token: string): string {
  const base = window.location.origin;
  return `${base}/catalogue?token=${token}`;
}

export default function CatalogueAdmin() {
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [authed,      setAuthed]      = useState(false);
  const [wrongPass,   setWrongPass]   = useState(false);
  const [category,    setCategory]    = useState('bangles');
  const [duration,    setDuration]    = useState(DURATIONS[2].value); // 30 min default
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied,      setCopied]      = useState(false);
  const [history,     setHistory]     = useState<{ link:string; cat:string; exp:string; label:string }[]>([]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setWrongPass(false); }
    else { setWrongPass(true); }
  };

  const handleGenerate = () => {
    const token = generateToken(category, duration);
    const link  = buildLink(token);
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? category;
    const durLabel = DURATIONS.find(d => d.value === duration)?.label ?? '';
    const expTime  = new Date(Date.now() + duration).toLocaleTimeString();
    setGeneratedLink(link);
    setHistory(prev => [
      { link, cat: catLabel, exp: expTime, label: durLabel },
      ...prev.slice(0, 9),  // keep last 10
    ]);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? category;
    const durLabel = DURATIONS.find(d => d.value === duration)?.label ?? '';
    const msg = `✨ *Shekhar Raja Jewellers*\n\nHere is your private *${catLabel} Collection* link:\n\n${generatedLink}\n\n⏱️ *Expires in ${durLabel}*\n\n_This link is for your viewing only._`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                    className="w-full max-w-sm">
          <div className="bg-white rounded-3xl p-8 shadow-xl" style={{ border:`1px solid ${C.border}` }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                   style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`1.5px solid ${C.border}` }}>
                <Lock size={28} style={{ color: C.gold }} />
              </div>
              <h1 className="font-cormorant text-3xl font-bold" style={{ color: C.text }}>Skhekhar Raja Jewellers</h1>
              <p className="font-raleway text-sm mt-1" style={{ color: C.textLight }}>Catalogue </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Admin Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 rounded-xl font-raleway text-sm outline-none pr-12"
                  style={{ border:`1.5px solid ${wrongPass ? '#EF4444' : C.border}`, background:'#FFF5F7', color: C.text }}
                />
                <button onClick={() => setShowPass(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: C.textLight }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {wrongPass && (
                <p className="font-raleway text-xs text-red-500 text-center">Incorrect password. Try again.</p>
              )}

              <button onClick={handleLogin}
                      className="w-full py-3 rounded-xl text-white font-raleway font-medium transition-all hover:-translate-y-0.5"
                      style={{ background:`linear-gradient(to right, ${C.gold}, ${C.goldDk})` }}>
                Enter Admin Panel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Admin panel ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: C.bg }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <Diamond size={14} style={{ color: C.gold }} />
            <span className="font-cinzel text-xs tracking-[0.25em]" style={{ color: C.gold }}>ADMIN</span>
            <Diamond size={14} style={{ color: C.gold }} />
          </div>
          <h1 className="font-cormorant text-4xl font-bold" style={{ color: C.text }}>Catalogue Link Generator</h1>
          <p className="font-raleway text-sm mt-2" style={{ color: C.textLight }}>Generate private, expiring catalogue links for customers</p>
        </div>

        {/* Generator card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6" style={{ border:`1px solid ${C.border}` }}>

          {/* Category picker */}
          <div className="mb-6">
            <label className="font-cinzel text-xs tracking-[0.2em] block mb-3" style={{ color: C.textLight }}>
              SELECT CATEGORY
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                  style={{
                    border:`1.5px solid ${category === cat.key ? C.gold : C.border}`,
                    background: category === cat.key ? `rgba(194,24,91,0.06)` : '#FFF5F7',
                  }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-cinzel text-[10px] tracking-wide" style={{ color: category === cat.key ? C.gold : C.textLight }}>
                    {cat.label.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration picker */}
          <div className="mb-8">
            <label className="font-cinzel text-xs tracking-[0.2em] block mb-3" style={{ color: C.textLight }}>
              LINK EXPIRY
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className="py-2 px-3 rounded-xl text-sm font-raleway transition-all"
                  style={{
                    border:`1.5px solid ${duration === d.value ? C.gold : C.border}`,
                    background: duration === d.value ? C.gold : '#FFF5F7',
                    color: duration === d.value ? '#fff' : C.textMid,
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button onClick={handleGenerate}
                  className="w-full py-4 rounded-2xl text-white font-cormorant text-xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:-translate-y-0.5 transition-all"
                  style={{ background:`linear-gradient(to right, ${C.gold}, ${C.goldDk})` }}>
            <LinkIcon size={20} />
            Generate Private Link
          </button>
        </div>

        {/* Generated link */}
        <AnimatePresence>
          {generatedLink && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className="bg-white rounded-3xl p-6 shadow-lg mb-6"
                        style={{ border:`1.5px solid ${C.gold}` }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} style={{ color: C.gold }} />
                <span className="font-cinzel text-xs tracking-[0.15em]" style={{ color: C.gold }}>
                  LINK GENERATED — {CATEGORIES.find(c=>c.key===category)?.label?.toUpperCase()} · {DURATIONS.find(d=>d.value===duration)?.label?.toUpperCase()}
                </span>
              </div>

              {/* Link preview */}
              <div className="rounded-xl p-3 mb-4 font-mono text-xs break-all"
                   style={{ background:'#FFF5F7', border:`1px solid ${C.border}`, color: C.textMid }}>
                {generatedLink}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-sm transition-all"
                        style={{ border:`1.5px solid ${C.border}`, color: C.gold, background: copied ? `rgba(194,24,91,0.06)` : '#FFF5F7' }}>
                  {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                </button>
                <button onClick={handleWhatsApp}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-sm text-white"
                        style={{ background:'#25D366' }}>
                  <span>📱</span> Send on WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link history */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border:`1px solid ${C.border}` }}>
            <h3 className="font-cinzel text-xs tracking-[0.2em] mb-4" style={{ color: C.textLight }}>
              RECENT LINKS (THIS SESSION)
            </h3>
            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                     style={{ background:'#FFF5F7', border:`1px solid ${C.border}` }}>
                  <div>
                    <span className="font-cinzel text-xs font-bold" style={{ color: C.text }}>{h.cat}</span>
                    <span className="font-raleway text-xs ml-2" style={{ color: C.textLight }}>· {h.label} · expires {h.exp}</span>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(h.link)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-pink-50">
                    <Copy size={13} style={{ color: C.textLight }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 rounded-2xl" style={{ background:'rgba(194,24,91,0.04)', border:`1px solid ${C.border}` }}>
          <h3 className="font-cinzel text-xs tracking-[0.15em] mb-3" style={{ color: C.gold }}>HOW TO USE</h3>
          <ol className="font-raleway text-sm space-y-2" style={{ color: C.textLight }}>
            <li>1. Select the jewellery category you want to share</li>
            <li>2. Choose how long the link should stay active</li>
            <li>3. Click "Generate Private Link"</li>
            <li>4. Send it to the customer via WhatsApp or copy the link</li>
            <li>5. Link auto-expires — customer cannot access it after time runs out</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
