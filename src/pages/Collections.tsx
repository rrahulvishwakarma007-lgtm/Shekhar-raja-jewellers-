import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Filter, X } from 'lucide-react';
import ProductModal from '../components/ProductModal';

const tabs = [
  { name: 'All', icon: '✦' },
  { name: 'Bridal', icon: '♔' },
  { name: 'Festive', icon: '❖' },
  { name: 'Diamond', icon: '◇' },
  { name: 'Rings', icon: '○' },
  { name: 'Earrings', icon: '◐' },
  { name: 'Necklaces', icon: '◯' },
  { name: 'Bangles', icon: '◉' },
];

const allProducts = [
  { id: 1, name: 'Kundan Bridal Choker', category: 'Bridal', description: 'Exquisite kundan work with meenakari detailing, perfect for the modern bride.', image: '/bridal.png', tag: 'Bestseller', featured: true },
  { id: 2, name: 'Diamond Eternity Band', category: 'Diamond', description: 'A stunning circle of brilliant diamonds symbolizing eternal love.', image: '/band.png', tag: 'Premium' },
  { id: 3, name: 'Antique Gold Jhumkas', category: 'Earrings', description: 'Traditional temple-style jhumkas with intricate peacock motifs.', image: '/antique.png', tag: 'Heritage' },
  { id: 4, name: '22KT Gold Bangles Set', category: 'Bangles', description: 'Set of 4 intricately designed bangles with traditional patterns.', image: '/band.png', tag: 'Classic' },
  { id: 5, name: 'Polki Diamond Ring', category: 'Diamond', description: 'Uncut polki diamonds set in 22KT gold with a classic design.', image: '/band.png', tag: 'Exclusive', featured: true },
  { id: 6, name: 'Temple Gold Haar', category: 'Necklaces', description: 'Traditional temple necklace with goddess motifs and Lakshmi coins.', image: '/temple.png', tag: 'Traditional' },
  { id: 7, name: 'Ruby & Emerald Ring', category: 'Rings', description: 'Stunning cocktail ring with precious gemstones in kundan setting.', image: '/band.png', tag: 'Limited' },
  { id: 8, name: 'Antique Temple Set', category: 'Bridal', description: 'Complete antique temple set with traditional craftsmanship.', image: '/antique.png', tag: 'Trending' },
  { id: 9, name: 'Meenakari Bridal Set', category: 'Bridal', description: 'Colorful meenakari work bridal set with traditional motifs.', image: '/bridal.png', tag: 'Bridal Pick', featured: true },
  { id: 10, name: 'Festive Gold Set', category: 'Festive', description: 'Elegant gold set perfect for festive occasions.', image: '/festive.png', tag: 'Festive' },
  { id: 11, name: 'Diamond Studs', category: 'Earrings', description: 'Classic diamond studs for everyday elegance.', image: '/band.png', tag: 'Everyday' },
  { id: 12, name: 'Gold Kada', category: 'Bangles', description: 'Heavy gold kada with traditional carvings.', image: '/band.png', tag: 'Heritage' },
  { id: 13, name: 'Heritage Necklace', category: 'Necklaces', description: 'Elegant heritage necklace with traditional design.', image: '/temple.png', tag: 'New Arrival' },
  { id: 14, name: 'Solitaire Engagement Ring', category: 'Rings', description: 'Brilliant solitaire in a classic six-prong setting.', image: '/band.png', tag: 'Premium', featured: true },
  { id: 15, name: 'Antique Choker Set', category: 'Festive', description: 'Beautiful antique choker set for festive celebrations.', image: '/antique.png', tag: 'Traditional' },
  { id: 16, name: 'Diamond Hoop Earrings', category: 'Earrings', description: 'Contemporary diamond hoops for modern elegance.', image: '/band.png', tag: 'Trending' },
  { id: 17, name: 'Gold Band Ring', category: 'Rings', description: 'Classic gold band with elegant minimal design.', image: '/band.png', tag: 'Classic' },
  { id: 18, name: 'Diamond Cluster Ring', category: 'Diamond', description: 'Beautiful cluster of diamonds in an elegant setting.', image: '/band.png', tag: 'Luxury' },
  { id: 19, name: 'Vintage Diamond Ring', category: 'Rings', description: 'Vintage-inspired design with intricate detailing.', image: '/band.png', tag: 'Vintage' },
];

export default function Collections() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

      {/* Filter Section */}
      <section className="sticky top-[140px] z-30 bg-[#faf7f2]/95 backdrop-blur-md border-y border-[rgba(184,134,42,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Desktop Tabs */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.name)}
                  className={`relative px-5 py-2.5 font-cinzel text-xs tracking-[0.15em] rounded-full transition-all ${
                    activeTab === tab.name
                      ? 'text-white'
                      : 'text-[#3a2e1e] hover:text-[#b8862a]'
                  }`}
                >
                  {activeTab === tab.name && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-gradient-to-r from-[#b8862a] to-[#8b6014] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-sm">{tab.icon}</span>
                    {tab.name}
                  </span>
                </motion.button>
              ))}
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#faf7f2] border border-[rgba(184,134,42,0.3)] rounded-full font-raleway text-sm text-[#3a2e1e]"
            >
              <Filter size={16} />
              <span>{activeTab}</span>
            </button>
            
            {/* Results Count */}
            <p className="font-raleway text-sm text-[#9a8060]">
              <span className="font-semibold text-[#3a2e1e]">{filteredProducts.length}</span> pieces found
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Filters Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#faf7f2] border-b border-[rgba(184,134,42,0.1)] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => {
                      setActiveTab(tab.name);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 font-cinzel text-xs tracking-[0.1em] rounded-full transition-all ${
                      activeTab === tab.name
                        ? 'bg-gradient-to-r from-[#b8862a] to-[#8b6014] text-white'
                        : 'bg-white border border-[rgba(184,134,42,0.2)] text-[#3a2e1e]'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
