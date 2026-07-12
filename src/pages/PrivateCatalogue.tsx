// ════════════════════════════════════════════════════════════════════════════
// src/pages/PrivateCatalogue.tsx
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Lock, ArrowRight, MessageCircle, Diamond,
  AlertCircle, Package, ShoppingBag, Search, X,
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import { loadStockMap, moveToOrdered, type StockStatus } from '../lib/stockStore';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
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
};

// ── All products ──────────────────────────────────────────────────────────────
const ALL_PRODUCTS: Record<string, any[]> = {
  bangles: [
    { id:'b1', name:'Classic Gold Bangles',   category:'Bangles',   description:'Set of 4 intricately designed 22K gold bangles.',  image:'/bangle1.png', tag:'Classic'    },
    { id:'b2', name:'Designer Bangles',        category:'Bangles',   description:'Designer gold bangles with enamel work.',           image:'/bangle2.png', tag:'Designer'   },
    { id:'b3', name:'Antique Finish Bangles',  category:'Bangles',   description:'Antique finish 22K bangles with stone work.',       image:'/bangle3.png', tag:'Heritage'   },
    { id:'b4', name:'Bridal Bangles Set',      category:'Bangles',   description:'Heavy bridal bangle set for your special day.',     image:'/bangle4.png', tag:'Bridal'     },
    { id:'b5', name:'Peacock Bangles',         category:'Bangles',   description:'Peacock motif 22K gold bangles.',                   image:'/bangle5.png', tag:'Exclusive'  },
  ],
  rings: [
    { id:'r1', name:'Solitaire Ring',          category:'Rings',     description:'Brilliant solitaire diamond in 18K gold.',         image:'/ring1.png',  tag:'Premium'    },
    { id:'r2', name:'Polki Diamond Ring',       category:'Rings',     description:'Uncut polki diamonds set in 22K gold.',            image:'/ring2.png',  tag:'Exclusive'  },
    { id:'r3', name:'Classic Gold Ring',        category:'Rings',     description:'Classic 22K gold ring with intricate design.',     image:'/ring3.png',  tag:'Classic'    },
    { id:'r4', name:'Floral Ring',             category:'Rings',     description:'Beautiful floral motif 22K gold ring.',            image:'/ring6.png',  tag:'Trending'   },
    { id:'r5', name:'Gents Statement Ring',     category:'Rings',     description:'Bold statement ring for men in 22K gold.',         image:'/ring7.png',  tag:'Men'        },
  ],
  necklaces: [
    { id:'n1', name:'Maharani Bridal Necklace',category:'Necklaces', description:'Grand bridal necklace in 22K gold.',              image:'/necklace88.png', tag:'Bridal'  },
    { id:'n2', name:'Temple Gold Haar',         category:'Necklaces', description:'Traditional temple necklace with Lakshmi coins.', image:'/temple.png',     tag:'Heritage'},
    { id:'n3', name:'Kundan Choker',            category:'Necklaces', description:'Royal Kundan choker with meenakari work.',        image:'/necklace1.jpg',  tag:'Royal'   },
  ],
  earrings: [
    { id:'e1', name:'Antique Gold Jhumkas',     category:'Earrings',  description:'Traditional temple-style jhumkas.',               image:'/earring1.jpg',   tag:'Heritage'},
    { id:'e2', name:'Chandbali Earrings',       category:'Earrings',  description:'Royal chandbali with stone work.',                 image:'/earring5.jpg',   tag:'Exclusive'},
    { id:'e3', name:'Antique Earrings Set',     category:'Earrings',  description:'Exquisite antique finish earring set.',            image:'/earrings13.png', tag:'Limited' },
  ],
  bridal: [
    { id:'br1', name:'Bridal Set – Maharani',  category:'Bridal',    description:'Complete necklace, earrings & maang tikka.',       image:'/bridal.png',     tag:'Bestseller'},
    { id:'br2', name:'Kundan Bridal Choker',   category:'Bridal',    description:'Exquisite kundan bridal choker.',                  image:'/necklace88.png', tag:'Premium'   },
  ],
  chains: [
    { id:'c1', name:'Figaro Gold Chain',        category:'Chains',    description:'Italian figaro chain in 22K gold.',                image:'/chain2.png',  tag:'Classic'   },
    { id:'c2', name:'Rope Gold Chain',          category:'Chains',    description:'Elegant rope chain in 22K gold.',                  image:'/chain4.png',  tag:'Trending'  },
  ],
  antique: [
    { id:'a1', name:'Antique Temple Set',       category:'Antique',   description:'Full antique temple jewellery set.',               image:'/antique2.jpg', tag:'Heritage' },
    { id:'a2', name:'Antique Choker Necklace',  category:'Antique',   description:'Traditional antique choker necklace.',             image:'/antique3.jpg', tag:'Limited'  },
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

function decodeToken(token: string): { category: string; expiry: number } | null {
  try {
    const decoded = atob(token);
    const [cat, exp] = decoded.split('|');
    return { category: cat, expiry: parseInt(exp) };
  } catch { return null; }
}

function formatTime(ms: number) {
  if (ms <= 0) return '00:00';
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
             style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`2px solid ${C.border}` }}>
          <AlertCircle size={40} style={{ color: C.gold }} />
        </div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Oh! No, Link Expired</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          This private catalogue link has expired. Please contact Shekhar Raja Jewellers for a new link.
        </p>
        <a href="https://wa.me/918377911745?text=Hi!%20The%20catalogue%20link%20expired.%20Please%20send%20a%20new%20one."
           target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium"
           style={{ background:'#25D366' }}>
          <MessageCircle size={18} /> Request New Link on WhatsApp
        </a>
        <div className="mt-6">
          <Link to="/" className="font-raleway text-sm" style={{ color: C.textLight }}>← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}

function InvalidPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
             style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`2px solid ${C.border}` }}>
          <Lock size={40} style={{ color: C.gold }} />
        </div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Private Catalogue</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          You need a valid link from Shekhar Raja Jewellers to view this catalogue.
        </p>
        <a href="https://wa.me/918377911745?text=Hi!%20I%20would%20like%20to%20view%20your%20jewellery%20catalogue."
           target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium"
           style={{ background:'#25D366' }}>
          <MessageCircle size={18} /> Request Catalogue on WhatsApp
        </a>
      </div>
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
  const [activeFilter, setActiveFilter]       = useState<'all' | 'ready' | 'ordered'>('all');

  const token   = searchParams.get('token');
  const decoded = token ? decodeToken(token) : null;
  const allProducts = decoded ? (ALL_PRODUCTS[decoded.category] ?? []) : [];
  const catLabel = decoded?.category
    ? decoded.category.charAt(0).toUpperCase() + decoded.category.slice(1)
    : '';

  // ── Countdown ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!decoded) return;
    const tick = () => {
      const rem = decoded.expiry - Date.now();
      if (rem <= 0) { setExpired(true); setTimeLeft(0); }
      else            setTimeLeft(rem);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [decoded?.expiry]);

  // ── Stock counts ─────────────────────────────────────────────────────────
  const readyCount   = allProducts.filter(p => (stockMap[p.id] ?? 'ready') === 'ready').length;
  const orderedCount = allProducts.filter(p => (stockMap[p.id] ?? 'ready') === 'ordered').length;

  // ── Filter + Search ───────────────────────────────────────────────────────
  const visibleProducts = useMemo(() => {
    return allProducts.filter(p => {
      const status = stockMap[p.id] ?? 'ready';
      const matchFilter =
        activeFilter === 'all'     ? true :
        activeFilter === 'ready'   ? status === 'ready' :
                                     status === 'ordered';
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [allProducts, stockMap, activeFilter, searchQuery]);

  // ── Enquire → auto move to ordered ───────────────────────────────────────
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
    <div className="min-h-screen pt-20" style={{ background: C.bg }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {orderedToast && (
          <motion.div
            initial={{ opacity:0, y:40, scale:0.9 }}
            animate={{ opacity:1, y:0,  scale:1   }}
            exit={{   opacity:0, y:20,  scale:0.95}}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl"
            style={{ background:'#2E7D32', color:'#fff', maxWidth:'90vw' }}
          >
            <ShoppingBag size={16} />
            <span className="font-raleway text-sm font-medium">
              <strong>{orderedToast}</strong> moved to Ordered Stock
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 backdrop-blur-md shadow-sm"
           style={{ background:'rgba(255,245,247,0.97)', borderBottom:`1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Lock size={13} style={{ color: C.gold }} />
              <span className="font-cinzel text-[10px] tracking-[0.2em]" style={{ color: C.textLight }}>PRIVATE CATALOGUE</span>
            </div>
            <h1 className="font-cormorant text-xl sm:text-2xl font-bold" style={{ color: C.text }}>
              {catLabel} Collection
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full"
               style={{ background:`rgba(194,24,91,0.08)`, border:`1px solid ${C.border}` }}>
            <Clock size={14} style={{ color: urgentColor }} />
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: urgentColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ background: C.border }}>
          <div className="h-full transition-all duration-1000"
               style={{ width:`${Math.max(0, Math.min(100, (timeLeft / 3600000) * 100))}%`,
                        background:`linear-gradient(to right, ${C.gold}, ${C.goldLt})` }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── STOCK SUMMARY CARDS ── */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Ready Stock card */}
          <motion.button
            whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
            onClick={() => setActiveFilter(f => f === 'ready' ? 'all' : 'ready')}
            className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
            style={{
              background: activeFilter === 'ready' ? C.green : C.greenBg,
              border: `2px solid ${activeFilter === 'ready' ? C.green : 'rgba(46,125,50,0.2)'}`,
              boxShadow: activeFilter === 'ready' ? '0 4px 20px rgba(46,125,50,0.25)' : 'none',
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: activeFilter === 'ready' ? 'rgba(255,255,255,0.2)' : 'rgba(46,125,50,0.12)' }}>
              <Package size={22} style={{ color: activeFilter === 'ready' ? '#fff' : C.green }} />
            </div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.7)' : '#4a7c59' }}>
                READY STOCK
              </p>
              <p className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                 style={{ color: activeFilter === 'ready' ? '#fff' : C.green }}>
                {readyCount}
              </p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.6)' : '#4a7c59' }}>
                pieces available
              </p>
            </div>
          </motion.button>

          {/* Ordered Stock card */}
          <motion.button
            whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
            onClick={() => setActiveFilter(f => f === 'ordered' ? 'all' : 'ordered')}
            className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
            style={{
              background: activeFilter === 'ordered' ? C.gold : `rgba(194,24,91,0.06)`,
              border: `2px solid ${activeFilter === 'ordered' ? C.gold : C.border}`,
              boxShadow: activeFilter === 'ordered' ? `0 4px 20px rgba(194,24,91,0.25)` : 'none',
            }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: activeFilter === 'ordered' ? 'rgba(255,255,255,0.2)' : `rgba(194,24,91,0.10)` }}>
              <ShoppingBag size={22} style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }} />
            </div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.7)' : C.textMid }}>
                ORDERED STOCK
              </p>
              <p className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                 style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }}>
                {orderedCount}
              </p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.6)' : C.textLight }}>
                pieces ordered
              </p>
            </div>
          </motion.button>
        </div>

        {/* ── SEARCH + FILTER ROW ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textLight }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, category or tag…"
              className="w-full pl-10 pr-9 py-3 rounded-xl font-raleway text-sm outline-none"
              style={{ background:'#fff', border:`1.5px solid ${C.border}`, color: C.text,
                       boxShadow:'0 1px 6px rgba(194,24,91,0.06)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} style={{ color: C.textLight }} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex rounded-xl overflow-hidden"
               style={{ border:`1.5px solid ${C.border}`, background:'#fff' }}>
            {(['all','ready','ordered'] as const).map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                      className="flex-1 px-4 py-2.5 font-cinzel text-[9px] tracking-[0.2em] transition-all duration-200 whitespace-nowrap"
                      style={{
                        background: activeFilter === f
                          ? f === 'ready' ? C.green : f === 'ordered' ? C.gold : C.goldDk
                          : 'transparent',
                        color: activeFilter === f ? '#fff' : C.textLight,
                      }}>
                {f === 'all' ? 'ALL' : f === 'ready' ? '● READY' : '◆ ORDERED'}
              </button>
            ))}
          </div>

          {/* WhatsApp button */}
          <a href="https://wa.me/918377911745?text=Hi!%20I%20am%20viewing%20the%20private%20catalogue."
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-xl font-raleway flex-shrink-0"
             style={{ background:'#25D366' }}>
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>

        {/* Count label */}
        <p className="font-raleway text-xs mb-4" style={{ color: C.textLight }}>
          Showing <strong style={{ color: C.text }}>{visibleProducts.length}</strong> of {allProducts.length} pieces
          {activeFilter !== 'all' && ` · ${activeFilter === 'ready' ? 'Ready' : 'Ordered'} stock only`}
          {searchQuery && ` · "${searchQuery}"`}
        </p>

        {/* ── PRODUCT GRID ── */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background:`rgba(194,24,91,0.08)` }}>
              <Search size={24} style={{ color: C.textLight }} />
            </div>
            <p className="font-cormorant text-2xl" style={{ color: C.textLight }}>No products found</p>
            <button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                    className="mt-4 font-raleway text-sm underline" style={{ color: C.gold }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, index) => {
                const isReady = (stockMap[product.id] ?? 'ready') === 'ready';
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0  }}
                    exit={{   opacity:0, scale:0.9 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ y:-5, scale:1.02 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio:'1/1' }}>
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale:1.1 }}
                        transition={{ duration:0.4 }}
                        onError={(e:any) => { e.target.src = '/bridal.png'; }}
                        style={{ filter: isReady ? 'none' : 'grayscale(30%) brightness(0.9)' }}
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                           style={{ background:'rgba(194,24,91,0.15)' }}>
                        <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                          <span className="font-cinzel text-xs" style={{ color: C.gold }}>VIEW</span>
                          <ArrowRight size={12} style={{ color: C.gold }} />
                        </div>
                      </div>
                      {/* Tag */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-cinzel tracking-wide px-2 py-1 rounded-full ${TAG_COLORS[product.tag] ?? 'bg-gray-100 text-gray-700'}`}>
                          {product.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
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

                      {/* Enquire button only — no per-product status text */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEnquire(product); }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-raleway text-xs font-medium transition-all hover:opacity-90"
                        style={{
                          background: isReady ? '#25D366' : `rgba(194,24,91,0.08)`,
                          color:      isReady ? '#fff'    : C.gold,
                          border:     isReady ? 'none'    : `1px solid ${C.border}`,
                        }}
                      >
                        <MessageCircle size={12} />
                        {isReady ? 'Order on WhatsApp' : 'Enquire'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Watermark */}
        <div className="text-center mt-16 pb-8">
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-16" style={{ background: C.border }} />
            <Diamond size={12} style={{ color: C.gold }} />
            <span className="font-cinzel text-xs tracking-[0.3em]" style={{ color: C.textLight }}>
              SHEKHAR RAJA JEWELLERS · PRIVATE
            </span>
            <Diamond size={12} style={{ color: C.gold }} />
            <div className="h-px w-16" style={{ background: C.border }} />
          </div>
          <p className="font-raleway text-xs mt-2" style={{ color: C.textLight }}>
            This catalogue is confidential and intended for the recipient only.
          </p>
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
