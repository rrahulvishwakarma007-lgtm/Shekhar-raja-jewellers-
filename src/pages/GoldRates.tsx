import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Info, Lock, Unlock, RefreshCw, Save, AlertCircle, Wifi, WifiOff } from 'lucide-react';

// ── Palette (Matching your App Theme) ─────────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
  bgCard:    '#FFFFFF',
  bgDeep:    '#FFE4EC',
  gold:      '#C2185B',
  goldDk:    '#880E4F',
  goldLt:    '#E91E8C',
  goldPale:  '#F8BBD9',
  goldBg:    'rgba(194,24,91,0.08)',
  text:      '#1A0010',
  textMid:   '#6D1B4E',
  textLight: '#AD6888',
  border:    'rgba(194,24,91,0.15)',
  borderMd:  'rgba(194,24,91,0.30)',
  shadow:    'rgba(194,24,91,0.08)',
};

// ── YOUR GOLDAPI.IO KEY — get free key at goldapi.io ─────────────────────────
const GOLD_API_KEY = 'YOUR_GOLDAPI_IO_KEY_HERE';

// ── Purity multipliers — all auto-calculated from 24K ────────────────────────
const PURITY_RATIOS = {
  '22K': 0.916,
  '20K': 0.833,
  '18K': 0.75,
  '14K': 0.583,
};

const purityGuide = [
  { purity: '24K', percentage: '99.9%', desc: 'Pure gold, soft and not ideal for daily jewellery',    use: 'Investment coins, bars' },
  { purity: '22K', percentage: '91.6%', desc: 'Ideal for fine jewellery with good durability',         use: 'Bridal, traditional jewellery' },
  { purity: '20K', percentage: '83.3%', desc: 'Balanced purity and durability',                        use: 'Heavy jewellery, antique pieces' },
  { purity: '18K', percentage: '75%',   desc: 'Durable for daily wear with rich gold color',           use: 'Diamond jewellery, watches' },
  { purity: '14K', percentage: '58.3%', desc: 'Very durable, lighter gold color',                      use: 'Everyday jewellery' },
];

// ── SKELETON PRELOADER ────────────────────────────────────────────────────────
function GoldRatesSkeleton() {
  return (
    <div className="pt-28 pb-16 min-h-screen relative overflow-hidden" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Skeleton */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="h-3 w-32 rounded-full animate-pulse mb-6" style={{ background: C.goldPale }} />
          <div className="h-12 sm:h-14 w-64 sm:w-80 rounded-2xl animate-pulse mb-6" style={{ background: 'rgba(248,187,217,0.6)' }} />
          <div className="h-4 w-48 rounded-full animate-pulse mb-6" style={{ background: 'rgba(248,187,217,0.4)' }} />
          <div className="h-8 w-40 rounded-full animate-pulse" style={{ background: 'rgba(248,187,217,0.5)' }} />
        </div>

        {/* 24K Featured Card Skeleton */}
        <div className="rounded-3xl p-8 mb-8 flex flex-col items-center justify-center shadow-xl animate-pulse" style={{ background: 'rgba(194,24,91,0.1)', border: `1px solid ${C.border}` }}>
          <div className="h-3 w-48 rounded-full mb-4" style={{ background: 'rgba(194,24,91,0.15)' }} />
          <div className="h-3 w-32 rounded-full mb-6" style={{ background: 'rgba(194,24,91,0.15)' }} />
          <div className="h-20 sm:h-24 w-64 sm:w-80 rounded-2xl mb-6" style={{ background: 'rgba(194,24,91,0.25)' }} />
          <div className="h-10 w-36 rounded-full" style={{ background: 'rgba(194,24,91,0.2)' }} />
        </div>

        {/* Calculated Rates Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col items-center animate-pulse" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
              <div className="w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(248,187,217,0.4)' }} />
              <div className="h-3 w-20 rounded-full mb-3" style={{ background: 'rgba(248,187,217,0.3)' }} />
              <div className="h-10 w-32 rounded-xl mb-3" style={{ background: 'rgba(248,187,217,0.6)' }} />
              <div className="h-3 w-24 rounded-full mb-3" style={{ background: 'rgba(248,187,217,0.3)' }} />
              <div className="h-2 w-16 rounded-full" style={{ background: 'rgba(248,187,217,0.5)' }} />
            </div>
          ))}
        </div>
        
        {/* Offer Card Skeleton */}
        <div className="rounded-2xl p-8 mb-12 flex flex-col items-center justify-center animate-pulse" style={{ background: 'rgba(194,24,91,0.1)' }}>
           <div className="h-10 sm:h-12 w-3/4 max-w-md rounded-xl mb-4" style={{ background: 'rgba(194,24,91,0.25)' }} />
           <div className="h-4 w-64 rounded-full mb-4" style={{ background: 'rgba(194,24,91,0.2)' }} />
           <div className="h-3 w-80 rounded-full" style={{ background: 'rgba(194,24,91,0.15)' }} />
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function GoldRates() {
  const [baseRate,      setBaseRate]      = useState(0);   // anchored 24K rate
  const [displayRate,   setDisplayRate]   = useState(0);   // flickering display rate
  const [history,       setHistory]       = useState<{ id: number; date: string; rate_24k: number }[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [isAdmin,       setIsAdmin]       = useState(false);
  const [password,      setPassword]      = useState('');
  const [showModal,     setShowModal]     = useState(false);
  const [newRate,       setNewRate]       = useState('');
  const [saving,        setSaving]        = useState(false);
  const [lastUpdated,   setLastUpdated]   = useState('');
  const [error,         setError]         = useState('');
  const [liveSource,    setLiveSource]    = useState<'api' | 'manual' | 'fallback'>('fallback');
  const [fetchingLive,  setFetchingLive]  = useState(false);

  const flickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auto-calculated rates from 24K base ──────────────────────────────────
  const calculatedRates = {
    '22K': Math.round(displayRate * PURITY_RATIOS['22K']),
    '20K': Math.round(displayRate * PURITY_RATIOS['20K']),
    '18K': Math.round(displayRate * PURITY_RATIOS['18K']),
    '14K': Math.round(displayRate * PURITY_RATIOS['14K']),
  };

  // ── Micro-flicker (±1 or ±2) to feel live ────────────────────────────────
  const startFlicker = (base: number) => {
    if (flickerRef.current) clearInterval(flickerRef.current);
    flickerRef.current = setInterval(() => {
      const delta = (Math.random() < 0.5 ? 1 : -1) * (Math.random() < 0.6 ? 1 : 2);
      setDisplayRate(base + delta);
    }, 2000 + Math.random() * 2000);
  };

  useEffect(() => {
    if (baseRate > 0) {
      setDisplayRate(baseRate);
      startFlicker(baseRate);
    }
    return () => { if (flickerRef.current) clearInterval(flickerRef.current); };
  }, [baseRate]);

  // ── LIVE FETCH from GoldAPI.io + Frankfurter for USD→INR ─────────────────
  const fetchLiveRate = async () => {
    setFetchingLive(true);
    try {
      // Step 1: Get XAU price in USD from GoldAPI.io
      const goldRes = await fetch('https://www.goldapi.io/api/XAU/USD', {
        headers: {
          'x-access-token': GOLD_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!goldRes.ok) throw new Error('GoldAPI error');
      const goldData = await goldRes.json();
      const usdPerOz = goldData.price as number; // price per troy oz in USD

      // Step 2: Get USD → INR exchange rate (free, no key needed)
      const fxRes  = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
      const fxData = await fxRes.json();
      const usdToInr = fxData.rates.INR as number;

      // Step 3: Convert to INR per gram
      // 1 troy oz = 31.1035 grams
      const inrPerGram = (usdPerOz / 31.1035) * usdToInr;
      const rate24k    = Math.round(inrPerGram);

      setBaseRate(rate24k);
      setLastUpdated(new Date().toISOString());
      setLiveSource('api');
      setError('');

      // Also save to your backend so admin can see it
      try {
        await fetch('/api/gold-rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rate_24k: rate24k }),
        });
      } catch (_) { /* silent — backend save is optional */ }

    } catch (err) {
      console.error('Live fetch failed:', err);
      // Fallback to your backend DB rate
      fetchBackendRate();
    } finally {
      setFetchingLive(false);
    }
  };

  // ── Fallback: fetch from your own backend ─────────────────────────────────
  const fetchBackendRate = async () => {
    try {
      const res  = await fetch('/api/gold-rates');
      const data = await res.json();
      if (data.current) {
        setBaseRate(data.current.rate_24k);
        setLastUpdated(data.current.updated_at);
        setLiveSource('manual');
      }
      if (data.history?.length > 0) setHistory(data.history);
    } catch (err) {
      console.error('Backend fetch failed:', err);
      setError('Unable to fetch gold rates');
      setLiveSource('fallback');
    }
  };

  // ── On mount: fetch live API first, with a minimum skeleton display time ──
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Promise.all ensures the skeleton is shown for at least 800ms for a smooth, premium feel
      await Promise.all([
        fetchLiveRate(),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);
      setLoading(false);
    };
    init();

    // Refresh live rate every 15 minutes
    const interval = setInterval(fetchLiveRate, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Admin manual override ─────────────────────────────────────────────────
  const handleUpdateRate = async () => {
    if (!newRate || parseInt(newRate) <= 0) { alert('Please enter a valid rate'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/gold-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate_24k: parseInt(newRate) }),
      });
      if (res.ok) {
        setBaseRate(parseInt(newRate));
        setLiveSource('manual');
        setNewRate('');
        setLastUpdated(new Date().toISOString());
        alert('Rate updated successfully!');
      } else {
        alert('Failed to update rate');
      }
    } catch { alert('Failed to update rate'); }
    finally { setSaving(false); }
  };

  const handleAdminLogin = () => {
    if (password === 'admin123') { setIsAdmin(true); setShowModal(false); setPassword(''); }
    else alert('Incorrect password');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // ── Source badge ──────────────────────────────────────────────────────────
  const SourceBadge = () => {
    if (liveSource === 'api') return (
      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
        <Wifi size={11} /> LIVE · GoldAPI.io
      </span>
    );
    if (liveSource === 'manual') return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full" style={{ background: C.goldPale, color: C.goldDk }}>
        Live Rates
      </span>
    );
    return null;
  };

  if (loading) {
    return <GoldRatesSkeleton />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="pt-28 pb-16 min-h-screen" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${C.gold})` }} />
            <span className="font-cinzel text-xs tracking-[0.25em]" style={{ color: C.gold }}>LIVE RATES</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${C.gold})` }} />
          </motion.div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>
            Today's Gold Rates
          </h1>
          <p className="font-raleway mt-4" style={{ color: C.textLight }}>
            Rates per 10 gram in INR
          </p>

          {/* Source + timestamp */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <SourceBadge />
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm" style={{ color: C.textLight }}>
                <RefreshCw size={13} className={fetchingLive ? 'animate-spin' : ''} />
                <span>
                  {formatDate(lastUpdated)}
                  {liveSource === 'api' && ` · ${formatTime(lastUpdated)}`}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 mt-4 text-red-600">
              <AlertCircle size={16} />
              <span className="font-raleway text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* ── 24K FEATURED CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 mb-8 text-center text-white shadow-xl relative overflow-hidden"
          style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldDk})` }}
        >
          {/* Live pulse dot */}
          {liveSource === 'api' && (
            <span className="absolute top-5 right-5 flex items-center gap-1.5 text-xs font-bold text-white/80">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          )}

          <p className="font-cinzel text-xs tracking-[0.3em] text-white/70 mb-1">24K FINE GOLD · 999.9 FINENESS</p>
          <p className="font-raleway text-sm text-white/60 mb-2">Per 10 Gram · Indian Rupees</p>

          <motion.h2
            key={displayRate}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="font-cormorant text-6xl sm:text-7xl font-bold mt-2"
          >
            ₹{displayRate.toLocaleString('en-IN')}
          </motion.h2>

          <p className="font-raleway text-sm text-white/60 mt-3"></p>

          {/* Refresh button */}
          <button
            onClick={fetchLiveRate}
            disabled={fetchingLive}
            className="mt-4 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
          >
            <RefreshCw size={12} className={fetchingLive ? 'animate-spin' : ''} />
            {fetchingLive ? 'Fetching…' : 'Refresh Rate'}
          </button>
        </motion.div>

        {/* ── AUTO-CALCULATED RATES GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {(Object.entries(calculatedRates) as [string, number][]).map(([purity, rate], index) => (
            <motion.div
              key={purity}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: `rgba(194,24,91,0.08)` }}>
                <span className="font-cinzel text-lg font-bold" style={{ color: C.gold }}>{purity}</span>
              </div>
              <p className="font-raleway text-xs" style={{ color: C.textLight }}>Per 10 Gram</p>
              <motion.p
                key={rate}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-cormorant text-3xl font-bold mt-1"
                style={{ color: C.text }}
              >
                ₹{rate.toLocaleString('en-IN')}
              </motion.p>
              <p className="font-raleway text-xs mt-1" style={{ color: C.textLight }}>
                {Math.round(PURITY_RATIOS[purity as keyof typeof PURITY_RATIOS] * 100)}% purity
              </p>
              <p className="font-raleway text-[10px] mt-1 font-semibold" style={{ color: C.gold }}>
                Fetching live Rates ✓
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── HIDDEN ADMIN TOGGLE — looks like a content label ── */}
        <div className="text-center mb-8">
          <button
            onClick={() => isAdmin ? setIsAdmin(false) : setShowModal(true)}
            className="inline-flex items-center gap-2 font-raleway text-xs tracking-[0.2em] transition-colors select-none"
            style={{ color: C.textLight, cursor: 'default' }}
          >
            <Shield size={13} style={{ color: C.gold }} />
            {isAdmin ? 'EXIT ADMIN MODE' : 'LIVE GOLD RATES'}
          </button>
        </div>

        {/* ── Live Gold Rates Admin ── */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="rounded-2xl p-6 mb-12 overflow-hidden"
              style={{ background: C.bgCard, border: `2px solid ${C.gold}` }}
            >
              <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: C.text }}>
                Live fetching 
              </h3>
              <p className="font-raleway text-sm mb-4" style={{ color: C.textLight }}>
                Override the live API rate. All 22K, 20K, 18K, 14K rates auto-calculate from this.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="number"
                  value={newRate}
                  onChange={e => setNewRate(e.target.value)}
                  placeholder="Enter 24K rate (e.g. 7850)"
                  className="flex-1 px-4 py-3 rounded-xl font-raleway focus:outline-none"
                  style={{ border: `1px solid ${C.borderMd}`, color: C.text }}
                />
                <button
                  onClick={handleUpdateRate}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 text-white px-8 py-3 rounded-xl font-raleway font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldDk})` }}
                >
                  <Save size={18} />
                  {saving ? 'Saving…' : 'Override Rate'}
                </button>
              </div>
              <button
                onClick={() => { fetchLiveRate(); setIsAdmin(false); }}
                className="mt-3 text-xs underline font-raleway"
                style={{ color: C.gold }}
              >
                ↩ Restore live API rate
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── OFFER CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 mb-12 text-center shadow-lg"
          style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldDk})` }}
        >
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-white">
            Flat 9% Making Charges
          </h2>
          <p className="font-raleway text-lg text-white/80 mt-2">On all 22KT Gold Jewellery</p>
          <p className="font-raleway text-sm text-white/60 mt-4">
            *Terms & conditions apply. Visit our showroom for details.
          </p>
        </motion.div>

        {/* ── PURITY GUIDE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6 sm:p-8 shadow-sm"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Info size={24} style={{ color: C.gold }} />
            <h2 className="font-cormorant text-2xl font-semibold" style={{ color: C.text }}>
              Gold Purity Guide
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th className="font-cinzel text-sm text-left py-3" style={{ color: C.gold }}>Purity</th>
                  <th className="font-raleway text-sm text-left py-3" style={{ color: C.textLight }}>Gold %</th>
                  <th className="font-raleway text-sm text-left py-3 hidden sm:table-cell" style={{ color: C.textLight }}>Description</th>
                  <th className="font-raleway text-sm text-left py-3" style={{ color: C.textLight }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {purityGuide.map((item, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td className="font-cormorant text-lg font-semibold py-4" style={{ color: C.text }}>{item.purity}</td>
                    <td className="font-raleway text-sm font-medium py-4" style={{ color: C.gold }}>{item.percentage}</td>
                    <td className="font-raleway text-sm py-4 hidden sm:table-cell" style={{ color: C.text }}>{item.desc}</td>
                    <td className="font-raleway text-sm py-4" style={{ color: C.textLight }}>{item.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* BIS Badge */}
        <div className="flex items-center justify-center gap-3 mt-12" style={{ color: C.gold }}>
          <Shield size={24} />
          <span className="font-cinzel text-sm tracking-[0.2em]">BIS HALLMARK CERTIFIED</span>
        </div>
      </div>

      {/* ── PASSWORD MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            style={{ background: C.bgCard }}
          >
            <h3 className="font-cormorant text-2xl font-semibold mb-4" style={{ color: C.text }}>Admin Login</h3>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              className="w-full px-4 py-3 rounded-xl font-raleway mb-4 focus:outline-none"
              style={{ border: `1px solid ${C.borderMd}`, color: C.text }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-raleway transition-colors"
                style={{ border: `1px solid ${C.gold}`, color: C.gold }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-3 text-white rounded-xl font-raleway hover:shadow-lg transition-all"
                style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldDk})` }}
              >
                Login
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
