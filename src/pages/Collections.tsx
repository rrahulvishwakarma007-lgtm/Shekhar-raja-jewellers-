import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, X, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Royal Pink / Blush Palette ────────────────────────────────────────────
const C = {
  bg:        '#FFF5F7', 
  bgCard:    '#FFFFFF',
  bgDeep:    '#FFE4EC', 
  gold:      '#C2185B', 
  goldDk:    '#880E4F', 
  goldLt:    '#E91E8C', 
  goldPale:  '#F8BBD9', 
  goldBg:    'rgba(194,24,91,0.08)',
  text:      '#1A0010', 
  textMid:   '#6D1B4E', 
  textLight: '#AD6888', 
  imageBg:   '#050505', 
  border:    '#FFE4EC', 
};

const TAG: Record<string, { bg: string; color: string }> = {
  'New Arrival': { bg: '#FFFFFF', color: '#1A0010' },
  'Bestseller':  { bg: '#166534', color: '#fff' },
  'Bridal Pick': { bg: C.goldDk,  color: '#fff' },
  'Trending':    { bg: '#1e40af', color: '#fff' },
  'Exclusive':   { bg: '#7c3aed', color: '#fff' },
  'Luxury':      { bg: '#854d0e', color: '#fff' },
  'Limited':     { bg: '#991b1b', color: '#fff' },
  'Premium':     { bg: '#6b21a8', color: '#fff' },
  'Heritage':    { bg: '#44403c', color: '#fff' },
  'Classic':     { bg: '#FFFFFF', color: '#1A0010' },
  'Traditional': { bg: '#9a3412', color: '#fff' },
  'Festive':     { bg: '#3f6212', color: '#fff' },
  'Everyday':    { bg: '#374151', color: '#fff' },
  'Vintage':     { bg: '#292524', color: '#fff' },
};

const categories = [
  'All','Necklaces','Chokers','Earrings',
  'Bangles',"Women's Ring","Men's Ring",
  'Pendants','Chains','Antique',
];

const allProducts = [
  { id:20, name:'Gold Bangle Set',           category:'Bangles',      description:'Elegant Certified gold bangles with traditional carvings and fine finish.',           image:'/bangleA.jpg',           tag:'New Arrival', featured:false },
  { id:21, name:'Designer Bangle',           category:'Bangles',      description:'Intricate designer bangles in Certified gold, perfect for festive occasions.',        image:'/bangleB.jpg',           tag:'Trending',    featured:false },
  { id:22, name:'Antique Bangle',            category:'Bangles',      description:'Antique-finish Certified gold bangles with classic Indian motifs.',                   image:'/bangleC.jpg',           tag:'Heritage',    featured:false },
  { id:23, name:'Bridal Bangle',             category:'Bangles',      description:'Heavy bridal bangles in Certified gold with ornate detailing.',                       image:'/bangleD.jpg',           tag:'Bridal Pick', featured:false },
  { id:24, name:'Festive Bangle',            category:'Bangles',      description:'Beautifully crafted gold bangles ideal for festivals.',                          image:'/bangleE.jpg',           tag:'Festive',     featured:false },
  { id:25, name:'Kundan Bangle',             category:'Bangles',      description:'Kundan-studded Certified gold bangles with vibrant meenakari work.',                  image:'/bangleF.jpg',           tag:'Exclusive',   featured:false },
  { id:26, name:'Classic Bangle',            category:'Bangles',      description:'Timeless classic gold bangles with smooth finish and fine engraving.',           image:'/bangleG.jpg',           tag:'Classic',     featured:false },
  { id:27, name:'Temple Bangle',             category:'Bangles',      description:'Temple-art inspired bangles in Certified gold with goddess motifs.',                  image:'/bangleH.jpg',           tag:'Traditional', featured:false },
  { id:28, name:'Royal Bangle',              category:'Bangles',      description:'Royal-style heavy gold bangles, a showstopper for every occasion.',              image:'/bangleI.jpg',           tag:'Premium',     featured:false },
  { id:29, name:'Bridal Necklace',           category:'Necklaces',    description:'Stunning Certified bridal necklace with kundan and polki work.',                     image:'/necklaceA.jpg',         tag:'Bridal Pick', featured:true  },
  { id:30, name:'Heritage Necklace',         category:'Necklaces',    description:'Traditional heritage necklace in Certified gold with antique finish.',               image:'/necklaceB.jpg',         tag:'Heritage',    featured:false },
  { id:31, name:'Temple Necklace',           category:'Necklaces',    description:'Handcrafted temple necklace with goddess motifs and ruby accents.',              image:'/necklaceC.jpg',         tag:'Traditional', featured:false },
  { id:32, name:'Kundan Necklace',           category:'Necklaces',    description:'Grand Kundan necklace with emerald and pearl drops in Certified gold.',              image:'/necklaceD.jpg',         tag:'Exclusive',   featured:false },
  { id:33, name:'Gold Haar',                 category:'Necklaces',    description:'Elegant long haar in Certified gold, ideal for festive and bridal wear.',            image:'/necklaceE.jpg',         tag:'New Arrival', featured:false },
  { id:34, name:'Gold Bangle',               category:'Bangles',      description:'Intricately crafted Certified gold bangle with traditional Indian motifs.',          image:'/bangle100.jpg',         tag:'New Arrival', featured:false },
  { id:35, name:'Gold Bangle',               category:'Bangles',      description:'Classic Certified gold bangle with fine hand-engraved patterns.',                    image:'/bangle101.jpg',         tag:'Classic',     featured:false },
  { id:36, name:'Gold Bangle',               category:'Bangles',      description:'Heritage-inspired gold bangle with intricate filigree detailing.',              image:'/bangle102.jpg',         tag:'Heritage',    featured:false },
  { id:37, name:'Gold Bangle',               category:'Bangles',      description:'Elegant Certified gold bangle perfect for festive and bridal occasions.',            image:'/bangle103.jpg',         tag:'Festive',     featured:false },
  { id:38, name:'Gold Bangle',               category:'Bangles',      description:'Traditional gold bangle with temple motifs and antique finish.',                image:'/bangle104.jpg',         tag:'Traditional', featured:false },
  { id:39, name:'Gold Bangle',               category:'Bangles',      description:'Premium Certified gold bangle with polished finish and ornate borders.',             image:'/bangle106.jpg',         tag:'Premium',     featured:false },
  { id:40, name:'Gold Bangle',               category:'Bangles',      description:'Trending designer bangle in Certified gold with modern-meets-traditional design.',  image:'/bangle107.jpg',         tag:'Trending',    featured:false },
  { id:41, name:'Gold Bangle',               category:'Bangles',      description:'Bridal-pick Certified gold bangle set for the perfect wedding look.',               image:'/bangle108.jpg',         tag:'Bridal Pick', featured:false },
  { id:42, name:'Short Necklace',            category:'Necklaces',    description:'Delicate short necklace in Certified gold, ideal for everyday and festive wear.',   image:'/short necklace1.jpg',   tag:'Everyday',    featured:false },
  { id:43, name:'Short Necklace',            category:'Necklaces',    description:'Elegant short gold necklace with fine craftsmanship and classic design.',       image:'/short necklace2.jpg',   tag:'Classic',     featured:false },
  { id:44, name:'Short Necklace',            category:'Necklaces',    description:'Trendy short necklace in Certified gold with contemporary styling.',                image:'/short necklace3.jpg',   tag:'Trending',    featured:false },
  { id:45, name:'Short Necklace',            category:'Necklaces',    description:'New arrival short necklace in Certified gold with intricate link design.',          image:'/short necklace4.jpg',   tag:'New Arrival', featured:false },
  { id:46, name:'Turkish Necklace',          category:'Necklaces',    description:'Grand Turkish-style necklace in Certified gold with bold layered design.',          image:'/turkish necklace1.jpg', tag:'Exclusive',   featured:true  },
  { id:47, name:'Turkish Necklace',          category:'Necklaces',    description:'Ornate Turkish necklace with antique gold finish and heritage motifs.',        image:'/turkish necklace2.jpg', tag:'Heritage',    featured:false },
  { id:48, name:'Turkish Necklace',          category:'Necklaces',    description:'Stunning Turkish-inspired necklace with traditional craftsmanship.',           image:'/turkish necklace3.jpg', tag:'Traditional', featured:false },
  { id:49, name:'Turkish Necklace',          category:'Necklaces',    description:'Premium Turkish necklace in Certified gold with intricate detailing.',              image:'/turkish necklace4.jpg', tag:'Premium',     featured:false },
  { id:50, name:'Turkish Necklace',          category:'Necklaces',    description:'Bridal Turkish necklace with kundan accents and rich gold work.',              image:'/turkish necklace5.jpg', tag:'Bridal Pick', featured:false },
  { id:51, name:'Turkish Necklace',          category:'Necklaces',    description:'Festive Turkish necklace perfect for celebrations and special occasions.',     image:'/turkish necklace6.jpg', tag:'Festive',     featured:false },
  { id:52, name:'Turkish Necklace',          category:'Necklaces',    description:'Luxury Turkish-style gold necklace with bold statement design.',               image:'/turkish necklace7.jpg', tag:'Luxury',      featured:false },
  { id:53, name:'Turkish Necklace',          category:'Necklaces',    description:'Trending Turkish necklace in Certified gold with modern heritage styling.',        image:'/turkish necklace8.jpg', tag:'Trending',    featured:false },
  { id:54, name:'Gold Earrings',             category:'Earrings',     description:'Classic gold earrings with intricate detailing, perfect for every occasion.',  image:'/earrings101.jpg',       tag:'Classic',     featured:false },
  { id:55, name:'Gold Earrings',             category:'Earrings',     description:'Heritage jhumka-style earrings in Certified gold with traditional motifs.',        image:'/earrings102.jpg',       tag:'Heritage',    featured:false },
  { id:56, name:'Gold Earrings',             category:'Earrings',     description:'Exclusive Certified gold earrings with premium finish and ornate design.',         image:'/earrings104.jpg',       tag:'Exclusive',   featured:false },
  { id:57, name:'Gold Earrings',             category:'Earrings',     description:'Trending Certified gold earrings with contemporary meets traditional design.',     image:'/earrings105.jpg',       tag:'Trending',    featured:false },
  { id:58, name:'Gold Earrings',             category:'Earrings',     description:'New arrival earrings in Certified gold with delicate filigree work.',              image:'/earrings106.jpg',       tag:'New Arrival', featured:false },
  { id:59, name:'Gold Earrings',             category:'Earrings',     description:'Bridal earrings in Certified gold with kundan stones and pearl drops.',            image:'/earrings107.jpg',       tag:'Bridal Pick', featured:false },
  { id:60, name:'Jadau Necklace',            category:'Necklaces',    description:'Exquisite Jadau necklace with uncut diamonds and precious stone settings.',   image:'/Jadau Necklace1.jpg',   tag:'Luxury',      featured:true  },
  { id:61, name:'Jadau Necklace',            category:'Necklaces',    description:'Traditional Jadau necklace with Polki diamonds in Certified gold setting.',       image:'/Jadau Necklace3.jpg',   tag:'Traditional', featured:false },
  { id:62, name:'Jadau Necklace',            category:'Necklaces',    description:'Bridal Jadau necklace with emerald drops and kundan work in Certified gold.',     image:'/Jadau Necklace4.jpg',   tag:'Bridal Pick', featured:false },
  { id:63, name:'Jadau Necklace',            category:'Necklaces',    description:'Heritage Jadau necklace with ruby and emerald accents, fit for royalty.',    image:'/Jadau Necklace5.jpg',   tag:'Heritage',    featured:false },
  { id:64, name:'Jadau Necklace',            category:'Necklaces',    description:'Premium Jadau necklace with handcrafted motifs and precious stone inlay.',   image:'/Jadau Necklace6.jpg',   tag:'Premium',     featured:false },
  { id:65, name:'Jadau Necklace',            category:'Necklaces',    description:'Exclusive Jadau necklace with Polki diamonds and meenakari detailing.',      image:'/Jadau Necklace7.jpg',   tag:'Exclusive',   featured:false },
  { id:66, name:'Jadau Necklace',            category:'Necklaces',    description:'Bestselling Jadau necklace — a statement piece for weddings and events.',    image:'/Jadau Necklace8.jpg',   tag:'Bestseller',  featured:false },
  { id:67, name:'Gold Choker',               category:'Chokers',      description:'Elegant Certified gold choker with intricate hand-engraved traditional patterns.', image:'/Choker101.jpg',         tag:'Classic',     featured:false },
  { id:68, name:'Gold Choker',               category:'Chokers',      description:'Heritage-style gold choker with antique finish and temple motifs.',           image:'/Choker102.jpg',         tag:'Heritage',    featured:false },
  { id:69, name:'Gold Choker',               category:'Chokers',      description:'Bridal choker in Certified gold with kundan stones and floral patterns.',         image:'/Choker103.jpg',         tag:'Bridal Pick', featured:true  },
  { id:70, name:'Gold Choker',               category:'Chokers',      description:'Exclusive choker necklace with bold design and premium gold craftsmanship.',  image:'/choker104.jpg',         tag:'Exclusive',   featured:false },
  { id:71, name:'Gold Choker',               category:'Chokers',      description:'Trending Certified gold choker with contemporary traditional fusion design.',     image:'/choker105.jpg',         tag:'Trending',    featured:false },
  { id:72, name:'Gold Choker',               category:'Chokers',      description:'New arrival gold choker with delicate beaded and filigree detailing.',       image:'/choker107.jpg',         tag:'New Arrival', featured:false },
  { id:73, name:'Long Haar',                 category:'Necklaces',    description:'Majestic long haar in Certified gold with traditional coin and temple motifs.',   image:'/long haar1.jpg',        tag:'Traditional', featured:false },
  { id:74, name:'Long Haar',                 category:'Necklaces',    description:'Elegant long gold haar with intricate link design and antique gold finish.', image:'/long haar2.jpg',        tag:'Heritage',    featured:false },
  { id:75, name:'Long Haar',                 category:'Necklaces',    description:'Bridal long haar in Certified gold — a timeless statement for the wedding day.', image:'/long haar3.jpg',        tag:'Bridal Pick', featured:false },
  { id:76, name:'Long Haar',                 category:'Necklaces',    description:'Premium long haar with layered design and fine Certified gold craftsmanship.',   image:'/long haar4.jpg',        tag:'Premium',     featured:false },
  { id:77, name:'Long Haar',                 category:'Necklaces',    description:'Luxury long haar necklace in Certified gold with bold statement design.',        image:'/long haar6.jpg',        tag:'Luxury',      featured:false },
  { id:78, name:'Pendant Set',               category:'Pendants',     description:'Elegant Certified gold pendant with matching earrings and delicate design.',      image:'/pandent set1.jpg',      tag:'Classic',     featured:false },
  { id:79, name:'Pendant Set',               category:'Pendants',     description:'Heritage gold pendant with traditional motifs and antique finish.',          image:'/pandent set2.jpg',      tag:'Heritage',    featured:false },
  { id:80, name:'Pendant Set',               category:'Pendants',     description:'Bridal pendant in Certified gold with kundan stones and pearl drops.',           image:'/pandent set3.jpg',      tag:'Bridal Pick', featured:false },
  { id:81, name:'Pendant Set',               category:'Pendants',     description:'Exclusive pendant with intricate handcrafted gold motifs.',                 image:'/pandent set4.jpg',      tag:'Exclusive',   featured:false },
  { id:82, name:'Pendant Set',               category:'Pendants',     description:'Trending pendant — contemporary gold design meets traditional art.',       image:'/pandent set5.jpg',      tag:'Trending',    featured:false },
  { id:83, name:'Pendant Set',               category:'Pendants',     description:'New arrival pendant in Certified gold with modern heritage styling.',           image:'/pandent set6.jpg',      tag:'New Arrival', featured:false },
  { id:84, name:'Pendant Set',               category:'Pendants',     description:'Premium gold pendant with fine filigree work and elegant design.',         image:'/pandent set7.jpg',      tag:'Premium',     featured:false },
  { id:85, name:'Pendant Set',               category:'Pendants',     description:'Festive pendant in Certified gold, perfect for celebrations and events.',       image:'/pandent set8.jpg',      tag:'Festive',     featured:false },
  { id:86, name:'Gents Gold Ring',           category:"Men's Ring",   description:'Bold Certified gold ring for men with classic band and fine engraving.',          image:'/gents ring1.jpg',       tag:'Classic',     featured:false },
  { id:87, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Heritage men's gold ring with traditional design and antique finish.",       image:'/gents ring2.jpg',       tag:'Heritage',    featured:false },
  { id:88, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Exclusive men's Certified gold ring with bold stone setting.",                    image:'/gents ring3.jpg',       tag:'Exclusive',   featured:false },
  { id:89, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Premium men's gold signet ring with elegant design and polished finish.",    image:'/gents ring4.jpg',       tag:'Premium',     featured:false },
  { id:90, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Trending men's gold ring with contemporary meets traditional styling.",      image:'/gents ring5.jpg',       tag:'Trending',    featured:false },
  { id:91, name:'Gents Gold Ring',           category:"Men's Ring",   description:"New arrival men's ring in Certified gold with intricate detailing.",              image:'/gents ring6.jpg',       tag:'New Arrival', featured:false },
  { id:92, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Luxury men's gold ring — a bold statement piece for special occasions.",    image:'/gents ring7.jpg',       tag:'Luxury',      featured:false },
  { id:93, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Bestselling men's Certified gold ring with classic band and stone accent.",      image:'/gents ring8.jpg',       tag:'Bestseller',  featured:false },
  { id:94, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Traditional men's gold ring with temple-inspired motifs.",                   image:'/gents ring9.jpg',       tag:'Traditional', featured:false },
  { id:95, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Bridal men's gold ring — perfect for grooms seeking bold elegance.",        image:'/gents ring10.jpg',      tag:'Bridal Pick', featured:false },
  { id:96,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Delicate Certified gold ring for women with floral motif and fine craftsmanship.', image:'/ladies ring1.jpg',    tag:'Classic',     featured:false },
  { id:97,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Heritage ladies gold ring with traditional design and antique finish.',       image:'/ladies ring2.jpg',    tag:'Heritage',    featured:false },
  { id:98,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Exclusive ladies Certified gold ring with kundan stone setting.',                  image:'/ladies ring3.jpg',    tag:'Exclusive',   featured:false },
  { id:99,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Premium ladies gold ring with elegant diamond-cut band design.',              image:'/ladies ring4.jpg',    tag:'Premium',     featured:false },
  { id:100, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Trending ladies gold ring with contemporary floral pattern in Certified.',        image:'/ladies ring5.jpg',    tag:'Trending',    featured:false },
  { id:101, name:'Ladies Gold Ring',         category:"Women's Ring", description:'New arrival ladies ring in Certified gold with intricate meenakari detailing.',   image:'/ladies ring6.jpg',    tag:'New Arrival', featured:false },
  { id:102, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Luxury ladies gold ring — a statement piece for weddings and events.',       image:'/ladies ring7.jpg',    tag:'Luxury',      featured:false },
  { id:103, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Bestselling ladies Certified gold ring with classic solitaire-style setting.',    image:'/ladies ring8.jpg',    tag:'Bestseller',  featured:true  },
  { id:104, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Traditional ladies gold ring with temple-inspired floral motifs.',            image:'/ladies ring9.jpg',    tag:'Traditional', featured:false },
  { id:105, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Bridal ladies ring in Certified gold with kundan and pearl accent.',              image:'/ladies ring10.jpg',   tag:'Bridal Pick', featured:false },
  { id:106, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Festive ladies ring in Certified gold with vibrant stone inlay work.',            image:'/ladies ring11.jpg',   tag:'Festive',     featured:false },
  { id:107, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Vintage-style ladies gold ring with intricate hand-carved detailing.',       image:'/ladies ring12.jpg',   tag:'Vintage',     featured:false },
  { id:108, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Classic ladies gold ring with bold stone setting and polished finish.',       image:'/ladies ring13.jpg',   tag:'Classic',     featured:false },
  { id:109, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Heritage ladies ring in Certified gold with antique finish and ornate border.',   image:'/ladies ring14.jpg',   tag:'Heritage',    featured:false },
  { id:110, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Exclusive ladies ring with Polki stone and Certified gold temple-style setting.', image:'/ladies ring15.jpg',   tag:'Exclusive',   featured:false },
  { id:111, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Premium bridal ladies ring with diamond-cut band and floral crown setting.',  image:'/ladies ring16.jpg',   tag:'Premium',     featured:false },
  { id:112, name:'Gold Chain',               category:'Chains',       description:'Elegant Certified gold chain with classic link design, perfect for everyday wear.',   image:'/chain.jpg',    tag:'Classic',     featured:true  },
  { id:113, name:'Gold Chain',               category:'Chains',       description:'Lightweight Certified gold chain ideal for pendants and daily use.',                   image:'/chain1.jpg',   tag:'Everyday',    featured:false },
  { id:114, name:'Figaro Gold Chain',        category:'Chains',       description:'Italian figaro link chain in Certified gold — timeless and versatile.',               image:'/chain2.jpg',   tag:'Trending',    featured:false },
  { id:115, name:'Rope Gold Chain',          category:'Chains',       description:'Twisted rope design in Certified gold, a bold statement piece.',                      image:'/chain3.jpg',   tag:'Bestseller',  featured:true  },
  { id:116, name:'Box Link Chain',           category:'Chains',       description:'Square box link chain in Certified gold — sleek and modern.',                         image:'/chain4.jpg',   tag:'New Arrival', featured:false },
  { id:117, name:'Heritage Gold Chain',      category:'Chains',       description:'Traditional heritage link chain in Certified gold with antique finish.',              image:'/chain5.jpg',   tag:'Heritage',    featured:false },
  { id:118, name:'Designer Gold Chain',      category:'Chains',       description:'Designer pattern chain in Certified gold, crafted for special occasions.',            image:'/chain6.jpg',   tag:'Exclusive',   featured:false },
  { id:119, name:'Curb Link Chain',          category:'Chains',       description:'Heavy curb link chain in Certified gold — ideal for men and women alike.',            image:'/chain7.jpg',   tag:'Premium',     featured:false },
  { id:120, name:'Temple Gold Chain',        category:'Chains',       description:'Temple-art inspired chain in Certified gold with traditional motifs.',                image:'/chain8.jpg',   tag:'Traditional', featured:false },
  { id:121, name:'Fancy Gold Chain',         category:'Chains',       description:'Fancy pattern gold chain in Certified, perfect for gifting.',                        image:'/chain9.jpg',   tag:'Festive',     featured:false },
  { id:122, name:'Bridal Gold Chain',        category:'Chains',       description:'Heavy bridal chain in Certified gold with intricate detailing.',                      image:'/chain10.jpg',  tag:'Bridal Pick', featured:false },
  { id:123, name:'Long Gold Chain',          category:'Chains',       description:'Long layering chain in Certified gold, versatile for all looks.',                     image:'/chain11.jpg',  tag:'Classic',     featured:false },
];

const WA = '918377911745';
function waLink(name: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(`Greetings. I would like to consult with an expert regarding the *${name.trim()}*.`)}`;
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ p, wished, onOpen, onWish }: {
  p: typeof allProducts[0];
  wished: boolean;
  onOpen: () => void;
  onWish: (id: number, e: React.MouseEvent) => void;
}) {
  const ts = TAG[p.tag] || { bg: '#111', color: '#fff' };
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax scroll setup: tracks the card's position relative to the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Maps the scroll progress (0 to 1) into a vertical pixel shift (-5% to 5%)
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.div 
      ref={cardRef}
      className="product-card" 
      whileTap={{ scale: 0.96 }}
      style={{ background: C.bgCard, border: `1px solid ${C.border}`, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
    >
      
      {/* Editorial Image Container */}
      <div
        onClick={onOpen}
        style={{ 
          position: 'relative', 
          aspectRatio: '1/1', 
          overflow: 'hidden', 
          background: C.imageBg, 
          cursor: 'pointer' 
        }}
      >
        {/* The Parallax Wrapper: Separates the scroll movement (y) from the hover scaling (className) */}
        <motion.div 
          style={{ 
            position: 'absolute', top: '-10%', left: 0, 
            width: '100%', height: '120%', // 120% height ensures no edges show during the parallax shift
            y: y 
          }}
        >
          <motion.img
            initial={{ filter: 'blur(3px)' }}
            whileInView={{ filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8 }}
            src={p.image} alt={p.name.trim()}
            className="product-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </motion.div>

        {/* Tag Overlapping Image */}
        <span className="product-tag" style={{
          position: 'absolute', top: 12, left: 12,
          padding: '4px 10px',
          fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
          background: ts.bg, color: ts.color,
          fontFamily: 'Raleway, sans-serif', textTransform: 'uppercase',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
        }}>
          {p.tag === 'New Arrival' ? 'LATEST' : p.tag.toUpperCase()}
        </span>

        {/* Heart Overlapping Image */}
        <motion.button
          onClick={e => onWish(p.id, e)}
          whileTap={{ scale: 0.85 }}
          className="heart-btn"
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'none', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10
          }}>
          <Heart size={20} strokeWidth={1.5} fill={wished ? C.gold : 'none'} color={wished ? C.gold : '#FFFFFF'} style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
        </motion.button>

        {/* Quick view hover pill */}
        <div className="quick-view" style={{
          position: 'absolute', bottom: 16, left: '50%',
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', padding: '8px 24px',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
          fontFamily: 'Raleway, sans-serif', color: C.text,
          border: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          pointerEvents: 'none'
        }}>
          QUICK VIEW
        </div>
      </div>

      {/* Info Panel */}
      <div className="card-info" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center', background: C.bgCard }}>
        <p className="product-category" style={{ fontSize: 10, color: C.textLight, marginBottom: 8, fontFamily: 'Raleway, sans-serif', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {p.category}
        </p>
        <p
          onClick={onOpen}
          className="product-title"
          style={{
            fontSize: '1.25rem', fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 500, color: C.text, lineHeight: 1.3,
            marginBottom: 16, cursor: 'pointer', flexGrow: 1,
          }}>
          {p.name.trim()}
        </p>

        <a
          href={waLink(p.name)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
          className="enquire-link"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
            fontFamily: 'Raleway, sans-serif', color: C.gold, textDecoration: 'none',
            textTransform: 'uppercase', margin: '0 auto'
          }}
        >
          Enquire <ArrowRight size={12} strokeWidth={2} />
        </a>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Collections() {
  const [tab, setTab]           = useState('All');
  const [q, setQ]               = useState('');
  const [wish, setWish]         = useState<number[]>([]);
  const [sel, setSel]           = useState<typeof allProducts[0] | null>(null);
  const [ready, setReady]       = useState(false);

  useEffect(() => { const t = setTimeout(() => setReady(true), 350); return () => clearTimeout(t); }, []);

  const toggleWish = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWish(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const list = allProducts.filter(p => {
    const catOk = tab === 'All' || p.category === tab;
    const sq = q.toLowerCase();
    const searchOk = !sq || p.name.toLowerCase().includes(sq) || p.category.toLowerCase().includes(sq) || p.tag.toLowerCase().includes(sq);
    return catOk && searchOk;
  });

  if (!ready) return (
    <div style={{ minHeight: '100vh', background: C.bg }} className="pt-20">
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 16px' }}>
        <div className="product-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ border: `1px solid ${C.border}` }}>
              <div className="animate-pulse" style={{ aspectRatio: '1/1', background: C.border }} />
              <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="animate-pulse" style={{ height: 8, width: '40%', background: C.border, marginBottom: 16 }} />
                <div className="animate-pulse" style={{ height: 16, width: '75%', background: C.border }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        /* Royal / Editorial Grid Setup */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 40px 24px;
        }

        /* Responsive Category Scrolling Container */
        .category-scroll-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          overflow-x: auto;
          display: flex;
          justify-content: center;
          scrollbar-width: none; 
          -ms-overflow-style: none; 
        }
        .category-scroll-container::-webkit-scrollbar { 
          display: none; 
        }

        /* Product Hover Scale (Isolated from Parallax scroll) */
        .product-img { 
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
        }
        
        .quick-view { transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; transform: translateX(-50%) translateY(12px); }
        .heart-btn { transition: transform 0.2s ease; }
        .tab-btn { transition: all 0.4s ease; position: relative; }
        .enquire-link { transition: all 0.3s ease; opacity: 0.8; }
        .concierge-btn { transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease; }

        /* True Hover for non-touch devices */
        @media (hover: hover) and (pointer: fine) {
          .product-card:hover { border-color: ${C.gold} !important; box-shadow: 0 10px 30px ${C.goldBg}; }
          .product-card:hover .product-img { transform: scale(1.08); }
          .product-card:hover .quick-view { opacity: 1; transform: translateX(-50%) translateY(0); }
          .product-card:hover .heart-btn { transform: scale(1.1); }
          .product-card:hover .enquire-link { opacity: 1; }
          .tab-btn:hover { color: ${C.text} !important; }
          .concierge-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(136, 14, 79, 0.2) !important; background: ${C.text} !important; }
        }

        /* Mobile specific spacing */
        @media (max-width: 768px) {
          .category-scroll-container {
             justify-content: flex-start;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr); /* FORCES exactly 2 items per row on mobile */
            gap: 20px 12px; 
          }
          
          /* Scale down card elements so they fit beautifully in 2 columns */
          .card-info { padding: 16px 8px !important; }
          .product-tag { font-size: 8px !important; padding: 4px 6px !important; top: 8px !important; left: 8px !important; letter-spacing: 0.08em !important; }
          .heart-btn { top: 6px !important; right: 6px !important; transform: scale(0.9); }
          .product-category { font-size: 9px !important; margin-bottom: 6px !important; }
          .product-title { font-size: 1.05rem !important; margin-bottom: 12px !important; line-height: 1.2 !important; }
          .enquire-link { font-size: 9px !important; }
          
          .quick-view { display: none !important; }
          .header-title { font-size: 2.2rem !important; }
          .concierge-btn { bottom: 20px !important; right: 20px !important; padding: 12px 18px !important; }
          .concierge-text { display: none; } 
        }
      `}</style>

      {/* Floating Private Concierge Button */}
      <motion.a
        href={waLink("a Custom Piece")} target="_blank" rel="noopener noreferrer"
        initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="concierge-btn"
        style={{
          position: 'fixed', bottom: 30, right: 30, zIndex: 100,
          background: C.goldDk, color: '#fff', padding: '14px 28px',
          borderRadius: '40px', display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none', fontFamily: 'Raleway, sans-serif', fontSize: 11,
          fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          boxShadow: '0 10px 24px rgba(136, 14, 79, 0.15)', border: `1px solid ${C.goldDk}`
        }}
      >
        <MessageCircle size={16} color={C.goldPale} />
        <span className="concierge-text">Private Concierge</span>
      </motion.a>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
                  style={{ minHeight: '100vh', background: C.bg, position: 'relative', overflow: 'hidden' }}>

        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* ── Editorial Header ── */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ background: 'transparent', paddingTop: 90, paddingBottom: 40 }}
          >
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
              
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: C.gold, fontFamily: 'Raleway, sans-serif', marginBottom: 12, textTransform: 'uppercase', fontWeight: 600 }}>
                Heritage Jewels
              </p>
              
              <h1 className="header-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', fontWeight: 300, color: C.text, lineHeight: 1.1, margin: 0 }}>
                The Royal Collection
              </h1>
              
              {/* Elegant Divider */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '24px 0 20px' }}>
                <div style={{ height: 1, width: 60, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
                <span style={{ color: C.gold, fontSize: 12 }}>✦</span>
                <div style={{ height: 1, width: 60, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
              </div>
              
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.25rem', color: C.textLight, margin: 0 }}>
                Timeless heritage pieces, expertly handcrafted in gold.
              </p>

              {/* Minimal Search */}
              <div style={{ position: 'relative', width: 280, maxWidth: '100%', margin: '32px auto 0' }}>
                <Search size={14} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
                <input
                  value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search the collection..."
                  style={{
                    width: '100%', padding: '12px 30px',
                    border: 'none', borderBottom: `1px solid ${q ? C.gold : C.border}`,
                    fontSize: 12, color: C.text, background: 'transparent', outline: 'none', 
                    fontFamily: 'Raleway, sans-serif', transition: 'border-color 0.5s ease',
                    textAlign: 'center', letterSpacing: '0.05em'
                  }}
                />
                {q && (
                  <button onClick={() => setQ('')} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={14} style={{ color: C.textLight }} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Staggered Category Tabs ── */}
          <motion.div 
            initial="hidden" animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } }
            }}
            style={{ background: 'rgba(255,245,247,0.85)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 40, borderBottom: `1px solid ${C.border}` }}
          >
            <div className="category-scroll-container">
              {categories.map(cat => {
                const isActive = tab === cat;
                return (
                  <motion.button
                    variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                    transition={{ ease: [0.25, 0.46, 0.45, 0.94], duration: 0.6 }}
                    key={cat} onClick={() => setTab(cat)} className="tab-btn"
                    style={{
                      flexShrink: 0, padding: '18px 24px', fontSize: 11, fontFamily: 'Raleway, sans-serif',
                      fontWeight: isActive ? 700 : 500, color: isActive ? C.text : C.textLight,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      background: 'transparent', border: 'none',
                      borderBottom: isActive ? `2px solid ${C.text}` : '2px solid transparent',
                      cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: -1,
                    }}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Grid ── */}
          <div style={{ maxWidth: 1400, margin: '40px auto 80px', padding: '0 20px' }}>
            <AnimatePresence mode="wait">
              {list.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ padding: '80px 20px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontStyle: 'italic', color: C.textLight, marginBottom: 24 }}>No pieces found matching your criteria.</p>
                  <button
                    onClick={() => { setTab('All'); setQ(''); }}
                    style={{ padding: '12px 32px', background: 'transparent', color: C.text, border: `1px solid ${C.text}`, borderRadius: 0, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Raleway, sans-serif', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.text; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text; }}
                  >
                    View Entire Collection
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={tab + q}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="product-grid"
                >
                  {list.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      transition={{ delay: (i % 2) * 0.15, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <Card p={p} wished={wish.includes(p.id)} onOpen={() => setSel(p)} onWish={toggleWish} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {list.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ padding: '60px 20px 20px', textAlign: 'center', marginTop: 40 }}
              >
                <div style={{ width: 40, height: 1, background: C.border, margin: '0 auto 24px' }} />
                <p style={{ fontSize: 10, color: C.textLight, fontFamily: 'Raleway, sans-serif', margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Showing {list.length} of {allProducts.length} pieces
                </p>
                <p style={{ fontSize: 12, color: C.textLight, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', marginTop: 12, letterSpacing: '0.05em' }}>
                  Exclusively Certified BIS Hallmark Certified.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {sel && <ProductModal product={sel} onClose={() => setSel(null)} />}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
