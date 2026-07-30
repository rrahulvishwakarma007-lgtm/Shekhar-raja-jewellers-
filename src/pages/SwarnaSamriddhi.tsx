import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import {
  Gift, Wallet, ShoppingBag, Calculator, MessageCircle,
  ArrowRight, X, Smartphone, QrCode, Shield,
  Star, Clock, CheckCircle2, ChevronLeft, Image as ImageIcon,
  Heart, Menu, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Tanishq-Inspired Heritage Luxury Palette ─────────────
const C = {
  void:      '#FAF7F2',     // Ivory / Cream base
  voidMid:   '#F4EFEA',     // Slightly darker ivory for contrast sections
  voidLight: '#FFFFFF',     // Pure white
  maroon:    '#832729',     // Deep heritage maroon (Primary)
  maroonLt:  '#A53540',     // Lighter maroon for hovers
  gold:      '#C5A059',     // Muted sophisticated gold
  goldLight: '#E8DCC4',     // Pale gold for borders
  text:      '#2C1A1D',     // Very dark brown/maroon for headings
  textDim:   '#5C4A4D',     // Muted text for paragraphs
  border:    'rgba(197, 160, 89, 0.3)', // Subtle gold border
};

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'Bridal', path: '/bridal' },
  { name: 'Offers', path: '/offer' },
  { name: 'Gold Rates', path: '/gold-rates' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'App', path: '/app' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

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

// ── Main Component ───────────────────────────────────────────────────────────
export default function SwarnaSamriddhi() {
  const [installment, setInstallment] = useState(5000);
  const [showModal, setShowModal]     = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [isScrolled, setIsScrolled]   = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(/android|iphone|ipad/i.test(navigator.userAgent.toLowerCase()));
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div style={{ background: C.void, color: C.text, fontFamily: 'Raleway, sans-serif' }} className="min-h-screen selection:bg-[#832729] selection:text-white">

      {/* ════════════════════════════════════════════════════════
          MAIN WEBSITE NAVBAR
      ════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-[#faf7f2]/98 backdrop-blur-xl shadow-[0_4px_30px_rgba(58,46,30,0.12)]' : 'bg-[#faf7f2]/95 backdrop-blur-md'
        }`}
      >
        <div className={`h-[2px] bg-gradient-to-r from-[#8b6014] via-[#d4a843] to-[#8b6014] transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-50'}`} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/logo.png" alt="Shekhar Raja Jewellers" className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-cormorant text-xl sm:text-2xl lg:text-3xl font-bold text-[#3a2e1e] tracking-wide leading-none">Shekhar Raja</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-px w-3 sm:w-4 bg-gradient-to-r from-[#b8862a] to-transparent" />
                  <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.3em] text-[#b8862a]">JEWELLERS</span>
                  <div className="h-px w-3 sm:w-4 bg-gradient-to-l from-[#b8862a] to-transparent" />
                </div>
              </div>
            </Link>
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-[rgba(184,134,42,0.15)] shadow-sm">
                {navLinks.map((link) => {
                  const isActive = link.path === '/offer';
                  return (
                    <Link key={link.path} to={link.path} className={`relative px-4 xl:px-5 py-2 font-cinzel text-[11px] tracking-[0.12em] uppercase transition-all duration-300 rounded-full ${isActive ? 'text-white' : 'text-[#3a2e1e] hover:text-[#b8862a]'}`}>
                      {isActive && <motion.div layoutId="activeNavPill" className="absolute inset-0 bg-gradient-to-r from-[#b8862a] to-[#8b6014] rounded-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/60 border border-[rgba(184,134,42,0.15)] text-[#9a8060] hover:text-[#b8862a] hover:border-[#b8862a]/30 transition-all duration-300"><Heart size={18} /></button>
              <a href="https://wa.me/918377911745" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#20bd5a] text-white px-5 py-2.5 rounded-full font-raleway text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-0.5">
                <MessageCircle size={16} /><span>Enquire</span>
              </a>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden w-11 h-11 rounded-full bg-gradient-to-br from-[#faf7f2] to-white border border-[rgba(184,134,42,0.2)] text-[#3a2e1e] hover:bg-[#b8862a] hover:text-white hover:border-[#b8862a] transition-all duration-300 flex items-center justify-center shadow-sm">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
        <div className={`h-[1px] bg-gradient-to-r from-transparent via-[#b8862a]/40 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-30'}`} />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 lg:hidden bg-gradient-to-b from-[#1a0f05] via-[#2a1a0a] to-[#1a0f05]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6014] via-[#d4a843] to-[#8b6014]" />
            <div className="flex flex-col h-full pt-24 pb-8 px-6 relative">
              <div className="flex items-center gap-3 mb-10">
                <img src="/logo.png" alt="Shekhar Raja Jewellers" className="h-12 w-auto object-contain" />
                <div className="flex flex-col">
                  <span className="font-cormorant text-xl font-bold text-white">Shekhar Raja</span>
                  <span className="font-cinzel text-[9px] tracking-[0.3em] text-[#b8862a]">JEWELLERS</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div key={link.path} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}>
                      <Link to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center justify-between py-3.5 border-b border-[#b8862a]/20 group ${link.path === '/offer' ? 'text-[#d4a843]' : 'text-white/70 hover:text-white'}`}>
                        <div className="flex items-center gap-4">
                          <span className="font-cinzel text-xs text-[#b8862a]/60">{String(index + 1).padStart(2, '0')}</span>
                          <span className="font-cormorant text-2xl">{link.name}</span>
                        </div>
                        <ChevronRight size={20} className="text-[#b8862a] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════
          EDITORIAL HERO SECTION (Tanishq Style Split Layout)
      ════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 flex items-center min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: `radial-gradient(${C.goldLight} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          
          {/* Left Content */}
          <motion.div style={{ y: heroY }} className="flex flex-col text-center lg:text-left items-center lg:items-start pt-10 lg:pt-0 z-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-4 mb-8">
              <div className="h-px w-12" style={{ background: C.maroon }} />
              <span className="font-cinzel text-xs tracking-[0.4em] uppercase font-bold" style={{ color: C.maroon }}>
                A Golden Opportunity
              </span>
              <div className="h-px w-12 lg:hidden" style={{ background: C.maroon }} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-cormorant font-bold mb-6 tracking-tight text-balance" style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', lineHeight: 1.05, color: C.text }}>
              स्वर्ण समृद्धि <br className="hidden lg:block"/> 
              <span className="italic font-light" style={{ color: C.gold }}>योजना</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="font-raleway text-lg sm:text-xl font-medium max-w-md mb-10" style={{ color: C.textDim, lineHeight: 1.7 }}>
              अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें। आज ही जुड़ें और 100% पारदर्शी योजना का लाभ उठाएं।
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="w-full sm:w-auto px-10 py-5 rounded-sm font-raleway font-bold text-sm tracking-widest uppercase text-white transition-all shadow-xl flex items-center justify-center gap-2" style={{ background: C.maroon }}>
                योजना शुरू करें <ArrowRight size={16} />
              </motion.button>
              <motion.a href="#calculator" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-10 py-5 rounded-sm font-raleway font-bold text-sm tracking-widest uppercase transition-all bg-transparent hover:bg-white flex items-center justify-center gap-2" style={{ border: `1px solid ${C.maroon}`, color: C.maroon }}>
                लाभ की गणना करें
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Visual (Simple Landscape Video with Floating Badge) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }} className="relative w-full flex justify-center lg:justify-end">
            {/* Landscape Frame */}
            <div className="relative w-full sm:w-[90%] lg:w-full aspect-video rounded-2xl overflow-hidden shadow-2xl z-10" style={{ border: `6px solid ${C.voidLight}` }}>
              <motion.video
                style={{ scale: imgScale }}
                src="/srjyojna.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Decorative Outline — offset so it doesn't clip */}
            <div className="absolute top-3 -right-3 w-full sm:w-[90%] lg:w-full aspect-video rounded-2xl border z-0 hidden sm:block" style={{ borderColor: C.gold }} />

            {/* Floating Glass Badge (10+2) — bottom-right inside video, compact so showroom is fully visible */}
            <motion.div 
              animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl z-30 shadow-xl"
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: '1rem',
                padding: '12px 16px',
              }}
            >
              <span className="font-cinzel text-[8px] tracking-widest uppercase mb-2 block" style={{ color: C.gold }}>Golden Benefit</span>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <span className="font-cormorant text-3xl font-bold leading-none" style={{ color: C.text }}>10</span>
                  <p className="font-cinzel text-[7px] tracking-wider font-bold mt-0.5" style={{ color: C.textDim }}>YOU PAY</p>
                </div>
                <span className="font-cormorant text-2xl" style={{ color: C.gold }}>+</span>
                <div className="text-center">
                  <span className="font-cormorant text-3xl font-bold leading-none" style={{ color: C.maroon }}>2</span>
                  <p className="font-cinzel text-[7px] tracking-wider font-bold mt-0.5" style={{ color: C.maroonLt }}>WE PAY</p>
                </div>
                <div className="w-px h-8 mx-1" style={{ background: C.border }} />
                <div className="text-center">
                  <span className="font-cormorant text-3xl font-bold leading-none" style={{ color: C.gold }}>12</span>
                  <p className="font-cinzel text-[7px] tracking-wider font-bold mt-0.5" style={{ color: C.gold }}>MONTHS</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          EDITORIAL IMAGE BANNER
      ════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-[300px] sm:h-[400px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Jadau Necklace8.jpg" 
            alt="Gold Details" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <Shield size={40} className="mx-auto mb-6 opacity-80" style={{ color: C.goldLight }} strokeWidth={1} />
          <h2 className="font-cormorant text-3xl sm:text-5xl font-light italic text-white leading-snug">
            "Building your golden legacy, <br/> one secure installment at a time."
          </h2>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PICTORIAL "HOW IT WORKS" SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32" style={{ background: C.voidLight }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase block mb-4" style={{ color: C.gold }}>The Process</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>यह कैसे काम करता है?</h2>
            <div className="mt-6 mx-auto w-16 h-px" style={{ background: C.maroon }} />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8">
            {[
              { 
                img: '/antique2.jpg',
                title: '1. योजना चुनें', 
                desc: '₹2,000 से लेकर ₹50,000 तक अपनी सुविधानुसार कोई भी मासिक किस्त राशि निर्धारित करें।' 
              },
              { 
                img: '/antique3.jpg',
                title: '2. 10 किस्तें जमा करें', 
                desc: 'लगातार 10 महीनों तक अपनी किस्त समय पर जमा करें। शेष 2 किस्तें हमारी ओर से मुफ्त दी जाएंगी।' 
              },
              { 
                img: '/bangle1.png',
                title: '3. आभूषण खरीदें', 
                desc: '12वें महीने में अपने कुल जमा मूल्य (10+2) के बराबर अपनी पसंद का कोई भी सोने का आभूषण घर ले जाएं।' 
              },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="group cursor-pointer">
                <div className="relative w-full aspect-[4/3] overflow-hidden mb-8 rounded-sm shadow-md bg-[#f9f9f9]">
                  <motion.img 
                    whileHover={{ scale: 1.08 }} transition={{ duration: 0.6 }}
                    src={step.img} alt={step.title} 
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md w-10 h-10 flex items-center justify-center font-cormorant text-2xl font-bold rounded-sm shadow-sm" style={{ color: C.maroon }}>
                    {i+1}
                  </div>
                </div>
                <h3 className="font-cormorant text-3xl font-bold mb-3" style={{ color: C.text }}>{step.title}</h3>
                <p className="font-raleway text-sm leading-relaxed" style={{ color: C.textDim }}>{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINTECH CALCULATOR (Flat & Elegant)
      ════════════════════════════════════════════════════════ */}
      <section id="calculator" className="py-24 sm:py-32" style={{ background: C.voidMid }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase block mb-4" style={{ color: C.gold }}>Investment Tool</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>लाभ की गणना करें</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="p-8 sm:p-16 bg-white shadow-lg relative" style={{ border: `1px solid ${C.border}` }}>
            
            {/* Elegant Slider */}
            <div className="max-w-3xl mx-auto mb-16 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b" style={{ borderColor: C.border }}>
                <label className="font-cinzel text-sm font-bold tracking-widest uppercase" style={{ color: C.textDim }}>मासिक किस्त चुनें</label>
                <motion.span key={installment} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="font-cormorant text-4xl sm:text-5xl font-bold tabular-nums" style={{ color: C.maroon }}>
                  {formatINR(installment)}
                </motion.span>
              </div>
              
              <div className="relative pt-4 pb-2">
                <input type="range" min={2000} max={50000} step={1000} value={installment} onChange={e => setInstallment(Number(e.target.value))} 
                       className="w-full h-1 outline-none cursor-pointer appearance-none z-10 relative" 
                       style={{ background: `linear-gradient(to right, ${C.maroon} ${(installment - 2000) / 48000 * 100}%, ${C.voidMid} ${(installment - 2000) / 48000 * 100}%)` }} />
                <style>{`
                  input[type=range]::-webkit-slider-thumb {
                    appearance: none; width: 28px; height: 28px; border-radius: 50%;
                    background: ${C.maroon}; border: 4px solid #fff;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2); cursor: grab; transition: transform 0.2s;
                  }
                  input[type=range]::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); }
                `}</style>
                <div className="flex justify-between mt-6">
                  <span className="font-cinzel text-xs font-bold" style={{ color: C.textDim }}>₹2,000</span>
                  <span className="font-cinzel text-xs font-bold" style={{ color: C.textDim }}>₹50,000</span>
                </div>
              </div>
            </div>

            {/* Flat Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-12 border-y sm:border-y-0 sm:border-x relative z-10" style={{ borderColor: C.border }}>
              <div className="p-8 text-center border-b sm:border-b-0 sm:border-r" style={{ borderColor: C.border }}>
                <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: C.textDim }}>आपकी 10 किस्तें</p>
                <p className="font-cormorant text-3xl sm:text-4xl font-bold tabular-nums" style={{ color: C.text }}><CountUp to={userTotal} /></p>
              </div>

              <div className="p-8 text-center border-b sm:border-b-0 sm:border-r relative overflow-hidden" style={{ borderColor: C.border, background: C.void }}>
                <div className="absolute top-4 right-4"><Star size={16} style={{ color: C.gold }} /></div>
                <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: C.maroon }}>SRJ की 2 किस्तें (Bonus)</p>
                <p className="font-cormorant text-4xl sm:text-5xl font-bold tabular-nums" style={{ color: C.maroon }}>+ <CountUp to={srjBonus} /></p>
              </div>

              <div className="p-8 text-center" style={{ background: C.voidLight }}>
                <p className="font-cinzel text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: C.gold }}>कुल आभूषण मूल्य</p>
                <p className="font-cormorant text-4xl sm:text-5xl font-bold tabular-nums" style={{ color: C.gold }}><CountUp to={grandTotal} /></p>
              </div>
            </div>

            <div className="flex justify-center relative z-10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-3 px-12 py-5 rounded-sm font-raleway font-bold text-sm tracking-widest uppercase text-white transition-all shadow-lg" style={{ background: C.maroon }}>
                {isMobile ? <Smartphone size={18} /> : <QrCode size={18} />} योजना शुरू करें <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TERMS & CONDITIONS (Editorial List)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32" style={{ background: C.voidLight }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="font-cormorant text-3xl font-bold uppercase tracking-wide" style={{ color: C.text }}>नियम एवं शर्तें</h2>
            <div className="mt-4 mx-auto w-10 h-px" style={{ background: C.gold }} />
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            {[
              'योजना की कुल अवधि 12 माह की होगी।',
              'ग्राहक को लगातार 10 मासिक किस्तें नियत समय पर जमा करनी अनिवार्य हैं।',
              'अंतिम 2 किस्तों (बोनस) का लाभ केवल योजना की सभी शर्तें सफलतापूर्वक पूरी करने पर ही देय होगा।',
              'यह योजना विशेष रूप से केवल सोने के आभूषणों की खरीद पर लागू है।',
              'योजना का लाभ किसी भी स्थिति में नकद भुगतान (Cash) के रूप में नहीं दिया जाएगा।',
              'प्रबंधन के पास बिना पूर्व सूचना के नियम एवं शर्तों में परिवर्तन करने का अधिकार सुरक्षित है।',
            ].map((text, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-4 pb-6 border-b" style={{ borderColor: C.voidMid }}>
                <span className="font-cormorant text-xl font-bold mt-[-2px]" style={{ color: C.gold }}>{String(i + 1).padStart(2, '0')}</span>
                <p className="font-raleway text-sm sm:text-base font-medium" style={{ color: C.textDim }}>{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER CTA (Classic Jewelry Dark Theme)
      ════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 text-center relative overflow-hidden" style={{ background: C.maroon }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(${C.goldLight} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="font-cinzel text-xs font-bold tracking-[0.5em] uppercase block mb-6 text-white/60">Take The First Step</span>
          <h2 className="font-cormorant font-bold mb-6 text-white leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            अपने सपनों के गहनों की <br/><em className="italic font-light" style={{ color: C.gold }}>शुरुआत करें</em>
          </h2>
          <p className="font-cormorant text-xl sm:text-2xl font-light italic mb-12 text-white/80">"सोना सिर्फ आभूषण नहीं, आपके भविष्य का निवेश है।"</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="w-full sm:w-auto px-10 py-5 rounded-sm font-raleway font-bold text-sm tracking-widest uppercase transition-all bg-white shadow-lg" style={{ color: C.maroon }}>
              योजना शुरू करें
            </motion.button>
            <motion.a href={waLink} target="_blank" rel="noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto px-10 py-5 rounded-sm font-raleway font-bold text-sm tracking-widest uppercase text-white border transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              WhatsApp पर जुड़ें
            </motion.a>
          </div>

          <p className="font-cinzel text-xs font-bold tracking-[0.3em] uppercase text-white/40">विश्वास · शुद्धता · गुणवत्ता</p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CLEAN PAYMENT MODAL
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(44, 26, 29, 0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white rounded-sm overflow-hidden shadow-2xl relative">
              
              <div className="px-6 py-6 border-b flex justify-between items-start" style={{ borderColor: C.border, background: C.void }}>
                <div>
                  <h3 className="font-cormorant text-2xl font-bold" style={{ color: C.text }}>Start Your Plan</h3>
                  <p className="font-raleway text-sm mt-1 font-bold" style={{ color: C.maroon }}>Amount: {formatINR(installment)}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 transition-colors rounded-full"><X size={20} style={{ color: C.textDim }} /></button>
              </div>

              <div className="px-6 py-8 flex flex-col items-center gap-8">
                {/* Step 1 */}
                <div className="w-full">
                  <p className="font-cinzel text-xs font-bold mb-4 text-center uppercase tracking-widest" style={{ color: C.textDim }}>
                    1. {isMobile ? 'Pay via UPI App' : 'Scan to Pay'}
                  </p>
                  {isMobile ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'GPay', href: `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR` },
                        { label: 'PhonePe', href: `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR` },
                        { label: 'Paytm', href: `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR` },
                        { label: 'Other', href: genericUpi },
                      ].map(btn => (
                        <a key={btn.label} href={btn.href} className="py-4 border rounded-sm font-raleway font-bold text-sm text-center transition-colors hover:bg-gray-50" style={{ borderColor: C.border, color: C.text }}>{btn.label}</a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <img src={qrUrl} alt="UPI QR" className="w-48 h-48 border p-2" style={{ borderColor: C.border }} />
                      <p className="font-mono text-xs mt-3 tracking-wide font-bold" style={{ color: C.textDim }}>{upiId}</p>
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div className="w-full border-t pt-8" style={{ borderColor: C.border }}>
                  <p className="font-cinzel text-xs font-bold mb-4 text-center uppercase tracking-widest" style={{ color: C.textDim }}>
                    2. Verify Payment
                  </p>
                  <motion.a href={waLink} target="_blank" rel="noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-3 w-full py-4 rounded-sm font-raleway font-bold text-white text-sm tracking-wider uppercase shadow-md" style={{ background: '#25D366' }}>
                    <ImageIcon size={18} /> Send Screenshot
                  </motion.a>
                  <p className="text-center font-raleway text-xs mt-4 leading-relaxed font-medium" style={{ color: C.textDim }}>
                    Share your payment screenshot on WhatsApp to instantly activate your plan.
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
