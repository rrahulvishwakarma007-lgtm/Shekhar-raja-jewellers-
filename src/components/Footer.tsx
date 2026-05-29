import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Clock, Instagram, Facebook, Youtube } from 'lucide-react';

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
    <footer className="bg-[#1a0f05] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Shekhar Raja Jewellers"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="font-cormorant text-2xl font-bold text-white">Shekhar Raja</span>
                <span className="font-cinzel text-[9px] tracking-[0.3em] text-[#d4a843]">JEWELLERS</span>
              </div>
            </div>
            <p className="font-cormorant italic text-[#9a8060] text-lg mb-4">
              "Crafting Elegance, Ensuring Excellence"
            </p>
            <p className="font-raleway text-sm text-[#9a8060]">
              Est. 1987 • Jabalpur, Madhya Pradesh
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-[#d4a843] hover:text-[#b8862a] transition-colors">
                <Instagram size={22} />
              </a>
              <a href="#" className="text-[#d4a843] hover:text-[#b8862a] transition-colors">
                <Facebook size={22} />
              </a>
              <a href="#" className="text-[#d4a843] hover:text-[#b8862a] transition-colors">
                <Youtube size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-sm tracking-[0.2em] text-[#d4a843] mb-6">QUICK LINKS</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-raleway text-sm text-[#9a8060] hover:text-[#d4a843] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h4 className="font-cinzel text-sm tracking-[0.2em] text-[#d4a843] mb-6">OTHER LINKS</h4>
            <ul className="space-y-3">
              {otherLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-raleway text-sm text-[#9a8060] hover:text-[#d4a843] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-sm tracking-[0.2em] text-[#d4a843] mb-6">CONTACT US</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#d4a843] flex-shrink-0 mt-1" />
                <p className="font-raleway text-sm text-[#9a8060]">
                  Dixitpura Rd, Sarafa, Uprainganj,<br />Jabalpur, Madhya Pradesh 482002
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#d4a843]" />
                <a href="tel:+918377911745" className="font-raleway text-sm text-[#9a8060] hover:text-[#d4a843]">
                  +91 83779 11745
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-[#d4a843]" />
                
                  href="https://wa.me/918377911745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-raleway text-sm text-[#9a8060] hover:text-[#d4a843]"
                >
                  WhatsApp Enquiry
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#d4a843]" />
                <p className="font-raleway text-sm text-[#9a8060]">
                  12:00 PM - 09:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#3a2e1e] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-raleway text-xs text-[#9a8060]">
            © 2024 Shekhar Raja Jewellers. All rights reserved.
          </p>
          <p className="font-raleway text-xs text-[#9a8060]">
            BIS Hallmark Certified Jeweller
          </p>
        </div>
      </div>
    </footer>
  );
}
