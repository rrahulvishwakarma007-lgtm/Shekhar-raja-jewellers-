import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, Wallet, ShieldCheck, ShoppingBag, ArrowRight, 
  CheckCircle2, Calculator, Sparkles, MessageCircle, Phone 
} from 'lucide-react';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#16171B',       // Graphite Dark
  bgCard: '#1E1F24',   // Slightly lighter dark for cards
  gold: '#B8923F',     // Muted antique gold
  goldLt: '#D9B876',   // Highlight gold
  ivory: '#F6F1E7',    // Text/Paper
  border: 'rgba(217, 184, 118, 0.15)',
};

const serif = "'Cormorant Garamond', serif"; // Or 'Fraunces'
const sans = "'Inter', sans-serif";

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

  return (
    <div className="min-h-screen font-sans selection:bg-[#B8923F] selection:text-white" style={{ background: C.bg, color: C.ivory }}>
      
      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ========================================================== */}
      <section className="relative pt-24 pb-16 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(217,184,118,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(217,184,118,0.2) 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none"
             style={{ background: C.gold }} 
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-6 block font-semibold text-center" style={{ color: C.gold }}>
            शेखर राजा ज्वेलर्स प्रस्तुत करता है
          </span>
          
          <h1 className="text-5xl sm:text-7xl font-bold mb-4" style={{ fontFamily: serif, color: C.goldLt }}>
            स्वर्ण समृद्धि योजना
          </h1>
          
          <p className="text-xl sm:text-3xl font-medium mb-8 text-[#F6F1E7]">
            10 किस्तें आपकी — <span style={{ color: C.goldLt }}>2 किस्तें हमारी</span>
          </p>

          <p className="text-sm sm:text-lg mb-10 max-w-2xl mx-auto text-gray-400">
            अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें। आज ही जुड़ें और अपने सपनों के गहनों की शुरुआत करें!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#calculator" className="w-full sm:w-auto px-8 py-4 font-bold text-sm tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all hover:-translate-y-1" style={{ background: C.gold, color: '#000' }}>
              <Calculator size={18} />
              योजना की गणना करें
            </a>
            <a href="https://wa.me/919876543210?text=मुझे%20स्वर्ण%20समृद्धि%20योजना%20के%20बारे%20में%20जानना%20है" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 font-bold text-sm tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all hover:bg-white/5 border" style={{ borderColor: C.border, color: C.ivory }}>
              <MessageCircle size={18} style={{ color: '#25D366' }} />
              WhatsApp पर बात करें
            </a>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES SECTION
      ========================================================== */}
      <section className="py-16 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: serif }}>योजना की विशेषताएँ</h2>
          <div className="w-16 h-1 mx-auto" style={{ background: C.gold }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Wallet, title: 'केवल 10 किस्तें', desc: 'ग्राहक केवल 10 मासिक किस्तें जमा करेगा। अपनी सुविधानुसार मासिक किस्त राशि चुनें।' },
            { icon: Gift, title: '2 किस्तें मुफ्त', desc: 'अंतिम 2 किस्तों का भुगतान शेखर राजा ज्वेलर्स द्वारा किया जाएगा।' },
            { icon: ShoppingBag, title: '12 किस्तों का लाभ', desc: 'कुल 12 किस्तों के मूल्य का सोने का आभूषण खरीदने का सुनहरा अवसर।' },
            { icon: ShieldCheck, title: '100% पारदर्शी', desc: 'यह योजना पूरी तरह से पारदर्शी एवं विश्वसनीय है।' },
            { icon: Sparkles, title: 'पसंदीदा आभूषण', desc: 'योजना पूरी होने पर अपनी पसंद के सोने के आभूषण खरीदें।' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-xl border flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
              style={{ background: C.bgCard, borderColor: C.border }}
            >
              <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center transition-colors group-hover:bg-[#B8923F]" style={{ background: 'rgba(217, 184, 118, 0.1)' }}>
                <feature.icon size={28} className="group-hover:text-black transition-colors" style={{ color: C.goldLt }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: serif }}>{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          INTERACTIVE CALCULATOR
      ========================================================== */}
      <section id="calculator" className="py-16 px-6 max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl border p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          style={{ background: C.bgCard, borderColor: C.border }}
        >
          {/* Subtle glow inside calculator */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8923F] rounded-full blur-[100px] opacity-10 pointer-events-none" />

          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: serif, color: C.goldLt }}>
              लाभ की गणना करें (उदाहरण)
            </h2>
            <p className="text-sm text-gray-400">अपनी मासिक किस्त की राशि चुनें और देखें कि आपको कितना अतिरिक्त लाभ मिलेगा।</p>
          </div>

          <div className="mb-10 relative z-10">
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-semibold tracking-wide text-gray-300">मासिक किस्त राशि चुनें</label>
              <span className="text-2xl font-bold" style={{ color: C.goldLt }}>{formatINR(installment)}</span>
            </div>
            <input 
              type="range" 
              min="2000" 
              max="50000" 
              step="1000" 
              value={installment} 
              onChange={(e) => setInstallment(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#B8923F]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
              <span>₹2,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
            <div className="p-6 rounded-lg border text-center" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
              <p className="text-xs text-gray-400 mb-2">आपकी 10 किस्तें</p>
              <p className="text-2xl font-bold">{formatINR(userTotal)}</p>
            </div>
            <div className="p-6 rounded-lg border text-center relative" style={{ borderColor: C.gold, background: 'rgba(217, 184, 118, 0.05)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B8923F] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                हमारा योगदान
              </div>
              <p className="text-xs text-gray-400 mb-2">शेखर राजा ज्वेलर्स की 2 किस्तें</p>
              <p className="text-2xl font-bold" style={{ color: C.goldLt }}>+ {formatINR(srjBonus)}</p>
            </div>
            <div className="p-6 rounded-lg border text-center" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
              <p className="text-xs text-gray-400 mb-2">कुल आभूषण खरीद मूल्य</p>
              <p className="text-3xl font-bold text-white">{formatINR(grandTotal)}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TERMS & CONDITIONS
      ========================================================== */}
      <section className="py-16 px-6 max-w-4xl mx-auto relative z-10">
        <div className="p-8 sm:p-10 border rounded-xl" style={{ borderColor: C.border, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.02))' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: serif }}>
            <span className="w-8 h-[1px]" style={{ background: C.gold }}></span>
            योजना के नियम एवं शर्तें
          </h2>
          <ul className="space-y-4">
            {[
              'योजना की अवधि 12 माह होगी।',
              'ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होगी।',
              'अंतिम 2 किस्तों का लाभ केवल योजना की सभी शर्तें पूरी करने पर मिलेगा।',
              'यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी।',
              'योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा।',
              'नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं।',
            ].map((term, i) => (
              <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-300 leading-relaxed">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: C.gold }} />
                {term}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER / CTA
      ========================================================== */}
      <footer className="pt-16 pb-8 px-6 text-center border-t relative z-10" style={{ borderColor: C.border }}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: serif }}>
          सोना सिर्फ आभूषण नहीं, <span style={{ color: C.goldLt }}>आपके सपनों का निवेश है</span>
        </h2>
        <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto">
          ज्वेलरी बुकिंग एवं अधिक जानकारी के लिए आज ही हमारे शोरूम पर संपर्क करें।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(217, 184, 118, 0.1)' }}>
              <Phone size={18} style={{ color: C.goldLt }} />
            </div>
            <div className="text-left">
              <p className="text-[10px] tracking-widest text-gray-500 uppercase">Call Us</p>
              <p className="font-mono font-bold">+91 98765 43210</p>
            </div>
          </div>
          <div className="hidden sm:block w-[1px] h-10" style={{ background: C.border }}></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(37, 211, 102, 0.1)' }}>
              <MessageCircle size={18} style={{ color: '#25D366' }} />
            </div>
            <div className="text-left">
              <p className="text-[10px] tracking-widest text-gray-500 uppercase">WhatsApp</p>
              <a href="https://wa.me/919876543210" className="font-mono font-bold hover:text-[#25D366] transition-colors">+91 98765 43210</a>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600 font-mono tracking-widest flex items-center justify-center gap-4">
          <span>SHEKHAR RAJA JEWELLERS</span>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>विश्वास • शुद्धता • गुणवत्ता</span>
        </div>
      </footer>

    </div>
  );
}
