import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, X, Search } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ─── Data ────────────────────────────────────────────────────────────────────
const categories = [
  { name: 'All',          image: null,              accent: '#C9A84C' },
  { name: 'Antique',      image: '/antique2.jpg',   accent: '#B87333' },
  { name: 'Necklaces',    image: '/necklace1.jpg',  accent: '#C9A84C' },
  { name: 'Earrings',     image: '/earring1.jpg',   accent: '#D4AF37' },
  { name: 'Bangles',      image: '/bangle1.png',    accent: '#CFB53B' },
  { name: "Men's Ring",   image: '/ring7.png',      accent: '#8B6914' },
  { name: 'Pendants',     image: '/pendant.png',    accent: '#C9A84C' },
  { name: "Women's Ring", image: '/ring2.png',      accent: '#D4AF37' },
  { name: 'Chains',       image: '/chain2.png',     accent: '#B8860B' },
  { name: 'Chokers',      image: '/antique3.jpg',   accent: '#DAA520' },
];

const allProducts = [
  { id: 1,  name: 'Kundan Bridal Necklace',   category: 'Necklaces',     description: 'Exquisite kundan work with meenakari detailing, perfect for the modern bride.',   image: '/antique1.jpg',        tag: 'Bestseller',  featured: true  },
  { id: 2,  name: 'Diamond Eternity Ring',     category: 'Antique',       description: 'A stunning circle of brilliant diamonds symbolizing eternal love.',                image: '/ring2.png',           tag: 'Premium',     featured: false },
  { id: 3,  name: 'Antique Gold Jhumkas',      category: 'Earrings',      description: 'Traditional temple-style jhumkas with intricate peacock motifs.',                  image: '/earrings13.png',      tag: 'Heritage',    featured: false },
  { id: 4,  name: '22KT Gold Bangles Set',     category: 'Bangles',       description: 'Set of 4 intricately designed bangles with traditional patterns.',                 image: '/bangle3.png',         tag: 'Classic',     featured: false },
  { id: 5,  name: 'Polki Diamond Ring',        category: 'Antique',       description: 'Uncut polki diamonds set in 22KT gold with a classic design.',                    image: '/ring6.png',           tag: 'Exclusive',   featured: true  },
  { id: 6,  name: 'Temple Gold Haar',          category: 'Necklaces',     description: 'Traditional temple necklace with goddess motifs and Lakshmi coins.',              image: '/necklace88.png',      tag: 'Traditional', featured: false },
  { id: 7,  name: 'Ruby & Emerald Ring',       category: "Women's Ring",  description: 'Stunning cocktail ring with precious gemstones in kundan setting.',               image: '/ring7.png',           tag: 'Limited',     featured: false },
  { id: 8,  name: 'Antique Necklace Set',      category: 'Necklaces',     description: 'Complete antique temple set with traditional craftsmanship.',                     image: '/necklace22.png',      tag: 'Trending',    featured: false },
  { id: 9,  name: 'Meenakari Bridal Set',      category: 'Necklaces',     description: 'Colorful meenakari work bridal set with traditional motifs.',                     image: '/necklace3.jpg',       tag: 'Bridal Pick', featured: true  },
  { id: 10, name: 'Festive Gold Set',          category: 'Antique',       description: 'Elegant gold set perfect for festive occasions.',                                  image: '/bangle5.png',         tag: 'Festive',     featured: false },
  { id: 11, name: 'Diamond Studs',             category: 'Earrings',      description: 'Classic diamond studs for everyday elegance.',                                    image: '/ring4.png',           tag: 'Everyday',    featured: false },
  { id: 12, name: 'Gold Bangles',              category: 'Bangles',       description: 'Heavy gold kada with traditional carvings.',                                      image: '/bangle9.png',         tag: 'Heritage',    featured: false },
  { id: 13, name: 'Heritage Necklace',         category: 'Necklaces',     description: 'Elegant heritage necklace with traditional design.',                              image: '/bridal-necklace.jpg', tag: 'New Arrival', featured: false },
  { id: 14, name: 'Solitaire Engagement Ring', category: "Women's Ring",  description: 'Brilliant solitaire in a classic six-prong setting.',                            image: '/ring6.png',           tag: 'Premium',     featured: true  },
  { id: 15, name: 'Antique Choker Set',        category: 'Antique',       description: 'Beautiful antique choker set for festive celebrations.',                          image: '/necklace15.png',      tag: 'Traditional', featured: false },
  { id: 16, name: 'Diamond Hoop Earrings',     category: 'Earrings',      description: 'Contemporary diamond hoops for modern elegance.',                                 image: '/earrings14.png',      tag: 'Trending',    featured: false },
  { id: 17, name: 'Gold Band Ring',            category: "Women's Ring",  description: 'Classic gold band with elegant minimal design.',                                  image: '/ring5.png',           tag: 'Classic',     featured: false },
  { id: 18, name: 'Diamond Cluster Ring',      category: 'Antique',       description: 'Beautiful cluster of diamonds in an elegant setting.',                            image: '/ring3.png',           tag: 'Luxury',      featured: false },
  { id: 19, name: 'Vintage Diamond Ring',      category: "Women's Ring",  description: 'Vintage-inspired design with intricate detailing.',                               image: '/ring1.png',           tag: 'Vintage',     featured: false },
  { id: 20, name: 'Gold Bangle Set A',         category: 'Bangles',       description: 'Elegant 22KT gold bangles with traditional carvings and fine finish.',           image: '/bangleA.jpg',         tag: 'New Arrival', featured: false },
  { id: 21, name: 'Designer Bangle B',         category: 'Bangles',       description: 'Intricate designer bangles in 22KT gold, perfect for festive occasions.',        image: '/bangleB.jpg',         tag: 'Trending',    featured: false },
  { id: 22, name: 'Antique Bangle C',          category: 'Bangles',       description: 'Antique-finish 22KT gold bangles with classic Indian motifs.',                   image: '/bangleC.jpg',         tag: 'Heritage',    featured: false },
  { id: 23, name: 'Bridal Bangle Set D',       category: 'Bangles',       description: 'Heavy bridal bangles in 22KT gold with ornate detailing.',                       image: '/bangleD.jpg',         tag: 'Bridal Pick', featured: false },
  { id: 24, name: 'Festive Bangle E',          category: 'Bangles',       description: 'Beautifully crafted gold bangles ideal for festivals.',                          image: '/bangleE.jpg',         tag: 'Festive',     featured: false },
  { id: 25, name: 'Kundan Bangle F',           category: 'Bangles',       description: 'Kundan-studded 22KT gold bangles with vibrant meenakari work.',                  image: '/bangleF.jpg',         tag: 'Exclusive',   featured: false },
  { id: 26, name: 'Classic Bangle G',          category: 'Bangles',       description: 'Timeless classic gold bangles with smooth finish and fine engraving.',           image: '/bangleG.jpg',         tag: 'Classic',     featured: false },
  { id: 27, name: 'Temple Bangle H',           category: 'Bangles',       description: 'Temple-art inspired bangles in 22KT gold with goddess motifs.',                  image: '/bangleH.jpg',         tag: 'Traditional', featured: false },
  { id: 28, name: 'Royal Bangle Set I',        category: 'Bangles',       description: 'Royal-style heavy gold bangles, a showstopper for every occasion.',              image: '/bangleI.jpg',         tag: 'Premium',     featured: false },
  { id: 29, name: 'Bridal Necklace A',         category: 'Necklaces',     description: 'Stunning 22KT bridal necklace with kundan and polki work.',                     image: '/necklaceA.jpg',       tag: 'Bridal Pick', featured: true  },
  { id: 30, name: 'Heritage Necklace B',       category: 'Necklaces',     description: 'Traditional heritage necklace in 22KT gold with antique finish.',               image: '/necklaceB.jpg',       tag: 'Heritage',    featured: false },
  { id: 31, name: 'Temple Necklace C',         category: 'Necklaces',     description: 'Handcrafted temple necklace with goddess motifs and ruby accents.',              image: '/necklaceC.jpg',       tag: 'Traditional', featured: false },
  { id: 32, name: 'Kundan Necklace D',         category: 'Necklaces',     description: 'Grand Kundan necklace with emerald and pearl drops in 22KT gold.',              image: '/necklaceD.jpg',       tag: 'Exclusive',   featured: false },
  { id: 33, name: 'Gold Haar E',               category: 'Necklaces',     description: 'Elegant long haar in 22KT gold, ideal for festive and bridal wear.',            image: '/necklaceE.jpg',       tag: 'New Arrival', featured: false },
];

// ─── Tag color map ────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  'Bestseller':  'bg-[#7B2D00] text-[#FFD580]',
  'Premium':     'bg-[#1A1A2E] text-[#C9A84C]',
  'Heritage':    'bg-[#2C1810] text-[#D4A843]',
  'Classic':     'bg-[#1C2B1C] text-[#8BC34A]',
  'Exclusive':   'bg-[#1A0A2E] text-[#B39DDB]',
  'Traditional': 'bg-[#2E1A00] text-[#FFCC80]',
  'Limited':     'bg-[#3E0000] text-[#EF9A9A]',
  'Trending':    'bg-[#001433] text-[#82B1FF]',
  'Bridal Pick': 'bg-[#2D002D] text-[#F48FB1]',
  'Festive':     'bg-[#1A2000] text-[#CCFF90]',
  'Everyday':    'bg-[#1A1A1A] text-[#BDBDBD]',
  'New Arrival': 'bg-[#003333] text-[#80CBC4]',
  'Luxury':      'bg-[#1A1500] text-[#FFE082]',
  'Vintage':     'bg-[#1C1010] text-[#BCAAA4]',
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function Collections() {
  const [activeTab, setActiveTab]         = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [hoveredId, setHoveredId]         = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const filteredProducts = allProducts.filter(p => {
    const matchCat   = activeTab === 'All' || p.category === activeTab;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const featuredProducts = allProducts.filter(p => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: '#0C0A06', fontFamily: 'var(--font-body, serif)' }}>

      {/* ══════════════════════════════════════════
          CINEMATIC HERO
      ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[520px] overflow-hidden flex items-end">
        {/* Parallax bg */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1000] via-[#0C0A06] to-[#0a0500]" />
          {/* Decorative orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(184,134,42,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          {/* Fine grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />
        </motion.div>

        {/* Floating category labels background effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {['RINGS', 'NECKLACES', 'BANGLES', 'EARRINGS', 'PENDANTS', 'CHAINS', 'ANTIQUE'].map((w, i) => (
            <span key={w} className="absolute font-serif text-[120px] font-bold tracking-tight opacity-[0.015] text-[#C9A84C] whitespace-nowrap"
                  style={{ top: `${10 + i * 13}%`, left: `${-5 + (i % 3) * 30}%`, transform: `rotate(${-3 + i * 1.5}deg)` }}>
              {w}
            </span>
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16">
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                      className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-[#C9A84C]" />
            <span className="font-cinzel text-[11px] tracking-[0.35em] text-[#C9A84C]">SHEKHAR RAJA JEWELLERS</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                     className="font-cormorant text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] text-white tracking-tight mb-6">
            The&nbsp;
            <span style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080, #A07830)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Eternal
            </span>
            <br />Collection
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="font-raleway text-base text-white/50 max-w-md leading-relaxed mb-10">
            Every piece a story. Every design an heirloom. Discover {allProducts.length} masterworks in gold.
          </motion.p>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="flex items-center gap-8">
            {[['500+','Designs'], ['22KT','Pure Gold'], ['BIS','Hallmark'], ['1987','Est.']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-cormorant text-2xl font-bold" style={{ color: '#C9A84C' }}>{v}</p>
                <p className="font-raleway text-[10px] tracking-[0.2em] text-white/40 mt-0.5">{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0C0A06] to-transparent" />
      </section>


      {/* ══════════════════════════════════════════
          FEATURED SPOTLIGHT — 3 cards
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#0C0A06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className="flex items-center gap-5 mb-12">
            <Sparkles size={16} style={{ color: '#C9A84C' }} />
            <span className="font-cinzel text-[11px] tracking-[0.3em] text-[#C9A84C]">EDITOR'S PICKS</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#C9A84C]/30 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredProducts.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }} viewport={{ once: true }}
                onClick={() => setSelectedProduct(p)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl"
                style={{ aspectRatio: i === 0 ? '3/4' : '3/4' }}
              >
                <img src={p.image} alt={p.name}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                {/* Gold top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.25em] text-[#C9A84C] mb-2">{p.category.toUpperCase()}</p>
                  <h3 className="font-cormorant text-2xl font-bold text-white leading-tight mb-3">{p.name}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    <span className="font-raleway text-sm text-white/70">Enquire Now</span>
                    <ArrowRight size={14} className="text-[#C9A84C]" />
                  </div>
                </div>
                {/* ★ Featured badge */}
                <div className="absolute top-4 right-4">
                  <span className="font-cinzel text-[9px] tracking-[0.15em] px-2.5 py-1 rounded-full text-black"
                        style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}>★ FEATURED</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          CATEGORY FILTER — Luxury horizontal scroll
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#080600] border-y border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          {/* Title row */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-cinzel text-[10px] tracking-[0.3em] text-[#C9A84C]/60 mb-2">BROWSE BY CATEGORY</p>
              <h2 className="font-cormorant text-4xl font-bold text-white">Shop the Collection</h2>
            </div>
            {/* Search */}
            <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
              <Search size={14} className="text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search designs…"
                className="bg-transparent font-raleway text-sm text-white placeholder-white/30 outline-none w-40"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={13} className="text-white/40 hover:text-white/70 transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Category tiles — horizontal scroll on mobile, wrap on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar sm:flex-wrap sm:overflow-visible sm:pb-0">
            {categories.map((cat, idx) => {
              const isActive = activeTab === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(cat.name)}
                  className="group relative flex-shrink-0 flex flex-col items-center gap-2.5 focus:outline-none"
                  style={{ width: 80 }}
                >
                  {/* Image frame */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden"
                       style={{
                         boxShadow: isActive ? `0 0 0 2px #C9A84C, 0 0 20px rgba(201,168,76,0.3)` : '0 0 0 1px rgba(255,255,255,0.07)',
                         transition: 'box-shadow 0.3s ease',
                       }}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                           style={{ background: 'linear-gradient(135deg, #1a1200, #3a2800)' }}>
                        <span className="text-2xl" style={{ color: '#C9A84C' }}>✦</span>
                      </div>
                    )}
                    {/* Hover/active overlay */}
                    <div className="absolute inset-0 transition-opacity duration-300"
                         style={{
                           background: isActive
                             ? 'linear-gradient(to bottom, rgba(201,168,76,0.15), rgba(0,0,0,0.4))'
                             : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))',
                           opacity: isActive ? 1 : 0,
                         }} />
                  </div>

                  {/* Label */}
                  <span className="font-cinzel text-[9px] tracking-[0.1em] text-center leading-tight"
                        style={{ color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.45)', transition: 'color 0.2s' }}>
                    {cat.name.toUpperCase()}
                  </span>

                  {/* Active underline */}
                  <motion.div
                    animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full origin-center"
                    style={{ background: 'linear-gradient(to right, #C9A84C, #F0D080)' }}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Results meta bar */}
          <div className="mt-10 flex items-center justify-between">
            <p className="font-raleway text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span className="font-semibold text-white">{filteredProducts.length}</span> pieces
              {activeTab !== 'All' && (
                <> in <span style={{ color: '#C9A84C' }}>{activeTab}</span></>
              )}
            </p>
            {(activeTab !== 'All' || searchQuery) && (
              <button
                onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                className="flex items-center gap-1.5 font-raleway text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          PRODUCTS GRID
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#0C0A06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="py-24 text-center">
                <p className="font-cormorant text-4xl text-white/20 mb-3">No pieces found</p>
                <p className="font-raleway text-sm text-white/30">Try a different category or clear your search</p>
              </motion.div>
            ) : (
              <motion.div key={activeTab + searchQuery}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.45 }}
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedProduct(product)}
                    className="group cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden"
                         style={{
                           background: '#13100A',
                           border: hoveredId === product.id ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.05)',
                           boxShadow: hoveredId === product.id ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)' : '0 4px 20px rgba(0,0,0,0.3)',
                           transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                           transform: hoveredId === product.id ? 'translateY(-6px)' : 'translateY(0)',
                         }}>

                      {/* Image */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                        <img src={product.image} alt={product.name}
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                             style={{ transform: hoveredId === product.id ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.7s ease' }} />

                        {/* Base gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#13100A] via-transparent to-transparent" />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 transition-opacity duration-500"
                             style={{
                               background: 'linear-gradient(to top, rgba(10,8,3,0.85) 0%, rgba(10,8,3,0.2) 50%, transparent 100%)',
                               opacity: hoveredId === product.id ? 1 : 0,
                             }} />

                        {/* Gold shimmer line on hover */}
                        <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
                             style={{
                               background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
                               opacity: hoveredId === product.id ? 1 : 0,
                             }} />

                        {/* Tag */}
                        <div className="absolute top-3 left-3">
                          <span className={`font-cinzel text-[9px] tracking-[0.12em] px-2.5 py-1 rounded-full ${TAG_COLORS[product.tag] || 'bg-black/60 text-[#C9A84C]'}`}>
                            {product.tag}
                          </span>
                        </div>

                        {/* Featured star */}
                        {product.featured && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                               style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}>
                            <span className="text-black text-[10px] font-bold">★</span>
                          </div>
                        )}

                        {/* View CTA */}
                        <div className="absolute bottom-4 left-4 right-4 transition-all duration-400"
                             style={{ opacity: hoveredId === product.id ? 1 : 0, transform: hoveredId === product.id ? 'translateY(0)' : 'translateY(8px)' }}>
                          <div className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5">
                            <span className="font-raleway text-xs text-white/90">View Details</span>
                            <ArrowRight size={13} style={{ color: '#C9A84C' }} />
                          </div>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="px-4 py-4">
                        <p className="font-cinzel text-[9px] tracking-[0.2em] mb-1.5" style={{ color: '#C9A84C' }}>
                          {product.category.toUpperCase()}
                        </p>
                        <h3 className="font-cormorant text-lg font-semibold leading-tight transition-colors duration-200"
                            style={{ color: hoveredId === product.id ? '#E8C96A' : 'rgba(255,255,255,0.9)' }}>
                          {product.name}
                        </h3>
                        <p className="font-raleway text-[11px] leading-relaxed mt-1.5 line-clamp-2"
                           style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {product.description}
                        </p>
                        {/* Bottom enquiry row */}
                        <div className="flex items-center justify-between mt-4 pt-3"
                             style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <span className="font-cinzel text-[9px] tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            ENQUIRE ON WHATSAPP
                          </span>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                               style={{
                                 background: hoveredId === product.id ? 'linear-gradient(135deg, #C9A84C, #F0D080)' : 'rgba(255,255,255,0.06)',
                               }}>
                            <ArrowRight size={10} style={{ color: hoveredId === product.id ? '#000' : 'rgba(255,255,255,0.4)' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load more hint */}
          {filteredProducts.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="mt-16 text-center">
              <div className="inline-flex items-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]/30" />
                <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#C9A84C]/40">
                  {filteredProducts.length} PIECES SHOWN
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]/30" />
              </div>
            </motion.div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          PRODUCT MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
