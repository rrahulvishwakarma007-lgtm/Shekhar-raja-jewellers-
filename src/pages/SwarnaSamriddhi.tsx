import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { 
  Gift, Wallet, ShieldCheck, ShoppingBag, 
  CheckCircle2, Calculator, Sparkles, MessageCircle, Phone, QrCode, ArrowRight, X, Image as ImageIcon
} from 'lucide-react';

// ── Design Tokens (Light Royal Pink Theme) ──
const C = {
  bg: '#FFF5F7',         // Light Royal Pink Base
  bgCard: '#FFFFFF',     // Pure white for cards
  primary: '#C2185B',    // Royal Pink / Magenta
  primaryLt: '#E91E8C',  // Highlight Pink
  primaryDk: '#880E4F',  // Deep Royal Pink
  text: '#1A0010',       // Deep Dark Pink/Graphite (Headings)
  textLight: '#AD6888',  // Muted Pink (Paragraphs)
  border: 'rgba(194, 24, 91, 0.15)', // Subtle pink border
};

export default function SwarnaSamriddhi() {
  const [installment, setInstallment] = useState<number>(5000);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  // Pre-filled WhatsApp Message
  const whatsappMsg = `नमस्ते! 🙏\nमैं *स्वर्ण समृद्धि योजना* से जुड़ना चाहता/चाहती हूँ।\n\nमैंने अपनी पहली किस्त *₹${installment}* का भुगतान कर दिया है। पेमेंट का स्क्रीनशॉट साथ में भेज रहा/रही हूँ।`;
  const whatsappLink = `https://wa.me/918377911745?text=${encodeURIComponent(whatsappMsg)}`;

  // Dynamic QR Code Generator (Uses a free API to generate a UPI QR code)
  // Replace '8377911745@upi' with your actual shop UPI ID.
  const upiId = "8377911745@upi"; 
  const upiString = `upi://pay?pa=${upiId}&pn=Shekhar%20Raja%20Jewellers&am=${installment}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}&margin=10`;

  // Staggered animation variants
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
    <div className="min-h-screen selection:bg-[#C2185B] selection:text-white pb-20" style={{ background: C.bg, color: C.text }}>
      
      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ========================================================== */}
      <section className="relative pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${C.primary} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        </div>
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[150px] pointer-events-none"
          style={{ background: C.primaryLt }} 
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent" style={{ '--tw-gradient-to': C.primary } as React.CSSProperties} />
            <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold" style={{ color: C.primaryDk }}>
              शेखर राजा ज्वेलर्स प्रस्तुत करता है
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent" style={{ '--tw-gradient-to': C.primary } as React.CSSProperties} />
          </div>
          
          <h1 className="font-cormorant text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ color: C.text }}>
            स्वर्ण समृद्धि <span className="italic" style={{ color: C.primary }}>योजना</span>
          </h1>
          
          <p className="font-cormorant text-2xl sm:text-4xl font-medium mb-8" style={{ color: C.textLight }}>
            10 किस्तें आपकी — <span className="font-bold border-b-2 pb-1" style={{ color: C.primaryDk, borderColor: C.primaryLt }}>2 किस्तें हमारी</span>
          </p>

          <p className="font-raleway text-sm sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: C.textLight }}>
            अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें। आज ही जुड़ें और अपने सपनों के गहनों की शुरुआत करें!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <button onClick={() => setShowPaymentModal(true)} className="w-full sm:w-auto px-8 py-4 font-raleway font-bold text-sm tracking-wider flex items-center justify-center gap-2 rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(194,24,91,0.2)] hover:shadow-[0_8px_25px_rgba(194,24,91,0.4)] hover:-translate-y-1 text-white" style={{ background: `linear-gradient(135deg, ${C.primaryLt}, ${C.primaryDk})` }}>
              <QrCode size={18} />
              योजना शुरू करें (Pay Now)
            </button>
            <a href="#calculator" className="w-full sm:w-auto px-8 py-4 font-raleway font-bold text-sm tracking-wider flex items-center justify-center gap-2 rounded-full transition-all duration-300 hover:bg-white shadow-sm hover:shadow-md hover:-translate-y-1 bg-white/50 backdrop-blur-sm" style={{ border: `1px solid ${C.border}`, color: C.text }}>
              <Calculator size={18} className="text-[#C2185B]" />
              योजना की गणना करें
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
          <div className="w-20 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${C.primary}, transparent)` }} />
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
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(194,24,91,0.04)' }}
            >
              <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(194,24,91,0.25)]" style={{ background: 'linear-gradient(135deg, #fff, #FFF5F7)', border: `1px solid ${C.border}` }}>
                <feature.icon size={26} style={{ color: C.primary }} />
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
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-3xl p-8 sm:p-14 shadow-[0_20px_50px_rgba(194,24,91,0.06)] relative overflow-hidden"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${C.primaryDk}, transparent)` }} />
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at bottom right, ${C.primaryDk}, transparent)` }} />

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
                initial={{ scale: 1.2, color: C.primaryLt }} animate={{ scale: 1, color: C.primaryDk }}
                className="font-cormorant text-3xl sm:text-4xl font-bold"
              >
                {formatINR(installment)}
              </motion.span>
            </div>
            
            <div className="relative pt-2">
              <input 
                type="range" min="2000" max="50000" step="1000" value={installment} 
                onChange={(e) => setInstallment(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none relative z-10"
                style={{ background: `linear-gradient(to right, ${C.primary} ${(installment - 2000) / (50000 - 2000) * 100}%, #FCE4EC ${(installment - 2000) / (50000 - 2000) * 100}%)` }}
              />
              <style>{`
                input[type=range]::-webkit-slider-thumb {
                  appearance: none; width: 24px; height: 24px; border-radius: 50%;
                  background: ${C.bgCard}; border: 3px solid ${C.primary};
                  box-shadow: 0 4px 10px rgba(194,24,91,0.3); cursor: pointer; transition: transform 0.1s;
                }
                input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }
              `}</style>
            </div>
            
            <div className="flex justify-between font-cinzel text-[10px] sm:text-xs tracking-widest mt-4 font-bold" style={{ color: C.textLight }}>
              <span>₹2,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-10">
            <div className="p-8 rounded-2xl text-center flex flex-col justify-center" style={{ background: '#FFFDFE', border: `1px solid rgba(194, 24, 91, 0.08)` }}>
              <p className="font-cinzel text-[10px] sm:text-xs tracking-widest mb-3 uppercase font-bold" style={{ color: C.textLight }}>आपकी 10 किस्तें</p>
              <p className="font-cormorant text-3xl font-bold" style={{ color: C.text }}>{formatINR(userTotal)}</p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-2xl text-center relative shadow-[0_10px_30px_rgba(194,24,91,0.2)] flex flex-col justify-center" 
              style={{ background: `linear-gradient(135deg, ${C.primaryLt}, ${C.primaryDk})`, border: `1px solid ${C.primaryLt}` }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black font-cinzel text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-md whitespace-nowrap">
                हमारा योगदान
              </div>
              <p className="font-cinzel text-[10px] sm:text-xs tracking-widest mb-3 uppercase font-bold text-white/90">शेखर राजा ज्वेलर्स की 2 किस्तें</p>
              <p className="font-cormorant text-4xl font-bold text-white drop-shadow-md">+ {formatINR(srjBonus)}</p>
            </motion.div>

            <div className="p-8 rounded-2xl text-center flex flex-col justify-center" style={{ background: '#FFFDFE', border: `1px solid rgba(194, 24, 91, 0.08)` }}>
              <p className="font-cinzel text-[10px] sm:text-xs tracking-widest mb-3 uppercase font-bold" style={{ color: C.textLight }}>कुल आभूषण खरीद मूल्य</p>
              <p className="font-cormorant text-4xl font-bold" style={{ color: C.primaryDk }}>{formatINR(grandTotal)}</p>
            </div>
          </div>

          <div className="flex justify-center relative z-10 mt-8 pt-8 border-t border-dashed" style={{ borderColor: C.border }}>
             <button onClick={() => setShowPaymentModal(true)} className="px-10 py-4 font-raleway font-bold text-sm tracking-wider flex items-center justify-center gap-3 rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(194,24,91,0.2)] hover:shadow-[0_8px_25px_rgba(194,24,91,0.4)] hover:-translate-y-1 text-white" style={{ background: `linear-gradient(135deg, ${C.primaryLt}, ${C.primaryDk})` }}>
              <QrCode size={20} />
              पहली किस्त भरें और योजना शुरू करें
              <ArrowRight size={18} />
            </button>
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
          style={{ border: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}
        >
          <h2 className="font-cormorant text-3xl font-bold mb-8 flex items-center gap-4">
            <span className="w-10 h-[1px]" style={{ background: C.primary }}></span>
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
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" style={{ color: C.primary }} />
                <span className="pt-0.5">{term}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PAYMENT MODAL
      ========================================================== */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
            style={{ background: 'rgba(26,0,16,0.6)' }}
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b flex justify-between items-center" style={{ borderColor: C.border, background: C.bg }}>
                <div>
                  <h3 className="font-cormorant text-2xl font-bold" style={{ color: C.text }}>योजना शुरू करें</h3>
                  <p className="font-raleway text-xs font-semibold tracking-wide" style={{ color: C.primary }}>FIRST INSTALLMENT: {formatINR(installment)}</p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white border shadow-sm hover:bg-gray-50 transition-colors" style={{ borderColor: C.border }}>
                  <X size={16} style={{ color: C.text }} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col items-center">
                {/* Step 1: QR Code */}
                <div className="w-full text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.primary }}>1</span>
                    <p className="font-raleway text-sm font-bold" style={{ color: C.text }}>Scan & Pay via any UPI App</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-sm inline-block" style={{ border: `2px solid ${C.border}` }}>
                    <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 object-contain" />
                  </div>
                  <p className="font-mono text-xs mt-3 text-gray-500">UPI ID: {upiId}</p>
                </div>

                {/* Step 2: Screenshot */}
                <div className="w-full text-center mb-6 opacity-80">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gray-400">2</span>
                    <p className="font-raleway text-sm font-bold" style={{ color: C.textLight }}>Take a Screenshot</p>
                  </div>
                  <p className="text-xs text-gray-500">Take a screenshot of your successful payment screen.</p>
                </div>

                {/* Step 3: WhatsApp Action */}
                <div className="w-full text-center border-t pt-6" style={{ borderColor: C.border }}>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[#25D366]">3</span>
                    <p className="font-raleway text-sm font-bold" style={{ color: C.text }}>Share Screenshot on WhatsApp</p>
                  </div>
                  
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-raleway font-bold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" style={{ background: '#25D366' }}>
                    <ImageIcon size={18} />
                    Attach Screenshot & Send
                    <ArrowRight size={18} className="ml-1" />
                  </a>
                  <p className="text-[10px] text-gray-400 mt-3 font-raleway">
                    Our team will verify the payment and confirm your plan activation immediately.
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
