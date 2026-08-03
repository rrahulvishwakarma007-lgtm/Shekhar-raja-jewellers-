import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Download, Smartphone, Tag, Bell, Headphones, Sparkles, Diamond, Crown, Search, MapPin, Play } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#FFF5F7', // soft blush white
  bgCard: '#FFFFFF',
  bgDeep: '#FFE4EC', // light rose
  gold: '#C2185B', // royal pink (deep rose)
  goldDk: '#880E4F', // dark magenta
  goldLt: '#E91E8C', // bright pink
  goldPale: '#F8BBD9', // pale pink
  goldBg: 'rgba(194,24,91,0.08)',
  text: '#1A0010', // near black with pink tint
  textMid: '#6D1B4E', // deep rose text
  textLight: '#AD6888', // muted rose
  border: 'rgba(194,24,91,0.15)',
  borderMd: 'rgba(194,24,91,0.30)',
  shadow: 'rgba(194,24,91,0.08)',
  goldBorder:'rgba(194,24,91,0.25)',
};

// ── Hero Slides ───────────────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    image: '/hero-1.jpg',
    eyebrow: 'New Collection',
    title: 'Diamond',
    accent: 'Rings',
    subtitle: 'Celebrate your eternal bond with handcrafted masterpieces',
    category: 'Rings',
  },
  {
    id: 2,
    image: '/hero-2.jpg',
    eyebrow: 'Bridal Heritage',
    title: 'Bridal',
    accent: 'Necklaces',
    subtitle: 'Make your special day unforgettable with our bridal treasures',
    category: 'Bridal',
  },
];

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { name:'Antique', image:'/antique2.jpg' },
  { name:'Necklaces', image:'/necklace1.jpg' },
  { name:'Earrings', image:'/earring1.jpg' },
  { name:'Bangles', image:'/bangle1.png' },
  { name:"Men's Ring", image:'/ring7.png' },
  { name:'Pendants', image:'/pendant.png' },
  { name:"Women's Ring", image:'/ring2.png' },
  { name:'Chains', image:'/chain2.png' },
  { name:'Chokers', image:'/antique3.jpg' },
];

// ── Collections ───────────────────────────────────────────────────────────────
const collections = [
  { id:1, name:'Traditional Choker', category:'Bridal', image:'/Choker101.jpg', featured:true },
  { id:2, name:'Classic Earrings', category:'Gold', image:'/earrings101.jpg', featured:false },
  { id:3, name:'Gold Earrings',category:'Earrings', image:'/earrings102.jpg', featured:false },
];

// ── Products ──────────────────────────────────────────────────────────────────
const products = [
  { id:1, name:'Bridal Chain', category:'Bridal', description:'Exquisite kundan work with meenakari detailing, perfect for the modern bride.', image:'/bridal.png', tag:'Bestseller' },
  { id:2, name:'Diamond Eternity Ring', category:'Diamond', description:'A stunning circle of brilliant diamonds symbolizing eternal love.', image:'/ring6.png', tag:'Premium' },
  { id:3, name:'Antique Gold Jhumkas', category:'Earrings', description:'Traditional temple-style jhumkas with intricate peacock motifs.', image:'/earrings13.png', tag:'Heritage' },
  { id:4, name:'22KT Gold Bangles Set', category:'Bangles', description:'Set of 4 intricately designed bangles with traditional patterns.', image:'/bangle5.png', tag:'Classic' },
  { id:5, name:'Polki Diamond Ring', category:'Rings', description:'Uncut polki diamonds set in 22KT gold with a classic design.', image:'/ring7.png', tag:'Exclusive' },
  { id:6, name:'Temple Gold Haar', category:'Necklaces',description:'Traditional temple necklace with goddess motifs and Lakshmi coins.', image:'/necklace88.png', tag:'Traditional'},
  { id:7, name:'Antique Earrings Set', category:'Antique', description:'Exquisite antique finish jewellery with traditional craftsmanship.', image:'/earring5.jpg', tag:'Limited' },
  { id:8, name:'Festive Gold Set', category:'Festive', description:'Elegant gold set perfect for festive occasions and celebrations.', image:'/chain4.png', tag:'Trending' },
];

// ── Trust items ───────────────────────────────────────────────────────────────
const trustItems = [
  { icon:'✓', title:'Hallmark Certified', desc:'BIS Hallmark on all gold jewellery' },
  { icon:'♦', title:'Bridal Specialist', desc:'35+ years of bridal expertise' },
  { icon:'⬡', title:'Two Showrooms', desc:'Conveniently located in Jabalpur' },
  { icon:'◈', title:'WA Support', desc:'Instant WhatsApp assistance' },
];

// ── Promo banners ──────────────────────────────────────────────────────────────
const promoBanners = [
  { label:'0% Deduction on Old Gold Exchange', img:'/hero2.jpg', cta:'Exchange Now' },
  { label:'Flat 9% Off Making Charges', img:'/hero1.jpg', cta:'Shop Now' },
  { label:'Gold Earrings Collection', img:'/slide3.jpg', cta:'Shop Now' },
  { label:'Gold Bangles Collection', img:'/slide4.jpg', cta:'Explore Now' },
  { label:'Royal Necklace Collection', img:'/slide5.jpg', cta:'View Now' },
];

// ── Video Carousel ─────────────────────────────────────────────────────────────
const VIDEOS = ['/video1.mp4','/video2.mp4','/video3.mp4','/video4.mp4','/video5.mp4','/video6.mp4','/video7.mp4'];

function VideoCarousel() {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = VIDEOS.length;

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
      <div ref={trackRef} className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-12 px-6 sm:px-12 scroll-smooth" style={{ scrollbarWidth:'none' }}>
        {VIDEOS.map((src, i) => {
          const isActive = i === active;
          return (
            <div
              key={i}
              ref={(el: HTMLDivElement | null) => { itemRefs.current[i] = el; }}
              onClick={() => { goTo(i); startTimer(); }}
              className={`relative flex-shrink-0 cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 ease-out origin-center ${
                isActive
                  ? 'w-[240px] h-[426px] sm:w-[320px] sm:h-[568px] ring-[3px] ring-[#E91E8C] shadow-[0_0_50px_rgba(233,30,140,0.5)] z-10 scale-100'
                  : 'w-[160px] h-[284px] sm:w-[200px] sm:h-[355px] ring-1 ring-transparent opacity-90 hover:opacity-100 z-0 scale-95 hover:scale-100'
              }`}
            >
              <video
                ref={el => { videoRefs.current[i] = el; }}
                src={src}
                muted playsInline loop={false}
                onEnded={isActive ? handleEnded : undefined}
                className="w-full h-full object-cover"
              />

              {!isActive && (
                <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'rgba(136,14,79,0.7)', mixBlendMode: 'multiply' }} />
              )}
              {!isActive && (
                <div className="absolute inset-0 transition-opacity duration-500" style={{ background: 'rgba(26,0,16,0.2)' }} />
              )}

              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 transition-transform duration-300 group-hover:scale-110">
                    <Play size={20} className="text-white ml-1" fill="white" />
                  </div>
                </div>
              )}

              {isActive && (
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-500" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3)' }} />
              )}

              <div className="absolute bottom-5 left-5">
                <span className={`font-cinzel text-xs tracking-[0.2em] font-bold ${isActive ? 'text-white drop-shadow-md' : 'text-white/60'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3 mt-2">
        {VIDEOS.map((_, i) => (
          <button key={i} onClick={() => { goTo(i); startTimer(); }}
            className={`rounded-full transition-all duration-500 ${i === active ? 'w-10 h-2 bg-[#E91E8C] shadow-[0_0_10px_#E91E8C]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`} />
        ))}
      </div>
    </div>
  );
}

// ── SKELETON PRELOADER ────────────────────────────────────────────────────────
function HomeSkeleton() {
  return (
    <div style={{ background: C.bg }} className="pt-20 min-h-screen">
      <section style={{ paddingBottom: 0 }}>
        {/* Top Nav Skeleton */}
        <div className="hidden md:flex items-center justify-between max-w-7xl mx-auto px-6 py-3" style={{ borderBottom:`1px solid ${C.border}` }}>
          <div className="h-4 w-48 rounded-md animate-pulse" style={{ background: C.goldPale }} />
          <div className="flex gap-6">
            <div className="h-3 w-16 rounded-md animate-pulse" style={{ background: C.goldPale }} />
            <div className="h-3 w-24 rounded-md animate-pulse" style={{ background: C.goldPale }} />
            <div className="h-3 w-20 rounded-md animate-pulse" style={{ background: C.goldPale }} />
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="max-w-2xl mx-auto h-[50px] rounded-full animate-pulse" style={{ background: 'rgba(248,187,217,0.4)' }} />
        </div>

        {/* Category Row Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="flex gap-4 sm:gap-6 overflow-hidden pb-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-[90px] h-[90px] rounded-2xl animate-pulse" style={{ background: 'rgba(248,187,217,0.5)' }} />
                <div className="w-16 h-3 rounded-md animate-pulse" style={{ background: C.goldPale }} />
              </div>
            ))}
          </div>
        </div>

        {/* Promo Banner Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <div className="w-full rounded-3xl h-[300px] sm:h-[400px] md:h-[550px] lg:h-[650px] xl:h-[700px] animate-pulse" style={{ background: 'rgba(248,187,217,0.3)' }} />
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [promoBanner, setPromoBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Preload all banner images immediately on mount & handle skeleton loading
  useEffect(() => {
    const imagePromises = promoBanners.map(banner => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = banner.img;
        img.onload = resolve;
        img.onerror = resolve; // Resolve anyway to avoid blocking on failed images
      });
    });

    // Wait for images to load, with a minimum simulated delay of 800ms to show the smooth skeleton effect
    Promise.all([
      ...imagePromises,
      new Promise(resolve => setTimeout(resolve, 800))
    ]).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't start carousels until loaded
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 4500);
    return () => clearInterval(timer);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return; // Don't start carousels until loaded
    const timer = setInterval(() => setPromoBanner(p => (p + 1) % promoBanners.length), 5000);
    return () => clearInterval(timer);
  }, [isLoading]);

  // Show the beautiful preloader skeleton until images are ready
  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ background: C.bg }} className="pt-20">

      {/* ══════════════════════════════════════════════════════════════
          HERO — CaratLane style: light bg, search, category row, promo
          (UNTOUCHED AS REQUESTED)
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
                boxShadow: `0 2px 12px ${C.shadow}`,
              }}
              onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${C.goldBorder}`}
              onBlur={e => e.target.style.boxShadow = `0 2px 12px ${C.shadow}`}
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
                  className="relative overflow-hidden rounded-2xl bg-white"
                  style={{
                    width: 90, height: 90,
                    border: `1.5px solid ${C.border}`,
                    boxShadow: `0 2px 10px ${C.shadow}`,
                  }}
                  whileHover={{ scale:1.05, boxShadow:`0 6px 20px rgba(194,24,91,0.2)` }}>
                  <img src={cat.image} alt={cat.name}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {/* subtle gold overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{ background:`linear-gradient(to bottom, transparent 40%, ${C.goldBorder} 100%)` }} />
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
          <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[400px] md:h-[550px] lg:h-[650px] xl:h-[700px]" style={{ perspective: 1500, background: C.bgDeep }}>

            {/* Shimmer effect stays active underneath images until they cover it */}
            <div className="absolute inset-0 animate-pulse opacity-50" style={{ background: C.goldPale }} />

            {/* Static fallback for the very first image to ensure instant loading */}
            <img
              src={promoBanners[0].img}
              alt={promoBanners[0].label}
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
              style={{ opacity: promoBanner === 0 ? 1 : 0, transition: 'opacity 0.8s ease' }}
            />

            {/* Render all banners instantly to force immediate browser downloads */}
            {promoBanners.map((banner, i) => (
              i !== 0 && (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    rotateY: i === promoBanner ? 0 : (i < promoBanner ? -90 : 90),
                    opacity: i === promoBanner ? 1 : 0,
                    zIndex: i === promoBanner ? 10 : 0
                  }}
                  style={{ transformOrigin: "left center", backfaceVisibility: "hidden", pointerEvents: i === promoBanner ? 'auto' : 'none' }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                >
                  <img
                    src={banner.img}
                    alt={banner.label}
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
              )
            ))}

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {promoBanners.map((_, i) => (
                <button key={i} onClick={() => setPromoBanner(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: i === promoBanner ? 28 : 8, height:8,
                                 background: i === promoBanner ? C.gold : 'rgba(255,255,255,0.6)' }} />
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

      {/* ══ UPGRADED SLIDING TELEPROMPTER ══ */}
      <div className="w-full relative overflow-hidden shadow-inner flex items-center h-14" style={{ background: `linear-gradient(90deg, ${C.goldDk}, ${C.gold}, ${C.goldDk})` }}>
        <style>{`
          @keyframes scrollText {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .sliding-teleprompter {
            display: flex;
            white-space: nowrap;
            animation: scrollText 120s linear infinite;
            will-change: transform;
          }
        `}</style>
        {/* Soft edge masks for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${C.goldDk}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${C.goldDk}, transparent)` }} />
        
        <div className="sliding-teleprompter font-raleway text-xs md:text-sm font-medium tracking-wider text-white items-center h-full">
          {/* Duplicated for seamless infinite scrolling */}
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 px-4">
              स्वर्ण समृद्धि योजना 10 किस्तें आपकी - 2 किस्तें हमारी अपने सपनों के सोने के आभूषण अब आसान किस्तों में खरीदें ! - योजना की विशेषताएँ ग्राहक केवल 10 मासिक अंतिम 2 किस्तों कुल 12 किस्तों के का भुगतान किस्तें जमा करेगा। शेखर राजा ज्वेलर्स मूल्य का सोने का आभूषण खरीदने अपनी सुविधानुसार मासिक किस्त राशि चुनें।  योजना के नियम एवं शर्तें • योजना की अवधि 12 माह होगी। • ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होगी। • अंतिम 2 किस्तों का लाभ केवल योजना की सभी शर्तें पूरी करने पर मिलेगा। • यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी। • योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा। • नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं। एवं विश्वसनीय योजना SR आज ही जुड़ें और अपने सपनों के गहनों की शुरुआत करें! शेखर राजा ज्वेलर्स + विश्वास शुद्धता गुपावन्ता ज्वेलरी बुकिंग एवं अधिक जानकारी के लिए आज ही हमारे शोरूम पर संपर्क करें +91 98765 43210 www.shekharrjewellers.com Follow us on • सोना सिर्फ आभूषण नहीं, आपके सपनों का निवेश है , जीरो मेकिंग चार्ज योजना 10 किस्तें आपकी - ज़ीरो मेकिंग चार्ज हमारी अपनाएं आज, बचत करें कल, पाएं ज़ीरो मेकिंग चार्ज पर सोने के गहने कल ! 0% योजना की विशेषताऐं 012 ग्राहक केवल 10 मासिक किस्तें जामा करेगा 12 वें माह में ज़ीरो मेकिंग चार्ज का लाभ कुल 12 माह की योजना, आसान मासिक किस्तों में अपनी पसंद के सोने के आभूषण बनवाएं विश्वसनीय योजना, शुद्ध सोना, पूर्ण पारदर्शित उदाहरण यदि आपकी मासिक किस्त ₹5,000 हैं आपकी 10 किस्तें शेखर राजा ज्वेलर्स की ज़ीरो मेकिंग चार्ज | कुल खरीद मूल्य (मेकिंग चार्ज वचत सहित) + ₹50,000 ₹0 ₹50,000 योजना के नियम एवं शर्तें • योजना की अवधि 12 माह होगी। • ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होंगी। • 12वें माह पर शून्य मेकिंग चार्ज का लाभ मिलेगा। • यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी। • योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा। • नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं। बचत, आज, सुनहरा कल SR आज ही जुड़ें और ज़ीरो मेकिंग चार्ज का लाभ उठाएं ६- अपने सपनों के गहनों को और भी खास बनाएं! शेखर राजा ज्वेलर्स विश्वास शुद्धता गुणवत्ता www.shekharrajewellers.com Follow us on f@ स्कैन करें और जुड़ें ज्वेलरी बुकिंग एवं अधिक जानकारी के लिए आज ही हमारे शोरूम पर संपर्क करें +91 98765 43210 • सोना सिर्फ आभूषण नहीं, आपके सपनों का निवेश है
              {/* Add a separator dot between loops */}
              <span className="inline-block w-2 h-2 rounded-full mx-4" style={{ background: C.goldPale }} />
            </span>
          ))}
        </div>
      </div>

      {/* ══ UPGRADED ZERO MAKING PROMO (Split Screen) ══ */}
      <section className="py-20 lg:py-32" style={{ background: C.bgCard }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="flex-1 text-center lg:text-left space-y-6"
            >
              <div className="inline-flex items-center gap-3 mb-2 justify-center lg:justify-start w-full">
                <div className="h-px w-8" style={{ background: C.gold }} />
                <span className="font-cinzel text-[10px] tracking-[0.3em] font-bold" style={{ color: C.gold }}>EXCLUSIVE OFFER</span>
                <div className="h-px w-8 lg:hidden" style={{ background: C.gold }} />
              </div>
              <h2 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: C.text }}>
                Experience True Value with <br/>
                <em className="italic font-light" style={{ color: C.gold }}>Zero Making Charges</em>
              </h2>
              <p className="font-raleway text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: C.textLight }}>
                Elevate your jewelry collection without the extra cost. Enjoy 100% transparency, pristine 22K hallmark gold, and absolutely no making charges on selected breathtaking designs.
              </p>
              <div className="pt-6">
                <Link to="/offer" className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-raleway font-semibold text-white transition-all hover:-translate-y-1 shadow-xl" style={{ background: C.goldDk, boxShadow: `0 10px 30px ${C.shadow}` }}>
                  <span>Explore The Collection</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Video Side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full relative"
            >
              {/* Decorative background accent */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-[2.5rem] opacity-30 blur-2xl" style={{ background: `linear-gradient(45deg, ${C.goldLt}, ${C.goldDk})` }} />
              
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl z-10" style={{ border: `2px solid ${C.goldBorder}` }}>
                <video
                  src="/makingoffer.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,0,16,0.4) 0%, transparent 40%)' }} />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/20 rounded-2xl p-4 flex items-center justify-between border border-white/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Sparkles size={20} style={{ color: C.gold }} />
                    </div>
                    <div>
                      <p className="font-cormorant text-xl font-bold text-white leading-none">0% Deduction</p>
                      <p className="font-raleway text-xs text-white/80 mt-1 font-medium">On Old Gold Exchange</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ UPGRADED FEATURED COLLECTIONS (Bento Box) ══ */}
      <section className="py-24 relative overflow-hidden" style={{ background: C.bgDeep }}>
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage:`radial-gradient(${C.goldDk} 1.5px, transparent 1.5px)`, backgroundSize:'32px 32px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>
              Our Signature <em className="italic font-light" style={{ color: C.gold }}>Curations</em>
            </h2>
            <div className="h-px w-24 mx-auto mt-6" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
            {/* Featured Large Card (Left) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once:true }}
              className="lg:col-span-7 relative rounded-[2rem] overflow-hidden group cursor-pointer h-[400px] lg:h-full shadow-lg"
            >
              <img src={collections[0].image} alt={collections[0].name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-4 py-1.5 rounded-full font-cinzel text-[10px] tracking-widest text-white backdrop-blur-md bg-white/10 border border-white/20 mb-4">
                  FEATURED COLLECTION
                </span>
                <h3 className="font-cormorant text-3xl sm:text-4xl text-white font-bold mb-2">{collections[0].name}</h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="font-raleway text-sm text-white/90">Explore Collection</span>
                  <ArrowRight size={16} className="text-white" />
                </div>
              </div>
            </motion.div>

            {/* Right Stacked Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6 h-full">
              {collections.slice(1).map((col, i) => (
                <motion.div 
                  key={col.id}
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} viewport={{ once:true }}
                  className="flex-1 relative rounded-[2rem] overflow-hidden group cursor-pointer min-h-[250px] shadow-lg"
                >
                  <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <span className="font-cinzel text-[10px] tracking-widest text-white/70 mb-2 uppercase">{col.category}</span>
                    <h3 className="font-cormorant text-2xl text-white font-bold">{col.name}</h3>
                    <div className="w-10 h-10 mt-4 rounded-full backdrop-blur-md bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white transition-colors duration-300">
                      <ArrowRight size={18} className="text-white group-hover:text-black transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ UPGRADED VIDEO CAROUSEL ══ */}
      <section className="py-24 relative overflow-hidden" style={{ background: C.text }}>
        {/* Luxury Glowing Orb Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: C.goldLt }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-12">
            <span className="font-cinzel text-[10px] tracking-[0.4em] block mb-4" style={{ color: C.goldPale }}>IN THE SPOTLIGHT</span>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-light text-white">
              Jewellery In <em className="italic" style={{ color: C.goldLt }}>Motion</em>
            </h2>
          </motion.div>

          <VideoCarousel />
        </div>
      </section>

      {/* ══ UPGRADED PRODUCTS GRID (Staggered Masonry Look) ══ */}
      <section className="py-24" style={{ background: C.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <Diamond size={14} style={{ color: C.gold }} />
                <span className="font-cinzel text-[10px] tracking-[0.35em]" style={{ color: C.gold }}>LATEST ARRIVALS</span>
              </div>
              <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{ color: C.text }}>
                Crafted In <em className="italic font-light" style={{ color: C.gold }}>Gold</em>
              </h2>
            </div>
            <Link to="/collections" className="group flex items-center gap-2 font-raleway font-semibold text-sm pb-1 border-b-2" style={{ color: C.textMid, borderColor: C.goldBorder }}>
              View Complete Collection <ArrowRight size={16} className="transform transition-transform group-hover:translate-x-1" style={{ color: C.gold }} />
            </Link>
          </motion.div>

          {/* Staggered Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, i) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity:0, y:40 }} 
                whileInView={{ opacity:1, y:0 }}
                transition={{ delay: (i % 4) * 0.1 }} 
                viewport={{ once:true }}
                onClick={() => setSelectedProduct(product)}
                // Stagger logic: Push down every even column on large screens
                className={`group cursor-pointer flex flex-col ${i % 2 !== 0 ? 'lg:mt-16' : ''}`}
              >
                {/* Borderless Image Card */}
                <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-md mb-5 bg-white">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Subtle Dark Gradient Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="font-cinzel text-[9px] tracking-[0.15em] px-3 py-1.5 rounded-full backdrop-blur-md bg-white/80 font-bold" style={{ color: C.text }}>
                      {product.tag}
                    </span>
                  </div>

                  {/* Floating Action Button */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out w-[85%]">
                    <div className="w-full py-3 rounded-xl backdrop-blur-lg flex items-center justify-center gap-2 shadow-xl" style={{ background: 'rgba(255,255,255,0.95)' }}>
                      <span className="font-raleway text-xs font-bold" style={{ color: C.text }}>Quick View</span>
                    </div>
                  </div>
                </div>

                {/* Typography underneath */}
                <div className="px-2 text-center">
                  <span className="font-cinzel text-[9px] tracking-[0.2em] mb-2 block" style={{ color: C.textLight }}>
                    {product.category.toUpperCase()}
                  </span>
                  <h3 className="font-cormorant text-xl font-bold leading-tight mb-2" style={{ color: C.text }}>
                    {product.name}
                  </h3>
                  <div className="w-6 h-px mx-auto transition-all duration-300 group-hover:w-12" style={{ background: C.gold }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ UPGRADED APP PROMO (Glassmorphism & Depth) ══ */}
      <section className="py-24 relative overflow-hidden flex items-center min-h-[80vh]" style={{ background: C.text }}>
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30" style={{ background: C.goldDk }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20" style={{ background: C.goldLt }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Glassmorphism Content Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }}
              className="p-8 sm:p-12 rounded-[2rem] backdrop-blur-xl border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border"
                   style={{ background:'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
                <Smartphone size={14} className="text-white" />
                <span className="font-raleway text-xs font-semibold text-white tracking-wide">Available on Android</span>
              </div>
              
              <h2 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Your Personal <br/>
                <em className="italic font-light" style={{ color: C.goldPale }}>Jewellery Concierge</em>
              </h2>
              
              <p className="font-raleway text-white/70 text-lg mb-10 leading-relaxed">
                Unlock exclusive app-only offers, live gold rate updates, and explore our entire heritage collection right from your pocket.
              </p>

              <div className="space-y-4 mb-10">
                {[{icon:<Tag size={18}/>, text:'Browse full 22K catalogue'},{icon:<Bell size={18}/>, text:'Instant daily gold rate alerts'},{icon:<Headphones size={18}/>, text:'Direct WhatsApp priority support'}].map((f,i) => (
                  <div key={i} className="flex items-center gap-4 text-white/90 font-raleway">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      {f.icon}
                    </div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/app" className="flex items-center gap-2 text-black px-8 py-4 rounded-full font-raleway font-bold transition-transform hover:scale-105"
                      style={{ background: C.goldPale }}>
                  <Download size={18} /> Download App
                </Link>
              </div>
            </motion.div>

            {/* Phone Mockup (Floating Animation) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
              className="flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Phone Frame */}
                <div className="w-[300px] h-[600px] rounded-[3rem] border-[8px] p-2 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-20" style={{ background: '#111', borderColor: '#333' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-30" />
                  
                  {/* Phone Screen */}
                  <div className="w-full h-full rounded-[2.2rem] overflow-hidden relative flex flex-col" style={{ background: C.bg }}>
                    <div className="pt-10 pb-4 px-6 text-center shadow-md relative z-20" style={{ background: C.gold }}>
                      <span className="font-cinzel text-sm tracking-[0.2em] text-white font-bold">SHEKHAR RAJA</span>
                    </div>

                    <div className="p-4 flex-1 overflow-hidden flex flex-col relative z-10">
                      <div className="w-full h-10 rounded-full mb-4 flex items-center px-4 shadow-sm" style={{ background: C.bgCard, border: '1px solid ' + C.border }}>
                        <Search size={14} style={{ color: C.textLight }} />
                        <span className="font-raleway text-xs ml-2" style={{ color: C.textLight }}>Search...</span>
                      </div>

                      <div className="w-full h-32 rounded-2xl mb-5 overflow-hidden shadow-md shrink-0 relative">
                        <img src="/hero-1.jpg" className="w-full h-full object-cover" alt="promo preview" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <span className="font-cormorant text-white font-semibold">New Arrivals</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {['/ring6.png', '/necklace88.png', '/bangle1.png', '/earring1.jpg'].map((img, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden shadow-sm flex flex-col" style={{ background: C.bgCard }}>
                            <div className="h-28 overflow-hidden bg-gray-50">
                              <img src={img} className="w-full h-full object-cover" alt="product" />
                            </div>
                            <div className="p-2.5">
                              <div className="h-2 w-3/4 rounded mb-1.5" style={{ background: C.borderMd }} />
                              <div className="h-2 w-1/2 rounded" style={{ background: C.goldPale }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 3D Ground Shadow */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/60 blur-2xl rounded-full z-10" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ UPGRADED TRUST STRIP (Floating Overlap) ══ */}
      <section className="relative z-20 -mt-12 mb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl bg-white/95 border flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x overflow-hidden" style={{ borderColor: C.border }}>
          {trustItems.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }} viewport={{ once:true }}
              className="flex-1 p-8 sm:p-10 flex flex-col items-center text-center group hover:bg-gray-50/50 transition-colors"
              style={{ borderColor: C.border }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-500 group-hover:-translate-y-2"
                   style={{ background: C.bgDeep }}>
                <span className="text-2xl" style={{ color: C.gold }}>{item.icon}</span>
              </div>
              <h3 className="font-cormorant text-xl font-bold mb-2" style={{ color: C.text }}>
                {item.title}
              </h3>
              <p className="font-raleway text-sm font-medium" style={{ color: C.textLight }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </motion.div>
  );
}
