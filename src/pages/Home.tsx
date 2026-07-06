import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Download, Smartphone, Tag, Bell, Headphones, Sparkles, Diamond, Crown, Search, MapPin } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        '#FAF6EE',   // light warm cream
  bgCard:    '#FFFFFF',
  bgDeep:    '#F5ECD7',
  gold:      '#B8862A',
  goldDk:    '#8B6014',
  goldLt:    '#D4A843',
  goldPale:  '#F0D080',
  text:      '#2C1A0E',
  textMid:   '#6B4E2A',
  textLight: '#9A7B50',
  border:    'rgba(184,134,42,0.18)',
  borderMd:  'rgba(184,134,42,0.35)',
};

// ── Hero Slides ───────────────────────────────────────────────────────────────
const heroSlides = [
  { id:1, image:'/hero1.jpg',  eyebrow:'New Collection',   title:'Diamond',  accent:'Rings',     subtitle:'Celebrate your eternal bond with handcrafted masterpieces',    category:'Rings'    },
  { id:2, image:'/hero2.jpg',  eyebrow:'Bridal Heritage',  title:'Bridal',   accent:'Necklaces', subtitle:'Make your special day unforgettable with our bridal treasures', category:'Bridal'   },
  { id:3, image:'/hero3.jpg',  eyebrow:'Timeless Beauty',  title:'Gold',     accent:'Earrings',  subtitle:'Elegant designs that complement every occasion with grace',      category:'Earrings' },
  { id:4, image:'/hero4.jpg',  eyebrow:'Traditional Art',  title:'Gold',     accent:'Bangles',   subtitle:'Traditional craftsmanship meets contemporary design excellence', category:'Bangles'  },
];

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { name:'Antique',      image:'/antique2.jpg'  },
  { name:'Necklaces',    image:'/necklace1.jpg' },
  { name:'Earrings',     image:'/earring1.jpg'  },
  { name:'Bangles',      image:'/bangle1.png'   },
  { name:"Men's Ring",   image:'/ring7.png'     },
  { name:'Pendants',     image:'/pendant.png'   },
  { name:"Women's Ring", image:'/ring2.png'     },
  { name:'Chains',       image:'/chain2.png'    },
  { name:'Chokers',      image:'/antique3.jpg'  },
];

// ── Collections ───────────────────────────────────────────────────────────────
const collections = [
  { id:1, name:'Maharani Bridal Set', category:'Bridal',  image:'/necklace88.png', featured:true  },
  { id:2, name:'Diamond Ring',        category:'Diamond', image:'/ring1.png',      featured:false },
  { id:3, name:'Temple Gold Necklace',category:'Temple',  image:'/temple.png',     featured:false },
];

// ── Products ──────────────────────────────────────────────────────────────────
const products = [
  { id:1, name:'Bridal Chain',           category:'Bridal',   description:'Exquisite kundan work with meenakari detailing, perfect for the modern bride.',   image:'/bridal.png',     tag:'Bestseller' },
  { id:2, name:'Diamond Eternity Ring',  category:'Diamond',  description:'A stunning circle of brilliant diamonds symbolizing eternal love.',                image:'/ring6.png',      tag:'Premium'    },
  { id:3, name:'Antique Gold Jhumkas',   category:'Earrings', description:'Traditional temple-style jhumkas with intricate peacock motifs.',                  image:'/earrings13.png', tag:'Heritage'   },
  { id:4, name:'22KT Gold Bangles Set',  category:'Bangles',  description:'Set of 4 intricately designed bangles with traditional patterns.',                 image:'/bangle5.png',    tag:'Classic'    },
  { id:5, name:'Polki Diamond Ring',     category:'Rings',    description:'Uncut polki diamonds set in 22KT gold with a classic design.',                    image:'/ring7.png',      tag:'Exclusive'  },
  { id:6, name:'Temple Gold Haar',       category:'Necklaces',description:'Traditional temple necklace with goddess motifs and Lakshmi coins.',              image:'/necklace88.png', tag:'Traditional'},
  { id:7, name:'Antique Earrings Set',   category:'Antique',  description:'Exquisite antique finish jewellery with traditional craftsmanship.',               image:'/earring5.jpg',   tag:'Limited'    },
  { id:8, name:'Festive Gold Set',       category:'Festive',  description:'Elegant gold set perfect for festive occasions and celebrations.',                  image:'/chain4.png',     tag:'Trending'   },
];

// ── Trust items ───────────────────────────────────────────────────────────────
const trustItems = [
  { icon:'✓', title:'Hallmark Certified', desc:'BIS Hallmark on all gold jewellery'   },
  { icon:'♦', title:'Bridal Specialist',  desc:'35+ years of bridal expertise'         },
  { icon:'⬡', title:'Two Showrooms',      desc:'Conveniently located in Jabalpur'      },
  { icon:'◈', title:'WA Support',         desc:'Instant WhatsApp assistance'           },
];

// ── Promo banners ──────────────────────────────────────────────────────────────
const promoBanners = [
  { label:'0% Deduction on Old Gold Exchange', img:'/hero2.jpg',  cta:'Exchange Now' },
  { label:'Flat 9% Off Making Charges',        img:'/hero1.jpg',  cta:'Shop Now'     },
];

// ── Video Carousel ─────────────────────────────────────────────────────────────
const VIDEOS = ['/video1.mp4','/video2.mp4','/video3.mp4','/video4.mp4','/video5.mp4','/video6.mp4','/video7.mp4'];

function VideoCarousel() {
  const [active, setActive]   = useState(0);
  const videoRefs             = useRef<(HTMLVideoElement | null)[]>([]);
  const itemRefs              = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef              = useRef<HTMLDivElement | null>(null);
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);
  const total                 = VIDEOS.length;

  const goTo = useCallback((idx: number) => setActive(idx), []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive(prev => (prev + 1) % total), 6000);
  }, [total]);

  useEffect(() => { startTimer(); return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, [startTimer]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) { v.currentTime = 0; v.play().catch(() => {}); }
      else { v.pause(); v.currentTime = 0; }
    });
  }, [active]);

  useEffect(() => {
    const track = trackRef.current; const item = itemRefs.current[active];
    if (!track || !item) return;
    const trackRect = track.getBoundingClientRect(); const itemRect = item.getBoundingClientRect();
    track.scrollTo({ left: track.scrollLeft + (itemRect.left - trackRect.left) - trackRect.width / 2 + itemRect.width / 2, behavior:'smooth' });
  }, [active]);

  const handleEnded = () => { startTimer(); setActive(prev => (prev + 1) % total); };

  return (
    <div className="relative">
      <div ref={trackRef} className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-4 px-2" style={{ scrollbarWidth:'none' }}>
        {VIDEOS.map((src, i) => {
          const isActive = i === active;
          return (
            <motion.div key={i} ref={(el: HTMLDivElement | null) => { itemRefs.current[i] = el; }}
              onClick={() => { goTo(i); startTimer(); }}
              animate={{ scale: isActive ? 1.08 : 0.88, opacity: isActive ? 1 : 0.55 }}
              transition={{ type:'spring', stiffness:300, damping:28 }}
              className={`relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden ${isActive ? 'w-52 sm:w-64 h-80 sm:h-96 ring-2 ring-[#d4a843] shadow-[0_0_40px_rgba(212,168,67,0.35)]' : 'w-36 sm:w-44 h-60 sm:h-72'}`}
              style={{ transition:'width 0.4s ease, height 0.4s ease' }}>
              <video ref={el => { videoRefs.current[i] = el; }} src={src} muted playsInline loop={false}
                     onEnded={isActive ? handleEnded : undefined} className="w-full h-full object-cover" />
              {!isActive && <div className="absolute inset-0 bg-[#0d0800]/50" />}
              {isActive && <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05]/70 via-transparent to-transparent pointer-events-none" />}
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-white ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <span className="font-cinzel text-[10px] tracking-[0.15em] text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8">
        {VIDEOS.map((_, i) => (
          <button key={i} onClick={() => { goTo(i); startTimer(); }}
                  className={`rounded-full transition-all duration-300 ${i === active ? 'w-8 h-2 bg-[#d4a843]' : 'w-2 h-2 bg-white/25 hover:bg-white/50'}`} />
        ))}
      </div>
      <div className="mt-4 mx-auto max-w-xs h-px bg-white/10 rounded-full overflow-hidden">
        <motion.div key={active} className="h-full bg-gradient-to-r from-[#b8862a] to-[#d4a843]"
                    initial={{ width:'0%' }} animate={{ width:'100%' }} transition={{ duration:6, ease:'linear' }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [currentSlide, setCurrentSlide]     = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [promoBanner, setPromoBanner]        = useState(0);
  const [searchQuery, setSearchQuery]        = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setPromoBanner(p => (p + 1) % promoBanners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(p => (p + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(p => (p - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div style={{ background: C.bg }}>

      {/* ══ GOLD TICKER ══ */}
      <div className="overflow-hidden mt-20" style={{ background: C.gold, padding:'10px 0' }}>
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-6">
              <span className="font-cinzel text-xs tracking-[0.2em] text-white">BIS HALLMARK</span>
              <span style={{ color: C.goldPale }}>◆</span>
              <span className="font-cinzel text-xs tracking-[0.2em] text-white">TRUSTED SINCE 1987</span>
              <span style={{ color: C.goldPale }}>◆</span>
              <span className="font-cinzel text-xs tracking-[0.2em] text-white">22K GOLD</span>
              <span style={{ color: C.goldPale }}>◆</span>
              <span className="font-cinzel text-xs tracking-[0.2em] text-white">DIAMOND JEWELLERY</span>
              <span style={{ color: C.goldPale }}>◆</span>
              <span className="font-cinzel text-xs tracking-[0.2em] text-white">WHATSAPP ENQUIRY</span>
              <span style={{ color: C.goldPale }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          HERO — CaratLane style: light bg, search, category row, promo
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, paddingBottom: 0 }}>

        {/* ── TOP NAV INFO BAR ── */}
        <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-3"
             style={{ borderBottom:`1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <MapPin size={14} style={{ color: C.gold }} />
            <span className="font-raleway text-sm" style={{ color: C.textMid }}>
              Delivering to <span style={{ color: C.gold }} className="font-semibold">Jabalpur · 482002</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-cinzel text-[10px] tracking-[0.25em]" style={{ color: C.textLight }}>EST. 1987</span>
            <span className="font-cinzel text-[10px] tracking-[0.25em]" style={{ color: C.textLight }}>BIS HALLMARK</span>
            <span className="font-cinzel text-[10px] tracking-[0.25em]" style={{ color: C.textLight }}>22K GOLD</span>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.textLight }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Price, Jewellery, Category..."
              className="w-full pl-11 pr-5 py-3.5 rounded-full font-raleway text-sm outline-none transition-all"
              style={{
                background: '#fff',
                border: `1.5px solid ${C.borderMd}`,
                color: C.text,
                boxShadow: '0 2px 12px rgba(184,134,42,0.08)',
              }}
              onFocus={e => e.target.style.boxShadow = `0 0 0 2px rgba(184,134,42,0.25)`}
              onBlur={e => e.target.style.boxShadow = '0 2px 12px rgba(184,134,42,0.08)'}
            />
          </div>
        </div>

        {/* ── CATEGORY ROW (CaratLane squares) ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2" style={{ scrollbarWidth:'none' }}>
            {categories.map((cat, i) => (
              <Link key={cat.name} to="/collections"
                    className="flex-shrink-0 flex flex-col items-center gap-2 group">
                <motion.div
                  initial={{ opacity:0, y:16 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    width: 90, height: 90,
                    border: `1.5px solid ${C.border}`,
                    boxShadow: '0 2px 10px rgba(184,134,42,0.08)',
                  }}
                  whileHover={{ scale:1.05, boxShadow:`0 6px 20px rgba(184,134,42,0.2)` }}>
                  <img src={cat.image} alt={cat.name}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* subtle gold overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{ background:'linear-gradient(to bottom, transparent 40%, rgba(184,134,42,0.25) 100%)' }} />
                </motion.div>
                <span className="font-raleway text-xs font-medium text-center whitespace-nowrap transition-colors"
                      style={{ color: C.textMid }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                      onMouseLeave={e => (e.currentTarget.style.color = C.textMid)}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── PROMO HERO BANNER (auto-rotating) ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <div className="relative rounded-3xl overflow-hidden" style={{ height: 340 }}>
            <AnimatePresence mode="wait">
              {promoBanners.map((banner, i) =>
                i === promoBanner && (
                  <motion.div key={i} className="absolute inset-0"
                    initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
                    transition={{ duration:0.6, ease:'easeInOut' }}>
                    <img src={banner.img} alt={banner.label} className="w-full h-full object-cover" />
                  </motion.div>
                )
              )}
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {promoBanners.map((_, i) => (
                <button key={i} onClick={() => setPromoBanner(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: i === promoBanner ? 28 : 8, height:8,
                                 background: i === promoBanner ? C.gold : 'rgba(184,134,42,0.3)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM NAV TABS (CaratLane style) ── */}
        <div style={{ background:'#fff', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto" style={{ scrollbarWidth:'none' }}>
              {['Category','New Arrivals','Bestsellers','Bridal','Diamond','Festive'].map((tab, i) => (
                <Link key={tab} to="/collections"
                      className="flex-shrink-0 flex items-center gap-1.5 px-6 py-3.5 font-cinzel text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors border-b-2"
                      style={{ color: i === 0 ? C.gold : C.textLight,
                               borderBottomColor: i === 0 ? C.gold : 'transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
                      onMouseLeave={e => { e.currentTarget.style.color = i === 0 ? C.gold : C.textLight; }}>
                  {i === 1 && <Sparkles size={11} style={{ color: C.goldLt }} />}
                  {i === 2 && <Crown size={11} style={{ color: C.goldLt }} />}
                  {i === 3 && <Diamond size={11} style={{ color: C.goldLt }} />}
                  {tab}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </section>
      {/* ══ END HERO ══ */}


      {/* ══ FEATURED COLLECTIONS ══ */}
      <section className="py-20 relative overflow-hidden" style={{ background: C.bgDeep }}>
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage:`repeating-linear-gradient(45deg, ${C.gold} 0, ${C.gold} 1px, transparent 0, transparent 50%)`, backgroundSize:'24px 24px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12" style={{ background:`linear-gradient(to right, transparent, ${C.gold})` }} />
              <Crown size={14} style={{ color: C.gold }} />
              <span className="font-cinzel text-[10px] tracking-[0.35em]" style={{ color: C.gold }}>FEATURED</span>
              <Crown size={14} style={{ color: C.gold }} />
              <div className="h-px w-12" style={{ background:`linear-gradient(to left, transparent, ${C.gold})` }} />
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-light" style={{ color: C.text }}>
              Our <em className="italic" style={{ color: C.gold }}>Signature</em> Pieces
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col, i) => (
              <motion.div key={col.id} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                          transition={{ delay: i*0.1 }} viewport={{ once:true }}
                          className="group rounded-2xl overflow-hidden cursor-pointer"
                          style={{ background:'#fff', border:`1px solid ${C.border}`, boxShadow:'0 4px 20px rgba(44,26,14,0.08)' }}
                          whileHover={{ y:-6, boxShadow:'0 16px 40px rgba(44,26,14,0.15)' }}>
                <div className="relative overflow-hidden" style={{ height: col.featured ? 320 : 240 }}>
                  <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                       style={{ background:'linear-gradient(to top, rgba(44,26,14,0.5) 0%, transparent 60%)' }} />
                  {col.featured && (
                    <div className="absolute top-4 left-4 font-cinzel text-[9px] tracking-[0.15em] px-3 py-1.5 rounded-full"
                         style={{ background: C.gold, color:'#fff' }}>FEATURED</div>
                  )}
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-cinzel text-[9px] tracking-[0.2em] mb-1" style={{ color: C.gold }}>{col.category.toUpperCase()}</p>
                    <h3 className="font-cormorant text-xl font-semibold" style={{ color: C.text }}>{col.name}</h3>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                       style={{ background:`rgba(184,134,42,0.1)`, border:`1px solid ${C.border}` }}>
                    <ArrowRight size={14} style={{ color: C.gold }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VIDEO CAROUSEL ══ */}
      <section className="py-20 relative overflow-hidden" style={{ background:'#1a0f05' }}>
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,134,42,0.15) 0%, transparent 70%)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
            <span className="font-cinzel text-[10px] tracking-[0.4em] block mb-4" style={{ color: C.gold }}>EXPLORE</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-light text-white">
              Our <em className="italic" style={{ color: C.goldLt }}>Jewellery</em> Reels
            </h2>
          </motion.div>
          <VideoCarousel />
        </div>
      </section>

      {/* ══ PRODUCTS GRID ══ */}
      <section className="py-20" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12" style={{ background:`linear-gradient(to right, transparent, ${C.gold})` }} />
              <Diamond size={14} style={{ color: C.gold }} />
              <span className="font-cinzel text-[10px] tracking-[0.35em]" style={{ color: C.gold }}>COLLECTION</span>
              <Diamond size={14} style={{ color: C.gold }} />
              <div className="h-px w-12" style={{ background:`linear-gradient(to left, transparent, ${C.gold})` }} />
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-light" style={{ color: C.text }}>
              Crafted in <em className="italic" style={{ color: C.gold }}>Gold</em>
            </h2>
            <p className="font-raleway text-sm mt-4 max-w-xl mx-auto" style={{ color: C.textLight }}>
              Discover our curated pieces, each a masterpiece of 22KT craftsmanship
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                          transition={{ delay: i*0.08 }} viewport={{ once:true }}
                          onClick={() => setSelectedProduct(product)}
                          className="group rounded-2xl overflow-hidden cursor-pointer"
                          style={{ background:'#fff', border:`1px solid ${C.border}`, boxShadow:'0 4px 16px rgba(44,26,14,0.07)' }}
                          whileHover={{ y:-5, boxShadow:'0 14px 36px rgba(44,26,14,0.14)' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio:'1/1' }}>
                  <img src={product.image} alt={product.name}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                       style={{ background:'linear-gradient(to top, rgba(44,26,14,0.55) 0%, rgba(44,26,14,0.1) 50%, transparent 100%)' }} />
                  <div className="absolute top-3 left-3">
                    <span className="font-cinzel text-[9px] tracking-[0.1em] px-2.5 py-1 rounded-full"
                          style={{ background:'rgba(44,26,14,0.85)', color: C.goldPale }}>{product.tag}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-400"
                       style={{ transform:'translateY(4px)' }}>
                    <div className="flex items-center justify-between backdrop-blur-md rounded-xl px-3 py-2"
                         style={{ background:'rgba(250,246,238,0.18)', border:'1px solid rgba(250,246,238,0.25)' }}>
                      <span className="font-raleway text-xs text-white">View Details</span>
                      <ArrowRight size={12} style={{ color: C.goldPale }} />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-15">
                    <div className="absolute top-0 right-0 w-20 h-20 rotate-45 translate-x-10 -translate-y-10"
                         style={{ background:`linear-gradient(to br, ${C.goldLt}, ${C.gold})` }} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
                    <span className="font-cinzel text-[9px] tracking-[0.2em]" style={{ color: C.gold }}>
                      {product.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-cormorant text-lg font-semibold leading-tight transition-colors"
                      style={{ color: C.text }}>
                    {product.name}
                  </h3>
                  <p className="font-raleway text-xs leading-relaxed mt-1 line-clamp-2" style={{ color: C.textLight }}>
                    {product.description}
                  </p>
                  <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop:`1px solid ${C.border}` }}>
                    <span className="font-cinzel text-[9px] tracking-[0.12em]" style={{ color: C.textLight }}>ENQUIRE ON WHATSAPP</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                         style={{ background:`rgba(184,134,42,0.1)`, border:`1px solid ${C.border}` }}>
                      <ArrowRight size={10} style={{ color: C.gold }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ delay:0.4 }} viewport={{ once:true }}
                      className="text-center mt-12">
            <Link to="/collections"
                  className="inline-flex items-center gap-3 text-white px-10 py-4 rounded-full font-raleway font-medium shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{ background:`linear-gradient(to right, ${C.gold}, ${C.goldDk})`, boxShadow:`0 6px 24px rgba(184,134,42,0.3)` }}>
              <span>View All Collection</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ APP PROMO ══ */}
      <section className="py-20 relative overflow-hidden" style={{ background:'#1a0f05' }}>
        <div className="absolute inset-0" style={{ background:`linear-gradient(to right, rgba(184,134,42,0.1), transparent)` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                   style={{ background:'rgba(184,134,42,0.2)' }}>
                <Smartphone size={18} style={{ color: C.goldLt }} />
                <span className="font-raleway text-sm" style={{ color: C.goldLt }}>Now on Android</span>
              </div>
              <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-white">Download Our App</h2>
              <p className="font-raleway text-lg mt-4" style={{ color:'rgba(255,255,255,0.7)' }}>
                Browse our entire collection, check gold rates, and get exclusive offers right on your phone.
              </p>
              <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                {[{icon:<Tag size={16}/>, label:'Catalogue'},{icon:<Bell size={16}/>, label:'Gold Rate'},{icon:<Headphones size={16}/>, label:'WA Support'}].map((f,i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background:'rgba(255,255,255,0.1)' }}>
                    <span style={{ color: C.goldLt }}>{f.icon}</span>
                    <span className="font-raleway text-sm text-white">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                <Link to="/app" className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-raleway font-medium transition-colors"
                      style={{ background: C.gold }}>
                  <Download size={18} /> Download APK
                </Link>
                <a href="https://wa.me/918377911745?text=Please%20send%20me%20the%20SRJ%20app%20download%20link"
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-raleway font-medium transition-colors"
                   style={{ background:'#25D366' }}>
                  <MessageCircle size={18} /> Get Link on WA
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] rounded-[3rem] border-4 p-3 shadow-2xl"
                     style={{ background:'linear-gradient(to bottom, #2a1a0a, #1a0f05)', borderColor:'#3a2e1e' }}>
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden" style={{ background: C.bg }}>
                    <div className="py-4 px-6 text-center" style={{ background: C.gold }}>
                      <span className="font-cinzel text-xs tracking-[0.2em] text-white">SHEKHAR RAJA</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {[20, 24, 16].map((w, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="h-3 rounded mb-2" style={{ width:`${w * 4}px`, background: C.gold }} />
                          <div className="h-2 w-full bg-gray-200 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full" style={{ background:'#3a2e1e' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══ */}
      <section className="py-20 relative overflow-hidden" style={{ background:'linear-gradient(to right, #faf7f2, #fff, #faf7f2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                          transition={{ delay: i*0.1 }} viewport={{ once:true }}
                          whileHover={{ y:-5 }} className="text-center group">
                <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
                     style={{ background:`linear-gradient(to br, rgba(184,134,42,0.1), rgba(212,168,67,0.1))`,
                              boxShadow:'0 4px 16px rgba(184,134,42,0.1)' }}>
                  <span className="text-3xl" style={{ color: C.gold }}>{item.icon}</span>
                </div>
                <h3 className="font-cormorant text-xl font-semibold group-hover:text-[#b8862a] transition-colors" style={{ color: C.text }}>
                  {item.title}
                </h3>
                <p className="font-raleway text-sm mt-2" style={{ color: C.textLight }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}