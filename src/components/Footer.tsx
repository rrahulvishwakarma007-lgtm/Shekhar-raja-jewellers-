import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Clock, Instagram, Facebook, Diamond } from 'lucide-react';

// ── Palette (Matches the rest of your app) ────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
  gold:      '#C2185B',
  goldDk:    '#880E4F',
  goldLt:    '#E91E8C',
  goldPale:  '#F8BBD9',
  text:      '#1A0010', // Deep luxury magenta-black
  textMid:   '#6D1B4E',
  textLight: '#AD6888',
  border:    'rgba(194,24,91,0.15)',
};

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'Bridal', path: '/bridal' },
  { name: 'Gold Rates', path: '/gold-rates' },
];

const otherLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Download App', path: '/app' },
];

export default function Footer() {
  return (
    <footer style={{ background: C.text }} className="text-white py-16 border-t border-[#880E4F]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link to="/" className="mb-6 flex items-center gap-3 group">
              {/* 1. Native Image - Removed "invert brightness-0" so it shows correctly */}
              <img
                src="/logo.png"
                alt="Shekhar Raja Jewellers"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  // 2. Fallback: If image is missing, show the luxury Diamond Icon automatically
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-10 h-10 rounded-full flex items-center justify-center shadow-md flex-shrink-0 transition-transform group-hover:scale-105"
                   style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.goldDk})` }}>
                <Diamond size={16} className="text-white" />
              </div>
              
              <div className="flex flex-col">
                <span className="font-cormorant text-2xl font-bold text-white tracking-wide">Shekhar Raja</span>
                <span className="font-cinzel text-[9px] tracking-[0.3em]" style={{ color: C.goldPale }}>JEWELLERS</span>
              </div>
            </Link>

            <p className="font-cormorant italic text-lg mb-4" style={{ color: C.goldPale }}>
              Crafting Elegance, Ensuring Excellence
            </p>
            <p className="font-raleway text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Est. 1987 — Jabalpur, Madhya Pradesh
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/shekharrajajewellers/" target="_blank" rel="noopener noreferrer"
                 className="transition-transform hover:scale-110" style={{ color: C.goldPale }}>
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/Srjewellers/" target="_blank" rel="noopener noreferrer"
                 className="transition-transform hover:scale-110" style={{ color: C.goldPale }}>
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-sm tracking-[0.2em] mb-6" style={{ color: C.gold }}>QUICK LINKS</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="font-raleway text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h4 className="font-cinzel text-sm tracking-[0.2em] mb-6" style={{ color: C.gold }}>OTHER LINKS</h4>
            <ul className="space-y-3">
              {otherLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="font-raleway text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-sm tracking-[0.2em] mb-6" style={{ color: C.gold }}>CONTACT US</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" style={{ color: C.goldPale }} />
                <p className="font-raleway text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Dixitpura Rd, Sarafa, Uprainganj,
                  <br />
                  Jabalpur, Madhya Pradesh 482002
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} style={{ color: C.goldPale }} />
                <a href="tel:+918377911745" className="font-raleway text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  +91 83779 11745
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} style={{ color: C.goldPale }} />
                <a href="https://wa.me/918377911745" target="_blank" rel="noopener noreferrer" className="font-raleway text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  WhatsApp Enquiry
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} style={{ color: C.goldPale }} />
                <p className="font-raleway text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  12:00 PM - 09:00 PM
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(248,187,217,0.15)' }}>
          <p className="font-raleway text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            2024 Shekhar Raja Jewellers. All rights reserved.
          </p>
          <p className="font-raleway text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            BIS Hallmark Certified Jeweller
          </p>
        </div>
      </div>
    </footer>
  );
}
