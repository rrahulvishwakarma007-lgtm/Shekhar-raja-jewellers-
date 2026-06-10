import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, X, Search, Crown } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Palette (matches live site) ───────────────────────────────────────────────
const C = {
  bg:         '#F5ECD7',   // warm cream — main bg
  bgDeep:     '#EDE0C8',   // deeper cream — section alternates
  bgCard:     '#FFFDF8',   // near-white card
  bgDark:     '#2C1A0E',   // rich dark brown — hero/footer
  bgDarkMid:  '#3D2510',   // mid brown
  gold:       '#B8862A',   // primary gold
  goldLight:  '#D4A843',   // hover gold
  goldPale:   '#F0D080',   // pale gold highlight
  goldBorder: 'rgba(184,134,42,0.25)',
  goldBg:     'rgba(184,134,42,0.08)',
  text:       '#2C1A0E',   // dark brown text
  textMid:    '#6B4E2A',   // mid brown text
  textLight:  '#9A7B50',   // muted gold-brown
  border:     'rgba(184,134,42,0.18)',
  shadow:     'rgba(44,26,14,0.10)',
  shadowMd:   'rgba(44,26,14,0.18)',
};

// ── Tag styles (light theme) ─────────────────────────────────────────────────
const TAG: Record<string, { bg: string; text: string }> = {
  'Bestseller':  { bg: '#2C1A0E', text: '#F0D080' },
  'Premium':     { bg: '#1A1040', text: '#C9A84C' },
  'Heritage':    { bg: '#3D2510', text: '#F5D490' },
  'Classic':     { bg: '#1C2B10', text: '#A8D060' },
  'Exclusive':   { bg: '#2A1040', text: '#C8A8F0' },
  'Traditional': { bg: '#4A2800', text: '#FFD08A' },
  'Limited':     { bg: '#3E1010', text: '#F4A0A0' },
  'Trending':    { bg: '#102040', text: '#90C0FF' },
  'Bridal Pick': { bg: '#3D0830', text: '#F8A0C8' },
  'Festive':     { bg: '#1E2800', text: '#C8F080' },
  'Everyday':    { bg: '#2A2A2A', text: '#D0D0D0' },
  'New Arrival': { bg: '#003830', text: '#80D8C8' },
  'Luxury':      { bg: '#1A1400', text: '#FFE080' },
  'Vintage':     { bg: '#281818', text: '#C8B0A8' },
};

// ── Categories ───────────────────────────────────────────────────────────────
const categories = [
  { name: 'All',          image: null },
  { name: 'Antique',      image: '/antique2.jpg'  },
  { name: 'Necklaces',    image: '/necklace1.jpg' },
  { name: 'Earrings',     image: '/earring1.jpg'  },
  { name: 'Bangles',      image: '/bangle1.png'   },
  { name: "Men's Ring",   image: '/ring7.png'     },
  { name: 'Pendants',     image: '/pendant.png'   },
  { name: "Women's Ring", image: '/ring2.png'     },
  { name: 'Chains',       image: '/chain2.png'    },
  { name: 'Chokers',      image: '/antique3.jpg'  },
];

// ── Products ─────────────────────────────────────────────────────────────────
const allProducts = [
  { id:1,  name:'Kundan Bridal Necklace',   category:'Necklaces',    description:'Exquisite kundan work with meenakari detailing, perfect for the modern bride.',   image:'/antique1.jpg',        tag:'Bestseller',  featured:true  },
  { id:2,  name:'Diamond Eternity Ring',    category:'Antique',      description:'A stunning circle of brilliant diamonds symbolizing eternal love.',                image:'/ring2.png',           tag:'Premium',     featured:false },
  { id:3,  name:'Antique Gold Jhumkas',     category:'Earrings',     description:'Traditional temple-style jhumkas with intricate peacock motifs.',                  image:'/earrings13.png',      tag:'Heritage',    featured:false },
  { id:4,  name:'22KT Gold Bangles Set',    category:'Bangles',      description:'Set of 4 intricately designed bangles with traditional patterns.',                 image:'/bangle3.png',         tag:'Classic',     featured:false },
  { id:5,  name:'Polki Diamond Ring',       category:'Antique',      description:'Uncut polki diamonds set in 22KT gold with a classic design.',                    image:'/ring6.png',           tag:'Exclusive',   featured:true  },
  { id:6,  name:'Temple Gold Haar',         category:'Necklaces',    description:'Traditional temple necklace with goddess motifs and Lakshmi coins.',              image:'/necklace88.png',      tag:'Traditional', featured:false },
  { id:7,  name:'Ruby & Emerald Ring',      category:"Women's Ring", description:'Stunning cocktail ring with precious gemstones in kundan setting.',               image:'/ring7.png',           tag:'Limited',     featured:false },
  { id:8,  name:'Antique Necklace Set',     category:'Necklaces',    description:'Complete antique temple set with traditional craftsmanship.',                     image:'/necklace22.png',      tag:'Trending',    featured:false },
  { id:9,  name:'Meenakari Bridal Set',     category:'Necklaces',    description:'Colorful meenakari work bridal set with traditional motifs.',                     image:'/necklace3.jpg',       tag:'Bridal Pick', featured:true  },
  { id:10, name:'Festive Gold Set',         category:'Antique',      description:'Elegant gold set perfect for festive occasions.',                                  image:'/bangle5.png',         tag:'Festive',     featured:false },
  { id:11, name:'Diamond Studs',            category:'Earrings',     description:'Classic diamond studs for everyday elegance.',                                    image:'/ring4.png',           tag:'Everyday',    featured:false },
  { id:12, name:'Gold Bangles',             category:'Bangles',      description:'Heavy gold kada with traditional carvings.',                                      image:'/bangle9.png',         tag:'Heritage',    featured:false },
  { id:13, name:'Heritage Necklace',        category:'Necklaces',    description:'Elegant heritage necklace with traditional design.',                              image:'/bridal-necklace.jpg', tag:'New Arrival', featured:false },
  { id:14, name:'Solitaire Engagement Ring',category:"Women's Ring", description:'Brilliant solitaire in a classic six-prong setting.',                            image:'/ring6.png',           tag:'Premium',     featured:true  },
  { id:15, name:'Antique Choker Set',       category:'Antique',      description:'Beautiful antique choker set for festive celebrations.',                          image:'/necklace15.png',      tag:'Traditional', featured:false },
  { id:16, name:'Diamond Hoop Earrings',    category:'Earrings',     description:'Contemporary diamond hoops for modern elegance.',                                 image:'/earrings14.png',      tag:'Trending',    featured:false },
  { id:17, name:'Gold Band Ring',           category:"Women's Ring", description:'Classic gold band with elegant minimal design.',                                  image:'/ring5.png',           tag:'Classic',     featured:false },
  { id:18, name:'Diamond Cluster Ring',     category:'Antique',      description:'Beautiful cluster of diamonds in an elegant setting.',                            image:'/ring3.png',           tag:'Luxury',      featured:false },
  { id:19, name:'Vintage Diamond Ring',     category:"Women's Ring", description:'Vintage-inspired design with intricate detailing.',                               image:'/ring1.png',           tag:'Vintage',     featured:false },
  { id:20, name:'Gold Bangle Set A',        category:'Bangles',      description:'Elegant 22KT gold bangles with traditional carvings and fine finish.',           image:'/bangleA.jpg',         tag:'New Arrival', featured:false },
  { id:21, name:'Designer Bangle B',        category:'Bangles',      description:'Intricate designer bangles in 22KT gold, perfect for festive occasions.',        image:'/bangleB.jpg',         tag:'Trending',    featured:false },
  { id:22, name:'Antique Bangle C',         category:'Bangles',      description:'Antique-finish 22KT gold bangles with classic Indian motifs.',                   image:'/bangleC.jpg',         tag:'Heritage',    featured:false },
  { id:23, name:'Bridal Bangle Set D',      category:'Bangles',      description:'Heavy bridal bangles in 22KT gold with ornate detailing.',                       image:'/bangleD.jpg',         tag:'Bridal Pick', featured:false },
  { id:24, name:'Festive Bangle E',         category:'Bangles',      description:'Beautifully crafted gold bangles ideal for festivals.',                          image:'/bangleE.jpg',         tag:'Festive',     featured:false },
  { id:25, name:'Kundan Bangle F',          category:'Bangles',      description:'Kundan-studded 22KT gold bangles with vibrant meenakari work.',                  image:'/bangleF.jpg',         tag:'Exclusive',   featured:false },
  { id:26, name:'Classic Bangle G',         category:'Bangles',      description:'Timeless classic gold bangles with smooth finish and fine engraving.',           image:'/bangleG.jpg',         tag:'Classic',     featured:false },
  { id:27, name:'Temple Bangle H',          category:'Bangles',      description:'Temple-art inspired bangles in 22KT gold with goddess motifs.',                  image:'/bangleH.jpg',         tag:'Traditional', featured:false },
  { id:28, name:'Royal Bangle Set I',       category:'Bangles',      description:'Royal-style heavy gold bangles, a showstopper for every occasion.',              image:'/bangleI.jpg',         tag:'Premium',     featured:false },
  { id:29, name:'Bridal Necklace A',        category:'Necklaces',    description:'Stunning 22KT bridal necklace with kundan and polki work.',                     image:'/necklaceA.jpg',       tag:'Bridal Pick', featured:true  },
  { id:30, name:'Heritage Necklace B',      category:'Necklaces',    description:'Traditional heritage necklace in 22KT gold with antique finish.',               image:'/necklaceB.jpg',       tag:'Heritage',    featured:false },
  { id:31, name:'Temple Necklace C',        category:'Necklaces',    description:'Handcrafted temple necklace with goddess motifs and ruby accents.',              image:'/necklaceC.jpg',       tag:'Traditional', featured:false },
  { id:32, name:'Kundan Necklace D',        category:'Necklaces',    description:'Grand Kundan necklace with emerald and pearl drops in 22KT gold.',              image:'/necklaceD.jpg',       tag:'Exclusive',   featured:false },
  { id:33, name:'Gold Haar E',              category:'Necklaces',    description:'Elegant long haar in 22KT gold, ideal for festive and bridal wear.',            image:'/necklaceE.jpg',       tag:'New Arrival', featured:false },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function Collections() {
  const [activeTab, setActiveTab]           = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [searchQuery, setSearchQuery]       = useState('');
  const [hoveredId, setHoveredId]           = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const filteredProducts = allProducts.filter(p => {
    const matchCat   = activeTab === 'All' || p.category === activeTab;
    const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const featured = allProducts.filter(p => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* ══════════════════════════════════════
          HERO — warm cream + dark brown
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden flex items-end"
               style={{ minHeight:'60vh', background:`linear-gradient(170deg, #3A2208 0%, #2C1A0E 45%, #4A2E10 100%)` }}>

        {/* Warm layered glow — no harsh pattern */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full"
               style={{ background:'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(184,134,42,0.18) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 right-0 w-full h-full"
               style={{ background:'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(120,70,10,0.25) 0%, transparent 60%)' }} />
          {/* Very subtle dot texture — far less distracting than diamonds */}
          <div className="absolute inset-0"
               style={{ backgroundImage:'radial-gradient(circle, rgba(201,168,76,0.07) 1px, transparent 1px)',
                        backgroundSize:'28px 28px', opacity:1 }} />
        </motion.div>

        {/* Ghost watermark text — toned down */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {['HERITAGE','1987'].map((w,i)=>(
            <span key={w} className="absolute font-serif font-black whitespace-nowrap"
                  style={{ fontSize:'clamp(80px,18vw,160px)', opacity:0.018, color:'#C9A84C',
                           top:`${20+i*40}%`, left:`${i*25}%`, transform:`rotate(${-3+i*2}deg)`, letterSpacing:'-0.04em' }}>
              {w}
            </span>
          ))}
        </div>

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-36 pb-20">

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                      className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background:C.gold }} />
            <span className="font-cinzel text-[10px] tracking-[0.35em]" style={{ color:C.gold }}>SHEKHAR RAJA JEWELLERS</span>
            <div className="h-px w-8" style={{ background:C.gold }} />
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:44 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.75 }}
                     className="font-cormorant font-bold leading-[0.9] tracking-tight mb-6"
                     style={{ fontSize:'clamp(3rem,9vw,7rem)', color:'#F5ECD7' }}>
            The&nbsp;
            <span style={{ background:`linear-gradient(135deg,#D4A843,#F0D080,#B8862A)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Eternal
            </span>
            <br/>Collection
          </motion.h1>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
                    className="font-raleway text-[15px] max-w-sm leading-relaxed mb-10"
                    style={{ color:'rgba(245,236,215,0.5)' }}>
            {allProducts.length} masterworks in 22KT gold — each piece a story of heritage and elegance.
          </motion.p>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
                      className="flex items-center gap-6 sm:gap-10">
            {[['500+','Designs'],['22KT','Pure Gold'],['BIS','Hallmark'],['1987','Est.']].map(([v,l],i)=>(
              <div key={l} className="text-center">
                {i>0 && <div className="hidden" />}
                <p className="font-cormorant text-2xl font-bold" style={{ color:C.gold }}>{v}</p>
                <p className="font-raleway text-[10px] tracking-[0.18em] mt-0.5" style={{ color:'rgba(245,236,215,0.32)' }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Long smooth cream fade — blends naturally into page */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height:'160px',
             background:`linear-gradient(to top, ${C.bg} 0%, ${C.bg}CC 25%, ${C.bg}66 55%, transparent 100%)` }} />
      </section>


      {/* ══════════════════════════════════════
          EDITOR'S PICKS — cream bg, warm cards
      ══════════════════════════════════════ */}
      <section className="py-20" style={{ background:C.bg }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          {/* Section header */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                      className="flex items-center gap-5 mb-12">
            <Crown size={16} style={{ color:C.gold }} />
            <span className="font-cinzel text-[11px] tracking-[0.3em]" style={{ color:C.gold }}>EDITOR'S PICKS</span>
            <div className="flex-1 h-px" style={{ background:`linear-gradient(to right, ${C.goldBorder}, transparent)` }} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {featured.map((p,i)=>(
              <motion.div key={p.id}
                initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay:i*0.1 }} viewport={{ once:true }}
                onClick={()=>setSelectedProduct(p)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl"
                style={{ aspectRatio:'3/4',
                         boxShadow:`0 8px 40px ${C.shadowMd}`,
                         border:`1px solid ${C.border}` }}
              >
                <img src={p.image} alt={p.name}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {/* Warm gradient overlay */}
                <div className="absolute inset-0"
                     style={{ background:`linear-gradient(to top, rgba(44,26,14,0.88) 0%, rgba(44,26,14,0.15) 55%, transparent 100%)` }} />
                {/* Gold top shimmer on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background:`linear-gradient(to right, transparent, ${C.gold}, transparent)` }} />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-cinzel text-[10px] tracking-[0.25em] mb-2" style={{ color:C.goldLight }}>{p.category.toUpperCase()}</p>
                  <h3 className="font-cormorant text-2xl font-bold text-white leading-tight mb-3">{p.name}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                    <span className="font-raleway text-sm" style={{ color:'rgba(255,255,255,0.75)' }}>Enquire Now</span>
                    <ArrowRight size={14} style={{ color:C.goldLight }} />
                  </div>
                </div>
                {/* Featured pill */}
                <div className="absolute top-4 right-4">
                  <span className="font-cinzel text-[9px] tracking-[0.15em] px-3 py-1.5 rounded-full text-white"
                        style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})` }}>★ FEATURED</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          CATEGORY FILTER — deep cream band
      ══════════════════════════════════════ */}
      <section className="py-16" style={{ background:C.bgDeep, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-cinzel text-[10px] tracking-[0.3em] mb-2" style={{ color:C.textLight }}>BROWSE BY CATEGORY</p>
              <h2 className="font-cormorant text-4xl font-bold" style={{ color:C.text }}>Shop the Collection</h2>
            </div>
            {/* Search */}
            <div className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                 style={{ background:C.bgCard, border:`1px solid ${C.border}`, boxShadow:`0 2px 12px ${C.shadow}` }}>
              <Search size={14} style={{ color:C.textLight }} />
              <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                     placeholder="Search designs…"
                     className="bg-transparent font-raleway text-sm outline-none w-36"
                     style={{ color:C.text }} />
              {searchQuery && (
                <button onClick={()=>setSearchQuery('')}>
                  <X size={13} style={{ color:C.textLight }} />
                </button>
              )}
            </div>
          </div>

          {/* Category circles */}
          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 sm:flex-wrap sm:overflow-visible sm:pb-0"
               style={{ scrollbarWidth:'none' }}>
            {categories.map((cat,idx)=>{
              const isActive = activeTab === cat.name;
              return (
                <motion.button key={cat.name}
                  initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay:idx*0.04 }} whileTap={{ scale:0.95 }}
                  onClick={()=>setActiveTab(cat.name)}
                  className="group flex-shrink-0 flex flex-col items-center gap-2.5 focus:outline-none"
                  style={{ width:80 }}
                >
                  {/* Circle image frame */}
                  <div className="relative rounded-full overflow-hidden"
                       style={{
                         width:76, height:76,
                         border: isActive ? `2.5px solid ${C.gold}` : `2px solid ${C.border}`,
                         boxShadow: isActive
                           ? `0 0 0 4px rgba(184,134,42,0.15), 0 8px 24px ${C.shadowMd}`
                           : `0 4px 14px ${C.shadow}`,
                         transition:'border-color 0.3s, box-shadow 0.3s',
                         background: C.bgCard,
                       }}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                           style={{ background:`linear-gradient(135deg, #F0E4C0, #E8D4A0)` }}>
                        <span className="text-2xl" style={{ color:C.gold }}>✦</span>
                      </div>
                    )}
                    {/* Active overlay */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full"
                           style={{ background:'rgba(184,134,42,0.12)' }} />
                    )}
                  </div>

                  {/* Label */}
                  <span className="font-cinzel text-[9px] tracking-[0.1em] text-center leading-tight transition-colors duration-200"
                        style={{ color: isActive ? C.gold : C.textLight,
                                 fontWeight: isActive ? '700' : '400' }}>
                    {cat.name.toUpperCase()}
                  </span>

                  {/* Active dot */}
                  {isActive && (
                    <motion.div layoutId="activeDot"
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background:C.gold }}
                      transition={{ type:'spring', stiffness:500, damping:30 }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Results bar */}
          <div className="mt-10 flex items-center justify-between pt-5"
               style={{ borderTop:`1px solid ${C.border}` }}>
            <p className="font-raleway text-sm" style={{ color:C.textLight }}>
              <span className="font-semibold" style={{ color:C.text }}>{filteredProducts.length}</span> pieces
              {activeTab !== 'All' && (
                <> in <span style={{ color:C.gold }}>{activeTab}</span></>
              )}
            </p>
            {(activeTab !== 'All' || searchQuery) && (
              <button onClick={()=>{ setActiveTab('All'); setSearchQuery(''); }}
                      className="flex items-center gap-1.5 font-raleway text-xs transition-colors"
                      style={{ color:C.textLight }}
                      onMouseEnter={e=>(e.currentTarget.style.color=C.gold)}
                      onMouseLeave={e=>(e.currentTarget.style.color=C.textLight)}>
                <X size={11} /> Clear filters
              </button>
            )}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          PRODUCTS GRID — warm white cards
      ══════════════════════════════════════ */}
      <section className="py-16" style={{ background:C.bg }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                          className="py-24 text-center">
                <p className="font-cormorant text-4xl mb-3" style={{ color:`${C.textLight}80` }}>No pieces found</p>
                <p className="font-raleway text-sm" style={{ color:C.textLight }}>Try a different category or clear your search</p>
              </motion.div>
            ) : (
              <motion.div key={activeTab+searchQuery}
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.22 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
              >
                {filteredProducts.map((product,index)=>{
                  const isHov = hoveredId === product.id;
                  const tagStyle = TAG[product.tag] || { bg:'#2C1A0E', text:'#C9A84C' };
                  return (
                    <motion.div key={product.id}
                      initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:Math.min(index*0.04,0.4), duration:0.4 }}
                      onMouseEnter={()=>setHoveredId(product.id)}
                      onMouseLeave={()=>setHoveredId(null)}
                      onClick={()=>setSelectedProduct(product)}
                      className="cursor-pointer"
                    >
                      <div className="relative rounded-2xl overflow-hidden"
                           style={{
                             background: C.bgCard,
                             border: isHov ? `1.5px solid ${C.gold}` : `1px solid ${C.border}`,
                             boxShadow: isHov
                               ? `0 20px 50px ${C.shadowMd}, 0 0 0 1px rgba(184,134,42,0.12)`
                               : `0 4px 18px ${C.shadow}`,
                             transform: isHov ? 'translateY(-6px)' : 'translateY(0)',
                             transition:'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                           }}>

                        {/* Image */}
                        <div className="relative overflow-hidden" style={{ aspectRatio:'4/5' }}>
                          <img src={product.image} alt={product.name}
                               className="w-full h-full object-cover"
                               style={{ transform: isHov ? 'scale(1.08)' : 'scale(1)', transition:'transform 0.7s ease' }} />

                          {/* Base gradient */}
                          <div className="absolute inset-0"
                               style={{ background:'linear-gradient(to top, rgba(44,26,14,0.55) 0%, transparent 55%)' }} />

                          {/* Hover vignette */}
                          <div className="absolute inset-0 transition-opacity duration-500"
                               style={{ background:'linear-gradient(to top, rgba(44,26,14,0.75) 0%, rgba(44,26,14,0.1) 50%, transparent 100%)',
                                        opacity: isHov ? 1 : 0 }} />

                          {/* Gold shimmer on hover */}
                          <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-400"
                               style={{ background:`linear-gradient(to right, transparent, ${C.gold}, transparent)`,
                                        opacity: isHov ? 1 : 0 }} />

                          {/* Tag */}
                          <div className="absolute top-3 left-3">
                            <span className="font-cinzel text-[9px] tracking-[0.1em] px-2.5 py-1 rounded-full"
                                  style={{ background:tagStyle.bg, color:tagStyle.text }}>
                              {product.tag}
                            </span>
                          </div>

                          {/* Featured star */}
                          {product.featured && (
                            <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                                 style={{ background:`linear-gradient(135deg,${C.gold},${C.goldPale})` }}>
                              <span className="text-[10px] font-bold" style={{ color:C.bgDark }}>★</span>
                            </div>
                          )}

                          {/* View CTA */}
                          <div className="absolute bottom-4 left-4 right-4 transition-all duration-400"
                               style={{ opacity: isHov ? 1 : 0, transform: isHov ? 'translateY(0)' : 'translateY(8px)' }}>
                            <div className="flex items-center justify-between backdrop-blur-md rounded-xl px-4 py-2.5"
                                 style={{ background:'rgba(245,236,215,0.18)', border:'1px solid rgba(245,236,215,0.25)' }}>
                              <span className="font-raleway text-xs text-white">View Details</span>
                              <ArrowRight size={13} style={{ color:C.goldPale }} />
                            </div>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="px-4 py-4">
                          <p className="font-cinzel text-[9px] tracking-[0.2em] mb-1.5" style={{ color:C.gold }}>
                            {product.category.toUpperCase()}
                          </p>
                          <h3 className="font-cormorant text-[17px] font-semibold leading-tight transition-colors duration-200"
                              style={{ color: isHov ? C.gold : C.text }}>
                            {product.name}
                          </h3>
                          <p className="font-raleway text-[11px] leading-relaxed mt-1.5 line-clamp-2"
                             style={{ color:C.textLight }}>
                            {product.description}
                          </p>
                          {/* Bottom enquiry row */}
                          <div className="flex items-center justify-between mt-4 pt-3"
                               style={{ borderTop:`1px solid ${C.border}` }}>
                            <span className="font-cinzel text-[9px] tracking-[0.12em]" style={{ color:C.textLight }}>
                              ENQUIRE ON WHATSAPP
                            </span>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                                 style={{ background: isHov ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : C.goldBg,
                                          border:`1px solid ${C.goldBorder}` }}>
                              <ArrowRight size={10} style={{ color: isHov ? '#fff' : C.gold }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer count */}
          {filteredProducts.length > 0 && (
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                        className="mt-16 text-center">
              <div className="inline-flex items-center gap-4">
                <div className="h-px w-14" style={{ background:`linear-gradient(to right, transparent, ${C.goldBorder})` }} />
                <Sparkles size={13} style={{ color:C.gold }} />
                <span className="font-cinzel text-[10px] tracking-[0.28em]" style={{ color:C.textLight }}>
                  {filteredProducts.length} PIECES SHOWN
                </span>
                <Sparkles size={13} style={{ color:C.gold }} />
                <div className="h-px w-14" style={{ background:`linear-gradient(to left, transparent, ${C.goldBorder})` }} />
              </div>
            </motion.div>
          )}
        </div>
      </section>


      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={()=>setSelectedProduct(null)} />
        )}
      </AnimatePresence>

    </div>
  );
}
