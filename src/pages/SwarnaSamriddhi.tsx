import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Gift, Wallet, ShoppingBag, Calculator, MessageCircle,
  ArrowRight, X, Smartphone, QrCode, Shield, ChevronDown,
  Star, Clock, CheckCircle2,
} from 'lucide-react';

// ── Design tokens: jewel-box dark with 22KT gold ─────────────────────────────
const C = {
  void:      '#0A0603',     // near-black with warm undertone — hero bg
  voidMid:   '#150C06',     // mid dark — section bg
  voidLight: '#1F1208',     // lighter dark — card bg
  gold:      '#B8862A',     // 22KT gold — primary
  goldPale:  '#F0D080',     // pale shimmer
  goldDeep:  '#7A5515',     // deep gold — pressed states
  pink:      '#C2185B',     // royal pink — accent / CTA
  pinkPale:  '#F8BBD9',
  cream:     '#FDF6E9',     // warm cream — light sections
  creamMid:  '#F5ECD7',
  text:      '#FFFDF8',     // near-white on dark
  textDim:   'rgba(255,253,248,0.55)',
  textDark:  '#1A0E04',     // dark text for light sections
  textDarkMid:'#6B4E2A',
  border:    'rgba(184,134,42,0.2)',
  borderBright:'rgba(184,134,42,0.5)',
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
  const heroOp = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const userTotal  = installment * 10;
  const srjBonus   = installment * 2;
  const grandTotal = userTotal + srjBonus;

  const upiId  = '8377911745@upi';
  const note   = 'Swarna Samriddhi Installment';
  const name   = 'Shekhar Raja Jewellers';
  const genericUpi   = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl        = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(genericUpi)}&margin=12&bgcolor=FFFDF8`;
  const whatsappMsg  = `नमस्ते! 🙏\nमैं *स्वर्ण समृद्धि योजना* से जुड़ना चाहता/चाहती हूँ।\n\nमासिक किस्त: *${formatINR(installment)}*\nपेमेंट स्क्रीनशॉट संलग्न है।`;
  const waLink       = `https://wa.me/918377911745?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div style={{ background: C.void, color: C.text, fontFamily: 'Raleway, sans-serif' }} className="min-h-screen selection:bg-[#B8862A] selection:text-black">

      {/* ════════════════════════════════════════════════════════
          HERO — typographic equation as the thesis
      ════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">

        {/* Layered background glows */}
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[140px]"
                      style={{ background: `radial-gradient(ellipse, ${C.gold} 0%, transparent 65%)` }} />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
                      transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                      className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px]"
                      style={{ background: `radial-gradient(ellipse, ${C.pink} 0%, transparent 65%)` }} />
        </div>

        <GoldParticles count={24} />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: `linear-gradient(${C.gold} 1px, transparent 1px), linear-gradient(90deg, ${C.gold} 1px, transparent 1px)`,
                      backgroundSize: '60px 60px' }} />

        <motion.div style={{ y: heroY, opacity: heroOp }}
                    className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.7 }}
                      className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, transparent, ${C.gold})` }} />
            <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.5em] uppercase"
                  style={{ color: C.gold }}>
              शेखर राजा ज्वेलर्स प्रस्तुत करता है
            </span>
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, transparent, ${C.gold})` }} />
          </motion.div>

          {/* Signature element: the 10 + 2 = 12 equation */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 1 }}
                      className="flex items-end justify-center gap-4 sm:gap-8 mb-6 leading-none select-none">
            <div className="flex flex-col items-center">
              <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                           className="font-cormorant font-bold"
                           style={{ fontSize: 'clamp(5rem, 18vw, 10rem)', color: C.goldPale, lineHeight: 0.9 }}>
                10
              </motion.span>
              <span className="font-cinzel text-[9px] sm:text-[11px] tracking-[0.3em] mt-2" style={{ color: C.textDim }}>
                आपकी किस्तें
              </span>
            </div>

            <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                         transition={{ delay: 0.85, type: 'spring', stiffness: 200, damping: 14 }}
                         className="font-cormorant font-light pb-10 sm:pb-14"
                         style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', color: C.gold }}>
              +
            </motion.span>

            <div className="flex flex-col items-center">
              <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                           className="font-cormorant font-bold relative"
                           style={{ fontSize: 'clamp(5rem, 18vw, 10rem)', color: C.pink, lineHeight: 0.9 }}>
                2
                {/* Glow behind 2 */}
                <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}
                             className="absolute inset-0 blur-2xl rounded-full -z-10"
                             style={{ background: C.pink }} />
              </motion.span>
              <span className="font-cinzel text-[9px] sm:text-[11px] tracking-[0.3em] mt-2" style={{ color: C.pink }}>
                हमारी किस्तें
              </span>
            </div>

            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                         transition={{ delay: 1.3, type: 'spring', stiffness: 200, damping: 14 }}
                         className="font-cormorant font-light pb-10 sm:pb-14"
                         style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', color: C.gold }}>
              =
            </motion.span>

            <div className="flex flex-col items-center">
              <motion.span initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                           transition={{ delay: 1.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                           className="font-cormorant font-bold"
                           style={{ fontSize: 'clamp(5rem, 18vw, 10rem)', color: C.goldPale, lineHeight: 0.9,
                                    background: `linear-gradient(135deg, ${C.goldPale}, ${C.gold})`,
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                12
              </motion.span>
              <span className="font-cinzel text-[9px] sm:text-[11px] tracking-[0.3em] mt-2" style={{ color: C.gold }}>
                किस्तों का लाभ
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 1.7, duration: 0.8 }}
                     className="font-cormorant font-bold mb-4"
                     style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
            स्वर्ण समृद्धि <em className="italic" style={{ color: C.gold }}>योजना</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.7 }}
                    className="font-raleway text-base sm:text-xl max-w-xl mx-auto mb-10"
                    style={{ color: C.textDim, lineHeight: 1.8 }}>
            अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2, duration: 0.6 }}
                      className="flex flex-col sm:flex-row items-center gap-4">
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                           onClick={() => setShowModal(true)}
                           className="flex items-center gap-2.5 px-8 py-4 rounded-full font-raleway font-bold text-sm tracking-wide text-black shadow-lg"
                           style={{ background: `linear-gradient(135deg, ${C.goldPale}, ${C.gold})`,
                                    boxShadow: `0 12px 36px rgba(184,134,42,0.4)` }}>
              {isMobile ? <Smartphone size={17} /> : <QrCode size={17} />}
              योजना शुरू करें — Pay Now
            </motion.button>
            <motion.a href="#calculator" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2.5 px-8 py-4 rounded-full font-raleway font-bold text-sm tracking-wide"
                      style={{ border: `1px solid ${C.borderBright}`, color: C.goldPale,
                               background: 'rgba(184,134,42,0.06)' }}>
              <Calculator size={17} style={{ color: C.gold }} />
              लाभ की गणना करें
            </motion.a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: 3, duration: 1 }}
                      className="mt-16">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <ChevronDown size={22} style={{ color: C.textDim }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES — cream band
      ════════════════════════════════════════════════════════ */}
      <section style={{ background: C.cream }}>
        <div className="max-w-6xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} className="text-center mb-16">
            <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase block mb-3"
                  style={{ color: C.gold }}>योजना की विशेषताएँ</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold"
                style={{ color: C.textDark }}>क्या मिलेगा आपको?</h2>
            <div className="mt-4 mx-auto w-20 h-0.5" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Wallet,      num: '10',    label: 'किस्तें आपकी', desc: 'ग्राहक केवल 10 मासिक किस्तें जमा करेगा। अपनी सुविधानुसार राशि चुनें।', accent: C.gold },
              { icon: Gift,        num: '2',     label: 'किस्तें हमारी', desc: 'अंतिम 2 किस्तों का भुगतान शेखर राजा ज्वेलर्स द्वारा किया जाएगा।', accent: C.pink },
              { icon: ShoppingBag, num: '12',    label: 'किस्तों का आभूषण', desc: 'कुल 12 किस्तों के मूल्य का सोने का आभूषण खरीदने का अवसर।', accent: C.gold },
            ].map((f, i) => (
              <motion.div key={i}
                          initial={{ opacity: 0, y: 32 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.12, duration: 0.6 }}
                          whileHover={{ y: -6 }}
                          className="p-8 sm:p-10 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group"
                          style={{ background: '#FFFFFF', border: `1px solid rgba(184,134,42,0.15)`,
                                   boxShadow: '0 4px 24px rgba(44,26,14,0.06)' }}>
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                     style={{ background: f.accent }} />
                <span className="font-cormorant font-bold mb-1"
                      style={{ fontSize: '5rem', lineHeight: 1, color: f.accent, opacity: 0.15,
                               position: 'absolute', top: 16, right: 24 }}>
                  {f.num}
                </span>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                     style={{ background: `${f.accent}15` }}>
                  <f.icon size={28} style={{ color: f.accent }} />
                </div>
                <h3 className="font-cormorant text-2xl font-bold mb-3 relative z-10" style={{ color: C.textDark }}>
                  {f.num} {f.label}
                </h3>
                <p className="font-raleway text-sm leading-relaxed relative z-10" style={{ color: C.textDarkMid }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CALCULATOR — dark jewel background
      ════════════════════════════════════════════════════════ */}
      <section id="calculator" style={{ background: C.voidMid }}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} className="text-center mb-14">
            <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase block mb-3" style={{ color: C.gold }}>
              INTERACTIVE CALCULATOR
            </span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>
              लाभ की गणना करें
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="rounded-3xl p-8 sm:p-14 relative overflow-hidden"
                      style={{ background: C.voidLight, border: `1px solid ${C.border}` }}>
            <GoldParticles count={12} />

            {/* Slider */}
            <div className="max-w-2xl mx-auto mb-14 relative z-10">
              <div className="flex items-end justify-between mb-6 pb-4 border-b border-dashed" style={{ borderColor: C.border }}>
                <label className="font-cinzel text-xs tracking-widest uppercase" style={{ color: C.textDim }}>
                  मासिक किस्त चुनें
                </label>
                <motion.span key={installment}
                             initial={{ scale: 1.15, color: C.goldPale }}
                             animate={{ scale: 1, color: C.gold }}
                             className="font-cormorant text-3xl sm:text-4xl font-bold tabular-nums">
                  {formatINR(installment)}
                </motion.span>
              </div>
              <div className="relative">
                <input type="range" min={2000} max={50000} step={1000} value={installment}
                       onChange={e => setInstallment(Number(e.target.value))}
                       className="w-full h-2 rounded-full outline-none cursor-pointer appearance-none"
                       style={{
                         background: `linear-gradient(to right, ${C.gold} ${(installment - 2000) / 48000 * 100}%, rgba(184,134,42,0.18) ${(installment - 2000) / 48000 * 100}%)`,
                       }} />
                <div className="flex justify-between mt-3">
                  <span className="font-cinzel text-[10px]" style={{ color: C.textDim }}>₹2,000</span>
                  <span className="font-cinzel text-[10px]" style={{ color: C.textDim }}>₹50,000</span>
                </div>
              </div>
            </div>

            {/* Result cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10 mb-10">
              <div className="rounded-2xl p-7 text-center"
                   style={{ background: 'rgba(255,253,248,0.04)', border: `1px solid ${C.border}` }}>
                <p className="font-cinzel text-[10px] tracking-widest uppercase mb-3" style={{ color: C.textDim }}>
                  आपकी 10 किस्तें
                </p>
                <p className="font-cormorant text-3xl font-bold tabular-nums" style={{ color: C.text }}>
                  <CountUp to={userTotal} />
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.03 }}
                          className="rounded-2xl p-7 text-center relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${C.pink}, #880E4F)`,
                                   boxShadow: `0 16px 40px rgba(194,24,91,0.35)` }}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full whitespace-nowrap shadow-md">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] font-bold"
                        style={{ color: C.pink }}>हमारा योगदान</span>
                </div>
                <p className="font-cinzel text-[10px] tracking-widest uppercase mb-3 text-white/80">
                  SRJ की 2 किस्तें
                </p>
                <p className="font-cormorant text-4xl font-bold text-white tabular-nums">
                  + <CountUp to={srjBonus} />
                </p>
              </motion.div>

              <div className="rounded-2xl p-7 text-center relative overflow-hidden"
                   style={{ background: 'rgba(184,134,42,0.07)', border: `1px solid ${C.borderBright}` }}>
                <p className="font-cinzel text-[10px] tracking-widest uppercase mb-3" style={{ color: C.gold }}>
                  कुल आभूषण मूल्य
                </p>
                <p className="font-cormorant text-4xl font-bold tabular-nums"
                   style={{ background: `linear-gradient(135deg, ${C.goldPale}, ${C.gold})`,
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <CountUp to={grandTotal} />
                </p>
              </div>
            </div>

            <div className="flex justify-center relative z-10">
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                             onClick={() => setShowModal(true)}
                             className="flex items-center gap-3 px-10 py-4 rounded-full font-raleway font-bold text-sm tracking-wide text-black"
                             style={{ background: `linear-gradient(135deg, ${C.goldPale}, ${C.gold})`,
                                      boxShadow: `0 12px 36px rgba(184,134,42,0.4)` }}>
                {isMobile ? <Smartphone size={18} /> : <QrCode size={18} />}
                पहली किस्त भरें और शुरू करें
                <ArrowRight size={17} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TERMS — cream band
      ════════════════════════════════════════════════════════ */}
      <section style={{ background: C.creamMid }}>
        <div className="max-w-4xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} className="text-center mb-12">
            <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase block mb-3" style={{ color: C.gold }}>
              TERMS & CONDITIONS
            </span>
            <h2 className="font-cormorant text-4xl font-bold" style={{ color: C.textDark }}>
              नियम एवं शर्तें
            </h2>
            <div className="mt-3 mx-auto w-16 h-0.5" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Clock,        text: 'योजना की अवधि 12 माह होगी।' },
              { icon: CheckCircle2, text: 'ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होगी।' },
              { icon: Gift,         text: 'अंतिम 2 किस्तों का लाभ केवल सभी शर्तें पूरी करने पर मिलेगा।' },
              { icon: Star,         text: 'यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी।' },
              { icon: Shield,       text: 'योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा।' },
              { icon: CheckCircle2, text: 'नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं।' },
            ].map((t, i) => (
              <motion.div key={i}
                          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.5 }}
                          className="flex items-start gap-4 p-5 rounded-2xl"
                          style={{ background: '#fff', border: `1px solid rgba(184,134,42,0.12)` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                     style={{ background: `${C.gold}15` }}>
                  <t.icon size={16} style={{ color: C.gold }} />
                </div>
                <p className="font-raleway text-sm leading-relaxed" style={{ color: C.textDarkMid }}>{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER CTA — dark jewel closer
      ════════════════════════════════════════════════════════ */}
      <section style={{ background: C.void }} className="relative overflow-hidden">
        <GoldParticles count={30} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 blur-[160px] pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 80%, ${C.gold}, transparent 60%)` }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}>
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase block mb-4" style={{ color: C.gold }}>
              आज ही जुड़ें
            </span>
            <h2 className="font-cormorant font-bold mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: C.text, lineHeight: 1.2 }}>
              अपने सपनों के गहनों की<br />
              <em className="italic" style={{ color: C.gold }}>शुरुआत करें!</em>
            </h2>
            <p className="font-cormorant text-xl italic mb-10" style={{ color: C.textDim }}>
              "सोना सिर्फ आभूषण नहीं, आपके सपनों का निवेश है।"
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
                             onClick={() => setShowModal(true)}
                             className="flex items-center gap-2.5 px-9 py-4 rounded-full font-raleway font-bold text-sm tracking-wide text-black"
                             style={{ background: `linear-gradient(135deg, ${C.goldPale}, ${C.gold})`,
                                      boxShadow: `0 16px 40px rgba(184,134,42,0.45)` }}>
                {isMobile ? <Smartphone size={17} /> : <QrCode size={17} />}
                योजना शुरू करें
              </motion.button>
              <motion.a href={waLink} target="_blank" rel="noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2.5 px-9 py-4 rounded-full font-raleway font-bold text-sm tracking-wide text-white"
                        style={{ background: '#25D366', boxShadow: '0 12px 32px rgba(37,211,102,0.3)' }}>
                <MessageCircle size={17} />
                WhatsApp पर जानकारी लें
              </motion.a>
            </div>

            {/* Contact */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <a href="tel:+918377911745" className="flex items-center gap-2 font-raleway text-sm"
                 style={{ color: C.textDim }}>
                <span style={{ color: C.gold }}>☎</span> +91 83779 11745
              </a>
              <div className="w-px h-4" style={{ background: C.border }} />
              <span className="font-raleway text-sm" style={{ color: C.textDim }}>
                shekharrajajewellers.com
              </span>
            </div>

            <p className="font-cinzel text-[10px] tracking-widest mt-10 uppercase"
               style={{ color: `${C.gold}60` }}>
              विश्वास · शुद्धता · गुणवत्ता
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PAYMENT MODAL
      ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
                      style={{ background: 'rgba(10,6,3,0.88)', backdropFilter: 'blur(12px)' }}
                      onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, y: 60, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        onClick={e => e.stopPropagation()}
                        className="w-full sm:max-w-md overflow-hidden relative"
                        style={{ background: C.cream, borderRadius: '24px 24px 0 0',
                                 boxShadow: '0 -20px 60px rgba(184,134,42,0.2)' }}>
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${C.goldDeep}, ${C.gold}, ${C.goldPale}, ${C.gold}, ${C.goldDeep})` }} />

              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'rgba(184,134,42,0.15)' }}>
                <div>
                  <p className="font-cinzel text-[9px] tracking-[0.3em] uppercase" style={{ color: C.gold }}>SWARNA SAMRIDDHI YOJANA</p>
                  <h3 className="font-cormorant text-2xl font-bold" style={{ color: C.textDark }}>योजना शुरू करें</h3>
                  <p className="font-raleway text-xs font-semibold" style={{ color: C.pink }}>
                    किस्त राशि: {formatINR(installment)}
                  </p>
                </div>
                <motion.button whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                               onClick={() => setShowModal(false)}
                               className="w-9 h-9 rounded-full flex items-center justify-center"
                               style={{ background: 'rgba(184,134,42,0.1)', border: `1px solid rgba(184,134,42,0.2)` }}>
                  <X size={16} style={{ color: C.textDark }} />
                </motion.button>
              </div>

              <div className="px-6 py-7 flex flex-col items-center gap-7">
                {/* Step 1 */}
                <div className="w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                         style={{ background: C.gold }}>1</div>
                    <p className="font-raleway font-bold text-sm" style={{ color: C.textDark }}>
                      {isMobile ? 'UPI App से भुगतान करें' : 'QR Code स्कैन करें'}
                    </p>
                  </div>

                  {isMobile ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Google Pay',  href: `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`, color: '#1a73e8' },
                        { label: 'PhonePe',     href: `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`,   color: '#5f259f' },
                        { label: 'Paytm',       href: `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${installment}&cu=INR`,   color: '#00baf2' },
                        { label: 'Other UPI',   href: genericUpi,                                                                              color: '#555' },
                      ].map(btn => (
                        <a key={btn.label} href={btn.href}
                           className="py-3 rounded-2xl font-raleway font-bold text-sm text-center"
                           style={{ background: `${btn.color}12`, border: `1.5px solid ${btn.color}30`, color: btn.color }}>
                          {btn.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-2xl" style={{ background: '#fff', border: `2px solid rgba(184,134,42,0.2)` }}>
                        <img src={qrUrl} alt="UPI QR" className="w-52 h-52 object-contain" />
                      </div>
                      <p className="font-mono text-xs" style={{ color: C.textDarkMid }}>UPI ID: {upiId}</p>
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div className="w-full flex items-center gap-3 opacity-70">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 text-gray-500">2</div>
                  <p className="font-raleway text-sm" style={{ color: C.textDarkMid }}>
                    भुगतान का screenshot लें
                  </p>
                </div>

                {/* Step 3 */}
                <div className="w-full border-t pt-5" style={{ borderColor: 'rgba(184,134,42,0.15)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[#25D366]">3</div>
                    <p className="font-raleway font-bold text-sm" style={{ color: C.textDark }}>
                      Screenshot WhatsApp पर भेजें
                    </p>
                  </div>
                  <motion.a href={waLink} target="_blank" rel="noreferrer"
                            whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-raleway font-bold text-white text-sm"
                            style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}>
                    <MessageCircle size={18} />
                    Screenshot भेजें और योजना पूरी करें
                    <ArrowRight size={16} />
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