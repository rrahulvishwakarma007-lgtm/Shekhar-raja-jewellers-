import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, MapPin, Clock, Send } from 'lucide-react';

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

const interests = [
  'Bridal Jewellery',
  'Gold Jewellery',
  'Diamond Jewellery',
  'Custom Order',
  'General Enquiry'
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello! I'm ${formData.name}.

Interest: ${formData.interest}
Phone: ${formData.phone}

Message: ${formData.message}`;
    
    window.open(
      `https://wa.me/918377911745?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="pt-28 pb-16 min-h-screen relative overflow-hidden" style={{ background: C.bg }}>
      
      {/* Decorative Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none" style={{ background: `linear-gradient(180deg, ${C.bgDeep} 0%, transparent 100%)` }} />
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full opacity-30 mix-blend-multiply filter blur-[100px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,24,91,0.15) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${C.gold})` }} />
            <span className="font-cinzel text-xs tracking-[0.25em]" style={{ color: C.gold }}>GET IN TOUCH</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${C.gold})` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-raleway mt-4 text-lg" style={{ color: C.textLight }}>
            We'd love to hear from you. Reach out to us anytime!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-6 sm:p-10 shadow-xl"
            style={{ background: C.bgCard, border: '1px solid ' + C.border, boxShadow: '0 10px 40px rgba(194,24,91,0.05)' }}
          >
            <h2 className="font-cormorant text-3xl font-semibold mb-8" style={{ color: C.text }}>
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="font-raleway text-sm font-medium block mb-2" style={{ color: C.textMid }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl font-raleway bg-white focus:outline-none transition-all duration-300"
                  style={{ border: '1px solid ' + C.borderMd, color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.gold}
                  onBlur={e => e.target.style.borderColor = C.borderMd}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="font-raleway text-sm font-medium block mb-2" style={{ color: C.textMid }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl font-raleway bg-white focus:outline-none transition-all duration-300"
                  style={{ border: '1px solid ' + C.borderMd, color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.gold}
                  onBlur={e => e.target.style.borderColor = C.borderMd}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="font-raleway text-sm font-medium block mb-2" style={{ color: C.textMid }}>
                  Interest
                </label>
                <select
                  required
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl font-raleway bg-white focus:outline-none transition-all duration-300"
                  style={{ border: '1px solid ' + C.borderMd, color: formData.interest ? C.text : C.textLight }}
                  onFocus={e => e.target.style.borderColor = C.gold}
                  onBlur={e => e.target.style.borderColor = C.borderMd}
                >
                  <option value="">Select your interest</option>
                  {interests.map((interest) => (
                    <option key={interest} value={interest} style={{ color: C.text }}>{interest}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-raleway text-sm font-medium block mb-2" style={{ color: C.textMid }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl font-raleway bg-white focus:outline-none resize-none transition-all duration-300"
                  style={{ border: '1px solid ' + C.borderMd, color: C.text }}
                  onFocus={e => e.target.style.borderColor = C.gold}
                  onBlur={e => e.target.style.borderColor = C.borderMd}
                  placeholder="Tell us what you're looking for..."
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(37,211,102,0.3)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-xl font-raleway font-bold transition-all"
              >
                <Send size={18} />
                Send via WhatsApp
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 lg:mt-0 mt-8"
          >
            {/* WhatsApp CTA */}
            <div className="bg-[#25D366] rounded-3xl p-8 text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
              <MessageCircle size={48} className="text-white mx-auto relative z-10" />
              <h3 className="font-cormorant text-3xl font-semibold text-white mt-4 relative z-10">
                Chat with us on WhatsApp
              </h3>
              <p className="font-raleway text-white/90 mt-2 text-lg relative z-10">
                Get instant replies to your queries
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/918377911745"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#25D366] px-8 py-3.5 rounded-full font-raleway font-bold mt-6 shadow-md transition-all relative z-10"
              >
                <MessageCircle size={18} />
                Start Chat
              </motion.a>
            </div>

            {/* Showrooms */}
            {showrooms.map((showroom, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(194,24,91,0.08)' }}
                className="rounded-3xl p-6 sm:p-8 transition-all duration-300"
                style={{ background: C.bgCard, border: '1px solid ' + C.border }}
              >
                <h3 className="font-cormorant text-2xl font-semibold mb-6" style={{ color: C.text }}>
                  {showroom.name}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full mt-0.5" style={{ background: C.goldBg }}>
                      <MapPin size={18} style={{ color: C.gold }} />
                    </div>
                    <p className="font-raleway text-sm leading-relaxed" style={{ color: C.textLight }}>
                      {showroom.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full" style={{ background: C.goldBg }}>
                      <Phone size={18} style={{ color: C.gold }} />
                    </div>
                    <a
                      href={`tel:${showroom.phone.replace(/\s/g, '')}`}
                      className="font-raleway text-sm font-medium transition-colors"
                      style={{ color: C.textMid }}
                      onMouseEnter={e => e.currentTarget.style.color = C.gold}
                      onMouseLeave={e => e.currentTarget.style.color = C.textMid}
                    >
                      {showroom.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full" style={{ background: C.goldBg }}>
                      <Clock size={18} style={{ color: C.gold }} />
                    </div>
                    <p className="font-raleway text-sm font-medium" style={{ color: C.textMid }}>
                      {showroom.hours}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid ' + C.border }}>
                  <a
                    href={showroom.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-raleway text-sm font-bold transition-colors"
                    style={{ background: C.goldBg, color: C.gold }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.goldBg; e.currentTarget.style.color = C.gold; }}
                  >
                    <MapPin size={16} />
                    Get Directions
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
