import { motion } from 'framer-motion';
import { Award, Users, Heart, Shield, MapPin, Clock, Star } from 'lucide-react';

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

const values = [
  { icon: Shield, title: 'Trust & Transparency', desc: 'BIS Hallmark certified with complete transparency in pricing' },
  { icon: Heart, title: 'Craftsmanship', desc: 'Each piece is handcrafted by skilled artisans with decades of experience' },
  { icon: Users, title: 'Customer First', desc: 'Your satisfaction is our priority, with personalized service' },
  { icon: Award, title: 'Quality Assurance', desc: 'Every piece undergoes rigorous quality checks' }
];

const showrooms = [
  {
    name: 'Main Showroom',
    address: 'Dixitpura Rd, Sarafa, Uprainganj, Jabalpur, Madhya Pradesh 482002',
    phone: '+91 83779 11745',
    hours: '12:00 PM - 09:00 PM',
    map: 'https://maps.app.goo.gl/fHfnK9jgUnYkmSKB7?g_st=a'
  },
  {
    name: 'Heritage Showroom',
    address: '1, Napier Town, Jabalpur, Madhya Pradesh 482001',
    phone: '+91 83779 11745',
    hours: '12:00 PM - 09:00 PM',
    map: 'https://maps.app.goo.gl/cYjTfiHyzXzPitd5A?g_st=a'
  }
];

export default function About() {
  return (
    <div className="pt-28 pb-16 min-h-screen relative overflow-hidden" style={{ background: C.bg }}>
      
      {/* Decorative Ambient Background */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full opacity-30 mix-blend-multiply filter blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.1) 0%, transparent 70%)' }} />

      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden mb-16 shadow-xl">
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(26,0,16,0.85) 0%, rgba(136,14,79,0.3) 60%, transparent 100%)' }} />
        <img
          src="https://nxtgenailabs.work/dixitpura.webp"
          alt="Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
              <span className="font-cinzel text-sm tracking-[0.3em]" style={{ color: C.goldPale }}>EST. 1987</span>
              <h1 className="font-cormorant text-5xl sm:text-6xl font-bold text-white mt-4">
                Our Heritage
              </h1>
              <p className="font-raleway text-lg mt-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                37 years of crafting elegance and ensuring excellence
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold" style={{ color: C.text }}>
                A Legacy of Trust
              </h2>
              <div className="h-1 w-20 mt-4 rounded-full" style={{ background: 'linear-gradient(to right, ' + C.gold + ', ' + C.goldLt + ')' }} />
              <p className="font-cormorant italic text-2xl mt-8" style={{ color: C.gold }}>
                "Crafting Elegance, Ensuring Excellence"
              </p>
              <p className="font-raleway mt-6 leading-relaxed" style={{ color: C.textLight }}>
                Since 1987, Shekhar Raja Jewellers has been a symbol of purity, trust, and masterful craftsmanship. Rooted in Jabalpur, our family has dedicated decades to creating timeless pieces that celebrate life's most precious moments. Every ornament we design is a testament to our unwavering commitment to quality and artistry.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="space-y-4 sm:space-y-6">
                <div className="h-48 overflow-hidden rounded-3xl shadow-lg" style={{ border: '1px solid ' + C.border }}>
                 <img
                    src="/ring2.png"
                    alt="Rings"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-32 overflow-hidden rounded-2xl shadow-lg" style={{ border: '1px solid ' + C.border }}>
                 <img
                    src="/necklace88.png"
                    alt="Necklace"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-12">
                <div className="h-32 overflow-hidden rounded-2xl shadow-lg" style={{ border: '1px solid ' + C.border }}>
                  <img
                    src="/earring6.jpg"
                    alt="Earrings"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-48 overflow-hidden rounded-3xl shadow-lg" style={{ border: '1px solid ' + C.border }}>
                  <img
                    src="/bangle1.png"
                    alt="Bangles"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Showrooms */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold" style={{ color: C.text }}>
              Visit Our Showrooms
            </h2>
            <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(to right, ' + C.gold + ', ' + C.goldLt + ')' }} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {showrooms.map((showroom, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: '0 15px 35px rgba(194,24,91,0.1)' }}
                className="rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full"
                style={{ background: C.bgCard, border: '1px solid ' + C.border }}
              >
                <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ background: C.text }}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <MapPin size={48} style={{ color: C.goldPale }} className="relative z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-cormorant text-3xl font-semibold mb-4" style={{ color: C.text }}>
                    {showroom.name}
                  </h3>
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin size={18} className="flex-shrink-0 mt-1" style={{ color: C.gold }} />
                    <p className="font-raleway text-sm leading-relaxed" style={{ color: C.textLight }}>
                      {showroom.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-auto text-sm font-medium" style={{ color: C.textMid }}>
                    <Clock size={16} style={{ color: C.gold }} />
                    <span className="font-raleway">{showroom.hours}</span>
                  </div>
                  <div className="mt-6 pt-6" style={{ borderTop: '1px solid ' + C.border }}>
                    <a
                      href={showroom.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-2 font-raleway text-sm font-bold py-3.5 rounded-xl transition-colors"
                      style={{ background: C.goldBg, color: C.gold }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.goldBg; e.currentTarget.style.color = C.gold; }}
                    >
                      <MapPin size={16} />
                      Get Directions
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 relative overflow-hidden" style={{ background: C.bgDeep, borderTop: '1px solid ' + C.border, borderBottom: '1px solid ' + C.border }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, ' + C.gold + ' 0, ' + C.gold + ' 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold" style={{ color: C.text }}>
              Our Values
            </h2>
            <div className="h-1 w-20 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(to right, ' + C.gold + ', ' + C.goldLt + ')' }} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-3xl transition-transform hover:-translate-y-2 bg-white/60 backdrop-blur-sm shadow-sm"
                style={{ border: '1px solid ' + C.border }}
              >
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform hover:rotate-12" style={{ background: C.goldBg }}>
                  <value.icon size={28} style={{ color: C.gold }} />
                </div>
                <h3 className="font-cormorant text-2xl font-semibold" style={{ color: C.text }}>
                  {value.title}
                </h3>
                <p className="font-raleway text-sm mt-3 leading-relaxed" style={{ color: C.textLight }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BIS Badge */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 sm:p-14 shadow-xl relative overflow-hidden"
            style={{ background: C.bgCard, border: '1px solid ' + C.borderMd }}
          >
            {/* Glossy sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 relative z-10 shadow-inner" style={{ background: C.goldBg }}>
              <Shield size={48} style={{ color: C.gold }} />
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold relative z-10" style={{ color: C.text }}>
              BIS Hallmark Certified
            </h2>
            <p className="font-raleway text-lg mt-6 max-w-2xl mx-auto relative z-10 leading-relaxed" style={{ color: C.textLight }}>
              All our gold jewellery is strictly BIS Hallmark certified, ensuring the highest standards of purity, authenticity, and quality. Your trust is our most valuable asset.
            </p>
            <div className="flex items-center justify-center gap-2 mt-8 relative z-10">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} style={{ color: C.gold, fill: C.gold }} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
