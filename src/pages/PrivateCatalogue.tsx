// ════════════════════════════════════════════════════════════════════════════
// src/pages/PrivateCatalogue.tsx
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Clock, Lock, ArrowRight, MessageCircle, Diamond,
  AlertCircle, Package, ShoppingBag, Search, X, Sparkles, Crown,
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import { loadStockMap, moveToOrdered, type StockStatus } from '../lib/stockStore';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
  bgDeep:    '#FCE4EC',
  gold:      '#C2185B',
  goldDk:    '#880E4F',
  goldLt:    '#E91E8C',
  goldPale:  '#F8BBD9',
  text:      '#1A0010',
  textMid:   '#6D1B4E',
  textLight: '#AD6888',
  border:    'rgba(194,24,91,0.15)',
  green:     '#2E7D32',
  greenBg:   'rgba(46,125,50,0.08)',
  white:     '#FFFFFF',
};

// ── Products ──────────────────────────────────────────────────────────────────
const ALL_PRODUCTS: Record<string, any[]> = {
  bangles: [
    { id:'b1', name:'Classic Gold Bangles',   category:'Bangles',   description:'Set of 4 intricately designed 22K gold bangles.',  image:'/bangle1.png', tag:'Classic'    },
    { id:'b2', name:'Designer Bangles',        category:'Bangles',   description:'Designer gold bangles with enamel work.',           image:'/bangle2.png', tag:'Designer'   },
    { id:'b3', name:'Antique Finish Bangles',  category:'Bangles',   description:'Antique finish 22K bangles with stone work.',       image:'/bangle3.png', tag:'Heritage'   },
    { id:'b4', name:'Bridal Bangles Set',      category:'Bangles',   description:'Heavy bridal bangle set for your special day.',     image:'/bangle4.png', tag:'Bridal'     },
    { id:'b5', name:'Peacock Bangles',         category:'Bangles',   description:'Peacock motif 22K gold bangles.',                   image:'/bangle5.png', tag:'Exclusive'  },
  ],
  rings: [
    { id:'r1', name:'Solitaire Ring',          category:'Rings',     description:'Brilliant solitaire diamond in 18K gold.',         image:'/ring1.png',      tag:'Premium'   },
    { id:'r2', name:'Polki Diamond Ring',       category:'Rings',     description:'Uncut polki diamonds set in 22K gold.',            image:'/ring2.png',      tag:'Exclusive' },
    { id:'r3', name:'Classic Gold Ring',        category:'Rings',     description:'Classic 22K gold ring with intricate design.',     image:'/ring3.png',      tag:'Classic'   },
    { id:'r4', name:'Floral Ring',             category:'Rings',     description:'Beautiful floral motif 22K gold ring.',            image:'/ring6.png',      tag:'Trending'  },
    { id:'r5', name:'Gents Statement Ring',     category:'Rings',     description:'Bold statement ring for men in 22K gold.',         image:'/ring7.png',      tag:'Men'       },
  ],
  necklaces: [
    { id:'n1', name:'Maharani Bridal Necklace',category:'Necklaces', description:'Grand bridal necklace in 22K gold.',              image:'/necklace88.png', tag:'Bridal'    },
    { id:'n2', name:'Temple Gold Haar',         category:'Necklaces', description:'Traditional temple necklace with Lakshmi coins.', image:'/temple.png',     tag:'Heritage'  },
    { id:'n3', name:'Kundan Choker',            category:'Necklaces', description:'Royal Kundan choker with meenakari work.',        image:'/necklace1.jpg',  tag:'Royal'     },
  ],
  earrings: [
    { id:'e1', name:'Antique Gold Jhumkas',     category:'Earrings',  description:'Traditional temple-style jhumkas.',               image:'/earring1.jpg',   tag:'Heritage'  },
    { id:'e2', name:'Chandbali Earrings',       category:'Earrings',  description:'Royal chandbali with stone work.',                 image:'/earring5.jpg',   tag:'Exclusive' },
    { id:'e3', name:'Antique Earrings Set',     category:'Earrings',  description:'Exquisite antique finish earring set.',            image:'/earrings13.png', tag:'Limited'   },
  ],
  bridal: [
    { id:'br1', name:'Bridal Set – Maharani',  category:'Bridal',    description:'Complete necklace, earrings & maang tikka.',       image:'/bridal.png',     tag:'Bestseller'},
    { id:'br2', name:'Kundan Bridal Choker',   category:'Bridal',    description:'Exquisite kundan bridal choker.',                  image:'/necklace88.png', tag:'Premium'   },
  ],
  chains: [
    { id:'c1', name:'Figaro Gold Chain',        category:'Chains',    description:'Italian figaro chain in 22K gold.',                image:'/chain2.png',     tag:'Classic'   },
    { id:'c2', name:'Rope Gold Chain',          category:'Chains',    description:'Elegant rope chain in 22K gold.',                  image:'/chain4.png',     tag:'Trending'  },
  ],
  antique: [
    { id:'a1', name:'Antique Temple Set',       category:'Antique',   description:'Full antique temple jewellery set.',               image:'/antique2.jpg',   tag:'Heritage'  },
    { id:'a2', name:'Antique Choker Necklace',  category:'Antique',   description:'Traditional antique choker necklace.',             image:'/antique3.jpg',   tag:'Limited'   },
  ],
};

const TAG_COLORS: Record<string, string> = {
  Classic:'bg-amber-100 text-amber-800', Premium:'bg-purple-100 text-purple-800',
  Heritage:'bg-stone-100 text-stone-700', Bridal:'bg-pink-100 text-pink-800',
  Exclusive:'bg-rose-100 text-rose-800', Royal:'bg-indigo-100 text-indigo-800',
  Bestseller:'bg-green-100 text-green-800', Trending:'bg-blue-100 text-blue-800',
  Limited:'bg-red-100 text-red-800', Designer:'bg-violet-100 text-violet-800',
  Men:'bg-slate-100 text-slate-700',
};

function decodeToken(t: string): { category: string; expiry: number } | null {
  try { const d = atob(t); const [cat,exp] = d.split('|'); return { category:cat, expiry:parseInt(exp) }; }
  catch { return null; }
}

function formatTime(ms: number) {
  if (ms <= 0) return '00:00';
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

// ── Floating diamond particles ────────────────────────────────────────────────
function Particles() {
  const items = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map(i => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left:`${8 + (i * 7.5) % 90}%`, top:`${10 + (i * 13) % 80}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.4, 0.15], rotate: [0, 180, 360] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.35, ease:'easeInOut' }}
        >
          <Diamond size={i % 3 === 0 ? 10 : 6} style={{ color: C.goldPale }} />
        </motion.div>
      ))}
    </div>
  );
}

// ── Expired page ──────────────────────────────────────────────────────────────
function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center max-w-md">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`2px solid ${C.border}` }}
        >
          <AlertCircle size={40} style={{ color: C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Oh! No, Link Expired</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          This private catalogue link has expired. Please contact Shekhar Raja Jewellers for a new link.
        </p>
        <motion.a
          whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20The%20catalogue%20link%20expired.%20Please%20send%20a%20new%20one."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg"
          style={{ background:'#25D366' }}
        >
          <MessageCircle size={18} /> Request New Link on WhatsApp
        </motion.a>
        <div className="mt-6">
          <Link to="/" className="font-raleway text-sm" style={{ color: C.textLight }}>← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Invalid page ──────────────────────────────────────────────────────────────
function InvalidPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="text-center max-w-md">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`2px solid ${C.border}` }}
        >
          <Lock size={40} style={{ color: C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Private Catalogue</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          You need a valid link from Shekhar Raja Jewellers to view this catalogue.
        </p>
        <motion.a
          whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20I%20would%20like%20to%20view%20your%20jewellery%20catalogue."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg"
          style={{ background:'#25D366' }}
        >
          <MessageCircle size={18} /> Request Catalogue on WhatsApp
        </motion.a>
      </motion.div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PrivateCatalogue() {
  const [searchParams]                        = useSearchParams();
  const [timeLeft, setTimeLeft]               = useState(0);
  const [expired, setExpired]                 = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockMap, setStockMap]               = useState<Record<string,StockStatus>>(() => loadStockMap());
  const [orderedToast, setOrderedToast]       = useState<string|null>(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [activeFilter, setActiveFilter]       = useState<'all'|'ready'|'ordered'>('all');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] });
  const heroY   = useTransform(scrollYProgress, [0,1], ['0%', '30%']);
  const heroOp  = useTransform(scrollYProgress, [0,0.7], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 60, damping: 20 });

  const token      = searchParams.get('token');
  const decoded    = token ? decodeToken(token) : null;
  const allProducts = decoded ? (ALL_PRODUCTS[decoded.category] ?? []) : [];
  const catLabel   = decoded?.category
    ? decoded.category.charAt(0).toUpperCase() + decoded.category.slice(1)
    : '';

  // Countdown
  useEffect(() => {
    if (!decoded) return;
    const tick = () => {
      const rem = decoded.expiry - Date.now();
      if (rem <= 0) { setExpired(true); setTimeLeft(0); }
      else setTimeLeft(rem);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [decoded?.expiry]);

  const readyCount   = allProducts.filter(p => (stockMap[p.id] ?? 'ready') === 'ready').length;
  const orderedCount = allProducts.filter(p => (stockMap[p.id] ?? 'ready') === 'ordered').length;

  const visibleProducts = useMemo(() => {
    return allProducts.filter(p => {
      const status = stockMap[p.id] ?? 'ready';
      const matchFilter =
        activeFilter === 'all'     ? true :
        activeFilter === 'ready'   ? status === 'ready' :
                                     status === 'ordered';
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || p.name.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [allProducts, stockMap, activeFilter, searchQuery]);

  const handleEnquire = (product: any) => {
    const status = stockMap[product.id] ?? 'ready';
    if (status === 'ready') {
      moveToOrdered(product.id);
      setStockMap(prev => ({ ...prev, [product.id]: 'ordered' }));
      setOrderedToast(product.name);
      setTimeout(() => setOrderedToast(null), 3500);
    }
    const msg = `Hi! I'm interested in *${product.name}* (${product.category}) from the private catalogue. Please share details.`;
    window.open(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!token || !decoded) return <InvalidPage />;
  if (expired)            return <ExpiredPage />;

  const urgentColor = timeLeft < 5 * 60 * 1000 ? '#EF4444' : C.gold;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {orderedToast && (
          <motion.div
            initial={{ opacity:0, y:60, scale:0.85 }}
            animate={{ opacity:1, y:0,  scale:1    }}
            exit={{   opacity:0, y:30,  scale:0.9  }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl"
            style={{ background:'#2E7D32', color:'#fff', maxWidth:'90vw',
                     boxShadow:'0 8px 40px rgba(46,125,50,0.4)' }}
          >
            <motion.div animate={{ rotate:[0,360] }} transition={{ duration:0.6 }}>
              <ShoppingBag size={18} />
            </motion.div>
            <span className="font-raleway text-sm font-medium">
              <strong>{orderedToast}</strong> moved to Ordered Stock ✓
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          LUXURY HERO HEADER
      ══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 320 }}>
        {/* Gradient background */}
        <div className="absolute inset-0"
             style={{ background:`linear-gradient(135deg, #2D0A18 0%, #6D1B4E 45%, #880E4F 75%, #C2185B 100%)` }} />

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage:'linear-gradient(rgba(248,187,217,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,187,217,0.3) 1px, transparent 1px)',
                      backgroundSize:'60px 60px' }} />

        {/* Floating particles */}
        <Particles />

        {/* Radial glow */}
        <motion.div
          animate={{ scale:[1,1.15,1], opacity:[0.3,0.5,0.3] }}
          transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background:`radial-gradient(ellipse, rgba(194,24,91,0.35) 0%, transparent 70%)`, filter:'blur(40px)' }}
        />

        {/* Content */}
        <motion.div
          style={{ y: springY, opacity: heroOp }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20"
        >
          {/* Brand eyebrow */}
          <motion.div
            initial={{ opacity:0, y:-20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1, duration:0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <motion.div
              animate={{ rotate:360 }}
              transition={{ duration:8, repeat:Infinity, ease:'linear' }}
            >
              <Crown size={16} style={{ color: C.goldPale }} />
            </motion.div>
            <span className="font-cinzel text-[10px] tracking-[0.5em] text-white/60">
              PRIVATE · EXCLUSIVE · CURATED
            </span>
            <motion.div
              animate={{ rotate:-360 }}
              transition={{ duration:8, repeat:Infinity, ease:'linear' }}
            >
              <Crown size={16} style={{ color: C.goldPale }} />
            </motion.div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration:0.8, ease:[0.22,1,0.36,1] }}
            className="font-cormorant font-light text-white leading-tight"
            style={{ fontSize:'clamp(2.2rem, 6vw, 4rem)' }}
          >
            Shekhar Raja{' '}
            <motion.em
              className="italic not-italic font-semibold"
              style={{ color: C.goldPale }}
              animate={{ opacity:[0.8,1,0.8] }}
              transition={{ duration:2.5, repeat:Infinity }}
            >
              Jewellers
            </motion.em>
          </motion.h1>

          {/* Collection name */}
          <motion.div
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.35, duration:0.7 }}
            className="mt-3 flex items-center gap-3"
          >
            <div className="h-px w-10" style={{ background:`rgba(248,187,217,0.4)` }} />
            <span className="font-cinzel text-xs tracking-[0.4em]" style={{ color: C.goldPale }}>
              {catLabel.toUpperCase()} COLLECTION
            </span>
            <div className="h-px w-10" style={{ background:`rgba(248,187,217,0.4)` }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.45, duration:0.7 }}
            className="font-raleway text-sm mt-4 max-w-md"
            style={{ color:'rgba(255,255,255,0.55)' }}
          >
            Handpicked exclusively for you. Each piece crafted with love &amp; heritage.
          </motion.p>

          {/* Countdown pill */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.55, duration:0.6 }}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
                     backdropFilter:'blur(8px)' }}
          >
            <motion.div
              animate={{ scale:[1,1.2,1] }}
              transition={{ duration:1, repeat:Infinity }}
            >
              <Clock size={14} style={{ color: urgentColor }} />
            </motion.div>
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: urgentColor }}>
              {formatTime(timeLeft)}
            </span>
            <span className="font-raleway text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>
              remaining
            </span>
          </motion.div>

          {/* Lock badge */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.7 }}
            className="mt-4 flex items-center gap-1.5"
          >
            <Lock size={11} style={{ color:'rgba(255,255,255,0.3)' }} />
            <span className="font-cinzel text-[9px] tracking-[0.3em]" style={{ color:'rgba(255,255,255,0.3)' }}>
              PRIVATE CATALOGUE · CONFIDENTIAL
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
          <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,48 C300,0 900,0 1200,48 L1200,48 L0,48 Z" fill={C.bg} />
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STICKY NAV HEADER (appears on scroll)
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        className="sticky top-0 z-40 backdrop-blur-md shadow-sm"
        style={{ background:'rgba(255,245,247,0.97)', borderBottom:`1px solid ${C.border}` }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                 style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.goldDk})` }}>
              <Diamond size={12} className="text-white" />
            </div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]" style={{ color: C.textLight }}>
                SHEKHAR RAJA JEWELLERS
              </p>
              <h2 className="font-cormorant text-base font-bold leading-none" style={{ color: C.text }}>
                {catLabel} Collection
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
               style={{ background:`rgba(194,24,91,0.08)`, border:`1px solid ${C.border}` }}>
            <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:1, repeat:Infinity }}>
              <Clock size={13} style={{ color: urgentColor }} />
            </motion.div>
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: urgentColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        {/* Animated progress bar */}
        <motion.div
          className="h-0.5"
          style={{ background:`linear-gradient(to right, ${C.gold}, ${C.goldLt})`,
                   width:`${Math.max(0, Math.min(100, (timeLeft/3600000)*100))}%`,
                   transition:'width 1s linear' }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── STOCK SUMMARY CARDS ── */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.6 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {/* Ready Stock */}
          <motion.button
            whileHover={{ y:-4, boxShadow:'0 8px 28px rgba(46,125,50,0.22)' }}
            whileTap={{ scale:0.97 }}
            onClick={() => setActiveFilter(f => f === 'ready' ? 'all' : 'ready')}
            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300"
            style={{
              background: activeFilter === 'ready' ? C.green : C.greenBg,
              border:`2px solid ${activeFilter === 'ready' ? C.green : 'rgba(46,125,50,0.2)'}`,
              boxShadow: activeFilter === 'ready' ? '0 6px 24px rgba(46,125,50,0.3)' : 'none',
            }}
          >
            <motion.div
              animate={activeFilter === 'ready' ? { scale:[1,1.1,1] } : {}}
              transition={{ duration:1.5, repeat:Infinity }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: activeFilter === 'ready' ? 'rgba(255,255,255,0.2)' : 'rgba(46,125,50,0.12)' }}
            >
              <Package size={20} style={{ color: activeFilter === 'ready' ? '#fff' : C.green }} />
            </motion.div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.7)' : '#4a7c59' }}>
                READY STOCK
              </p>
              <motion.p
                key={readyCount}
                initial={{ scale:1.2, opacity:0.6 }}
                animate={{ scale:1, opacity:1 }}
                className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                style={{ color: activeFilter === 'ready' ? '#fff' : C.green }}
              >
                {readyCount}
              </motion.p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.6)' : '#4a7c59' }}>
                pieces available
              </p>
            </div>
          </motion.button>

          {/* Ordered Stock */}
          <motion.button
            whileHover={{ y:-4, boxShadow:`0 8px 28px rgba(194,24,91,0.22)` }}
            whileTap={{ scale:0.97 }}
            onClick={() => setActiveFilter(f => f === 'ordered' ? 'all' : 'ordered')}
            className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300"
            style={{
              background: activeFilter === 'ordered' ? C.gold : `rgba(194,24,91,0.06)`,
              border:`2px solid ${activeFilter === 'ordered' ? C.gold : C.border}`,
              boxShadow: activeFilter === 'ordered' ? `0 6px 24px rgba(194,24,91,0.3)` : 'none',
            }}
          >
            <motion.div
              animate={activeFilter === 'ordered' ? { scale:[1,1.1,1] } : {}}
              transition={{ duration:1.5, repeat:Infinity }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: activeFilter === 'ordered' ? 'rgba(255,255,255,0.2)' : `rgba(194,24,91,0.10)` }}
            >
              <ShoppingBag size={20} style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }} />
            </motion.div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.7)' : C.textMid }}>
                ORDERED STOCK
              </p>
              <motion.p
                key={orderedCount}
                initial={{ scale:1.2, opacity:0.6 }}
                animate={{ scale:1, opacity:1 }}
                className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }}
              >
                {orderedCount}
              </motion.p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.6)' : C.textLight }}>
                pieces ordered
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* ── SEARCH + FILTER ROW ── */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.2, duration:0.6 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textLight }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, category or tag…"
              className="w-full pl-10 pr-9 py-3 rounded-xl font-raleway text-sm outline-none transition-shadow focus:shadow-md"
              style={{ background:'#fff', border:`1.5px solid ${C.border}`, color: C.text,
                       boxShadow:'0 1px 6px rgba(194,24,91,0.06)' }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity:0, scale:0.8 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X size={14} style={{ color: C.textLight }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filter tabs */}
          <div className="flex rounded-xl overflow-hidden"
               style={{ border:`1.5px solid ${C.border}`, background:'#fff' }}>
            {(['all','ready','ordered'] as const).map(f => (
              <motion.button
                key={f}
                onClick={() => setActiveFilter(f)}
                whileTap={{ scale:0.95 }}
                className="flex-1 px-3 sm:px-4 py-2.5 font-cinzel text-[9px] tracking-[0.2em] transition-all duration-300 whitespace-nowrap"
                style={{
                  background: activeFilter === f
                    ? f === 'ready' ? C.green : f === 'ordered' ? C.gold : C.goldDk
                    : 'transparent',
                  color: activeFilter === f ? '#fff' : C.textLight,
                }}
              >
                {f === 'all' ? 'ALL' : f === 'ready' ? '● READY' : '◆ ORDERED'}
              </motion.button>
            ))}
          </div>

          {/* WhatsApp */}
          <motion.a
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            href="https://wa.me/918377911745?text=Hi!%20I%20am%20viewing%20the%20private%20catalogue."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-white text-sm px-5 py-2.5 rounded-xl font-raleway flex-shrink-0 shadow-md"
            style={{ background:'#25D366' }}
          >
            <MessageCircle size={14} /> WhatsApp
          </motion.a>
        </motion.div>

        {/* Count */}
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          className="font-raleway text-xs mb-5"
          style={{ color: C.textLight }}
        >
          Showing <strong style={{ color: C.text }}>{visibleProducts.length}</strong> of {allProducts.length} pieces
          {activeFilter !== 'all' && ` · ${activeFilter === 'ready' ? 'Ready' : 'Ordered'} stock only`}
          {searchQuery && ` · "${searchQuery}"`}
        </motion.p>

        {/* ── PRODUCT GRID ── */}
        {visibleProducts.length === 0 ? (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ scale:[1,1.08,1] }} transition={{ duration:2, repeat:Infinity }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background:`rgba(194,24,91,0.08)` }}
            >
              <Search size={24} style={{ color: C.textLight }} />
            </motion.div>
            <p className="font-cormorant text-2xl" style={{ color: C.textLight }}>No products found</p>
            <motion.button
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="mt-4 font-raleway text-sm underline"
              style={{ color: C.gold }}
            >
              Clear filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, index) => {
                const isReady = (stockMap[product.id] ?? 'ready') === 'ready';
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity:0, y:30, scale:0.95 }}
                    animate={{ opacity:1, y:0,  scale:1   }}
                    exit={{   opacity:0, scale:0.88, transition:{ duration:0.2 } }}
                    transition={{ delay: Math.min(index * 0.05, 0.4), duration:0.45, ease:[0.22,1,0.36,1] }}
                    whileHover={{ y:-7, scale:1.025 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group"
                    style={{ boxShadow:'0 2px 12px rgba(194,24,91,0.07)' }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio:'1/1' }}>
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e:any) => { e.target.src = '/bridal.png'; }}
                        style={{ filter: isReady ? 'none' : 'grayscale(30%) brightness(0.88)' }}
                      />

                      {/* Shimmer on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                           style={{ background:'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.18) 60%, transparent 80%)' }} />

                      {/* Hover CTA */}
                      <motion.div
                        initial={{ opacity:0 }}
                        whileHover={{ opacity:1 }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background:'rgba(194,24,91,0.12)' }}
                      >
                        <motion.div
                          initial={{ scale:0.8, opacity:0 }}
                          whileHover={{ scale:1, opacity:1 }}
                          className="bg-white rounded-full px-5 py-2 flex items-center gap-2 shadow-lg"
                        >
                          <span className="font-cinzel text-xs" style={{ color: C.gold }}>VIEW</span>
                          <ArrowRight size={12} style={{ color: C.gold }} />
                        </motion.div>
                      </motion.div>

                      {/* Tag */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`text-xs font-cinzel tracking-wide px-2 py-1 rounded-full shadow-sm ${TAG_COLORS[product.tag] ?? 'bg-gray-100 text-gray-700'}`}>
                          {product.tag}
                        </span>
                      </div>

                      {/* Sparkle effect for ready items */}
                      {isReady && (
                        <motion.div
                          className="absolute top-3 right-3"
                          animate={{ scale:[1,1.2,1], opacity:[0.7,1,0.7] }}
                          transition={{ duration:2, repeat:Infinity, delay:index*0.2 }}
                        >
                          <Sparkles size={14} style={{ color:'#2E7D32' }} />
                        </motion.div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <motion.div
                          animate={{ scale:[1,1.3,1] }}
                          transition={{ duration:2.5, repeat:Infinity, delay:index*0.15 }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: C.gold }}
                        />
                        <span className="font-cinzel text-[9px] tracking-[0.2em]" style={{ color: C.gold }}>
                          {product.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-cormorant text-lg font-semibold leading-tight" style={{ color: C.text }}>
                        {product.name}
                      </h3>
                      <p className="font-raleway text-xs leading-relaxed mt-1 line-clamp-2" style={{ color: C.textLight }}>
                        {product.description}
                      </p>

                      {/* CTA */}
                      <motion.button
                        whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                        onClick={(e) => { e.stopPropagation(); handleEnquire(product); }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-raleway text-xs font-medium transition-all"
                        style={{
                          background: isReady ? '#25D366' : `rgba(194,24,91,0.07)`,
                          color:      isReady ? '#fff'    : C.gold,
                          border:     isReady ? 'none'    : `1px solid ${C.border}`,
                          boxShadow:  isReady ? '0 3px 12px rgba(37,211,102,0.3)' : 'none',
                        }}
                      >
                        <MessageCircle size={12} />
                        {isReady ? 'Order on WhatsApp' : 'Enquire'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ── FOOTER WATERMARK ── */}
        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ delay:0.2 }}
          className="text-center mt-16 pb-8"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-16" style={{ background: C.border }} />
            <motion.div animate={{ rotate:360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}>
              <Diamond size={14} style={{ color: C.gold }} />
            </motion.div>
            <span className="font-cinzel text-xs tracking-[0.3em]" style={{ color: C.textLight }}>
              SHEKHAR RAJA JEWELLERS · PRIVATE
            </span>
            <motion.div animate={{ rotate:-360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}>
              <Diamond size={14} style={{ color: C.gold }} />
            </motion.div>
            <div className="h-px w-16" style={{ background: C.border }} />
          </div>
          <p className="font-raleway text-xs" style={{ color: C.textLight }}>
            This catalogue is confidential and intended for the recipient only.
          </p>
        </motion.div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
