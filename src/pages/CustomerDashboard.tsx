import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Wallet, ChevronRight, CheckCircle2, QrCode, 
  Smartphone, ArrowRight, ShieldCheck, Image as ImageIcon, X
} from 'lucide-react';

const C = {
  bg: '#FFF5F7',
  bgCard: '#FFFFFF',
  primary: '#C2185B',
  primaryLt: '#E91E8C',
  primaryDk: '#880E4F',
  text: '#1A0010',
  textLight: '#AD6888',
  border: 'rgba(194, 24, 91, 0.15)',
};

// Simulated Ledger Data
const MOCK_DATA = {
  name: "Rahul Vishwakarma",
  planName: "Swarna Samriddhi Yojana",
  installmentAmount: 5000,
  installmentsPaid: 3,
  totalInstallments: 10,
  history: [
    { month: "May 2026", date: "05-May-2026", status: "Paid" },
    { month: "June 2026", date: "02-Jun-2026", status: "Paid" },
    { month: "July 2026", date: "01-Jul-2026", status: "Paid" },
    { month: "August 2026", date: "Due by 05-Aug-2026", status: "Pending" },
  ]
};

export default function CustomerDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device for UPI intent links
    const userAgent = navigator.userAgent || navigator.vendor;
    setIsMobile(/android|ipad|playbook|silk|iphone|ipod/i.test(userAgent.toLowerCase()));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'phone') {
      if (phoneNumber.length === 10) setStep('otp');
      else alert('Please enter a valid 10-digit number.');
    } else {
      if (otp === '1234') setIsLoggedIn(true);
      else alert('Invalid OTP. Use 1234 for demo.');
    }
  };

  const formatINR = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);

  // Intent Link Generation
  const upiId = "8377911745@upi";
  const installment = MOCK_DATA.installmentAmount;
  const genericUpi = `upi://pay?pa=${upiId}&pn=Shekhar%20Raja%20Jewellers&am=${installment}&cu=INR&tn=Swarna%20Samriddhi%20Month%204`;
  const gpayLink = `gpay://upi/pay?pa=${upiId}&pn=Shekhar%20Raja%20Jewellers&am=${installment}&cu=INR&tn=Month4`;
  const phonepeLink = `phonepe://pay?pa=${upiId}&pn=Shekhar%20Raja%20Jewellers&am=${installment}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(genericUpi)}&margin=10`;

  // ── RENDER LOGIN SCREEN ──
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.bg }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full p-8 rounded-3xl shadow-xl" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primaryLt}, ${C.primary})` }}>
              <User size={28} color="white" />
            </div>
            <h1 className="font-cormorant text-3xl font-bold" style={{ color: C.text }}>Customer Portal</h1>
            <p className="font-raleway text-sm mt-1" style={{ color: C.textLight }}>Access your Swarna Samriddhi Passbook</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {step === 'phone' ? (
              <>
                <label className="font-cinzel text-xs font-bold tracking-widest uppercase" style={{ color: C.textLight }}>Mobile Number</label>
                <input type="tel" placeholder="Enter registered number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl border outline-none font-mono" style={{ borderColor: C.border }} />
                <button type="submit" className="w-full py-4 mt-2 rounded-xl text-white font-bold tracking-wider uppercase font-cinzel transition-transform hover:-translate-y-1" style={{ background: C.primary }}>Request OTP</button>
              </>
            ) : (
              <>
                <label className="font-cinzel text-xs font-bold tracking-widest uppercase" style={{ color: C.textLight }}>Enter OTP (Use 1234)</label>
                <input type="text" placeholder="1234" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 rounded-xl border outline-none font-mono text-center tracking-widest text-lg" style={{ borderColor: C.border }} />
                <button type="submit" className="w-full py-4 mt-2 rounded-xl text-white font-bold tracking-wider uppercase font-cinzel transition-transform hover:-translate-y-1" style={{ background: C.primary }}>Verify & Login</button>
              </>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  // ── RENDER DASHBOARD ──
  const progressPct = (MOCK_DATA.installmentsPaid / MOCK_DATA.totalInstallments) * 100;
  
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6" style={{ background: C.bg }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="font-cormorant text-4xl font-bold" style={{ color: C.text }}>Welcome back, {MOCK_DATA.name}</h1>
            <p className="font-raleway text-sm font-semibold" style={{ color: C.primary }}>{MOCK_DATA.planName}</p>
          </div>
          <button className="px-6 py-2 rounded-full border text-sm font-bold font-raleway hover:bg-white transition-colors" style={{ borderColor: C.border, color: C.primary }}>
            Download Passbook
          </button>
        </motion.div>

        {/* Progress Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 rounded-3xl shadow-sm mb-8" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
          <div className="flex justify-between items-end mb-4">
            <span className="font-cinzel text-xs font-bold tracking-widest uppercase" style={{ color: C.textLight }}>Installment Progress</span>
            <span className="font-cormorant text-2xl font-bold" style={{ color: C.primaryDk }}>{MOCK_DATA.installmentsPaid} / {MOCK_DATA.totalInstallments}</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden mb-6" style={{ background: C.bg }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${C.primaryLt}, ${C.primary})` }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: C.border }}>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Total Paid by You</p>
              <p className="font-cormorant text-3xl font-bold" style={{ color: C.text }}>{formatINR(MOCK_DATA.installmentsPaid * installment)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">SRJ Bonus (At Maturity)</p>
              <p className="font-cormorant text-3xl font-bold" style={{ color: C.primaryLt }}>{formatINR(installment * 2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Expected Maturity Value</p>
              <p className="font-cormorant text-3xl font-bold" style={{ color: C.primaryDk }}>{formatINR((10 * installment) + (installment * 2))}</p>
            </div>
          </div>
        </motion.div>

        {/* Payment CTA Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 shadow-md" style={{ background: `linear-gradient(135deg, ${C.primaryLt}, ${C.primaryDk})` }}>
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-3 inline-block">Due Action</span>
            <h3 className="font-cormorant text-3xl font-bold text-white mb-1">Installment #4 is Pending</h3>
            <p className="font-raleway text-white/80 text-sm">Please pay {formatINR(installment)} by 5th August 2026.</p>
          </div>
          <button onClick={() => setShowPaymentModal(true)} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full font-raleway shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Pay {formatINR(installment)} Now <ChevronRight size={18} />
          </button>
        </motion.div>

        {/* History Ledger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl overflow-hidden shadow-sm" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
          <div className="p-6 border-b" style={{ borderColor: C.border }}>
            <h3 className="font-cormorant text-2xl font-bold" style={{ color: C.text }}>Payment Ledger</h3>
          </div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {MOCK_DATA.history.map((record, idx) => (
              <div key={idx} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {record.status === 'Paid' ? <CheckCircle2 size={20} /> : <Wallet size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base font-raleway" style={{ color: C.text }}>{record.month}</p>
                    <p className="text-xs text-gray-500 font-mono">{record.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-cormorant text-xl font-bold" style={{ color: C.text }}>{formatINR(installment)}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${record.status === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>{record.status}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Modal (Reused Logic) */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: 'rgba(26,0,16,0.6)' }} onClick={() => setShowPaymentModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b flex justify-between" style={{ borderColor: C.border, background: C.bg }}>
                <div><h3 className="font-cormorant text-2xl font-bold">Pay Installment #4</h3><p className="font-raleway text-xs text-gray-500">Amount: {formatINR(installment)}</p></div>
                <button onClick={() => setShowPaymentModal(false)}><X size={20} /></button>
              </div>
              <div className="p-6 flex flex-col items-center">
                <p className="font-raleway text-sm font-bold mb-4">{isMobile ? "Tap to Pay via UPI App" : "Scan to Pay"}</p>
                {isMobile ? (
                   <div className="grid grid-cols-2 gap-3 w-full mb-6">
                      <a href={gpayLink} className="py-3 border rounded-xl flex items-center justify-center font-bold text-xs">GPay</a>
                      <a href={phonepeLink} className="py-3 border rounded-xl flex items-center justify-center font-bold text-xs">PhonePe</a>
                      <a href={genericUpi} className="col-span-2 py-3 border rounded-xl flex items-center justify-center font-bold text-xs bg-gray-50">Other UPI App</a>
                   </div>
                ) : (
                  <img src={qrCodeUrl} alt="QR" className="w-48 h-48 mb-6 border p-2 rounded-xl" />
                )}
                <a href={`https://wa.me/918377911745?text=Hi! I have paid Installment 4.`} className="w-full py-4 rounded-xl flex justify-center gap-2 text-white font-bold shadow-md bg-[#25D366]"><ImageIcon size={18} /> Send Screenshot to WhatsApp</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  }
    
