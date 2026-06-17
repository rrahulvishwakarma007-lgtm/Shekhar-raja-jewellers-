import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Shield, Gem, Sparkles, ZoomIn } from 'lucide-react';

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

// ── Palette — matches the live site's warm cream + gold system ────────────────
const C = {
  bg:         '#F5ECD7',
  bgCard:     '#FFFDF8',
  bgDark:     '#2C1A0E',
  gold:       '#B8862A',
  goldLight:  '#D4A843',
  goldPale:   '#F0D080',
  text:       '#2C1A0E',
  textLight:  '#9A7B50',
  border:     'rgba(184,134,42,0.18)',
};

export default function ProductModal({ product, onClose }: Props) {
  const [zoomed, setZoomed]   = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgWrapRef = useRef<HTMLDivElement>(null);

  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in ${product.name} (${product.category}). Please share more details.`
  );

  // Track cursor position over the image for the magnified-glass zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        style={{ background: 'rgba(20,12,6,0.82)', backdropFilter: 'blur(20px)' }}
        onClick={onClose}
      >
        {/* Ambient gold glow behind the modal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="absolute pointer-events-none"
          style={{
            width: 700, height: 700,
            background: `radial-gradient(circle, rgba(184,134,42,0.18) 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl overflow-hidden rounded-[28px]"
          style={{
            background: C.bgCard,
            boxShadow: '0 30px 90px rgba(20,12,6,0.5), 0 0 0 1px rgba(184,134,42,0.15)',
          }}
        >
          {/* Hairline gold top edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
               style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.goldPale}, ${C.gold}, transparent)` }} />

          {/* Close button — top right, floating above everything */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,253,248,0.92)', boxShadow: '0 4px 16px rgba(20,12,6,0.25)' }}
          >
            <X size={18} style={{ color: C.text }} />
          </motion.button>

          <div className="flex flex-col md:flex-row max-h-[92vh] md:max-h-[640px]">

            {/* ══════════════════════════════════
                IMAGE — cinematic cursor-zoom
            ══════════════════════════════════ */}
            <div
              ref={imgWrapRef}
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative md:w-[52%] overflow-hidden cursor-zoom-in select-none"
              style={{ height: '320px', minHeight: '320px' }}
            >
              <motion.div
                animate={{
                  scale: zoomed ? 1.9 : 1,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: '100%', height: '100%',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }}
              >
                <motion.img
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </motion.div>

              {/* Base gradient for legibility of overlaid badges */}
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: 'linear-gradient(to top, rgba(44,26,14,0.45) 0%, transparent 45%)' }} />

              {/* Zoom hint badge — fades out once hovered */}
              <motion.div
                animate={{ opacity: zoomed ? 0 : 1 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-none"
                style={{ background: 'rgba(255,253,248,0.85)', backdropFilter: 'blur(8px)' }}
              >
                <ZoomIn size={12} style={{ color: C.text }} />
                <span className="font-raleway text-[10px]" style={{ color: C.text }}>Hover to zoom</span>
              </motion.div>

              {/* Tag */}
              {product.tag && (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="absolute top-5 left-5 z-10"
                >
                  <span className="inline-flex items-center gap-1.5 font-cinzel text-[10px] tracking-[0.15em] px-3.5 py-2 rounded-full"
                        style={{ background: 'rgba(44,26,14,0.85)', color: C.goldPale, backdropFilter: 'blur(8px)' }}>
                    <Sparkles size={10} />
                    {product.tag}
                  </span>
                </motion.div>
              )}
            </div>

            {/* ══════════════════════════════════
                CONTENT
            ══════════════════════════════════ */}
            <div className="md:w-[48%] flex flex-col overflow-y-auto"
                 style={{ background: C.bgCard }}>
              <div className="p-7 sm:p-9 flex flex-col flex-1">

                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="flex items-center gap-2.5 mb-4"
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
                  <span className="font-cinzel text-[10px] tracking-[0.28em]" style={{ color: C.gold }}>
                    {product.category.toUpperCase()}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="font-cormorant font-bold leading-[1.05] mb-5"
                  style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.6rem)', color: C.text }}
                >
                  {product.name}
                </motion.h3>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px w-20 mb-6 origin-left"
                  style={{ background: `linear-gradient(to right, ${C.gold}, transparent)` }}
                />

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.32, duration: 0.4 }}
                  className="font-raleway text-[15px] leading-relaxed mb-7"
                  style={{ color: C.textLight }}
                >
                  {product.description}
                </motion.p>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.4 }}
                  className="flex items-center gap-5 py-5 mb-7"
                  style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                         style={{ background: 'rgba(184,134,42,0.1)' }}>
                      <Shield size={15} style={{ color: C.gold }} />
                    </div>
                    <div>
                      <span className="font-raleway text-[10px] block" style={{ color: C.textLight }}>Certified</span>
                      <span className="font-cormorant text-sm font-semibold" style={{ color: C.text }}>BIS Hallmark</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                         style={{ background: 'rgba(184,134,42,0.1)' }}>
                      <Gem size={15} style={{ color: C.gold }} />
                    </div>
                    <div>
                      <span className="font-raleway text-[10px] block" style={{ color: C.textLight }}>Guaranteed</span>
                      <span className="font-cormorant text-sm font-semibold" style={{ color: C.text }}>22KT Pure Gold</span>
                    </div>
                  </div>
                </motion.div>

                {product.price && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
                    className="mb-6"
                  >
                    <span className="font-raleway text-xs" style={{ color: C.textLight }}>Starting from</span>
                    <p className="font-cormorant text-3xl font-bold" style={{ color: C.gold }}>{product.price}</p>
                  </motion.div>
                )}

                <div className="flex-1" />

                {/* WhatsApp CTA */}
                <motion.a
                  href={`https://wa.me/918377911745?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46, duration: 0.4 }}
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.985 }}
                  className="relative flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-raleway font-medium text-white overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #25D366, #1FAE57)',
                    boxShadow: '0 10px 30px rgba(37,211,102,0.28)',
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
                  />
                  <MessageCircle size={19} className="relative z-10" />
                  <span className="relative z-10 text-[15px]">Enquire on WhatsApp</span>
                </motion.a>

                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                  className="text-center font-raleway text-[11px] mt-4 flex items-center justify-center gap-1.5"
                  style={{ color: C.textLight }}
                >
                  <Sparkles size={10} style={{ color: C.gold }} />
                  Personalized assistance & best prices
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
