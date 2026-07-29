import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Gift, Wallet, ShoppingBag, Calculator, MessageCircle,
  ArrowRight, X, Smartphone, QrCode, Shield, ChevronDown,
  Star, Clock, CheckCircle2, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Design tokens: High-Contrast Royal Pink + Gold Palette ─────────────
const C = {
  void:      '#FFF5F7',     // soft blush white — main background
  voidMid:   '#FCE4EC',     // light rose — section background
  voidLight: '#FFFFFF',     // white — card background
  gold:      '#C2185B',     // royal pink — primary accent
  goldPale:  '#F8BBD9',     // pale pink shimmer
  goldDeep:  '#880E4F',     // very deep pink — high contrast text
  pink:      '#B8862A',     // warm gold — secondary accent 
  cream:     '#FFFFFF',     // white sections
  creamMid:  '#FCE4EC',
  text:      '#1A0010',     // near-black text for primary headings
  textDim:   '#5A3A4A',     // dark muted burgundy for highly visible paragraphs
  textDark:  '#1A0010',     
  textDarkMid:'#6D1B4E',    // deep magenta for secondary text
  border:    'rgba(194,24,91,0.2)',
  borderBright:'rgba(194,24,91,0.4)',
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
function GoldParticles({ count = 18 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i}
          className="absolute w-px h-px rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top:  `${Math.random() * 100}%`,
            background: i % 3 === 0 ? C.goldPale : i % 3 === 1 ? C.gold : C.pink,
            width:  i % 5 === 0 ? 3 : 2,
            height: i % 5 === 0 ? 3 : 2,
          }}
          animate={{
            y:       [0, -(40 + Math.random() * 60), 0],
            opacity: [0, 0.7, 0],
            scale:   [0, 1.5, 0],
          }}
          transition={{
            duration:  3 + Math.random() * 4,
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
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const userTotal  = installment * 10;
  const srjBonus   = installment * 2;
  const grandTotal = userTotal + srjBonus;

  // Payment Links
  const upiId  = '8377911745@upi';
  const note   = 'Swarna Samriddhi Installment';
  const name   = 'Shekhar Raja Jewellers';
  const genericUpi   = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl        = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(genericUpi)}&margin=12&bgcolor=FFFDF8`;
  const whatsappMsg  = `नमस्ते! 🙏\nमैं *स्वर्ण समृद्धि योजना* से जुड़ना चाहता/चाहती हूँ।\n\nमासिक किस्त: *${formatINR(installment)}*\nपेमेंट स्क्रीनशॉट संलग्न है।`;
  const waLink       = `https://wa.me/918377911745?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div style={{ background: C.void, color: C.text, fontFamily: 'Raleway, sans-serif' }} className="min-h-screen selection:bg-[#C2185B] selection:text-white">

      {/* ════════════════════════════════════════════════════════
          STANDALONE NAVBAR
      ════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-sm" style={{ background: 'rgba(255, 245, 247, 0.9)', borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group text-sm font-bold font-raleway transition-colors" style={{ color: C.goldDeep }}>
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
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
      <section ref={heroRef} className="relative pt-40 pb-24 px-6 flex flex-col items-center justify-center overflow-hidden text-center min-h-[70vh]">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[140px]" style={{ background: `radial-gradient(ellipse, ${C.gold} 0%, transparent 65%)` }} />
        </div>
        <GoldParticles count={24} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(${C.goldDeep} 1px, transparent 1px), linear-gradient(90deg, ${C.goldDeep} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

        <motion.div style={{ y: heroY }} className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, transparent, ${C.goldDeep})` }} />
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase font-bold" style={{ color: C.goldDeep }}>शेखर राजा ज्वेलर्स प्रस्तुत करता है</span>
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, transparent, ${C.goldDeep})` }} />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="font-cormorant font-bold mb-6" style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: 1.05, color: C.text }}>
            स्वर्ण समृद्धि <span className="italic" style={{ color: C.gold }}>योजना</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }} className="font-raleway text-lg sm:text-2xl font-semibold max-w-2xl mx-auto mb-12" style={{ color: C.textDim, lineHeight: 1.6 }}>
            अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें। आज ही जुड़ें और 100% पारदर्शी योजना का लाभ उठाएं।
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-5 rounded-full font-raleway font-bold text-sm tracking-wide text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, boxShadow: `0 12px 36px rgba(194,24,91,0.3)` }}>
              {isMobile ? <Smartphone size={18} /> : <QrCode size={18} />} योजना शुरू करें
            </motion.button>
            <motion.a href="#calculator" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-5 rounded-full font-raleway font-bold text-sm tracking-wide bg-white shadow-md" style={{ border: `1.5px solid ${C.borderBright}`, color: C.goldDeep }}>
              <Calculator size={18} style={{ color: C.gold }} /> लाभ की गणना करें
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          THE EQUATION BAND (10 + 2 = 12)
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: C.voidMid, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 select-none">
            
            {/* 10 */}
            <div className="flex flex-col items-center">
              <span className="font-cormorant font-bold" style={{ fontSize: 'clamp(5rem, 12vw, 8rem)', color: C.goldDeep, lineHeight: 0.9 }}>10</span>
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] font-bold mt-3 uppercase" style={{ color: C.textDim }}>आपकी किस्तें</span>
            </div>

            <span className="font-cormorant font-light pb-6 sm:pb-10" style={{ fontSize: 'clamp(3rem, 6vw, 4rem)', color: C.gold }}>+</span>

            {/* 2 */}
            <div className="flex flex-col items-center relative">
              <span className="font-cormorant font-bold relative z-10" style={{ fontSize: 'clamp(5rem, 12vw, 8rem)', color: C.pink, lineHeight: 0.9 }}>2</span>
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] font-bold mt-3 uppercase" style={{ color: C.pink }}>हमारी किस्तें</span>
              <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 blur-3xl rounded-full -z-0" style={{ background: C.pink }} />
            </div>

            <span className="font-cormorant font-light pb-6 sm:pb-10" style={{ fontSize: 'clamp(3rem, 6vw, 4rem)', color: C.gold }}>=</span>

            {/* 12 */}
            <div className="flex flex-col items-center">
              <span className="font-cormorant font-bold" style={{ fontSize: 'clamp(5rem, 12vw, 8rem)', color: C.goldDeep, lineHeight: 0.9, background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>12</span>
              <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] font-bold mt-3 uppercase" style={{ color: C.goldDeep }}>किस्तों का लाभ</span>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="font-cinzel text-xs font-bold tracking-[0.4em] uppercase block mb-3" style={{ color: C.goldDeep }}>योजना की विशेषताएँ</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.textDark }}>क्या मिलेगा आपको?</h2>
            <div className="mt-4 mx-auto w-20 h-1 rounded-full" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Wallet,      num: '10',    label: 'किस्तें आपकी', desc: 'ग्राहक केवल 10 मासिक किस्तें जमा करेगा। अपनी सुविधानुसार राशि चुनें।', accent: C.gold },
              { icon: Gift,        num: '2',     label: 'किस्तें हमारी', desc: 'अंतिम 2 किस्तों का भुगतान शेखर राजा ज्वेलर्स द्वारा किया जाएगा।', accent: C.pink },
              { icon: ShoppingBag, num: '12',    label: 'किस्तों का आभूषण', desc: 'कुल 12 किस्तों के मूल्य का सोने का आभूषण खरीदने का अवसर।', accent: C.goldDeep },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }} whileHover={{ y: -6 }} className="p-8 sm:p-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group" style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, boxShadow: '0 8px 30px rgba(194,24,91,0.06)' }}>
                <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{ background: f.accent }} />
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gray-50 border shadow-sm" style={{ borderColor: `${f.accent}30` }}>
                  <f.icon size={28} style={{ color: f.accent }} />
                </div>
                <h3 className="font-cormorant text-2xl font-bold mb-3" style={{ color: C.textDark }}>{f.num} {f.label}</h3>
                <p className="font-raleway text-sm leading-relaxed font-medium" style={{ color: C.textDim }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CALCULATOR
      ════════════════════════════════════════════════════════ */}
      <section id="calculator" style={{ background: C.voidMid }}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="font-cinzel text-xs font-bold tracking-[0.4em] uppercase block mb-3" style={{ color: C.goldDeep }}>INTERACTIVE CALCULATOR</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>लाभ की गणना करें</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl" style={{ background: C.voidLight, border: `1px solid ${C.border}` }}>
            <GoldParticles count={12} />

            {/* Slider */}
            <div className="max-w-2xl mx-auto mb-14 relative z-10">
              <div className="flex items-end justify-between mb-6 pb-4 border-b border-dashed" style={{ borderColor: C.borderBright }}>
                <label className="font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase" style={{ color: C.textDarkMid }}>मासिक किस्त चुनें</label>
                <motion.span key={installment} initial={{ scale: 1.15, color: C.gold }} animate={{ scale: 1, color: C.goldDeep }} className="font-cormorant text-3xl sm:text-4xl font-bold tabular-nums">{formatINR(installment)}</motion.span>
              </div>
              <div className="relative">
                <input type="range" min={2000} max={50000} step={1000} value={installment} onChange={e => setInstallment(Number(e.target.value))} className="w-full h-3 rounded-full outline-none cursor-pointer appearance-none shadow-inner" style={{ background: `linear-gradient(to right, ${C.gold} ${(installment - 2000) / 48000 * 100}%, rgba(194,24,91,0.18) ${(installment - 2000) / 48000 * 100}%)` }} />
                <div className="flex justify-between mt-4">
                  <span className="font-cinzel text-[10px] font-bold" style={{ color: C.textDim }}>₹2,000</span>
                  <span className="font-cinzel text-[10px] font-bold" style={{ color: C.textDim }}>₹50,000</span>
                </div>
              </div>
            </div>

            {/* Result cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10 mb-10">
              <div className="rounded-2xl p-7 text-center bg-[#FFFDFE]" style={{ border: `1px solid ${C.border}` }}>
                <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: C.textDarkMid }}>आपकी 10 किस्तें</p>
                <p className="font-cormorant text-3xl font-bold tabular-nums" style={{ color: C.text }}><CountUp to={userTotal} /></p>
              </div>

              <motion.div whileHover={{ scale: 1.03 }} className="rounded-2xl p-7 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, boxShadow: `0 16px 40px rgba(194,24,91,0.35)` }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full whitespace-nowrap shadow-md">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] font-bold" style={{ color: C.goldDeep }}>हमारा योगदान</span>
                </div>
                <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-3 text-white/90">SRJ की 2 किस्तें</p>
                <p className="font-cormorant text-4xl font-bold text-white tabular-nums">+ <CountUp to={srjBonus} /></p>
              </motion.div>

              <div className="rounded-2xl p-7 text-center relative overflow-hidden bg-gray-50" style={{ border: `2px solid ${C.borderBright}` }}>
                <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: C.goldDeep }}>कुल आभूषण मूल्य</p>
                <p className="font-cormorant text-4xl font-bold tabular-nums" style={{ color: C.goldDeep }}><CountUp to={grandTotal} /></p>
              </div>
            </div>

            <div className="flex justify-center relative z-10">
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setShowModal(true)} className="flex items-center gap-3 px-10 py-5 rounded-full font-raleway font-bold text-sm tracking-wide text-white" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, boxShadow: `0 12px 36px rgba(194,24,91,0.3)` }}>
                {isMobile ? <Smartphone size={18} /> : <QrCode size={18} />} पहली किस्त भरें और शुरू करें <ArrowRight size={17} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TERMS & CONDITIONS
      ════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream }}>
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase font-bold block mb-3" style={{ color: C.goldDeep }}>TERMS & CONDITIONS</span>
            <h2 className="font-cormorant text-4xl font-bold" style={{ color: C.textDark }}>नियम एवं शर्तें</h2>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: Clock,        text: 'योजना की अवधि 12 माह होगी।' },
              { icon: CheckCircle2, text: 'ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होगी।' },
              { icon: Gift,         text: 'अंतिम 2 किस्तों का लाभ केवल सभी शर्तें पूरी करने पर मिलेगा।' },
              { icon: Star,         text: 'यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी।' },
              { icon: Shield,       text: 'योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा।' },
              { icon: CheckCircle2, text: 'नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं।' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="flex items-start gap-4 p-5 rounded-2xl bg-white shadow-sm" style={{ border: `1px solid ${C.border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${C.gold}15` }}>
                  <t.icon size={18} style={{ color: C.gold }} />
                </div>
                <p className="font-raleway text-sm sm:text-base font-medium leading-relaxed pt-1" style={{ color: C.textDim }}>{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER CTA
      ════════════════════════════════════════════════════════ */}
      {/* FIXED DUAL STYLE ATTRIBUTE: Merged into a single style prop */}
      <section className="relative overflow-hidden border-t" style={{ background: C.void, borderColor: C.border }}>
        <GoldParticles count={30} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 10, repeat: Infinity }} className="absolute inset-0 blur-[160px] pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 80%, ${C.gold}, transparent 60%)` }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <span className="font-cinzel text-xs font-bold tracking-[0.5em] uppercase block mb-4" style={{ color: C.goldDeep }}>आज ही जुड़ें</span>
            <h2 className="font-cormorant font-bold mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: C.text, lineHeight: 1.2 }}>
              अपने सपनों के गहनों की<br />
              <em className="italic" style={{ color: C.gold }}>शुरुआत करें!</em>
            </h2>
            <p className="font-cormorant text-2xl font-bold italic mb-10" style={{ color: C.textDim }}>"सोना सिर्फ आभूषण नहीं, आपके सपनों का निवेश है।"</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12">
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => setShowModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-5 rounded-full font-raleway font-bold text-sm tracking-wide text-white" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, boxShadow: `0 16px 40px rgba(194,24,91,0.3)` }}>
                {isMobile ? <Smartphone size={18} /> : <QrCode size={18} />} योजना शुरू करें
              </motion.button>
              <motion.a href={waLink} target="_blank" rel="noreferrer" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-5 rounded-full font-raleway font-bold text-sm tracking-wide text-white bg-[#25D366] shadow-lg">
                <MessageCircle size={18} /> WhatsApp पर जानकारी लें
              </motion.a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 font-raleway font-bold text-sm" style={{ color: C.textDarkMid }}>
              <a href="tel:+918377911745" className="flex items-center gap-2 hover:underline"><span style={{ color: C.gold }}>☎</span> +91 83779 11745</a>
              <div className="hidden sm:block w-px h-4" style={{ background: C.borderBright }} />
              <span>shekharrajajewellers.com</span>
            </div>

            <p className="font-cinzel text-[10px] font-bold tracking-widest mt-12 uppercase" style={{ color: C.goldDeep }}>विश्वास · शुद्धता · गुणवत्ता</p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PAYMENT MODAL
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6" style={{ background: 'rgba(26,0,16,0.85)', backdropFilter: 'blur(10px)' }} onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }} onClick={e => e.stopPropagation()} className="w-full sm:max-w-md overflow-hidden relative" style={{ background: C.cream, borderRadius: '24px 24px 0 0', boxShadow: '0 -20px 60px rgba(194,24,91,0.2)' }}>
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${C.goldDeep}, ${C.gold}, ${C.goldPale}, ${C.gold}, ${C.goldDeep})` }} />

              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: C.border }}>
                <div>
                  <p className="font-cinzel text-[9px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: C.gold }}>SWARNA SAMRIDDHI YOJANA</p>
                  <h3 className="font-cormorant text-2xl font-bold" style={{ color: C.textDark }}>योजना शुरू करें</h3>
                  <p className="font-raleway text-sm font-bold mt-1" style={{ color: C.textDarkMid }}>किस्त राशि: {formatINR(installment)}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border" style={{ borderColor: C.border }}><X size={16} style={{ color: C.textDark }} /></button>
              </div>

              <div className="px-6 py-7 flex flex-col items-center gap-7">
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: C.goldDeep }}>1</div>
                    <p className="font-raleway font-bold text-base" style={{ color: C.textDark }}>{isMobile ? 'UPI App से भुगतान करें' : 'QR Code स्कैन करें'}</p>
                  </div>
                  {isMobile ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Google Pay',  href: `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`, color: '#1a73e8' },
                        { label: 'PhonePe',     href: `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`,   color: '#5f259f' },
                        { label: 'Paytm',       href: `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`,   color: '#00baf2' },
                        { label: 'Other UPI',   href: genericUpi,                                                                              color: '#333333' },
                      ].map(btn => (
                        <a key={btn.label} href={btn.href} className="py-4 rounded-xl font-raleway font-bold text-sm text-center shadow-sm" style={{ background: `${btn.color}08`, border: `1.5px solid ${btn.color}30`, color: btn.color }}>
                          {btn.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-2xl bg-white shadow-md" style={{ border: `2px solid ${C.borderBright}` }}>
                        <img src={qrUrl} alt="UPI QR" className="w-52 h-52 object-contain" />
                      </div>
                      <p className="font-mono text-sm font-bold" style={{ color: C.textDarkMid }}>UPI ID: {upiId}</p>
                    </div>
                  )}
                </div>

                <div className="w-full flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200 text-gray-600">2</div>
                  <p className="font-raleway text-sm font-bold" style={{ color: C.textDim }}>भुगतान का screenshot लें</p>
                </div>

                <div className="w-full border-t pt-6 mt-2" style={{ borderColor: C.border }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-[#25D366]">3</div>
                    <p className="font-raleway font-bold text-base" style={{ color: C.textDark }}>Screenshot WhatsApp पर भेजें</p>
                  </div>
                  <motion.a href={waLink} target="_blank" rel="noreferrer" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} className="flex items-center justify-center gap-3 w-full py-5 rounded-xl font-raleway font-bold text-white text-base shadow-lg" style={{ background: '#25D366' }}>
                    <MessageCircle size={20} /> Screenshot भेजें
                    <ArrowRight size={18} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
