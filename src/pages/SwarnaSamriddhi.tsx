import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import {
  Gift, Wallet, ShoppingBag, Calculator, MessageCircle,
  ArrowRight, X, Smartphone, QrCode, Shield, ChevronDown,
  Star, Clock, CheckCircle2, ChevronLeft, Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Design tokens: High-Contrast Royal Pink + Gold Palette ─────────────
const C = {
  void:      '#FFF5F7',     // soft blush white
  voidMid:   '#FCE4EC',     // light rose
  voidLight: '#FFFFFF',     // pure white
  gold:      '#C2185B',     // royal pink primary
  goldPale:  '#F8BBD9',     // pale pink
  goldDeep:  '#880E4F',     // deep pink for contrast
  pink:      '#B8862A',     // warm luxury gold
  cream:     '#FFFFFF',     
  creamMid:  '#FDF8FA',     // ultra light pink-cream
  text:      '#1A0010',     // near-black
  textDim:   '#5A3A4A',     // muted burgundy
  textDark:  '#1A0010',     
  textDarkMid:'#6D1B4E',    // magenta text
  border:    'rgba(194,24,91,0.12)',
  borderBright:'rgba(194,24,91,0.3)',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ── Animated counter ──────────────────────────────────────────────────────────
function CountUp({ to, prefix = '₹', duration = 1.2 }: { to: number; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);
  
  return <span ref={ref}>{prefix}{new Intl.NumberFormat('en-IN').format(val)}</span>;
}

// ── Gold shimmer particle ────────────────────────────────────────────────────
function GoldParticles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            background: i % 3 === 0 ? C.goldPale : i % 3 === 1 ? C.gold : C.pink,
            width:  i % 5 === 0 ? 3 : 1.5,
            height: i % 5 === 0 ? 3 : 1.5,
            boxShadow: `0 0 ${i % 5 === 0 ? '8px' : '4px'} ${C.goldPale}`,
          }}
          animate={{
            y:       [0, -(50 + Math.random() * 80), 0],
            opacity: [0, 0.8, 0],
            scale:   [0, 1.2, 0],
          }}
          transition={{
            duration:  4 + Math.random() * 5,
            repeat:    Infinity,
            delay:     Math.random() * 5,
            ease:      'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SwarnaSamriddhi() {
  const [installment, setInstallment] = useState(5000);
  const [showModal, setShowModal]     = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(/android|iphone|ipad/i.test(navigator.userAgent.toLowerCase()));
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const userTotal  = installment * 10;
  const srjBonus   = installment * 2;
  const grandTotal = userTotal + srjBonus;

  // Payment Links
  const upiId  = '8377911745@upi';
  const note   = 'Swarna Samriddhi Installment';
  const name   = 'Shekhar Raja Jewellers';
  const genericUpi   = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl        = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(genericUpi)}&margin=10&bgcolor=FFFFFF`;
  const whatsappMsg  = `नमस्ते! 🙏\nमैं *स्वर्ण समृद्धि योजना* से जुड़ना चाहता/चाहती हूँ।\n\nमासिक किस्त: *${formatINR(installment)}*\nपेमेंट स्क्रीनशॉट संलग्न है।`;
  const waLink       = `https://wa.me/918377911745?text=${encodeURIComponent(whatsappMsg)}`;

  // Animation Variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div style={{ background: C.void, color: C.text, fontFamily: 'Raleway, sans-serif' }} className="min-h-screen selection:bg-[#C2185B] selection:text-white">

      {/* ════════════════════════════════════════════════════════
          STANDALONE NAVBAR
      ════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b transition-all duration-300" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group text-sm font-bold tracking-wide transition-colors hover:opacity-80" style={{ color: C.goldDeep }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border" style={{ borderColor: C.border }}>
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="hidden sm:block">Back to Home</span>
          </Link>
          <div className="flex flex-col items-end">
            <span className="font-cormorant text-2xl sm:text-3xl font-bold leading-none" style={{ color: C.text }}>Shekhar Raja</span>
            <span className="font-cinzel text-[8px] sm:text-[10px] tracking-[0.3em] font-bold" style={{ color: C.gold }}>JEWELLERS</span>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════
          GRAND HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center overflow-hidden text-center min-h-[85vh]">
        {/* Abstract Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px]" style={{ background: C.gold }} />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px]" style={{ background: C.pink }} />
        </div>
        
        <GoldParticles count={30} />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${C.goldDeep} 1px, transparent 1px), linear-gradient(90deg, ${C.goldDeep} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="px-4 py-1.5 rounded-full mb-8 border backdrop-blur-sm shadow-sm flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.6)', borderColor: C.borderBright }}>
            <Shield size={12} style={{ color: C.gold }} />
            <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: C.goldDeep }}>100% Secure & Transparent</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="font-cormorant font-bold mb-6 tracking-tight" style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', lineHeight: 1.05, color: C.text }}>
            स्वर्ण समृद्धि <span className="italic relative whitespace-nowrap" style={{ color: C.gold }}>
              योजना
              <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full" viewBox="0 0 200 20" preserveAspectRatio="none">
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }} d="M0,10 Q100,20 200,5" fill="none" stroke={C.goldPale} strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="font-raleway text-lg sm:text-2xl font-medium max-w-2xl mx-auto mb-12" style={{ color: C.textDim, lineHeight: 1.6 }}>
            अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें। आज ही जुड़ें और शानदार लाभ उठाएं।
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full font-raleway font-bold text-sm tracking-widest uppercase text-white shadow-2xl transition-all" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, boxShadow: `0 20px 40px -10px ${C.gold}` }}>
              {isMobile ? <Smartphone size={18} /> : <QrCode size={18} />} योजना शुरू करें
            </motion.button>
            <motion.a href="#calculator" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full font-raleway font-bold text-sm tracking-widest uppercase bg-white shadow-xl transition-all hover:bg-gray-50" style={{ border: `1px solid ${C.border}`, color: C.goldDeep }}>
              <Calculator size={18} style={{ color: C.gold }} /> लाभ की गणना करें
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          THE EQUATION BAND (10 + 2 = 12) - Glassmorphism Upgrade
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 relative z-20 -mt-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }} 
                      className="rounded-[2.5rem] p-10 sm:p-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 select-none shadow-2xl backdrop-blur-xl border"
                      style={{ background: 'rgba(255, 255, 255, 0.8)', borderColor: C.borderBright }}>
            
            <div className="flex flex-col items-center">
              <span className="font-cormorant font-bold drop-shadow-sm" style={{ fontSize: 'clamp(4.5rem, 10vw, 7rem)', color: C.textDark, lineHeight: 0.9 }}>10</span>
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] font-bold mt-4 uppercase px-4 py-1 rounded-full bg-gray-100" style={{ color: C.textDim }}>आपकी किस्तें</span>
            </div>

            <span className="font-cormorant font-light pb-6 sm:pb-10" style={{ fontSize: 'clamp(3rem, 6vw, 4rem)', color: C.goldPale }}>+</span>

            <div className="flex flex-col items-center relative group">
              <motion.span whileHover={{ scale: 1.1 }} className="font-cormorant font-bold relative z-10 transition-transform" style={{ fontSize: 'clamp(4.5rem, 10vw, 7rem)', color: C.gold, lineHeight: 0.9 }}>2</motion.span>
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] font-bold mt-4 uppercase px-4 py-1 rounded-full relative z-10" style={{ background: `${C.gold}15`, color: C.goldDeep }}>हमारी किस्तें</span>
              <div className="absolute inset-0 blur-2xl rounded-full bg-gradient-to-r from-[#C2185B] to-[#F8BBD9] opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>

            <span className="font-cormorant font-light pb-6 sm:pb-10" style={{ fontSize: 'clamp(3rem, 6vw, 4rem)', color: C.goldPale }}>=</span>

            <div className="flex flex-col items-center">
              <span className="font-cormorant font-bold" style={{ fontSize: 'clamp(4.5rem, 10vw, 7rem)', color: C.pink, lineHeight: 0.9, background: `linear-gradient(135deg, ${C.pink}, #d4a843)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>12</span>
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] font-bold mt-4 uppercase px-4 py-1 rounded-full" style={{ background: '#fdf8ec', color: C.pink }}>किस्तों का लाभ</span>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32" style={{ background: C.creamMid }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <span className="font-cinzel text-xs font-bold tracking-[0.4em] uppercase block mb-4" style={{ color: C.goldDeep }}>योजना की विशेषताएँ</span>
            <h2 className="font-cormorant text-4xl sm:text-6xl font-bold" style={{ color: C.textDark }}>क्या मिलेगा आपको?</h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Wallet,      title: 'आसान भुगतान', desc: 'ग्राहक केवल 10 मासिक किस्तें जमा करेगा। अपनी सुविधानुसार राशि चुनें।', accent: C.gold },
              { icon: Gift,        title: '2 किस्तें मुफ्त', desc: 'अंतिम 2 किस्तों का पूर्ण भुगतान शेखर राजा ज्वेलर्स द्वारा किया जाएगा।', accent: C.pink },
              { icon: ShoppingBag, title: 'पसंदीदा आभूषण', desc: 'कुल 12 किस्तों के मूल्य का अपनी पसंद का सोने का आभूषण खरीदें।', accent: C.goldDeep },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -8 }} className="p-10 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group bg-white shadow-xl transition-all" style={{ border: `1px solid ${C.border}` }}>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" style={{ backgroundImage: `linear-gradient(to right, ${f.accent}, ${C.goldPale})` }} />
                
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150" style={{ background: f.accent }} />
                  <div className="relative z-10 w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center border" style={{ borderColor: `${f.accent}30` }}>
                    <f.icon size={26} style={{ color: f.accent }} />
                  </div>
                </div>
                <h3 className="font-cormorant text-2xl sm:text-3xl font-bold mb-4" style={{ color: C.textDark }}>{f.title}</h3>
                <p className="font-raleway text-sm sm:text-base leading-relaxed font-medium" style={{ color: C.textDim }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINTECH CALCULATOR
      ════════════════════════════════════════════════════════ */}
      <section id="calculator" className="py-24 sm:py-32 relative overflow-hidden" style={{ background: C.voidLight }}>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FCE4EC] to-transparent opacity-40 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="font-cinzel text-xs font-bold tracking-[0.4em] uppercase block mb-4" style={{ color: C.goldDeep }}>Interactive Tool</span>
            <h2 className="font-cormorant text-4xl sm:text-6xl font-bold" style={{ color: C.text }}>लाभ की गणना करें</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="rounded-[2.5rem] p-8 sm:p-16 shadow-[0_20px_60px_-15px_rgba(194,24,91,0.15)] bg-white relative border" style={{ borderColor: C.borderBright }}>
            
            {/* Custom Fintech Slider */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-dashed gap-4" style={{ borderColor: C.borderBright }}>
                <label className="font-cinzel text-sm sm:text-base font-bold tracking-widest uppercase" style={{ color: C.textDarkMid }}>मासिक किस्त चुनें</label>
                <motion.span key={installment} initial={{ scale: 1.1, color: C.gold }} animate={{ scale: 1, color: C.goldDeep }} className="font-cormorant text-4xl sm:text-5xl font-bold tabular-nums bg-gray-50 px-6 py-2 rounded-2xl border" style={{ borderColor: C.border }}>
                  {formatINR(installment)}
                </motion.span>
              </div>
              
              <div className="relative pt-4 pb-2">
                {/* Custom Slider Styling */}
                <input type="range" min={2000} max={50000} step={1000} value={installment} onChange={e => setInstallment(Number(e.target.value))} 
                       className="w-full h-3 rounded-full outline-none cursor-pointer appearance-none shadow-inner z-10 relative" 
                       style={{ background: `linear-gradient(to right, ${C.goldDeep} ${(installment - 2000) / 48000 * 100}%, #FDE9F0 ${(installment - 2000) / 48000 * 100}%)` }} />
                <style>{`
                  input[type=range]::-webkit-slider-thumb {
                    appearance: none; width: 32px; height: 32px; border-radius: 50%;
                    background: #fff; border: 4px solid ${C.goldDeep};
                    box-shadow: 0 4px 12px rgba(136, 14, 79, 0.4); cursor: grab; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                  }
                  input[type=range]::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.15); }
                `}</style>
                <div className="flex justify-between mt-5">
                  <span className="font-cinzel text-xs font-bold" style={{ color: C.textDim }}>₹2,000</span>
                  <span className="font-cinzel text-xs font-bold" style={{ color: C.textDim }}>₹50,000</span>
                </div>
              </div>
            </div>

            {/* Premium Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="rounded-[1.5rem] p-8 text-center bg-[#FFFDFE] border hover:shadow-lg transition-shadow" style={{ borderColor: C.border }}>
                <p className="font-cinzel text-xs font-bold tracking-widest uppercase mb-4" style={{ color: C.textDarkMid }}>आपकी 10 किस्तें</p>
                <p className="font-cormorant text-4xl font-bold tabular-nums" style={{ color: C.text }}><CountUp to={userTotal} /></p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} className="rounded-[1.5rem] p-8 text-center relative overflow-hidden shadow-2xl" style={{ background: `linear-gradient(145deg, ${C.goldDeep}, ${C.gold})` }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-5 py-1.5 rounded-b-xl shadow-md z-10">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] font-bold" style={{ color: C.goldDeep }}>FREE BONUS</span>
                </div>
                <p className="font-cinzel text-xs font-bold tracking-widest uppercase mb-4 mt-2 text-white/90 relative z-10">SRJ की 2 किस्तें</p>
                <p className="font-cormorant text-5xl font-bold text-white tabular-nums relative z-10 drop-shadow-md">+ <CountUp to={srjBonus} /></p>
              </motion.div>

              <div className="rounded-[1.5rem] p-8 text-center bg-gray-50 border-2 hover:shadow-lg transition-shadow" style={{ borderColor: C.borderBright }}>
                <p className="font-cinzel text-xs font-bold tracking-widest uppercase mb-4" style={{ color: C.goldDeep }}>कुल आभूषण मूल्य</p>
                <p className="font-cormorant text-4xl font-bold tabular-nums" style={{ color: C.goldDeep }}><CountUp to={grandTotal} /></p>
              </div>
            </div>

            <div className="flex justify-center border-t border-dashed pt-10" style={{ borderColor: C.borderBright }}>
              <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-3 px-12 py-5 rounded-full font-raleway font-bold text-sm sm:text-base tracking-widest uppercase text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, boxShadow: `0 15px 30px -10px ${C.goldDeep}` }}>
                {isMobile ? <Smartphone size={20} /> : <QrCode size={20} />} भुगतान करें और शुरू करें <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TERMS & CONDITIONS
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32" style={{ background: C.voidMid }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase font-bold block mb-4" style={{ color: C.goldDeep }}>Guidelines</span>
            <h2 className="font-cormorant text-4xl sm:text-6xl font-bold" style={{ color: C.textDark }}>नियम एवं शर्तें</h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Clock,        text: 'योजना की कुल अवधि 12 माह की होगी।' },
              { icon: CheckCircle2, text: 'ग्राहक को लगातार 10 मासिक किस्तें नियत समय पर जमा करनी अनिवार्य हैं।' },
              { icon: Gift,         text: 'अंतिम 2 किस्तों (बोनस) का लाभ केवल योजना की सभी शर्तें सफलतापूर्वक पूरी करने पर ही देय होगा।' },
              { icon: Star,         text: 'यह योजना विशेष रूप से केवल सोने के आभूषणों की खरीद पर लागू है।' },
              { icon: Shield,       text: 'योजना का लाभ किसी भी स्थिति में नकद भुगतान (Cash) के रूप में नहीं दिया जाएगा।' },
              { icon: CheckCircle2, text: 'प्रबंधन के पास बिना पूर्व सूचना के नियम एवं शर्तों में परिवर्तन करने का अधिकार सुरक्षित है।' },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-5 p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow" style={{ border: `1px solid ${C.border}` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gray-50 border" style={{ borderColor: `${C.gold}20` }}>
                  <t.icon size={20} style={{ color: C.goldDeep }} />
                </div>
                <p className="font-raleway text-sm sm:text-base font-semibold leading-relaxed pt-2" style={{ color: C.textDim }}>{t.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER CTA
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t py-32" style={{ background: C.voidLight, borderColor: C.border }}>
        <GoldParticles count={40} />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity }} className="absolute inset-0 blur-[150px] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 50%, ${C.gold}, transparent 70%)` }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="font-cinzel text-xs font-bold tracking-[0.5em] uppercase block mb-6" style={{ color: C.goldDeep }}>आज ही जुड़ें</span>
            <h2 className="font-cormorant font-bold mb-6 tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: C.text, lineHeight: 1.1 }}>
              अपने सपनों के गहनों की <em className="italic" style={{ color: C.gold }}>शुरुआत करें!</em>
            </h2>
            <p className="font-cormorant text-2xl sm:text-3xl font-bold italic mb-14" style={{ color: C.textDim }}>"सोना सिर्फ आभूषण नहीं, आपके भविष्य का निवेश है।"</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full font-raleway font-bold text-sm tracking-widest uppercase text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, boxShadow: `0 15px 30px -10px ${C.goldDeep}` }}>
                {isMobile ? <Smartphone size={20} /> : <QrCode size={20} />} योजना शुरू करें
              </motion.button>
              <motion.a href={waLink} target="_blank" rel="noreferrer" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full font-raleway font-bold text-sm tracking-widest uppercase text-white shadow-xl" style={{ background: '#25D366', boxShadow: '0 15px 30px -10px #25D366' }}>
                <MessageCircle size={20} /> WhatsApp पर जुड़ें
              </motion.a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 font-raleway font-bold text-base bg-gray-50 py-4 px-8 rounded-full border inline-flex mx-auto" style={{ color: C.textDarkMid, borderColor: C.border }}>
              <a href="tel:+918377911745" className="flex items-center gap-2 hover:text-[#C2185B] transition-colors"><span style={{ color: C.gold }}>☎</span> +91 83779 11745</a>
              <div className="hidden sm:block w-px h-5" style={{ background: C.borderBright }} />
              <a href="/" className="hover:text-[#C2185B] transition-colors">shekharrajajewellers.com</a>
            </div>

            <p className="font-cinzel text-xs font-bold tracking-[0.3em] mt-16 uppercase" style={{ color: C.goldDeep }}>विश्वास · शुद्धता · गुणवत्ता</p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          MODERN PAYMENT MODAL
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6" style={{ background: 'rgba(26,0,16,0.6)', backdropFilter: 'blur(16px)' }} onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, y: 100, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.95 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} onClick={e => e.stopPropagation()} className="w-full sm:max-w-md overflow-hidden relative bg-white rounded-t-[32px] sm:rounded-[32px]" style={{ boxShadow: '0 -20px 80px rgba(0,0,0,0.2)' }}>
              
              {/* Premium Header */}
              <div className="px-8 py-6 border-b relative overflow-hidden" style={{ borderColor: C.border, background: C.voidMid }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="font-cinzel text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block bg-white px-2 py-0.5 rounded shadow-sm inline-block" style={{ color: C.goldDeep }}>Step 1 of 2</span>
                    <h3 className="font-cormorant text-3xl font-bold" style={{ color: C.textDark }}>Start Your Plan</h3>
                    <p className="font-raleway text-sm font-bold mt-1" style={{ color: C.textDarkMid }}>Installment: {formatINR(installment)}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border hover:bg-gray-50 transition-colors" style={{ borderColor: C.border }}><X size={18} style={{ color: C.textDark }} /></button>
                </div>
              </div>

              <div className="px-8 py-8 flex flex-col items-center gap-8">
                
                {/* 1. Payment Action */}
                <div className="w-full">
                  <p className="font-raleway font-bold text-sm mb-4 text-center text-gray-500 uppercase tracking-wider">
                    {isMobile ? '1. Tap to Pay via UPI App' : '1. Scan to Pay via UPI'}
                  </p>

                  {isMobile ? (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Google Pay',  href: `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`, color: '#1a73e8' },
                        { label: 'PhonePe',     href: `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`,   color: '#5f259f' },
                        { label: 'Paytm',       href: `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`,   color: '#00baf2' },
                        { label: 'Other Apps',  href: genericUpi,                                                                              color: '#333333' },
                      ].map(btn => (
                        <a key={btn.label} href={btn.href} className="py-4 rounded-2xl font-raleway font-bold text-sm text-center shadow-sm border bg-white hover:bg-gray-50 transition-colors" style={{ borderColor: `${btn.color}30`, color: btn.color }}>
                          {btn.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-3xl bg-white shadow-lg border" style={{ borderColor: C.borderBright }}>
                        <img src={qrUrl} alt="UPI QR" className="w-56 h-56 object-contain rounded-xl" />
                      </div>
                      <p className="font-mono text-sm font-bold bg-gray-100 px-4 py-2 rounded-lg" style={{ color: C.textDarkMid }}>{upiId}</p>
                    </div>
                  )}
                </div>

                {/* 2. Verification Action */}
                <div className="w-full border-t pt-8" style={{ borderColor: C.border }}>
                  <p className="font-raleway font-bold text-sm mb-4 text-center text-gray-500 uppercase tracking-wider">
                    2. Verify Payment
                  </p>
                  <motion.a href={waLink} target="_blank" rel="noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-raleway font-bold text-white text-base shadow-xl" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                    <ImageIcon size={20} /> Attach Screenshot on WhatsApp
                  </motion.a>
                  <p className="text-center font-raleway text-xs text-gray-400 mt-4 font-medium leading-relaxed">
                    Take a screenshot of your successful payment and send it to us. Our team will instantly activate your plan.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
