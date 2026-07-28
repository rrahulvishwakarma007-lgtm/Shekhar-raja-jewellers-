import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Gift, Wallet, ShieldCheck, ShoppingBag, 
  CheckCircle2, Calculator, Sparkles, MessageCircle, Phone 
} from 'lucide-react';

// ── Design Tokens (Matched to Shekhar Raja Jewellers Theme) ──
const C = {
  bg: '#faf7f2',         // Warm Ivory Base
  bgCard: '#ffffff',     // Pure white for cards
  gold: '#b8862a',       // Primary Gold
  goldLt: '#d4a843',     // Highlight Gold
  goldDk: '#8b6014',     // Deep Gold
  text: '#3a2e1e',       // Deep Brown/Graphite (Headings)
  textLight: '#7a6448',  // Muted Brown (Paragraphs)
  border: 'rgba(184, 134, 42, 0.15)', // Subtle gold border
};

export default function SwarnaSamriddhi() {
  const [installment, setInstallment] = useState<number>(5000);

  // Calculations
  const userTotal = installment * 10;
  const srjBonus = installment * 2;
  const grandTotal = userTotal + srjBonus;

  // Formatting currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Staggered animation variants correctly typed for TypeScript
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen selection:bg-[#b8862a] selection:text-white pb-20" style={{ background: C.bg, color: C.text }}>
      
      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ========================================================== */}
      <section className="relative pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Background Patterns & Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${C.gold} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[150px] pointer-events-none"
          style={{ background: C.goldLt }} 
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#b8862a]" />
            <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold" style={{ color: C.goldDk }}>
              शेखर राजा ज्वेलर्स प्रस्तुत करता है
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#b8862a]" />
          </div>
          
          {/* Main Title */}
          <h1 className="font-cormorant text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ color: C.text }}>
            स्वर्ण समृद्धि <span className="italic" style={{ color: C.gold }}>योजना</span>
          </h1>
          
          <p className="font-cormorant text-2xl sm:text-4xl font-medium mb-8" style={{ color: C.textLight }}>
            10 किस्तें आपकी — <span className="font-bold border-b-2 pb-1" style={{ color: C.goldDk, borderColor: C.goldLt }}>2 किस्तें हमारी</span>
          </p>

          <p className="font-raleway text-sm sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: C.textLight }}>
            अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें। आज ही जुड़ें और अपने सपनों के गहनों की शुरुआत करें!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <a href="#calculator" className="w-full sm:w-auto px-8 py-4 font-raleway font-bold text-sm tracking-wider flex items-center justify-center gap-2 rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(184,134,42,0.2)] hover:shadow-[0_8px_25px_rgba(184,134,42,0.4)] hover:-translate-y-1 text-white" style={{ background: `linear-gradient(135deg, ${C.goldLt}, ${C.goldDk})` }}>
              <Calculator size={18} />
              योजना की गणना करें
            </a>
            <a href="https://wa.me/918377911745?text=मुझे%20स्वर्ण%20समृद्धि%20योजना%20के%20बारे%20में%20जानना%20है" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 font-raleway font-bold text-sm tracking-wider flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:bg-white shadow-sm hover:shadow-md hover:-translate-y-1 bg-white/50 backdrop-blur-sm" style={{ border: `1px solid ${C.border}`, color: C.text }}>
              <MessageCircle size={18} className="text-[#25D366]" />
              WhatsApp पर बात करें
            </a>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES SECTION
      ========================================================== */}
      <section className="py-16 px-6 max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h2 className="font-cormorant text-4xl sm:text-5xl font-bold mb-4">योजना की विशेषताएँ</h2>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
        </motion.div>

        <motion.div 
          variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: Wallet, title: 'केवल 10 किस्तें', desc: 'ग्राहक केवल 10 मासिक किस्तें जमा करेगा। अपनी सुविधानुसार मासिक किस्त राशि चुनें।' },
            { icon: Gift, title: '2 किस्तें मुफ्त', desc: 'अंतिम 2 किस्तों का भुगतान शेखर राजा ज्वेलर्स द्वारा किया जाएगा।' },
            { icon: ShoppingBag, title: '12 किस्तों का लाभ', desc: 'कुल 12 किस्तों के मूल्य का सोने का आभूषण खरीदने का सुनहरा अवसर।' },
            { icon: ShieldCheck, title: '100% पारदर्शी', desc: 'यह योजना पूरी तरह से पारदर्शी एवं विश्वसनीय है।' },
            { icon: Sparkles, title: 'पसंदीदा आभूषण', desc: 'योजना पूरी होने पर अपनी पसंद के सोने के आभूषण खरीदें।' },
          ].map((feature, i) => (
            <motion.div 
              key={i} variants={itemVariants}
              className="p-8 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500"
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(58,46,30,0.03)' }}
            >
              <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(184,134,42,0.3)]" style={{ background: 'linear-gradient(135deg, #fff, #fdf8f0)', border: `1px solid ${C.border}` }}>
                <feature.icon size={26} style={{ color: C.gold }} />
              </div>
              <h3 className="font-cormorant text-2xl font-bold mb-3" style={{ color: C.text }}>{feature.title}</h3>
              <p className="font-raleway text-sm leading-relaxed" style={{ color: C.textLight }}>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          INTERACTIVE CALCULATOR
      ========================================================== */}
      <section id="calculator" className="py-20 px-6 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-3xl p-8 sm:p-14 shadow-[0_20px_50px_rgba(58,46,30,0.08)] relative overflow-hidden"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          {/* Decorative Corner Flairs */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${C.goldDk}, transparent)` }} />
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at bottom right, ${C.goldDk}, transparent)` }} />

          <div className="text-center mb-12 relative z-10">
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold mb-4" style={{ color: C.text }}>
              लाभ की गणना करें
            </h2>
            <p className="font-raleway text-sm sm:text-base max-w-lg mx-auto" style={{ color: C.textLight }}>
              अपनी मासिक किस्त की राशि चुनें और देखें कि शेखर राजा ज्वेलर्स की ओर से आपको कितना अतिरिक्त लाभ मिलेगा।
            </p>
          </div>

          <div className="mb-14 relative z-10 max-w-2xl mx-auto">
            <div className="flex justify-between items-end mb-6 border-b border-dashed pb-4" style={{ borderColor: C.border }}>
              <label className="font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase" style={{ color: C.textLight }}>
                मासिक किस्त चुनें
              </label>
              <motion.span 
                key={installment}
                initial={{ scale: 1.2, color: C.goldLt }}
                animate={{ scale: 1, color: C.goldDk }}
                className="font-cormorant text-3xl sm:text-4xl font-bold"
              >
                {formatINR(installment)}
              </motion.span>
            </div>
            
            {/* Custom Range Slider */}
            <div className="relative pt-2">
              <input 
                type="range" 
                min="2000" 
                max="50000" 
                step="1000" 
                value={installment} 
                onChange={(e) => setInstallment(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none relative z-10"
                style={{ 
                  background: `linear-gradient(to right, ${C.gold} ${(installment - 2000) / (50000 - 2000) * 100}%, #f0e6d2 ${(installment - 2000) / (50000 - 2000) * 100}%)`,
                }}
              />
              <style>{`
                input[type=range]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${C.bgCard};
                  border: 3px solid ${C.gold};
                  box-shadow: 0 4px 10px rgba(184,134,42,0.4);
                  cursor: pointer;
                  transition: transform 0.1s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                  transform: scale(1.2);
                }
              `}</style>
            </div>
            
            <div className="flex justify-between font-cinzel text-[10px] sm:text-xs tracking-widest mt-4 font-bold" style={{ color: C.textLight }}>
              <span>₹2,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* User Contribution */}
            <div className="p-8 rounded-2xl text-center flex flex-col justify-center" style={{ background: '#fdfbf7', border: `1px solid rgba(184, 134, 42, 0.08)` }}>
              <p className="font-cinzel text-[10px] sm:text-xs tracking-widest mb-3 uppercase font-bold" style={{ color: C.textLight }}>आपकी 10 किस्तें</p>
              <p className="font-cormorant text-3xl font-bold" style={{ color: C.text }}>{formatINR(userTotal)}</p>
            </div>
            
            {/* SRJ Bonus (Highlight) */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-2xl text-center relative shadow-[0_10px_30px_rgba(184,134,42,0.15)] flex flex-col justify-center" 
              style={{ background: `linear-gradient(135deg, ${C.goldLt}, ${C.goldDk})`, border: `1px solid ${C.goldLt}` }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black font-cinzel text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-md whitespace-nowrap">
                हमारा योगदान
              </div>
              <p className="font-cinzel text-[10px] sm:text-xs tracking-widest mb-3 uppercase font-bold text-white/90">शेखर राजा ज्वेलर्स की 2 किस्तें</p>
              <p className="font-cormorant text-4xl font-bold text-white drop-shadow-md">+ {formatINR(srjBonus)}</p>
            </motion.div>

            {/* Grand Total */}
            <div className="p-8 rounded-2xl text-center flex flex-col justify-center" style={{ background: '#fdfbf7', border: `1px solid rgba(184, 134, 42, 0.08)` }}>
              <p className="font-cinzel text-[10px] sm:text-xs tracking-widest mb-3 uppercase font-bold" style={{ color: C.textLight }}>कुल आभूषण खरीद मूल्य</p>
              <p className="font-cormorant text-4xl font-bold" style={{ color: C.goldDk }}>{formatINR(grandTotal)}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TERMS & CONDITIONS
      ========================================================== */}
      <section className="py-16 px-6 max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl" 
          style={{ border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}
        >
          <h2 className="font-cormorant text-3xl font-bold mb-8 flex items-center gap-4">
            <span className="w-10 h-[1px]" style={{ background: C.gold }}></span>
            योजना के नियम एवं शर्तें
          </h2>
          <ul className="space-y-5">
            {[
              'योजना की अवधि 12 माह होगी।',
              'ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होगी।',
              'अंतिम 2 किस्तों का लाभ केवल योजना की सभी शर्तें पूरी करने पर मिलेगा।',
              'यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी।',
              'योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा।',
              'नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं।',
            ].map((term, i) => (
              <li key={i} className="flex items-start gap-4 font-raleway text-sm sm:text-base leading-relaxed" style={{ color: C.textLight }}>
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" style={{ color: C.gold }} />
                <span className="pt-0.5">{term}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER / CTA
      ========================================================== */}
      <footer className="pt-20 px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto border-t pt-16" style={{ borderColor: C.border }}>
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold mb-4" style={{ color: C.text }}>
            सोना सिर्फ आभूषण नहीं, <span className="italic" style={{ color: C.goldDk }}>आपके सपनों का निवेश है</span>
          </h2>
          <p className="font-raleway text-sm mb-10 max-w-xl mx-auto" style={{ color: C.textLight }}>
            ज्वेलरी बुकिंग एवं अधिक जानकारी के लिए आज ही हमारे शोरूम पर संपर्क करें।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
            {/* Phone */}
            <motion.a whileHover={{ y: -2 }} href="tel:+918377911745" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all group-hover:shadow-md" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
                <Phone size={18} style={{ color: C.goldDk }} />
              </div>
              <div className="text-left">
                <p className="font-cinzel text-[10px] tracking-widest uppercase font-bold" style={{ color: C.textLight }}>Call Us</p>
                <p className="font-raleway font-bold text-lg" style={{ color: C.text }}>+91 8377911745</p>
              </div>
            </motion.a>
            
            <div className="hidden sm:block w-[1px] h-12" style={{ background: C.border }}></div>
            
            {/* WhatsApp */}
            <motion.a whileHover={{ y: -2 }} href="https://wa.me/918377911745" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all group-hover:shadow-md bg-[#25D366]/10 border border-[#25D366]/30">
                <MessageCircle size={18} className="text-[#25D366]" />
              </div>
              <div className="text-left">
                <p className="font-cinzel text-[10px] tracking-widest uppercase font-bold" style={{ color: C.textLight }}>WhatsApp</p>
                <p className="font-raleway font-bold text-lg hover:text-[#25D366] transition-colors" style={{ color: C.text }}>+91 8377911745</p>
              </div>
            </motion.a>
          </div>

          <div className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-bold uppercase opacity-80" style={{ color: C.goldDk }}>
            <span>Shekhar Raja Jewellers</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }}></span>
            <span>विश्वास • शुद्धता • गुणवत्ता</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
