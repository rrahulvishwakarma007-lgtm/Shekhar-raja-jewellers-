import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import ProductModal from '../components/ProductModal';

const categories = [
  { name: 'All',          image: null },
  { name: 'Antique',      image: '/antique2.jpg' },
  { name: 'Necklaces',    image: '/necklace1.jpg' },
  { name: 'Earrings',     image: '/earring1.jpg' },
  { name: 'Bangles',      image: '/bangle1.png' },
  { name: "Men's Ring",   image: '/ring7.png' },
  { name: 'Pendants',     image: '/pendant.png' },
  { name: "Women's Ring", image: '/ring2.png' },
  { name: 'Chains',       image: '/chain2.png' },
  { name: 'Chokers',      image: '/antique3.jpg' },
];

const allProducts = [
  { id: 1, name: 'Kundan Bridal necklace', category: 'Necklaces', description: 'Exquisite kundan work with meenakari detailing, perfect for the modern bride.', image: '/antique1.jpg', tag: 'Bestseller', featured: true },
  { id: 2, name: 'Diamond Eternity Ring', category: 'Antique', description: 'A stunning circle of brilliant diamonds symbolizing eternal love.', image: '/ring2.png', tag: 'Premium' },
  { id: 3, name: 'Antique Gold Jhumkas', category: 'Earrings', description: 'Traditional temple-style jhumkas with intricate peacock motifs.', image: '/earrings13.png', tag: 'Heritage' },
  { id: 4, name: '22KT Gold Bangles Set', category: 'Bangles', description: 'Set of 4 intricately designed bangles with traditional patterns.', image: '/bangle3.png', tag: 'Classic' },
  { id: 5, name: 'Polki Diamond Ring', category: 'Antique', description: 'Uncut polki diamonds set in 22KT gold with a classic design.', image: '/ring6.png', tag: 'Exclusive', featured: true },
  { id: 6, name: 'Temple Gold Haar', category: 'Necklaces', description: 'Traditional temple necklace with goddess motifs and Lakshmi coins.', image: '/necklace88.png', tag: 'Traditional' },
  { id: 7, name: 'Ruby & Emerald Ring', category: "Women's Ring", description: 'Stunning cocktail ring with precious gemstones in kundan setting.', image: '/ring7.png', tag: 'Limited' },
  { id: 8, name: 'Antique Necklace Set', category: 'Necklaces', description: 'Complete antique temple set with traditional craftsmanship.', image: '/necklace22.png', tag: 'Trending' },
  { id: 9, name: 'Meenakari Bridal Set', category: 'Necklaces', description: 'Colorful meenakari work bridal set with traditional motifs.', image: '/necklace3.jpg', tag: 'Bridal Pick', featured: true },
  { id: 10, name: 'Festive Gold Set', category: 'Antique', description: 'Elegant gold set perfect for festive occasions.', image: '/bangle5.png', tag: 'Festive' },
  { id: 11, name: 'Diamond Studs', category: 'Earrings', description: 'Classic diamond studs for everyday elegance.', image: '/ring4.png', tag: 'Everyday' },
  { id: 12, name: 'Gold Bangles', category: 'Bangles', description: 'Heavy gold kada with traditional carvings.', image: '/bangle9.png', tag: 'Heritage' },
  { id: 13, name: 'Heritage Necklace', category: 'Necklaces', description: 'Elegant heritage necklace with traditional design.', image: '/bridal-necklace.jpg', tag: 'New Arrival' },
  { id: 14, name: 'Solitaire Engagement Ring', category: "Women's Ring", description: 'Brilliant solitaire in a classic six-prong setting.', image: '/ring6.png', tag: 'Premium', featured: true },
  { id: 15, name: 'Antique Necklace  Set', category: 'Antique', description: 'Beautiful antique choker set for festive celebrations.', image: '/necklace15.png', tag: 'Traditional' },
  { id: 16, name: 'Diamond Hoop Earrings', category: 'Earrings', description: 'Contemporary diamond hoops for modern elegance.', image: '/earrings14.png', tag: 'Trending' },
  { id: 17, name: 'Gold Band Ring', category: "Women's Ring", description: 'Classic gold band with elegant minimal design.', image: '/ring5.png', tag: 'Classic' },
  { id: 18, name: 'Diamond Cluster Ring', category: 'Antique', description: 'Beautiful cluster of diamonds in an elegant setting.', image: '/ring3.png', tag: 'Luxury' },
  { id: 19, name: 'Vintage Diamond Ring', category: "Women's Ring", description: 'Vintage-inspired design with intricate detailing.', image: '/ring1.png', tag: 'Vintage' },

  // ── NEW BANGLES (bangleA–I) ───────────────────────────────────────────────
  { id: 20, name: 'Gold Bangle Set A',    category: 'Bangles', description: 'Elegant 22KT gold bangles with traditional carvings and fine finish.',             image: '/bangleA.jpg', tag: 'New Arrival' },
  { id: 21, name: 'Designer Bangle B',    category: 'Bangles', description: 'Intricate designer bangles in 22KT gold, perfect for festive occasions.',          image: '/bangleB.jpg', tag: 'Trending'   },
  { id: 22, name: 'Antique Bangle C',     category: 'Bangles', description: 'Antique-finish 22KT gold bangles with classic Indian motifs.',                     image: '/bangleC.jpg', tag: 'Heritage'   },
  { id: 23, name: 'Bridal Bangle Set D',  category: 'Bangles', description: 'Heavy bridal bangles in 22KT gold with ornate detailing.',                         image: '/bangleD.jpg', tag: 'Bridal Pick' },
  { id: 24, name: 'Festive Bangle E',     category: 'Bangles', description: 'Beautifully crafted gold bangles ideal for festivals and celebrations.',            image: '/bangleE.jpg', tag: 'Festive'    },
  { id: 25, name: 'Kundan Bangle F',      category: 'Bangles', description: 'Kundan-studded 22KT gold bangles with vibrant meenakari work.',                    image: '/bangleF.jpg', tag: 'Exclusive'  },
  { id: 26, name: 'Classic Bangle G',     category: 'Bangles', description: 'Timeless classic gold bangles with smooth finish and fine engraving.',             image: '/bangleG.jpg', tag: 'Classic'    },
  { id: 27, name: 'Temple Bangle H',      category: 'Bangles', description: 'Temple-art inspired bangles in 22KT gold with goddess motifs.',                   image: '/bangleH.jpg', tag: 'Traditional'},
  { id: 28, name: 'Royal Bangle Set I',   category: 'Bangles', description: 'Royal-style heavy gold bangles, a showstopper for every occasion.',               image: '/bangleI.jpg', tag: 'Premium'    },

  // ── NEW NECKLACES (necklaceA–E) ────────────────────────────────────────────
  { id: 29, name: 'Bridal Necklace A',    category: 'Necklaces', description: 'Stunning 22KT bridal necklace with kundan and polki work, perfect for weddings.', image: '/necklaceA.jpg', tag: 'Bridal Pick', featured: true },
  { id: 30, name: 'Heritage Necklace B',  category: 'Necklaces', description: 'Traditional heritage necklace in 22KT gold with antique finish.',                 image: '/necklaceB.jpg', tag: 'Heritage'    },
  { id: 31, name: 'Temple Necklace C',    category: 'Necklaces', description: 'Handcrafted temple necklace with goddess motifs and ruby accents.',               image: '/necklaceC.jpg', tag: 'Traditional' },
  { id: 32, name: 'Kundan Necklace D',    category: 'Necklaces', description: 'Grand Kundan necklace with emerald and pearl drops in 22KT gold.',               image: '/necklaceD.jpg', tag: 'Exclusive'   },
  { id: 33, name: 'Gold Haar E',          category: 'Necklaces', description: 'Elegant long haar in 22KT gold, ideal for festive and bridal wear.',             image: '/necklaceE.jpg', tag: 'New Arrival' },
];

export default function Collections() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);

  const filteredProducts = activeTab === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#b8862a] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#b8862a] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <span className="font-raleway text-sm text-[#9a8060]">Home</span>
            <span className="text-[#b8862a]">/</span>
            <span className="font-raleway text-sm text-[#3a2e1e] font-medium">Collections</span>
          </motion.div>
          
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#b8862a]" />
              <Sparkles size={20} className="text-[#b8862a]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#b8862a]" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-cormorant text-5xl sm:text-6xl lg:text-7xl font-bold text-[#3a2e1e] tracking-tight"
            >
              Our Collections
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-raleway text-lg text-[#9a8060] mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Discover masterpieces crafted with passion, where every piece tells a story of heritage and elegance
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-8 sm:gap-12 mt-10"
            >
              <div className="text-center">
                <p className="font-cormorant text-3xl font-bold text-[#b8862a]">500+</p>
                <p className="font-raleway text-xs text-[#9a8060] tracking-wide mt-1">DESIGNS</p>
              </div>
              <div className="h-10 w-px bg-[rgba(184,134,42,0.3)]" />
              <div className="text-center">
                <p className="font-cormorant text-3xl font-bold text-[#b8862a]">22KT</p>
                <p className="font-raleway text-xs text-[#9a8060] tracking-wide mt-1">GOLD</p>
              </div>
              <div className="h-10 w-px bg-[rgba(184,134,42,0.3)]" />
              <div className="text-center">
                <p className="font-cormorant text-3xl font-bold text-[#b8862a]">BIS</p>
                <p className="font-raleway text-xs text-[#9a8060] tracking-wide mt-1">HALLMARK</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Gold Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b8862a]/30 to-transparent" />
      </section>

      {/* ── CATEGORY IMAGE GRID ── */}
      <section className="py-12 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <p className="font-cinzel text-xs tracking-[0.25em] text-[#b8862a] mb-2">BROWSE BY</p>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#3a2e1e]">Shop Categories</h2>
            <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#b8862a] to-transparent" />
          </motion.div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(cat.name)}
                className="group relative flex flex-col items-center gap-2 focus:outline-none"
              >
                {/* Image circle */}
                <div className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md ${
                  activeTab === cat.name
                    ? 'border-[#b8862a] shadow-[0_0_0_3px_rgba(184,134,42,0.25)]'
                    : 'border-transparent group-hover:border-[#b8862a]/50'
                }`}>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    /* "All" tile — decorative gold gradient */
                    <div className="w-full h-full bg-gradient-to-br from-[#b8862a] via-[#d4a843] to-[#8b6014] flex items-center justify-center">
                      <span className="font-cormorant text-white text-3xl font-bold">✦</span>
                    </div>
                  )}
                  {/* dark overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* active gold ring overlay */}
                  {activeTab === cat.name && (
                    <div className="absolute inset-0 bg-[#b8862a]/15" />
                  )}
                </div>

                {/* Label */}
                <span className={`font-cinzel text-[10px] sm:text-xs tracking-[0.12em] text-center leading-tight transition-colors duration-200 ${
                  activeTab === cat.name ? 'text-[#b8862a] font-bold' : 'text-[#3a2e1e] group-hover:text-[#b8862a]'
                }`}>
                  {cat.name.toUpperCase()}
                </span>

                {/* active dot */}
                {activeTab === cat.name && (
                  <motion.div
                    layoutId="activeCatDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#b8862a]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Results count */}
          <div className="mt-8 flex items-center justify-between border-t border-[rgba(184,134,42,0.15)] pt-5">
            <p className="font-raleway text-sm text-[#9a8060]">
              Showing <span className="font-semibold text-[#3a2e1e]">{filteredProducts.length}</span> pieces
              {activeTab !== 'All' && <span> in <span className="text-[#b8862a] font-medium">{activeTab}</span></span>}
            </p>
            {activeTab !== 'All' && (
              <button onClick={() => setActiveTab('All')} className="font-raleway text-xs text-[#b8862a] hover:underline flex items-center gap-1">
                <X size={12} /> Clear filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(58,46,30,0.06)] group-hover:shadow-[0_20px_50px_rgba(58,46,30,0.12)] transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#3a2e1e]/70 via-[#3a2e1e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-block bg-[#b8862a] text-white font-cinzel text-[10px] tracking-[0.1em] px-3 py-1.5 rounded-full shadow-lg">
                            ★ FEATURED
                          </span>
                        </div>
                      )}
                      
                      {/* Tag Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-[#1a0f05]/80 backdrop-blur-sm text-[#d4a843] font-cinzel text-[10px] tracking-[0.12em] px-3 py-1.5 rounded-full">
                          {product.tag}
                        </span>
                      </div>
                      
                      {/* Quick View */}
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <div className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-[#3a2e1e] py-3 rounded-xl font-raleway text-sm font-medium shadow-lg">
                          <span>View Details</span>
                          <ArrowRight size={16} className="text-[#b8862a]" />
                        </div>
                      </div>
                      
                      {/* Gold Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#d4a843] to-[#b8862a] transform rotate-45 translate-x-14 -translate-y-14 opacity-20" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#b8862a]" />
                        <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#b8862a]">
                          {product.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e] group-hover:text-[#b8862a] transition-colors">
                        {product.name}
                      </h3>
                      <p className="font-raleway text-sm text-[#9a8060] mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Bottom Line */}
                      <div className="mt-4 h-px bg-gradient-to-r from-[#b8862a]/40 via-[#b8862a]/10 to-transparent" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-cormorant text-2xl text-[#3a2e1e]">No products found in this category</p>
              <button
                onClick={() => setActiveTab('All')}
                className="mt-4 font-raleway text-sm text-[#b8862a] hover:underline"
              >
                View all products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1a0f05] to-[#2a1a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles size={32} className="text-[#d4a843] mx-auto mb-4" />
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-white">
              Can't Find What You're Looking For?
            </h2>
            <p className="font-raleway text-lg text-white/70 mt-4">
              We offer custom jewellery design services. Let us create your dream piece.
            </p>
            <a
              href="https://wa.me/918377911745?text=${encodeURIComponent('Hello! I would like to enquire about custom jewellery design.')}'"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b8862a] to-[#8b6014] text-white px-8 py-4 rounded-full font-raleway font-medium mt-8 shadow-lg hover:shadow-xl hover:shadow-[#b8862a]/20 transition-all duration-300 hover:-translate-y-1"
            >
              <span>Enquire Now</span>
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
