import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Info, Lock, Unlock, RefreshCw, Save, AlertCircle, Wifi, WifiOff } from 'lucide-react';

// ── YOUR GOLDAPI.IO KEY — get free key at goldapi.io ─────────────────────────
const GOLD_API_KEY = 'goldapi-3ojcqdsmno9l0pu-io';

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

export default function GoldRates() {
  const [baseRate,     setBaseRate]     = useState(0);   // anchored 24K rate
  const [displayRate,  setDisplayRate]  = useState(0);   // flickering display rate
  const [history,      setHistory]      = useState<{ id: number; date: string; rate_24k: number }[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [password,     setPassword]     = useState('');
  const [showModal,    setShowModal]    = useState(false);
  const [newRate,      setNewRate]      = useState('');
  const [saving,       setSaving]       = useState(false);
  const [lastUpdated,  setLastUpdated]  = useState('');
  const [error,        setError]        = useState('');
  const [liveSource,   setLiveSource]   = useState<'api' | 'manual' | 'fallback'>('fallback');
  const [fetchingLive, setFetchingLive] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  // ── On mount: fetch live API first, refresh every 15 minutes ─────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchLiveRate();
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
      <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
        <WifiOff size={11} /> MANUAL RATE
      </span>
    );
    return null;
  };

  if (loading) return (
    <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-[#e8e0d0]">
      <div className="text-center">
        <RefreshCw size={40} className="text-[#b8862a] animate-spin mx-auto" />
        <p className="font-raleway text-[#9a8060] mt-4">Fetching live gold rates…</p>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-16 bg-[#e8e0d0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8862a]" />
            <span className="font-cinzel text-xs tracking-[0.25em] text-[#b8862a]">LIVE RATES</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8862a]" />
          </motion.div>

          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-[#3a2e1e]">
            Today's Gold Rates
          </h1>
          <p className="font-raleway text-[#9a8060] mt-4">
            Rates per 10g in INR · Auto-calculated from live 24K base rate
          </p>

          {/* Source + timestamp */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <SourceBadge />
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-[#9a8060]">
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
          className="bg-gradient-to-r from-[#b8862a] to-[#8b6014] rounded-3xl p-8 mb-8 text-center text-white shadow-xl relative overflow-hidden"
        >
          {/* Live pulse dot */}
          {liveSource === 'api' && (
            <span className="absolute top-5 right-5 flex items-center gap-1.5 text-xs font-bold text-white/80">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          )}

          <p className="font-cinzel text-xs tracking-[0.3em] text-white/70 mb-1">24K FINE GOLD · 999.9 FINENESS</p>
          <p className="font-raleway text-sm text-white/60 mb-2">Per 10g · Indian Rupees</p>

          <motion.h2
            key={displayRate}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="font-cormorant text-6xl sm:text-7xl font-bold mt-2"
          >
            ₹{(displayRate * 10).toLocaleString('en-IN')}
          </motion.h2>

          <p className="font-raleway text-sm text-white/60 mt-3">
          </p>

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
              className="bg-[#faf7f2] rounded-2xl p-6 text-center border border-[rgba(184,134,42,0.2)] hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 mx-auto bg-[#b8862a]/10 rounded-full flex items-center justify-center mb-3">
                <span className="font-cinzel text-lg font-bold text-[#b8862a]">{purity}</span>
              </div>
              <p className="font-raleway text-xs text-[#9a8060]">Per 10g</p>
              <motion.p
                key={rate}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-cormorant text-3xl font-bold text-[#3a2e1e] mt-1"
              >
                ₹{rate.toLocaleString('en-IN')}
              </motion.p>
              <p className="font-raleway text-xs text-[#9a8060] mt-1">
                {Math.round(PURITY_RATIOS[purity as keyof typeof PURITY_RATIOS] * 100)}% purity
              </p>
              <p className="font-raleway text-[10px] text-[#b8862a] mt-1 font-semibold">
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── ADMIN TOGGLE ── */}
        <div className="text-center mb-8">
          <button
            onClick={() => isAdmin ? setIsAdmin(false) : setShowModal(true)}
            className="inline-flex items-center gap-2 text-[#9a8060] font-raleway text-sm hover:text-[#b8862a] transition-colors"
          >
            {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
            {isAdmin ? 'Exit Admin Mode' : 'Admin: Manual Override'}
          </button>
        </div>

        {/* ── ADMIN PANEL ── */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#faf7f2] rounded-2xl p-6 mb-12 border-2 border-[#b8862a]"
          >
            <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e] mb-2">
              Manual Rate Override
            </h3>
            <p className="font-raleway text-sm text-[#9a8060] mb-4">
              Override the live API rate. All 22K, 20K, 18K, 14K rates auto-calculate from this.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                value={newRate}
                onChange={e => setNewRate(e.target.value)}
                placeholder="Enter 24K rate (e.g. 7850)"
                className="flex-1 px-4 py-3 border border-[#b8862a]/30 rounded-xl font-raleway focus:outline-none focus:border-[#b8862a]"
              />
              <button
                onClick={handleUpdateRate}
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#b8862a] to-[#8b6014] text-white px-8 py-3 rounded-xl font-raleway font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving…' : 'Override Rate'}
              </button>
            </div>
            <button
              onClick={() => { fetchLiveRate(); setIsAdmin(false); }}
              className="mt-3 text-xs text-[#b8862a] underline font-raleway"
            >
              ↩ Restore live API rate
            </button>
          </motion.div>
        )}

        {/* ── OFFER CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#b8862a] to-[#8b6014] rounded-2xl p-8 mb-12 text-center"
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
          className="bg-[#faf7f2] rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Info size={24} className="text-[#b8862a]" />
            <h2 className="font-cormorant text-2xl font-semibold text-[#3a2e1e]">
              Gold Purity Guide
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(184,134,42,0.2)]">
                  <th className="font-cinzel text-sm text-[#b8862a] text-left py-3">Purity</th>
                  <th className="font-raleway text-sm text-[#9a8060] text-left py-3">Gold %</th>
                  <th className="font-raleway text-sm text-[#9a8060] text-left py-3 hidden sm:table-cell">Description</th>
                  <th className="font-raleway text-sm text-[#9a8060] text-left py-3">Best For</th>
                </tr>
              </thead>
              <tbody>
                {purityGuide.map((item, i) => (
                  <tr key={i} className="border-b border-[rgba(184,134,42,0.1)]">
                    <td className="font-cormorant text-lg font-semibold text-[#3a2e1e] py-4">{item.purity}</td>
                    <td className="font-raleway text-sm text-[#b8862a] font-medium py-4">{item.percentage}</td>
                    <td className="font-raleway text-sm text-[#3a2e1e] py-4 hidden sm:table-cell">{item.desc}</td>
                    <td className="font-raleway text-sm text-[#9a8060] py-4">{item.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* BIS Badge */}
        <div className="flex items-center justify-center gap-3 mt-12 text-[#b8862a]">
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
            className="bg-[#faf7f2] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <h3 className="font-cormorant text-2xl font-semibold text-[#3a2e1e] mb-4">Admin Login</h3>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              className="w-full px-4 py-3 border border-[#b8862a]/30 rounded-xl font-raleway mb-4 focus:outline-none focus:border-[#b8862a]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-[#b8862a] text-[#b8862a] rounded-xl font-raleway hover:bg-[#b8862a]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#b8862a] to-[#8b6014] text-white rounded-xl font-raleway hover:shadow-lg transition-all"
              >
                Login
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}