import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Download, Smartphone, Tag, Bell, Headphones, Sparkles, Crown, ShieldCheck, Gem } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        '#F5ECD7',
  bgDeep:    '#EDE0C8',
  bgCard:    '#FFFDF8',
  bgDark:    '#2C1A0E',
  gold:      '#B8862A',
  goldLight: '#D4A843',
  goldPale:  '#F0D080',
  text:      '#2C1A0E',
  textMid:   '#6B4E2A',
  textLight: '#9A7B50',
  border:    'rgba(184,134,42,0.20)',
  shadow:    'rgba(44,26,14,0.10)',
  shadowMd:  'rgba(44,26,14,0.20)',
};

// ── Data ──────────────────────────────────────────────────────────────────────
const heroSlides = [
  { id:1, image:'/hero1.jpg', eyebrow:'Exquisite Collection', title:'Diamond', titleAccent:'Rings',     subtitle:'Celebrate your eternal bond with our handcrafted diamond masterpieces', tagline:'Where brilliance meets eternity' },
  { id:2, image:'/hero2.jpg', eyebrow:'Bridal Heritage',      title:'Bridal',  titleAccent:'Necklaces', subtitle:'Make your special day unforgettable with our exquisite bridal collections', tagline:'For your most precious moments' },
  { id:3, image:'/hero3.jpg', eyebrow:'Timeless Beauty',      title:'Gold',    titleAccent:'Earrings',  subtitle:'Elegant designs that complement every occasion with timeless grace', tagline:'Elegance in every detail' },
  { id:4, image:'/hero4.jpg', eyebrow:'Traditional Art',      title:'Gold',    titleAccent:'Bangles',   subtitle:'Traditional craftsmanship meets contemporary design excellence', tagline:'Heritage reimagined' },
];

const categories = [
  { name:'Antique',       image:'/antique2.jpg'  },
  { name:'Necklaces',     image:'/necklace1.jpg' },
  { name:'Earrings',      image:'/earring1.jpg'  },
  { name:'Bangles',       image:'/bangle1.png'   },
  { name:"Men's Ring",    image:'/ring7.png'      },
  { name:'Pendants',      image:'/pendant.png'   },
  { name:"Women's Ring",  image:'/ring2.png'      },
  { name:'Chains',        image:'/chain2.png'    },
  { name:'Chokers',       image:'/antique3.jpg'  },
];

const products = [
  { id:1, name:'Bridal Chain',          category:'Bridal',    description:'Exquisite kundan work with meenakari detailing, perfect for the modern bride.',       image:'/bridal.png',       tag:'Bestseller' },
  { id:2, name:'Diamond Eternity Ring', category:'Diamond',   description:'A stunning circle of brilliant diamonds symbolizing eternal love.',                   image:'/ring6.png',        tag:'Premium'    },
  { id:3, name:'Antique Gold Jhumkas',  category:'Earrings',  description:'Traditional temple-style jhumkas with intricate peacock motifs.',                     image:'/earrings13.png',   tag:'Heritage'   },
  { id:4, name:'22KT Gold Bangles Set', category:'Bangles',   description:'Set of 4 intricately designed bangles with traditional patterns.',                   image:'/bangle5.png',      tag:'Classic'    },
  { id:5, name:'Polki Diamond Ring',    category:'Rings',     description:'Uncut polki diamonds set in 22KT gold with a classic design.',                       image:'/ring7.png',        tag:'Exclusive'  },
  { id:6, name:'Temple Gold Haar',      category:'Necklaces', description:'Traditional temple necklace with goddess motifs and Lakshmi coins.',                  image:'/necklace88.png',   tag:'Traditional'},
  { id:7, name:'Antique Earrings Set',  category:'Antique',   description:'Exquisite antique finish jewellery with traditional craftsmanship.',                  image:'/earring5.jpg',     tag:'Limited'    },
  { id:8, name:'Festive Gold Set',      category:'Festive',   description:'Elegant gold set perfect for festive occasions and celebrations.',                    image:'/chain4.png',       tag:'Trending'   },
];

const TAG: Record<string,{bg:string;text:string}> = {
  'Bestseller': { bg:'#2C1A0E', text:'#F0D080' },
  'Premium':    { bg:'#1A1040', text:'#C9A84C' },
  'Heritage':   { bg:'#3D2510', text:'#F5D490' },
  'Classic':    { bg:'#1C2B10', text:'#A8D060' },
  'Exclusive':  { bg:'#2A1040', text:'#C8A8F0' },
  'Traditional':{ bg:'#4A2800', text:'#FFD08A' },
  'Limited':    { bg:'#3E1010', text:'#F4A0A0' },
  'Trending':   { bg:'#102040', text:'#90C0FF' },
};

const VIDEOS = ['/video1.mp4','/video2.mp4','/video3.mp4','/video4.mp4','/video5.mp4','/video6.mp4','/video7.mp4'];

// ── TiltCard ──────────────────────────────────────────────────────────────────
function TiltCard({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx:0, ry:0, gx:50, gy:50 });
  const [active, setActive] = useState(false);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx:(0.5-py)*16, ry:(px-0.5)*16, gx:px*100, gy:py*100 });
  };
  return (
    <div style={{ perspective:'900px' }} onClick={onClick} className="cursor-pointer">
      <div ref={ref} onMouseEnter={()=>setActive(true)} onMouseMove={handleMove}
           onMouseLeave={()=>{ setActive(false); setTilt({rx:0,ry:0,gx:50,gy:50}); }}
           style={{ transform:`rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${active?1.032:1})`, transformStyle:'preserve-3d',
                    transition:active?'transform 0.08s linear':'transform 0.5s cubic-bezier(0.22,1,0.36,1)', willChange:'transform' }}
           className="relative">
        {children}
        <div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
             style={{ opacity:active?0.5:0, background:`radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.35) 0%, transparent 55%)`, mixBlendMode:'screen' }} />
      </div>
    </div>
  );
}

// ── VideoCarousel ─────────────────────────────────────────────────────────────
function VideoCarousel() {
  const [active, setActive] = useState(0);
  const videoRefs  = useRef<(HTMLVideoElement|null)[]>([]);
  const itemRefs   = useRef<(HTMLDivElement|null)[]>([]);
  const trackRef   = useRef<HTMLDivElement|null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const total = VIDEOS.length;
  const goTo = useCallback((idx:number) => setActive(idx), []);
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive(p=>(p+1)%total), 6000);
  }, [total]);
  useEffect(() => { startTimer(); return ()=>{ if(intervalRef.current) clearInterval(intervalRef.current); }; }, [startTimer]);
  useEffect(() => {
    videoRefs.current.forEach((v,i) => {
      if (!v) return;
      if (i===active) { v.currentTime=0; v.play().catch(()=>{}); } else { v.pause(); v.currentTime=0; }
    });
  }, [active]);
  useEffect(() => {
    const track=trackRef.current, item=itemRefs.current[active];
    if (!track||!item) return;
    const tr=track.getBoundingClientRect(), ir=item.getBoundingClientRect();
    track.scrollTo({ left: track.scrollLeft+(ir.left-tr.left)-tr.width/2+ir.width/2, behavior:'smooth' });
  }, [active]);
  const handleEnded = () => { startTimer(); setActive(p=>(p+1)%total); };
  return (
    <div className="relative">
      <div ref={trackRef} className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-4 px-2" style={{scrollbarWidth:'none'}}>
        {VIDEOS.map((src,i) => {
          const isA = i===active;
          return (
            <motion.div key={i} ref={el=>{itemRefs.current[i]=el;}}
              onClick={()=>{goTo(i);startTimer();}}
              animate={{ scale:isA?1.08:0.88, opacity:isA?1:0.52 }}
              transition={{ type:'spring', stiffness:300, damping:28 }}
              className={`relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden ${isA?'ring-2 shadow-[0_0_40px_rgba(212,168,67,0.35)]':''}`}
              style={{ width:isA?'clamp(13rem,16vw,16rem)':'clamp(9rem,11vw,11rem)', height:isA?'clamp(20rem,24vw,24rem)':'clamp(15rem,18vw,18rem)', transition:'width 0.4s ease,height 0.4s ease', '--tw-ring-color':C.goldLight } as React.CSSProperties}
            >
              <video ref={el=>{videoRefs.current[i]=el;}} src={src} muted playsInline loop={false}
                     onEnded={isA?handleEnded:undefined} className="w-full h-full object-cover" />
              {!isA && <div className="absolute inset-0 bg-black/50"/>}
              {isA && <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f05]/70 via-transparent to-transparent pointer-events-none"/>}
              {!isA && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-white ml-1" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <span className="font-cinzel text-[10px] tracking-[0.15em] text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {String(i+1).padStart(2,'0')}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8">
        {VIDEOS.map((_,i) => (
          <button key={i} onClick={()=>{goTo(i);startTimer();}}
            className="rounded-full transition-all duration-300"
            style={{ width:i===active?32:8, height:8, background:i===active?C.gold:'rgba(255,255,255,0.25)' }} />
        ))}
      </div>
      <div className="mt-4 mx-auto max-w-xs h-px rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.1)'}}>
        <motion.div key={active} className="h-full" initial={{width:'0%'}} animate={{width:'100%'}} transition={{duration:6,ease:'linear'}}
                    style={{background:`linear-gradient(to right, ${C.gold}, ${C.goldLight})`}} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0]|null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const heroTextY  = useTransform(scrollYProgress,[0,1],['0%','18%']);
  const heroOpacity = useTransform(scrollYProgress,[0,0.7],[1,0]);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p=>(p+1)%heroSlides.length), 5000);
    return ()=>clearInterval(t);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div style={{ background:C.bg }}>

      {/* ── ANNOUNCEMENT TICKER ─────────────────────────────────── */}
      <div className="overflow-hidden mt-20" style={{ background:C.bgDark }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_,i)=>(
            <div key={i} className="flex items-center gap-10 px-6 py-3">
              {['BIS HALLMARK CERTIFIED','TRUSTED SINCE 1987','22KT PURE GOLD','BRIDAL SPECIALIST','WHATSAPP ENQUIRY','TWO SHOWROOMS IN JABALPUR'].map(t=>(
                <span key={t} className="flex items-center gap-4">
                  <span className="font-cinzel text-[11px] tracking-[0.28em]" style={{color:'rgba(245,236,215,0.75)'}}>{t}</span>
                  <span style={{color:C.gold}}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CINEMATIC HERO ──────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[88vh] min-h-[560px] overflow-hidden">
        {/* Slide backgrounds */}
        <AnimatePresence mode="wait">
          <motion.div key={slide.id}
            initial={{ opacity:0, scale:1.06 }} animate={{ opacity:1, scale:1 }}
            exit={{ opacity:0, scale:0.98 }} transition={{ duration:1.3, ease:[0.22,1,0.36,1] }}
            className="absolute inset-0">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* Layered gradients */}
        <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(44,26,14,0.88) 0%, rgba(44,26,14,0.35) 50%, rgba(44,26,14,0.1) 100%)'}} />
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 60% 80% at 20% 100%, rgba(184,134,42,0.2) 0%, transparent 70%)'}} />

        {/* Parallax text content */}
        <motion.div style={{ y:heroTextY, opacity:heroOpacity }}
          className="absolute inset-0 flex flex-col justify-end z-10">
          <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 pb-20 sm:pb-24">
            <AnimatePresence mode="wait">
              <motion.div key={slide.id}
                initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-16 }} transition={{ duration:0.65, ease:[0.22,1,0.36,1] }}>

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-3 mb-5">
                  <div className="h-px w-8" style={{background:C.gold}} />
                  <span className="font-cinzel text-[10px] tracking-[0.4em]" style={{color:C.gold}}>{slide.eyebrow.toUpperCase()}</span>
                </div>

                {/* Headline */}
                <h1 className="font-cormorant font-bold text-white leading-[0.9] mb-5"
                    style={{ fontSize:'clamp(3.5rem,10vw,7.5rem)' }}>
                  {slide.title}{' '}
                  <span style={{ background:`linear-gradient(135deg,${C.gold},${C.goldPale},#A07830)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                    {slide.titleAccent}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="font-raleway text-base max-w-md leading-relaxed mb-8" style={{color:'rgba(245,236,215,0.65)'}}>
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link to="/collections">
                    <motion.div whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-raleway font-medium text-sm"
                      style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.bgDark, boxShadow:`0 10px 30px rgba(184,134,42,0.4)` }}>
                      <span>Explore Collection</span>
                      <ArrowRight size={15} />
                    </motion.div>
                  </Link>
                  <a href="https://wa.me/918377911745" target="_blank" rel="noopener noreferrer">
                    <motion.div whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-raleway font-medium text-sm"
                      style={{ background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.25)', backdropFilter:'blur(8px)' }}>
                      <MessageCircle size={15} />
                      <span>WhatsApp Enquiry</span>
                    </motion.div>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Slide navigation dots */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
          {heroSlides.map((_,i)=>(
            <button key={i} onClick={()=>setCurrentSlide(i)}
              className="rounded-full transition-all duration-400"
              style={{ width:i===currentSlide?28:8, height:8, background:i===currentSlide?C.gold:'rgba(255,255,255,0.35)' }} />
          ))}
        </div>

        {/* Arrow buttons */}
        <button onClick={()=>setCurrentSlide(p=>(p-1+heroSlides.length)%heroSlides.length)}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.18)' }}>
          <ChevronLeft size={22} className="text-white" />
        </button>
        <button onClick={()=>setCurrentSlide(p=>(p+1)%heroSlides.length)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.18)' }}>
          <ChevronRight size={22} className="text-white" />
        </button>

        {/* Bottom cream fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
             style={{ background:`linear-gradient(to top, ${C.bg}, transparent)` }} />
      </section>

      {/* ── HERITAGE STATS BAND ─────────────────────────────────── */}
      <section className="py-10" style={{ background:C.bgDeep, borderBottom:`1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value:'1987', label:'Est. Year', icon:<Crown size={18}/> },
              { value:'22KT', label:'Pure Gold',  icon:<Gem size={18}/> },
              { value:'BIS',  label:'Hallmark',   icon:<ShieldCheck size={18}/> },
              { value:'500+', label:'Designs',    icon:<Sparkles size={18}/> },
            ].map(({ value, label, icon })=>(
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3" style={{background:`rgba(184,134,42,0.12)`}}>
                  <span style={{color:C.gold}}>{icon}</span>
                </div>
                <p className="font-cormorant text-3xl font-bold" style={{color:C.text}}>{value}</p>
                <p className="font-raleway text-[10px] tracking-[0.2em] mt-0.5" style={{color:C.textLight}}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY RAIL ────────────────────────────────────────── */}
      <section className="py-16" style={{ background:C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <p className="font-cinzel text-[10px] tracking-[0.35em] mb-3" style={{color:C.gold}}>BROWSE BY</p>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold" style={{color:C.text}}>Shop Categories</h2>
            <div className="mt-4 mx-auto w-24 h-px" style={{background:`linear-gradient(to right, transparent, ${C.gold}, transparent)`}} />
          </motion.div>

          <div className="flex gap-5 sm:gap-8 overflow-x-auto pb-3 sm:flex-wrap sm:justify-center sm:overflow-visible" style={{scrollbarWidth:'none'}}>
            {categories.map((cat,i)=>(
              <Link to="/collections" key={cat.name}>
                <motion.div initial={{opacity:0,scale:0.88}} whileInView={{opacity:1,scale:1}}
                  transition={{delay:i*0.05}} viewport={{once:true}}
                  whileHover={{y:-6,scale:1.06}} whileTap={{scale:0.97}}
                  className="flex-shrink-0 flex flex-col items-center gap-2.5 group" style={{width:80}}>
                  <div className="rounded-full overflow-hidden"
                       style={{ width:76, height:76, border:`2px solid ${C.border}`, boxShadow:`0 4px 14px ${C.shadow}`,
                                transition:'border-color 0.3s, box-shadow 0.3s' }}
                       onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=C.gold; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 0 0 3px rgba(184,134,42,0.2), 0 8px 24px ${C.shadowMd}`;}}
                       onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=C.border; (e.currentTarget as HTMLDivElement).style.boxShadow=`0 4px 14px ${C.shadow}`;}}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-115" />
                  </div>
                  <span className="font-cinzel text-[9px] tracking-[0.12em] text-center leading-tight transition-colors duration-200 group-hover:text-[#B8862A]"
                        style={{color:C.textLight}}>
                    {cat.name.toUpperCase()}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────────── */}
      <section className="py-20" style={{ background:C.bgDeep }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="flex items-center gap-5 mb-12">
            <Sparkles size={16} style={{color:C.gold}} />
            <span className="font-cinzel text-[11px] tracking-[0.3em]" style={{color:C.gold}}>HANDPICKED FOR YOU</span>
            <div className="flex-1 h-px" style={{background:`linear-gradient(to right, ${C.border}, transparent)`}} />
            <Link to="/collections" className="font-raleway text-xs flex items-center gap-1.5 transition-colors hover:opacity-70" style={{color:C.textLight}}>
              View all <ArrowRight size={12}/>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {products.map((product,i)=>{
              const tagStyle = TAG[product.tag] || {bg:'#2C1A0E',text:'#F0D080'};
              return (
                <motion.div key={product.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
                  transition={{delay:Math.min(i*0.06,0.36),duration:0.4}} viewport={{once:true}}>
                  <TiltCard onClick={()=>setSelectedProduct(product)}>
                    <div className="rounded-2xl overflow-hidden"
                         style={{ background:C.bgCard, border:`1px solid ${C.border}`, boxShadow:`0 4px 16px ${C.shadow}` }}>
                      {/* Image */}
                      <div className="relative overflow-hidden" style={{aspectRatio:'4/5',transform:'translateZ(20px)'}}>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-400"
                             style={{background:'linear-gradient(to top, rgba(44,26,14,0.7) 0%, rgba(44,26,14,0.1) 50%, transparent 100%)'}} />
                        <div className="absolute top-3 left-3" style={{transform:'translateZ(12px)'}}>
                          <span className="font-cinzel text-[9px] tracking-[0.1em] px-2.5 py-1 rounded-full"
                                style={{background:tagStyle.bg, color:tagStyle.text}}>{product.tag}</span>
                        </div>
                        <div className="absolute inset-0 flex items-end p-4 opacity-0 hover:opacity-100 transition-all duration-400"
                             style={{transform:'translateZ(20px)'}}>
                          <div className="w-full flex items-center justify-between rounded-xl px-4 py-2.5"
                               style={{background:'rgba(245,236,215,0.15)', backdropFilter:'blur(12px)', border:'1px solid rgba(245,236,215,0.25)'}}>
                            <span className="font-raleway text-xs text-white">View Details</span>
                            <ArrowRight size={13} style={{color:C.goldPale}} />
                          </div>
                        </div>
                      </div>
                      {/* Body */}
                      <div className="px-4 py-4">
                        <p className="font-cinzel text-[9px] tracking-[0.2em] mb-1.5" style={{color:C.gold}}>{product.category.toUpperCase()}</p>
                        <h3 className="font-cormorant text-[17px] font-semibold leading-tight" style={{color:C.text}}>{product.name}</h3>
                        <p className="font-raleway text-[11px] leading-relaxed mt-1.5 line-clamp-2" style={{color:C.textLight}}>{product.description}</p>
                        <div className="flex items-center justify-between mt-4 pt-3" style={{borderTop:`1px solid ${C.border}`}}>
                          <span className="font-cinzel text-[9px] tracking-[0.12em]" style={{color:C.textLight}}>ENQUIRE ON WHATSAPP</span>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background:`rgba(184,134,42,0.1)`,border:`1px solid ${C.border}`}}>
                            <ArrowRight size={10} style={{color:C.gold}} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mt-12">
            <Link to="/collections">
              <motion.div whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-raleway font-medium text-sm"
                style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.bgDark, boxShadow:`0 10px 28px rgba(184,134,42,0.3)` }}>
                <span>View All Jewellery</span>
                <ArrowRight size={15} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── VIDEO SHOWCASE ───────────────────────────────────────── */}
      <section className="py-20 overflow-hidden" style={{ background:C.bgDark }}>
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{backgroundImage:`radial-gradient(ellipse 60% 50% at 20% 50%, ${C.gold} 0%, transparent 65%)`,position:'absolute'}} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-14">
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="h-px w-10" style={{background:`linear-gradient(to right, transparent, ${C.gold})`}} />
              <Crown size={14} style={{color:C.gold}} />
              <span className="font-cinzel text-[10px] tracking-[0.3em]" style={{color:C.gold}}>IN MOTION</span>
              <Crown size={14} style={{color:C.gold}} />
              <div className="h-px w-10" style={{background:`linear-gradient(to left, transparent, ${C.gold})`}} />
            </div>
            <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-white">
              Feel the <em className="italic" style={{color:C.goldLight}}>Elegance</em>
            </h2>
            <p className="font-raleway text-sm mt-4 max-w-md mx-auto" style={{color:'rgba(255,255,255,0.5)'}}>
              Watch our masterpieces come alive — each piece crafted for moments that last forever
            </p>
          </motion.div>
          <VideoCarousel />
        </div>
      </section>

      {/* ── TRUST PILLARS ────────────────────────────────────────── */}
      <section className="py-20" style={{ background:C.bg }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <h2 className="font-cormorant text-4xl font-bold" style={{color:C.text}}>Why Shekhar Raja</h2>
            <div className="mt-3 mx-auto w-16 h-px" style={{background:`linear-gradient(to right, transparent, ${C.gold}, transparent)`}} />
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:<ShieldCheck size={26}/>, title:'Hallmark Certified', desc:'BIS Hallmark on all gold jewellery — guaranteed purity' },
              { icon:<Crown size={26}/>,       title:'Bridal Specialist',  desc:'35+ years of bridal expertise & timeless craftsmanship' },
              { icon:<Sparkles size={26}/>,    title:'Two Showrooms',      desc:'Conveniently located showrooms across Jabalpur' },
              { icon:<MessageCircle size={26}/>, title:'WA Support',       desc:'Instant WhatsApp assistance for all enquiries' },
            ].map(({ icon, title, desc },i)=>(
              <motion.div key={title} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
                transition={{delay:i*0.1}} viewport={{once:true}}
                whileHover={{y:-6}} className="text-center group">
                <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-xl"
                     style={{ background:`rgba(184,134,42,0.08)`, border:`1px solid ${C.border}`,
                              boxShadow:`0 4px 12px ${C.shadow}` }}
                     onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement; el.style.background=`rgba(184,134,42,0.16)`;}}
                     onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement; el.style.background=`rgba(184,134,42,0.08)`;}}
                >
                  <span style={{color:C.gold}}>{icon}</span>
                </div>
                <h3 className="font-cormorant text-xl font-semibold mb-2" style={{color:C.text}}>{title}</h3>
                <p className="font-raleway text-[12px] leading-relaxed" style={{color:C.textLight}}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PROMO ────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ background:C.bgDark }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{background:'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(184,134,42,0.12) 0%, transparent 65%)'}} />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left copy */}
            <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                   style={{background:'rgba(184,134,42,0.15)', border:`1px solid rgba(184,134,42,0.3)`}}>
                <Smartphone size={15} style={{color:C.goldLight}} />
                <span className="font-raleway text-sm" style={{color:C.goldLight}}>Now on Android</span>
              </div>
              <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-white mb-5">
                Shekhar Raja<br/>
                <em className="italic" style={{color:C.gold}}>In Your Pocket</em>
              </h2>
              <p className="font-raleway text-base mb-8 leading-relaxed" style={{color:'rgba(255,255,255,0.55)'}}>
                Browse our entire catalogue, check live gold rates, and get exclusive offers — right from your phone.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon:<Tag size={14}/>, label:'Full Catalogue' },
                  { icon:<Bell size={14}/>, label:'Live Gold Rates' },
                  { icon:<Headphones size={14}/>, label:'WA Support' },
                ].map(({icon,label})=>(
                  <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full"
                       style={{background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)'}}>
                    <span style={{color:C.goldLight}}>{icon}</span>
                    <span className="font-raleway text-sm text-white">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="https://github.com/rrahulvishwakarma007-lgtm/srj-app/releases/download/SRJ/theshekharrajajewellersapp.apk"
                   target="_blank" rel="noopener noreferrer">
                  <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-raleway font-medium text-sm"
                    style={{background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,color:C.bgDark,boxShadow:`0 8px 24px rgba(184,134,42,0.35)`}}>
                    <Download size={16}/> Download APK
                  </motion.div>
                </a>
                <a href="https://wa.me/918377911745" target="_blank" rel="noopener noreferrer">
                  <motion.div whileHover={{scale:1.04,y:-2}} whileTap={{scale:0.97}}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-raleway font-medium text-sm"
                    style={{background:'#25D366',color:'white',boxShadow:'0 8px 24px rgba(37,211,102,0.3)'}}>
                    <MessageCircle size={16}/> Get Link on WA
                  </motion.div>
                </a>
              </div>
            </motion.div>

            {/* Right: phone mockup */}
            <motion.div initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 rounded-[3rem] blur-3xl opacity-30"
                     style={{background:`radial-gradient(circle, ${C.gold} 0%, transparent 70%)`}} />
                <div className="relative w-60 h-[480px] rounded-[3rem] p-3"
                     style={{ background:`linear-gradient(160deg, #3A2208, ${C.bgDark})`,
                              border:`3px solid rgba(184,134,42,0.3)`,
                              boxShadow:`0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)` }}>
                  <div className="w-full h-full rounded-[2.4rem] overflow-hidden" style={{background:C.bg}}>
                    <div className="py-4 px-5 text-center" style={{background:`linear-gradient(135deg,${C.gold},${C.goldLight})`}}>
                      <span className="font-cinzel text-[10px] tracking-[0.2em]" style={{color:C.bgDark}}>SHEKHAR RAJA</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {[20,28,16].map((w,j)=>(
                        <div key={j} className="rounded-xl p-3" style={{background:C.bgCard,boxShadow:`0 2px 8px ${C.shadow}`}}>
                          <div className="h-2.5 rounded mb-2" style={{width:`${w*4}px`,background:`linear-gradient(to right, ${C.gold}, ${C.goldLight})`}} />
                          <div className="h-2 w-full rounded" style={{background:C.border}} />
                          <div className="h-2 w-3/4 rounded mt-1" style={{background:C.border}} />
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[C.bgCard,C.bgCard].map((bg,j)=>(
                          <div key={j} className="rounded-xl overflow-hidden" style={{background:bg,boxShadow:`0 2px 8px ${C.shadow}`}}>
                            <div className="h-16" style={{background:C.bgDeep}} />
                            <div className="p-2">
                              <div className="h-2 rounded" style={{background:C.border}} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP FLOAT BUTTON ────────────────────────────────── */}
      <a href="https://wa.me/918377911745" target="_blank" rel="noopener noreferrer"
         className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
         style={{ background:'#25D366', boxShadow:'0 8px 28px rgba(37,211,102,0.45)' }}>
        <MessageCircle size={26} className="text-white" />
      </a>

      {/* Modal */}
      <ProductModal product={selectedProduct} onClose={()=>setSelectedProduct(null)} />
    </div>
  );
}
