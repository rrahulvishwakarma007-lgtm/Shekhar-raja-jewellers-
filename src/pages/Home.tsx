import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Download, Smartphone, Tag, Bell, Headphones, Sparkles, Diamond, Crown } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Google Drive direct URL helper ───────────────────────────────────────────
const gd = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;

// ── Hero slides — DO NOT TOUCH ───────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    image: '/hero1.jpg',
    eyebrow: 'Exquisite Collection',
    title: 'Diamond',
    titleAccent: 'Rings',
    subtitle: 'Celebrate your eternal bond with our handcrafted diamond masterpieces',
    category: 'Rings',
    tagline: 'Where brilliance meets eternity'
  },
  {
    id: 2,
    image: '/hero2.jpg',
    eyebrow: 'Bridal Heritage',
    title: 'Bridal',
    titleAccent: 'Necklaces',
    subtitle: 'Make your special day unforgettable with our exquisite bridal collections',
    category: 'Bridal',
    tagline: 'For your most precious moments'
  },
  {
    id: 3,
    image: '/hero3.jpg',
    eyebrow: 'Timeless Beauty',
    title: 'Gold',
    titleAccent: 'Earrings',
    subtitle: 'Elegant designs that complement every occasion with timeless grace',
    category: 'Earrings',
    tagline: 'Elegance in every detail'
  },
  {
    id: 4,
    image: '/hero4.jpg',
    eyebrow: 'Traditional Art',
    title: 'Gold',
    titleAccent: 'Bangles',
    subtitle: 'Traditional craftsmanship meets contemporary design excellence',
    category: 'Bangles',
    tagline: 'Heritage reimagined'
  }
];

// ── Categories — updated with Google Drive images ────────────────────────────
const categories = [
  { name: 'Bridal',     image: gd('1gjyEU0uPpfHKiuvoTfR847mkr2J5LHqW') },  // necklace 3
  { name: 'Festive',    image: gd('1ZYL2io58ZBM3Zj5TUb29yZzIZCBpERVp') },  // necklace 4
  { name: 'Dailywear',  image: gd('1uFouP3vJqRn3xg0_-XaYF5WstCjDmoOK') },  // chain 1
  { name: 'Necklaces',  image: gd('178WZEQ5UhlSu0NJ2D7buXiBFyhRXd0TN') },  // necklace 1
  { name: 'Earrings',   image: gd('1rz-e2uhRWYQsOyEJG_O0B3dekF0kpu43') },  // earring 1
  { name: 'Bangles',    image: gd('1bOjrDufMVW8WSHXRVaWvwSgaFVrNPafB') },  // bangle 1
  { name: 'Rings',      image: gd('1IB_iNGjIlPQl2h4rqNfypU-Uqtrl2egk') },  // ring 1
  { name: 'Pendants',   image: gd('1MGHQ9y1ZwLSZFwyWzqPLMy4s2u0s4YCw') },  // necklace 5
  { name: 'Diamond',    image: gd('1quBTTS1bwijG-XAoT_7RLfQqBgk3kp_W') },  // ring 4
  { name: 'Chains',     image: gd('1Js6g0OUeKC8dNVhqHczaP0XhjcYn6cgP') },  // chain 2
  { name: 'Antique',    image: gd('1VpZkJ5u7IVaj3ifTBMbHC2IJsvCCh-qh') },  // earring 4
  { name: 'Temple',     image: gd('1etFrF2xVdxtcEYDZkAPD4NNZwNGkUmWN') },  // necklace 2
];

// ── Collections — updated with Google Drive images ───────────────────────────
const collections = [
  {
    id: 1,
    name: 'Maharani Bridal Set',
    category: 'Bridal',
    image: gd('1gjyEU0uPpfHKiuvoTfR847mkr2J5LHqW'),   // necklace 3 — bridal style
    featured: true
  },
  {
    id: 2,
    name: 'Diamond Eternity Band',
    category: 'Diamond',
    image: gd('1quBTTS1bwijG-XAoT_7RLfQqBgk3kp_W'),   // ring 4
    featured: false
  },
  {
    id: 3,
    name: 'Temple Gold Necklace',
    category: 'Temple',
    image: gd('178WZEQ5UhlSu0NJ2D7buXiBFyhRXd0TN'),   // necklace 1
    featured: false
  }
];

// ── Products — updated with Google Drive images ───────────────────────────────
const products = [
  {
    id: 1,
    name: 'Kundan Bridal Choker',
    category: 'Bridal',
    description: 'Exquisite kundan work with meenakari detailing, perfect for the modern bride.',
    image: gd('1gjyEU0uPpfHKiuvoTfR847mkr2J5LHqW'),   // necklace 3 — bridal
    tag: 'Bestseller'
  },
  {
    id: 2,
    name: 'Diamond Eternity Band',
    category: 'Diamond',
    description: 'A stunning circle of brilliant diamonds symbolizing eternal love.',
    image: gd('1quBTTS1bwijG-XAoT_7RLfQqBgk3kp_W'),   // ring 4
    tag: 'Premium'
  },
  {
    id: 3,
    name: 'Antique Gold Jhumkas',
    category: 'Earrings',
    description: 'Traditional temple-style jhumkas with intricate peacock motifs.',
    image: gd('1rz-e2uhRWYQsOyEJG_O0B3dekF0kpu43'),   // earring 1
    tag: 'Heritage'
  },
  {
    id: 4,
    name: '22KT Gold Bangles Set',
    category: 'Bangles',
    description: 'Set of 4 intricately designed bangles with traditional patterns.',
    image: gd('1bOjrDufMVW8WSHXRVaWvwSgaFVrNPafB'),   // bangle 1
    tag: 'Classic'
  },
  {
    id: 5,
    name: 'Polki Diamond Ring',
    category: 'Rings',
    description: 'Uncut polki diamonds set in 22KT gold with a classic design.',
    image: gd('1IB_iNGjIlPQl2h4rqNfypU-Uqtrl2egk'),   // ring 1
    tag: 'Exclusive'
  },
  {
    id: 6,
    name: 'Temple Gold Haar',
    category: 'Necklaces',
    description: 'Traditional temple necklace with goddess motifs and Lakshmi coins.',
    image: gd('178WZEQ5UhlSu0NJ2D7buXiBFyhRXd0TN'),   // necklace 1
    tag: 'Traditional'
  },
  {
    id: 7,
    name: 'Antique Temple Set',
    category: 'Antique',
    description: 'Exquisite antique finish temple jewellery with traditional craftsmanship.',
    image: gd('1VpZkJ5u7IVaj3ifTBMbHC2IJsvCCh-qh'),   // earring 4
    tag: 'Limited'
  },
  {
    id: 8,
    name: 'Festive Gold Set',
    category: 'Festive',
    description: 'Elegant gold set perfect for festive occasions and celebrations.',
    image: gd('1ZYL2io58ZBM3Zj5TUb29yZzIZCBpERVp'),   // necklace 4
    tag: 'Trending'
  }
];

// Trust items
const trustItems = [
  { icon: '✓', title: 'Hallmark Certified', desc: 'BIS Hallmark on all gold jewellery' },
  { icon: '♦', title: 'Bridal Specialist', desc: '35+ years of bridal expertise' },
  { icon: '⬡', title: 'Two Showrooms', desc: 'Conveniently located in Jabalpur' },
  { icon: '◈', title: 'WA Support', desc: 'Instant WhatsApp assistance' }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div>
      {/* Gold Ticker */}
      <div className="bg-[#b8862a] py-3 overflow-hidden mt-20">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="font-cinzel text-sm tracking-[0.2em] text-white">BIS HALLMARK</span>
              <span className="text-[#d4a843]">◆</span>
              <span className="font-cinzel text-sm tracking-[0.2em] text-white">TRUSTED</span>
              <span className="text-[#d4a843]">◆</span>
              <span className="font-cinzel text-sm tracking-[0.2em] text-white">22K GOLD</span>
              <span className="text-[#d4a843]">◆</span>
              <span className="font-cinzel text-sm tracking-[0.2em] text-white">DIAMOND JEWELLERY</span>
              <span className="text-[#d4a843]">◆</span>
              <span className="font-cinzel text-sm tracking-[0.2em] text-white">WHATSAPP ENQUIRY</span>
              <span className="text-[#d4a843]">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Slider — UNCHANGED */}
      <section className="relative h-[85vh] sm:h-[90vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, index) => (
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30">
          <button
            onClick={prevSlide}
            className="group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft size={24} className="text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30">
          <button
            onClick={nextSlide}
            className="group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight size={24} className="text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-[#d4a843] w-12'
                      : 'bg-white/40 w-8 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Circles */}
      <section className="py-20 bg-gradient-to-b from-[#faf7f2] to-[#f5efe6] relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#b8862a]/5 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#d4a843]/5 rounded-full blur-3xl animate-morph" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8862a]" />
              <Diamond size={16} className="text-[#b8862a]" />
              <span className="font-cinzel text-xs tracking-[0.3em] text-[#b8862a]">EXPLORE</span>
              <Diamond size={16} className="text-[#b8862a]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8862a]" />
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-[#3a2e1e]">
              Shop by Category
            </h2>
            <p className="font-raleway text-[#9a8060] mt-4 max-w-xl mx-auto">
              Discover our curated collections, each piece a masterpiece of craftsmanship
            </p>
          </motion.div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-6 gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 40, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="flex flex-col items-center cursor-pointer group perspective-1000"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4a843] to-[#b8862a] rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative w-28 h-28 rounded-full border-2 border-[#b8862a] overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-[#b8862a]/20 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#d4a843] to-[#b8862a] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                    <Diamond size={10} className="text-white" />
                  </div>
                </div>
                <span className="font-cinzel text-xs tracking-[0.15em] text-[#3a2e1e] mt-4 group-hover:text-[#b8862a] transition-colors duration-300">
                  {cat.name.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="flex gap-8 pb-4">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center flex-shrink-0 group"
                >
                  <div className="relative w-24 h-24 rounded-full border-2 border-[#b8862a] overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                  </div>
                  <span className="font-cinzel text-xs tracking-[0.15em] text-[#3a2e1e] mt-3 group-hover:text-[#b8862a] transition-colors">
                    {cat.name.toUpperCase()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-24 bg-gradient-to-b from-[#e8e0d0] to-[#faf7f2] relative overflow-hidden">
        <div className="absolute top-40 left-20 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-[#d4a843] to-[#b8862a] rounded-full animate-float blur-sm" />
        </div>
        <div className="absolute bottom-40 right-20 w-40 h-40 opacity-15">
          <div className="w-full h-full bg-gradient-to-br from-[#b8862a] to-[#8b6014] rounded-full animate-float-delayed blur-sm" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Crown size={18} className="text-[#b8862a]" />
              <span className="font-cinzel text-xs tracking-[0.3em] text-[#b8862a]">FEATURED</span>
              <Crown size={18} className="text-[#b8862a]" />
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-[#3a2e1e]">
              Featured Collections
            </h2>
            <p className="font-raleway text-[#9a8060] mt-4 max-w-xl mx-auto">
              Handpicked masterpieces that define luxury and elegance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Big Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -12, rotateY: 2, rotateX: 2 }}
              className="bg-[#faf7f2] rounded-3xl overflow-hidden md:row-span-2 cursor-pointer group perspective-1000 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <div className="h-72 md:h-96 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10" />
                  <img
                    src={collections[0].image}
                    alt={collections[0].name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3a2e1e]/40 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#b8862a] text-white font-cinzel text-xs tracking-wider px-4 py-2 rounded-full shadow-lg">
                      ★ FEATURED
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-center bg-gradient-to-b from-[#faf7f2] to-white">
                  <span className="font-cinzel text-xs tracking-[0.2em] text-[#b8862a]">
                    {collections[0].category.toUpperCase()}
                  </span>
                  <h3 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] mt-2 italic">
                    {collections[0].name}
                  </h3>
                  <Link
                    to="/collections"
                    className="flex items-center gap-2 text-[#b8862a] font-raleway text-sm mt-6 group/link"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Small Cards */}
            {collections.slice(1).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50, rotateY: 5 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, rotateY: -2, scale: 1.02 }}
                className="bg-[#faf7f2] rounded-3xl overflow-hidden flex cursor-pointer group perspective-1000 shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <div className="w-[52%] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10" />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="w-[48%] p-6 flex flex-col justify-center">
                  <span className="font-cinzel text-xs tracking-[0.2em] text-[#b8862a]">
                    {item.category.toUpperCase()}
                  </span>
                  <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e] mt-1 italic">
                    {item.name}
                  </h3>
                  <Link
                    to="/collections"
                    className="flex items-center gap-2 text-[#b8862a] font-raleway text-xs mt-4 group/link"
                  >
                    <span>View</span>
                    <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Sparkles size={16} className="text-[#b8862a]" />
              <span className="font-cinzel text-xs tracking-[0.3em] text-[#b8862a]">OUR JEWELLERY</span>
              <Sparkles size={16} className="text-[#b8862a]" />
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-[#3a2e1e]">
              Explore Our Collections
            </h2>
            <p className="font-raleway text-[#9a8060] mt-4 max-w-xl mx-auto">
              Every piece tells a story of craftsmanship and heritage
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-10" />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#b8862a] text-white font-cinzel text-[10px] tracking-wider px-3 py-1 rounded-full">
                      {product.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#b8862a]">
                    {product.category.toUpperCase()}
                  </span>
                  <h3 className="font-cormorant text-lg font-semibold text-[#3a2e1e] mt-1 leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-raleway text-xs text-[#9a8060] mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <button className="mt-4 w-full bg-gradient-to-r from-[#b8862a] to-[#d4a843] text-white font-cinzel text-xs tracking-wider py-2.5 rounded-full hover:shadow-lg hover:shadow-[#b8862a]/30 transition-all duration-300">
                    ENQUIRE NOW
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gradient-to-r from-[#3a2e1e] to-[#1a1008]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl text-[#d4a843] mb-3">{item.icon}</div>
                <h3 className="font-cinzel text-sm text-white tracking-wider mb-2">{item.title}</h3>
                <p className="font-raleway text-xs text-[#9a8060]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
