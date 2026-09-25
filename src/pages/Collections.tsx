import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Heart, SlidersHorizontal, ChevronDown, Star } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Minimalist Palette ────────────────────────────────────────────────────────
const C = {
  bg:         '#FFFFFF',
  bgDeep:     '#F9FAFB', // Light editorial gray
  bgCard:     '#FFFFFF',
  text:       '#000000',
  textMid:    '#4B5563',
  textLight:  '#9CA3AF',
  border:     '#F3F4F6',
  accent:     '#000000',
};

// ── Minimal Tags ──────────────────────────────────────────────────────────────
const getTagStyle = (tag: string) => {
  if (tag === 'Premium' || tag === 'Luxury') return { bg: '#000000', text: '#FFFFFF', border: '#000000' };
  if (tag === 'Bestseller') return { bg: '#F3F4F6', text: '#000000', border: '#E5E7EB' };
  return { bg: '#FFFFFF', text: '#4B5563', border: '#E5E7EB' };
};

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { name: 'All',          image: null,            emoji: '✨' },
  { name: 'Necklaces',    image: '/necklace1.jpg',emoji: '📿' },
  { name: 'Chokers',      image: '/antique3.jpg', emoji: '💫' },
  { name: 'Earrings',     image: '/earring1.jpg', emoji: '💛' },
  { name: 'Bangles',      image: '/bangle1.png',  emoji: '🔮' },
  { name: "Men's Ring",   image: '/ring7.png',    emoji: '💍' },
  { name: "Women's Ring", image: '/ring2.png',    emoji: '💎' },
  { name: 'Pendants',     image: '/pendant.png',  emoji: '🌟' },
  { name: 'Chains',       image: '/chain2.png',   emoji: '⛓️' },
  { name: 'Antique',      image: '/antique2.jpg', emoji: '🏺' },
];

// ── Tag filter groups ─────────────────────────────────────────────────────────
const tagGroups = [
  { label: 'All Styles', value: 'all' },
  { label: 'Bridal',     value: 'Bridal Pick' },
  { label: 'Festive',    value: 'Festive' },
  { label: 'New In',     value: 'New Arrival' },
  { label: 'Trending',   value: 'Trending' },
  { label: 'Luxury',     value: 'Luxury' },
  { label: 'Bestseller', value: 'Bestseller' },
  { label: 'Heritage',   value: 'Heritage' },
  { label: 'Everyday',   value: 'Everyday' },
];

// ── Products (Truncated for brevity, insert your full allProducts array here) ──
const allProducts = [
  { id:1,  name:'Kundan Bridal Necklace',    category:'Necklaces',    description:'Exquisite kundan work with meenakari detailing.', image:'/antique1.jpg', tag:'Bestseller', featured:true  },
  { id:2,  name:'Diamond Eternity Ring',     category:'Antique',      description:'A stunning circle of brilliant diamonds.',        image:'/ring2.png',    tag:'Premium',    featured:false },
  { id:3,  name:'Antique Gold Jhumkas',      category:'Earrings',     description:'Traditional temple-style jhumkas.',               image:'/earrings13.png',tag:'Heritage',   featured:false },
  // ... Paste your full 123 products here ...
];

// ── WhatsApp enquiry link ─────────────────────────────────────────────────────
const WA_NUMBER = '918377911745';
function waLink(productName: string) {
  const msg = encodeURIComponent(`Hello! I'm interested in the *${productName}* from your collection. Could you please share more details and pricing?`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div className="h-64 animate-pulse bg-gray-50" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-hidden mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-full animate-pulse bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-gray-100 p-4">
              <div className="w-full aspect-square bg-gray-50 mb-4" />
              <div className="h-4 w-3/4 bg-gray-100 mb-2" />
              <div className="h-3 w-1/2 bg-gray-50 mb-6" />
              <div className="h-10 w-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Collections() {
  const [isLoading, setIsLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag]           = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [wishlist, setWishlist]             = useState<number[]>([]);
  const [showFilters, setShowFilters]       = useState(false);
  const [sortBy, setSortBy]                 = useState<'default' | 'featured'>('default');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filtered = allProducts.filter(p => {
    const catOk  = activeCategory === 'All' || p.category === activeCategory;
    const tagOk  = activeTag === 'all' || p.tag === activeTag;
    const q      = searchQuery.toLowerCase();
    const searchOk = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
    return catOk && tagOk && searchOk;
  }).sort((a, b) => sortBy === 'featured' ? (b.featured ? 1 : 0) - (a.featured ? 1 : 0) : 0);

  if (isLoading) return <Skeleton />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                style={{ background: C.bg, minHeight: '100vh' }}>

      {/* ── HERO — Editorial & Minimalist ── */}
      <section className="pt-24 pb-16 px-4 md:px-8 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
            <h1 className="font-cormorant text-5xl md:text-[5.5rem] leading-[1.05] text-black mb-8 tracking-tight">
              Elevate The<br />Everyday<br />With Timeless<br />Jewels
            </h1>
            <p className="font-raleway text-sm text-gray-500 max-w-sm mb-10 leading-relaxed">
              Est. 1987 · Jabalpur · 22K BIS Hallmark Certified.<br/>
              Browse our handcrafted collection and enquire directly to secure your piece.
            </p>
            <button className="bg-black text-white px-10 py-4 text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors">
              Shop Collection
            </button>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex gap-4 w-full h-[500px]">
             <div className="w-1/2 pt-16">
                <img src={allProducts[0]?.image || '/antique1.jpg'} alt="Featured Jewelry" className="w-full h-full object-cover bg-gray-50" />
             </div>
             <div className="w-1/2 pb-16">
                <img src={allProducts[1]?.image || '/ring2.png'} alt="Featured Jewelry" className="w-full h-full object-cover bg-gray-50" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY TABS ── */}
      <section className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const isActive = activeCategory === cat.name;
              return (
                <button key={cat.name}
                        onClick={() => { setActiveCategory(cat.name); setActiveTag('all'); }}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium tracking-wide uppercase transition-all duration-300 ${isActive ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-50'}`}
                        style={{ fontFamily: 'Raleway, sans-serif' }}>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTER BAR ── */}
      <section className="py-6 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <h2 className="font-cormorant text-3xl hidden md:block">{activeCategory === 'All' ? 'Best Selling' : activeCategory}</h2>
          
          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-9 pr-8 py-2.5 rounded-none text-xs outline-none bg-gray-50 border border-transparent focus:border-gray-200 transition-all font-raleway text-black"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={13} className="text-gray-400" />
                </button>
              )}
            </div>

            <button onClick={() => setShowFilters(v => !v)}
                    className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all font-raleway border ${showFilters ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-black'}`}>
              <SlidersHorizontal size={13} />
              Filter
            </button>

            <div className="relative hidden sm:block border border-gray-200">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="appearance-none pl-4 pr-8 py-2.5 bg-white text-xs text-black outline-none cursor-pointer font-raleway uppercase tracking-wider">
                <option value="default">Sort: Default</option>
                <option value="featured">Featured First</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
            </div>
          </div>
        </div>

        {/* Tag filter strip */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="max-w-7xl mx-auto overflow-hidden">
              <div className="flex gap-2 flex-wrap pt-4 border-t border-gray-100 mt-4">
                {tagGroups.map(tg => (
                  <button key={tg.value}
                          onClick={() => setActiveTag(tg.value)}
                          className={`px-4 py-1.5 text-[11px] font-medium tracking-wide uppercase transition-all font-raleway border ${activeTag === tg.value ? 'bg-black text-white border-black' : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                    {tg.label.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim()} {/* Stripping emojis for the clean look */}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="py-8 px-4 md:px-8 bg-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-center py-32">
                <p className="font-cormorant text-3xl mb-3 text-black">No pieces found</p>
                <p className="font-raleway text-sm mb-8 text-gray-500">
                  Try selecting a different category or refining your search.
                </p>
                <button onClick={() => { setActiveCategory('All'); setActiveTag('all'); setSearchQuery(''); }}
                        className="px-8 py-3 text-xs font-semibold tracking-[0.15em] uppercase bg-black text-white hover:bg-gray-800 transition-colors">
                  View Full Collection
                </button>
              </motion.div>
            ) : (
              <motion.div key={activeCategory + activeTag + searchQuery + sortBy}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {filtered.map((product, i) => {
                  const tagStyle = getTagStyle(product.tag);
                  const isWished = wishlist.includes(product.id);
                  // Generate a mock static rating between 4.5 and 5.0 for the UI
                  const rating = (4.5 + (product.id % 5) * 0.1).toFixed(1);
                  const reviews = 40 + (product.id % 200);

                  return (
                    <motion.div key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.4 }}>

                      {/* ── CARD — Editorial, Clean, Minimal ── */}
                      <div className="bg-white group cursor-pointer flex flex-col h-full"
                           onClick={() => setSelectedProduct(product)}>

                        {/* Top Meta: Rating & Heart */}
                        <div className="flex justify-between items-center mb-4 px-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-sans tracking-wide">
                            <Star size={10} className="text-black" fill="currentColor" /> {rating} ({reviews})
                          </div>
                          <button onClick={e => toggleWishlist(product.id, e)} className="p-1">
                            <Heart size={14} 
                                   className={`transition-colors ${isWished ? 'text-black' : 'text-gray-300 group-hover:text-gray-500'}`} 
                                   fill={isWished ? "black" : "none"} />
                          </button>
                        </div>

                        {/* Image area */}
                        <div className="relative overflow-hidden mb-6 bg-[#FAFAFA] flex items-center justify-center p-4" style={{ aspectRatio: '1/1' }}>
                          <img src={product.image} alt={product.name}
                               className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.03]" />
                          
                          {/* Minimal Tag */}
                          <div className="absolute bottom-3 left-3">
                            <span className="text-[9px] font-semibold tracking-wider px-2 py-1 uppercase"
                                  style={{ background: tagStyle.bg, color: tagStyle.text, border: `1px solid ${tagStyle.border}`, fontFamily: 'Raleway, sans-serif' }}>
                              {product.tag}
                            </span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="px-1 flex flex-col flex-1 text-center">
                          <h3 className="font-cormorant text-lg leading-snug mb-1 text-black">
                            {product.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 font-raleway mb-5 flex-1">
                            By Maa Nunhai Hallmarking
                          </p>

                          {/* ── Minimal Black CTA Button ── */}
                          <a href={waLink(product.name)}
                             target="_blank" rel="noopener noreferrer"
                             onClick={e => e.stopPropagation()}
                             className="w-full py-3 border border-black text-black text-[10px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-black hover:text-white">
                            Enquire Now
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>

    </motion.div>
  );
}