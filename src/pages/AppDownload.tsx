import { motion } from 'framer-motion';
import { Download, MessageCircle, Smartphone, Tag, Bell, Headphones, Check, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Palette (Matching your App Theme) ─────────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
  bgCard:    '#FFFFFF',
  bgDeep:    '#FFE4EC',
  gold:      '#C2185B',
  goldDk:    '#880E4F',
  goldLt:    '#E91E8C',
  goldPale:  '#F8BBD9',
  goldBg:    'rgba(194,24,91,0.08)',
  text:      '#1A0010',
  textMid:   '#6D1B4E',
  textLight: '#AD6888',
  border:    'rgba(194,24,91,0.15)',
  borderMd:  'rgba(194,24,91,0.30)',
};

const features = [
  { icon: Tag, title: 'Complete Catalogue', desc: 'Browse our entire collection of gold and diamond jewellery' },
  { icon: Bell, title: 'Live Gold Rates', desc: 'Get real-time gold rate updates right on your phone' },
  { icon: Headphones, title: 'WhatsApp Support', desc: 'Instant support through WhatsApp integration' },
  { icon: Tag, title: 'Exclusive Offers', desc: 'Get app-only discounts and early access to new collections' }
];

const installSteps = [
  { step: 1, title: 'Download APK', desc: 'Click the download button to get the APK file' },
  { step: 2, title: 'Enable Unknown Sources', desc: 'Go to Settings, then Security, then enable Unknown Sources' },
  { step: 3, title: 'Install the App', desc: 'Open the downloaded APK and tap Install' },
  { step: 4, title: 'Start Shopping', desc: 'Open the app and explore our collection!' }
];

const APK_URL = 'https://github.com/rrahulvishwakarma007-lgtm/srj-app/releases/download/SRJ/shekharrajajewellerstheapp.apk';

export default function AppDownload() {
  return (
    <div className="pt-20 min-h-screen relative overflow-hidden" style={{ background: C.bg }}>

      {/* Decorative Ambient Background */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full opacity-30 mix-blend-multiply filter blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.1) 0%, transparent 70%)' }} />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, ' + C.text + ' 0%, ' + C.goldDk + ' 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Smartphone size={18} style={{ color: C.goldPale }} />
                <span className="font-raleway text-sm font-medium" style={{ color: C.goldPale }}>Now Available on Android</span>
              </div>
              <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Shekhar Raja <br />Jewellers App
              </h1>
              <p className="font-raleway text-lg mt-6 max-w-lg mx-auto lg:mx-0" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Your favourite jewellery store now in your pocket. Browse collections, check live gold rates, and shop from anywhere.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-10 justify-center lg:justify-start">
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  href={APK_URL}
                  download
                  className="flex items-center gap-2 text-white px-8 py-4 rounded-full font-raleway font-bold transition-all shadow-lg"
                  style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLt})` }}
                >
                  <Download size={20} />
                  Download APK
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(37,211,102,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://wa.me/918377911745?text=${encodeURIComponent('Hello! Please share the app download link.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-raleway font-bold transition-all shadow-lg"
                >
                  <MessageCircle size={20} />
                  Get Link on WA
                </motion.a>
              </div>
            </motion.div>

            {/* Realistic Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
              className="flex justify-center"
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Phone Frame */}
                <div className="w-[300px] h-[600px] rounded-[3rem] border-[6px] p-2 shadow-2xl relative" style={{ background: 'linear-gradient(to bottom, #1A0010, #3D001C)', borderColor: C.gold }}>
                  
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A0010] rounded-b-2xl z-30" />

                  {/* Phone Screen */}
                  <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative flex flex-col" style={{ background: C.bg }}>
                    
                    {/* App Header */}
                    <div className="pt-10 pb-4 px-6 text-center shadow-md relative z-20" style={{ background: C.gold }}>
                      <span className="font-cinzel text-sm tracking-[0.2em] text-white font-bold">SHEKHAR RAJA</span>
                      <p className="font-cormorant text-xs text-white/80 mt-0.5">Jewellers</p>
                    </div>

                    {/* App Content */}
                    <div className="p-4 flex-1 overflow-hidden flex flex-col relative z-10">
                      
                      {/* Fake Search Bar */}
                      <div className="w-full h-10 rounded-full mb-4 flex items-center px-4 shadow-sm" style={{ background: C.bgCard, border: '1px solid ' + C.border }}>
                        <Search size={14} style={{ color: C.textLight }} />
                        <span className="font-raleway text-xs ml-2" style={{ color: C.textLight }}>Search jewellery...</span>
                      </div>

                      {/* Fake Promo Banner */}
                      <div className="w-full h-32 rounded-2xl mb-5 overflow-hidden shadow-md shrink-0 relative" style={{ border: '1px solid ' + C.border }}>
                        <img src="/hero-1.jpg" className="w-full h-full object-cover" alt="promo preview" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <span className="font-cormorant text-white font-semibold">New Collection</span>
                        </div>
                      </div>

                      {/* Fake Product Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {['/ring6.png', '/necklace88.png', '/bangle1.png', '/earring1.jpg'].map((img, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden shadow-sm flex flex-col" style={{ background: C.bgCard, border: '1px solid ' + C.border }}>
                            <div className="h-28 overflow-hidden bg-gray-50">
                              <img src={img} className="w-full h-full object-cover" alt="product preview" />
                            </div>
                            <div className="p-2.5">
                              <div className="h-2 w-3/4 rounded mb-1.5" style={{ background: C.borderMd }} />
                              <div className="h-2 w-1/2 rounded" style={{ background: C.goldPale }} />
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Ground Shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-3 bg-black/40 blur-xl rounded-full" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative z-10" style={{ background: C.bgDeep, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold" style={{ color: C.text }}>
              App Features
            </h2>
            <div className="h-1 w-16 mx-auto mt-4 rounded-full" style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLt})` }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(194,24,91,0.08)' }}
                className="rounded-3xl p-8 text-center transition-all duration-300"
                style={{ background: C.bgCard, border: '1px solid ' + C.border }}
              >
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: C.goldBg }}>
                  <feature.icon size={28} style={{ color: C.gold }} />
                </div>
                <h3 className="font-cormorant text-2xl font-semibold" style={{ color: C.text }}>
                  {feature.title}
                </h3>
                <p className="font-raleway text-sm mt-3 leading-relaxed" style={{ color: C.textLight }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Install Guide */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold" style={{ color: C.text }}>
              How to Install
            </h2>
            <div className="h-1 w-16 mx-auto mt-4 rounded-full" style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLt})` }} />
          </div>
          <div className="space-y-4">
            {installSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 rounded-2xl p-6 sm:p-8 shadow-sm"
                style={{ background: C.bgCard, border: '1px solid ' + C.border }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDk})` }}>
                  <span className="font-cinzel text-xl font-bold text-white">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-cormorant text-2xl font-semibold" style={{ color: C.text }}>
                    {item.title}
                  </h3>
                  <p className="font-raleway text-sm mt-1" style={{ color: C.textLight }}>
                    {item.desc}
                  </p>
                </div>
                <Check size={28} className="ml-auto hidden sm:block opacity-30" style={{ color: C.gold }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${C.goldDk} 0%, ${C.gold} 100%)` }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-white">
            Download Now
          </h2>
          <p className="font-raleway text-lg text-white/80 mt-4 max-w-xl mx-auto">
            Get the app today and start exploring our beautiful collections with exclusive offers.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 justify-center">
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.95 }}
              href={APK_URL}
              download
              className="flex items-center gap-2 bg-white px-8 py-4 rounded-full font-raleway font-bold transition-all shadow-lg"
              style={{ color: C.gold }}
            >
              <Download size={20} />
              Download APK
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(37,211,102,0.3)' }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/918377911745"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-raleway font-bold transition-all shadow-lg"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </motion.a>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-raleway text-sm font-medium mt-12 hover:gap-2 transition-all text-white/70 hover:text-white"
          >
            Back to Home <ChevronRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
