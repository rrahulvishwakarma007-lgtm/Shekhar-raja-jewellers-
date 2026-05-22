import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Shield, Info, Lock, Unlock, RefreshCw, Save, AlertCircle } from 'lucide-react';

// Gold purity percentages for auto-calculation
const PURITY_RATIOS = {
  '24K': 1.0,
  '22K': 0.916,
  '20K': 0.833,
  '18K': 0.75,
  '14K': 0.583
};

const purityGuide = [
  { purity: '24K', percentage: '99.9%', desc: 'Pure gold, soft and not ideal for daily jewellery', use: 'Investment coins, bars' },
  { purity: '22K', percentage: '91.6%', desc: 'Ideal for fine jewellery with good durability', use: 'Bridal, traditional jewellery' },
  { purity: '20K', percentage: '83.3%', desc: 'Balanced purity and durability', use: 'Heavy jewellery, antique pieces' },
  { purity: '18K', percentage: '75%', desc: 'Durable for daily wear with rich gold color', use: 'Diamond jewellery, watches' },
  { purity: '14K', percentage: '58.3%', desc: 'Very durable, lighter gold color', use: 'Everyday jewellery' }
];

interface RateData {
  id: number;
  rate_24k: number;
  updated_at: string;
}

interface HistoryData {
  id: number;
  date: string;
  rate_24k: number;
}

export default function GoldRates() {
  const [rate24K, setRate24K] = useState<number>(0);
  const [previousRate, setPreviousRate] = useState<number>(0);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newRate, setNewRate] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState('');

  // Calculate derived rates from 24K
  const calculatedRates = {
    '22K': Math.round(rate24K * PURITY_RATIOS['22K']),
    '20K': Math.round(rate24K * PURITY_RATIOS['20K']),
    '18K': Math.round(rate24K * PURITY_RATIOS['18K']),
    '14K': Math.round(rate24K * PURITY_RATIOS['14K'])
  };

  const dailyChange = previousRate > 0 ? rate24K - previousRate : 0;

  // Fetch rates from API
  const fetchRates = async () => {
    try {
      const res = await fetch('/api/gold-rates');
      const data = await res.json();
      
      if (data.current) {
        setRate24K(data.current.rate_24k);
        setLastUpdated(data.current.updated_at);
      }
      
      if (data.history && data.history.length > 0) {
        setHistory(data.history);
        // Get previous day's rate for change calculation
        if (data.history.length >= 2) {
          setPreviousRate(data.history[data.history.length - 2].rate_24k);
        }
      }
    } catch (err) {
      console.error('Failed to fetch rates:', err);
      setError('Failed to load gold rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Update rate in database
  const handleUpdateRate = async () => {
    if (!newRate || parseInt(newRate) <= 0) {
      alert('Please enter a valid rate');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/gold-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate_24k: parseInt(newRate) })
      });

      if (res.ok) {
        await fetchRates();
        setNewRate('');
        alert('Rate updated successfully!');
      } else {
        alert('Failed to update rate');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update rate');
    } finally {
      setSaving(false);
    }
  };

  const handleAdminLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  // Format date for display
  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e8e0d0' }}>
        <div className="text-center">
          <RefreshCw size={40} className="text-[#b8862a] animate-spin mx-auto" />
          <p className="font-raleway text-[#9a8060] mt-4">Loading gold rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 bg-[#e8e0d0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            Rates per gram in INR • Auto-calculated from 24K base rate
          </p>
          
          {lastUpdated && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#9a8060]">
              <RefreshCw size={14} />
              <span>Updated: {formatFullDate(lastUpdated)}</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center gap-2 mt-4 text-red-600">
              <AlertCircle size={16} />
              <span className="font-raleway text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* 24K Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#b8862a] to-[#8b6014] rounded-3xl p-8 mb-8 text-center text-white shadow-xl"
        >
          <h2 className="font-cormorant text-6xl sm:text-7xl font-bold mt-2">
            ₹{rate24K.toLocaleString()}
          </h2>
          <p className="font-raleway text-lg text-white/80 mt-2">24K Gold / Per Gram</p>
          
          {dailyChange !== 0 && (
            <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${
              dailyChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {dailyChange >= 0 ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingDown size={18} />
              )}
              <span className="font-raleway font-medium">
                {dailyChange >= 0 ? '+' : ''}{dailyChange} from yesterday
              </span>
            </div>
          )}
        </motion.div>

        {/* Calculated Rates Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {Object.entries(calculatedRates).map(([purity, rate], index) => (
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
              <p className="font-raleway text-xs text-[#9a8060]">Per Gram</p>
              <p className="font-cormorant text-3xl font-bold text-[#3a2e1e] mt-1">
                ₹{rate.toLocaleString()}
              </p>
              <p className="font-raleway text-xs text-[#9a8060] mt-2">
                {Math.round(PURITY_RATIOS[purity as keyof typeof PURITY_RATIOS] * 100)}% purity
              </p>
            </motion.div>
          ))}
        </div>

        {/* Admin Section */}
        <div className="text-center mb-12">
          <button
            onClick={() => isAdmin ? setIsAdmin(false) : setShowPasswordModal(true)}
            className="inline-flex items-center gap-2 text-[#9a8060] font-raleway text-sm hover:text-[#b8862a] transition-colors"
          >
            {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
            {isAdmin ? 'Exit Admin Mode' : 'Admin: Update 24K Rate'}
          </button>
        </div>

        {/* Admin Update Panel */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#faf7f2] rounded-2xl p-6 mb-12 border-2 border-[#b8862a]"
          >
            <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e] mb-4">
              Update 24K Base Rate
            </h3>
            <p className="font-raleway text-sm text-[#9a8060] mb-4">
              Enter the new 24K rate. All other rates (22K, 20K, 18K, 14K) will be auto-calculated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Enter 24K rate (e.g., 6800)"
                className="flex-1 px-4 py-3 border border-[#b8862a]/30 rounded-xl font-raleway focus:outline-none focus:border-[#b8862a]"
              />
              <button
                onClick={handleUpdateRate}
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#b8862a] to-[#8b6014] text-white px-8 py-3 rounded-xl font-raleway font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Update Rate'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Offer Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#b8862a] to-[#8b6014] rounded-2xl p-8 mb-12 text-center"
        >
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-white">
            Flat 9% Off Making Charges
          </h2>
          <p className="font-raleway text-lg text-white/80 mt-2">
            On all 22KT Gold Jewellery
          </p>
          <p className="font-raleway text-sm text-white/60 mt-4">
            *Terms & conditions apply. Visit our showroom for details.
          </p>
        </motion.div>

        {/* Purity Guide */}
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
                {purityGuide.map((item, index) => (
                  <tr key={index} className="border-b border-[rgba(184,134,42,0.1)]">
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

        {/* BIS Hallmark Badge */}
        <div className="flex items-center justify-center gap-3 mt-12 text-[#b8862a]">
          <Shield size={24} />
          <span className="font-cinzel text-sm tracking-[0.2em]">BIS HALLMARK CERTIFIED</span>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#faf7f2] rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <h3 className="font-cormorant text-2xl font-semibold text-[#3a2e1e] mb-4">
              Admin Login
            </h3>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#b8862a]/30 rounded-xl font-raleway mb-4 focus:outline-none focus:border-[#b8862a]"
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
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
