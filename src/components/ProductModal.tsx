import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Shield, Gem, ZoomIn, ZoomOut, ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  price?: string;
  tag?: string;
}

interface Props {
  product: Product | null;
  onClose: () => void;
}

// ── Editorial Palette — matches the new Royal Collection page ────────────────
const C = {
  bgCard:    '#FFFFFF',     // Pure gallery white
  text:      '#1A1A1A',     // Soft editorial black
  textLight: '#999999',     // Subtle grey for descriptions
  brand:     '#C2185B',     // Brand magenta
  royalGold: '#D4AF37',     // Champagne Gold for luxury accents
  pearl:     '#FDFBF7',     // Warm ivory for image backgrounds
  border:    '#F0F0F0',     // Delicate divider lines
};

const ZOOM_LEVELS = [1, 1.9, 2.8];

export default function ProductModal({ product, onClose }: Props) {
  const [hovering, setHovering]   = useState(false);
  const [zoomStep, setZoomStep]   = useState(0); 
  const [mousePos, setMousePos]   = useState({ x: 50, y: 50 });
  const imgWrapRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Greetings. I would like to consult with an expert regarding the *${product.name.trim()}* (${product.category}).`
  );

  const zoomLevel  = ZOOM_LEVELS[zoomStep];
  const isZoomedIn = zoomStep > 0;
  const effectiveScale = isZoomedIn ? zoomLevel : (hovering ? 1.9 : 1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setZoomStep(s => (s + 1) % ZOOM_LEVELS.length);
  };

  const zoomIn = () => setZoomStep(s => Math.min(s + 1, ZOOM_LEVELS.length - 1));
  const zoomOut = () => setZoomStep(s => Math.max(s - 1, 0));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-5xl overflow-hidden bg-white sm:rounded-sm flex flex-col md:flex-row shadow-2xl"
        >
          {/* Top minimal gold accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
               style={{ background: `linear-gradient(90deg, transparent, ${C.royalGold}, transparent)` }} />

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm"
          >
            <X size={16} style={{ color: C.text }} />
          </motion.button>

          {/* ══════════════════════════════════
              IMAGE SECTION
          ══════════════════════════════════ */}
          <div
            ref={imgWrapRef}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onMouseMove={handleMouseMove}
            onClick={handleImageClick}
            className="relative w-full md:w-[55%] h-[50vh] sm:h-[600px] md:h-auto overflow-hidden bg-[#FDFBF7] select-none"
            style={{ cursor: isZoomedIn ? 'zoom-out' : 'zoom-in' }}
          >
            <motion.div
              animate={{ scale: effectiveScale }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                width: '100%', height: '100%',
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }}
            >
              <motion.img
                initial={{ opacity: 0, filter: 'grayscale(20%)' }}
                animate={{ opacity: 1, filter: 'grayscale(0%)' }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>

            {/* Subtle overlay gradient to ensure zoom controls are visible */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 30%)' }} />

            {/* Editorial Tag */}
            {product.tag && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute top-5 left-5 z-10"
              >
                <span className="inline-flex items-center font-raleway text-[9px] font-bold tracking-[0.12em] uppercase px-3 py-1.5 bg-black text-white shadow-lg">
                  {product.tag === 'New Arrival' ? 'LATEST' : product.tag}
                </span>
              </motion.div>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-5 right-5 flex items-center gap-2 z-10">
              <AnimatePresence>
                {isZoomedIn && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-100"
                    title="Zoom out"
                  >
                    <ZoomOut size={12} style={{ color: C.text }} />
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                disabled={zoomStep === ZOOM_LEVELS.length - 1}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-md border border-gray-100"
                style={{ opacity: zoomStep === ZOOM_LEVELS.length - 1 ? 0.5 : 1 }}
                title="Zoom in"
              >
                <ZoomIn size={12} style={{ color: C.text }} />
                <span className="font-raleway text-[9px] font-bold tracking-[0.05em] uppercase text-gray-800">
                  {isZoomedIn ? `${zoomLevel.toFixed(1)}x` : 'Zoom'}
                </span>
              </motion.button>
            </div>
          </div>

          {/* ══════════════════════════════════
              CONTENT SECTION
          ══════════════════════════════════ */}
          <div className="md:w-[45%] flex flex-col h-full bg-white overflow-y-auto">
            <div className="p-8 sm:p-10 flex flex-col flex-1 text-center md:text-left">

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <p style={{ fontSize: 9, color: C.royalGold, fontFamily: 'Raleway, sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {product.category}
                </p>
                
                <h3 className="font-cormorant font-light text-[2.2rem] leading-[1.1] mb-2" style={{ color: C.text }}>
                  {product.name}
                </h3>
              </motion.div>

              {/* Elegant Divider */}
              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center justify-center md:justify-start gap-3 my-6 origin-left"
              >
                <div style={{ height: 1, width: 40, background: `linear-gradient(to right, ${C.royalGold}, transparent)` }} />
                <span style={{ color: C.royalGold, fontSize: 10 }}>✦</span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-raleway text-[13px] leading-relaxed mb-8"
                style={{ color: C.textLight }}
              >
                {product.description}
              </motion.p>

              {/* Trust Badges - Refined */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center md:items-start gap-4 sm:gap-8 py-6 mb-8"
                style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} style={{ color: C.royalGold }} strokeWidth={1.5} />
                  <div className="text-left">
                    <span className="font-raleway text-[9px] uppercase tracking-[0.1em] block" style={{ color: C.textLight }}>Certified</span>
                    <span className="font-cormorant text-[15px] italic text-gray-900">BIS Hallmarked Gold</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gem size={16} style={{ color: C.royalGold }} strokeWidth={1.5} />
                  <div className="text-left">
                    <span className="font-raleway text-[9px] uppercase tracking-[0.1em] block" style={{ color: C.textLight }}>Guaranteed</span>
                    <span className="font-cormorant text-[15px] italic text-gray-900">Trusted & Certified</span>
                  </div>
                </div>
              </motion.div>

              {product.price && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <span className="font-raleway text-[10px] uppercase tracking-[0.1em]" style={{ color: C.textLight }}>Starting from</span>
                  <p className="font-cormorant text-2xl" style={{ color: C.text }}>{product.price}</p>
                </motion.div>
              )}

              <div className="flex-1" />

              {/* Private Concierge Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="w-full mt-4"
              >
                <a
                  href={`https://wa.me/918377911745?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 font-raleway text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-500 overflow-hidden"
                  style={{ background: C.text, color: '#fff' }}
                >
                  {/* Subtle Hover Gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                       style={{ background: C.royalGold }} />
                  
                  <MessageCircle size={14} className="relative z-10 transition-transform duration-500 group-hover:rotate-12" />
                  <span className="relative z-10">Consult an Expert</span>
                  <ArrowRight size={14} className="relative z-10 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-500" />
                </a>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
