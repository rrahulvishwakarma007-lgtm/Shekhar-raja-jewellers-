import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Phone, ChevronRight, Crown, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'Bridal', path: '/bridal' },
  { name: 'Gold Rates', path: '/gold-rates' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'App', path: '/app' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
        }`}
      >
        <div className="bg-gradient-to-r from-[#1a0f05] via-[#2a1a0a] to-[#1a0f05] text-white relative">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(90deg, #b8862a 0px, #b8862a 1px, transparent 1px, transparent 50px)`,
            }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between py-3">
              {/* Left - Est. 1987 */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Crown size={12} className="text-[#d4a843]" />
                  <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#d4a843]">EST. 1987</span>
                </div>
                <div className="h-3 w-px bg-[#b8862a]/30" />
                <div className="flex items-center gap-1.5">
                  <span className="font-raleway text-xs text-white/60">Jabalpur, MP</span>
                </div>
              </div>
              
              {/* Center - Spacer */}
              <div className="flex-1 sm:flex-none" />
              
              {/* Right - Contact */}
              <div className="hidden sm:flex items-center gap-5">
                <a
                  href="tel:+918377911745"
                  className="flex items-center gap-2 text-white/60 hover:text-[#d4a843] transition-colors group"
                >
                  <Phone size={12} className="group-hover:scale-110 transition-transform" />
                  <span className="font-raleway text-xs">+91 83779 11745</span>
                </a>
                <div className="h-3 w-px bg-[#b8862a]/30" />
                <a
                  href="https://wa.me/918377911745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-[#25D366] transition-colors group"
                >
                  <MessageCircle size={12} className="group-hover:scale-110 transition-transform" />
                  <span className="font-raleway text-xs">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Gold Accent Line */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#b8862a] to-transparent" />
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled ? 'top-0' : 'top-[56px]'
        }`}
      >
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? 'bg-[#faf7f2]/98 backdrop-blur-xl shadow-[0_4px_30px_rgba(58,46,30,0.12)]'
              : 'bg-[#faf7f2]/95 backdrop-blur-md'
          }`}
        >
          {/* Gold Top Line */}
          <div className={`h-[2px] bg-gradient-to-r from-[#8b6014] via-[#d4a843] to-[#8b6014] transition-opacity duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-50'
          }`} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 lg:h-24">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                {/* Logo Image */}
                <div className="relative">
                  <img 
                    src="/logo.png" 
                    alt="Shekhar Raja Jewellers" 
                    className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="font-cormorant text-xl sm:text-2xl lg:text-3xl font-bold text-[#3a2e1e] tracking-wide leading-none">
                    Shekhar Raja
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-px w-3 sm:w-4 bg-gradient-to-r from-[#b8862a] to-transparent" />
                    <span className="font-cinzel text-[8px] sm:text-[9px] tracking-[0.3em] text-[#b8862a]">
                      JEWELLERS
                    </span>
                    <div className="h-px w-3 sm:w-4 bg-gradient-to-l from-[#b8862a] to-transparent" />
                  </div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center">
                <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-[rgba(184,134,42,0.15)] shadow-sm">
                  {navLinks.map((link, index) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative px-4 xl:px-5 py-2 font-cinzel text-[11px] tracking-[0.12em] uppercase transition-all duration-300 rounded-full ${
                        location.pathname === link.path
                          ? 'text-white'
                          : 'text-[#3a2e1e] hover:text-[#b8862a]'
                      }`}
                    >
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-gradient-to-r from-[#b8862a] to-[#8b6014] rounded-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Heart Icon */}
                <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/60 border border-[rgba(184,134,42,0.15)] text-[#9a8060] hover:text-[#b8862a] hover:border-[#b8862a]/30 transition-all duration-300">
                  <Heart size={18} />
                </button>
                
                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/918377911745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#20bd5a] text-white px-5 py-2.5 rounded-full font-raleway text-sm font-medium shadow-lg hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle size={16} />
                  <span>Enquire</span>
                </a>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden w-11 h-11 rounded-full bg-gradient-to-br from-[#faf7f2] to-white border border-[rgba(184,134,42,0.2)] text-[#3a2e1e] hover:bg-[#b8862a] hover:text-white hover:border-[#b8862a] transition-all duration-300 flex items-center justify-center shadow-sm"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Gold Bottom Line */}
          <div className={`h-[1px] bg-gradient-to-r from-transparent via-[#b8862a]/40 to-transparent transition-opacity duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-30'
          }`} />
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-gradient-to-b from-[#1a0f05] via-[#2a1a0a] to-[#1a0f05]"
          >
            {/* Decorative Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6014] via-[#d4a843] to-[#8b6014]" />
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #b8862a 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            <div className="flex flex-col h-full pt-24 pb-8 px-6 relative">
              {/* Logo in Mobile Menu */}
              <div className="flex items-center gap-3 mb-10">
                <img 
                  src="/logo.png" 
                  alt="Shekhar Raja Jewellers" 
                  className="h-12 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-cormorant text-xl font-bold text-white">Shekhar Raja</span>
                  <span className="font-cinzel text-[9px] tracking-[0.3em] text-[#b8862a]">JEWELLERS</span>
                </div>
              </div>
              
              {/* Nav Links */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between py-3.5 border-b border-[#b8862a]/20 group ${
                          location.pathname === link.path
                            ? 'text-[#d4a843]'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-cinzel text-xs text-[#b8862a]/60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="font-cormorant text-2xl">{link.name}</span>
                        </div>
                        <ChevronRight
                          size={20}
                          className="text-[#b8862a] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Bottom Section */}
              <div className="space-y-5">
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  href="https://wa.me/918377911745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#25D366] to-[#20bd5a] text-white py-4 rounded-xl font-raleway text-lg font-medium shadow-lg"
                >
                  <MessageCircle size={22} />
                  <span>Chat on WhatsApp</span>
                </motion.a>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center pt-4 border-t border-[#b8862a]/20"
                >
                  <p className="font-raleway text-xs text-white/40">
                    Est. 1987 • Jabalpur, Madhya Pradesh
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
