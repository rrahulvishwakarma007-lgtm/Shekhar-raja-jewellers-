import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Heart, MessageCircle } from 'lucide-react';
import ProductModal from '../components/ProductModal';

const C = {
  bg:        '#FAFAFA',
  bgCard:    '#FFFFFF',
  text:      '#1A0010',
  textLight: '#999999',
  textMid:   '#6D1B4E',
  gold:      '#C2185B',
  border:    '#E8E8E8',
};

const TAG: Record<string, { bg: string; color: string }> = {
  'New Arrival': { bg: '#111',    color: '#fff' },
  'Bestseller':  { bg: '#166534', color: '#fff' },
  'Bridal Pick': { bg: '#9d174d', color: '#fff' },
  'Trending':    { bg: '#1e40af', color: '#fff' },
  'Exclusive':   { bg: '#7c3aed', color: '#fff' },
  'Luxury':      { bg: '#854d0e', color: '#fff' },
  'Limited':     { bg: '#991b1b', color: '#fff' },
  'Premium':     { bg: '#6b21a8', color: '#fff' },
  'Heritage':    { bg: '#44403c', color: '#fff' },
  'Classic':     { bg: '#92400e', color: '#fff' },
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
  { id:19, name:'Vintage Diamond Ring',      category:"Women's Ring", description:'Vintage-inspired design with intricate detailing.',                               image:'/ring1.png',             tag:'Vintage',     featured:false },
  { id:20, name:'Gold Bangle Set',           category:'Bangles',      description:'Elegant 22KT gold bangles with traditional carvings and fine finish.',           image:'/bangleA.jpg',           tag:'New Arrival', featured:false },
  { id:21, name:'Designer Bangle',           category:'Bangles',      description:'Intricate designer bangles in 22KT gold, perfect for festive occasions.',        image:'/bangleB.jpg',           tag:'Trending',    featured:false },
  { id:22, name:'Antique Bangle',            category:'Bangles',      description:'Antique-finish 22KT gold bangles with classic Indian motifs.',                   image:'/bangleC.jpg',           tag:'Heritage',    featured:false },
  { id:23, name:'Bridal Bangle',             category:'Bangles',      description:'Heavy bridal bangles in 22KT gold with ornate detailing.',                       image:'/bangleD.jpg',           tag:'Bridal Pick', featured:false },
  { id:24, name:'Festive Bangle',            category:'Bangles',      description:'Beautifully crafted gold bangles ideal for festivals.',                          image:'/bangleE.jpg',           tag:'Festive',     featured:false },
  { id:25, name:'Kundan Bangle',             category:'Bangles',      description:'Kundan-studded 22KT gold bangles with vibrant meenakari work.',                  image:'/bangleF.jpg',           tag:'Exclusive',   featured:false },
  { id:26, name:'Classic Bangle',            category:'Bangles',      description:'Timeless classic gold bangles with smooth finish and fine engraving.',           image:'/bangleG.jpg',           tag:'Classic',     featured:false },
  { id:27, name:'Temple Bangle',             category:'Bangles',      description:'Temple-art inspired bangles in 22KT gold with goddess motifs.',                  image:'/bangleH.jpg',           tag:'Traditional', featured:false },
  { id:28, name:'Royal Bangle',              category:'Bangles',      description:'Royal-style heavy gold bangles, a showstopper for every occasion.',              image:'/bangleI.jpg',           tag:'Premium',     featured:false },
  { id:29, name:'Bridal Necklace',           category:'Necklaces',    description:'Stunning 22KT bridal necklace with kundan and polki work.',                     image:'/necklaceA.jpg',         tag:'Bridal Pick', featured:true  },
  { id:30, name:'Heritage Necklace',         category:'Necklaces',    description:'Traditional heritage necklace in 22KT gold with antique finish.',               image:'/necklaceB.jpg',         tag:'Heritage',    featured:false },
  { id:31, name:'Temple Necklace',           category:'Necklaces',    description:'Handcrafted temple necklace with goddess motifs and ruby accents.',              image:'/necklaceC.jpg',         tag:'Traditional', featured:false },
  { id:32, name:'Kundan Necklace',           category:'Necklaces',    description:'Grand Kundan necklace with emerald and pearl drops in 22KT gold.',              image:'/necklaceD.jpg',         tag:'Exclusive',   featured:false },
  { id:33, name:'Gold Haar',                 category:'Necklaces',    description:'Elegant long haar in 22KT gold, ideal for festive and bridal wear.',            image:'/necklaceE.jpg',         tag:'New Arrival', featured:false },
  { id:34, name:'Gold Bangle',               category:'Bangles',      description:'Intricately crafted 22KT gold bangle with traditional Indian motifs.',          image:'/bangle100.jpg',         tag:'New Arrival', featured:false },
  { id:35, name:'Gold Bangle',               category:'Bangles',      description:'Classic 22KT gold bangle with fine hand-engraved patterns.',                    image:'/bangle101.jpg',         tag:'Classic',     featured:false },
  { id:36, name:'Gold Bangle',               category:'Bangles',      description:'Heritage-inspired gold bangle with intricate filigree detailing.',              image:'/bangle102.jpg',         tag:'Heritage',    featured:false },
  { id:37, name:'Gold Bangle',               category:'Bangles',      description:'Elegant 22KT gold bangle perfect for festive and bridal occasions.',            image:'/bangle103.jpg',         tag:'Festive',     featured:false },
  { id:38, name:'Gold Bangle',               category:'Bangles',      description:'Traditional gold bangle with temple motifs and antique finish.',                image:'/bangle104.jpg',         tag:'Traditional', featured:false },
  { id:39, name:'Gold Bangle',               category:'Bangles',      description:'Premium 22KT gold bangle with polished finish and ornate borders.',             image:'/bangle106.jpg',         tag:'Premium',     featured:false },
  { id:40, name:'Gold Bangle',               category:'Bangles',      description:'Trending designer bangle in 22KT gold with modern-meets-traditional design.',  image:'/bangle107.jpg',         tag:'Trending',    featured:false },
  { id:41, name:'Gold Bangle',               category:'Bangles',      description:'Bridal-pick 22KT gold bangle set for the perfect wedding look.',               image:'/bangle108.jpg',         tag:'Bridal Pick', featured:false },
  { id:42, name:'Short Necklace',            category:'Necklaces',    description:'Delicate short necklace in 22KT gold, ideal for everyday and festive wear.',   image:'/short necklace1.jpg',   tag:'Everyday',    featured:false },
  { id:43, name:'Short Necklace',            category:'Necklaces',    description:'Elegant short gold necklace with fine craftsmanship and classic design.',       image:'/short necklace2.jpg',   tag:'Classic',     featured:false },
  { id:44, name:'Short Necklace',            category:'Necklaces',    description:'Trendy short necklace in 22KT gold with contemporary styling.',                image:'/short necklace3.jpg',   tag:'Trending',    featured:false },
  { id:45, name:'Short Necklace',            category:'Necklaces',    description:'New arrival short necklace in 22KT gold with intricate link design.',          image:'/short necklace4.jpg',   tag:'New Arrival', featured:false },
  { id:46, name:'Turkish Necklace',          category:'Necklaces',    description:'Grand Turkish-style necklace in 22KT gold with bold layered design.',          image:'/turkish necklace1.jpg', tag:'Exclusive',   featured:true  },
  { id:47, name:'Turkish Necklace',          category:'Necklaces',    description:'Ornate Turkish necklace with antique gold finish and heritage motifs.',        image:'/turkish necklace2.jpg', tag:'Heritage',    featured:false },
  { id:48, name:'Turkish Necklace',          category:'Necklaces',    description:'Stunning Turkish-inspired necklace with traditional craftsmanship.',           image:'/turkish necklace3.jpg', tag:'Traditional', featured:false },
  { id:49, name:'Turkish Necklace',          category:'Necklaces',    description:'Premium Turkish necklace in 22KT gold with intricate detailing.',              image:'/turkish necklace4.jpg', tag:'Premium',     featured:false },
  { id:50, name:'Turkish Necklace',          category:'Necklaces',    description:'Bridal Turkish necklace with kundan accents and rich gold work.',              image:'/turkish necklace5.jpg', tag:'Bridal Pick', featured:false },
  { id:51, name:'Turkish Necklace',          category:'Necklaces',    description:'Festive Turkish necklace perfect for celebrations and special occasions.',     image:'/turkish necklace6.jpg', tag:'Festive',     featured:false },
  { id:52, name:'Turkish Necklace',          category:'Necklaces',    description:'Luxury Turkish-style gold necklace with bold statement design.',               image:'/turkish necklace7.jpg', tag:'Luxury',      featured:false },
  { id:53, name:'Turkish Necklace',          category:'Necklaces',    description:'Trending Turkish necklace in 22KT gold with modern heritage styling.',        image:'/turkish necklace8.jpg', tag:'Trending',    featured:false },
  { id:54, name:'Gold Earrings',             category:'Earrings',     description:'Classic gold earrings with intricate detailing, perfect for every occasion.',  image:'/earrings101.jpg',       tag:'Classic',     featured:false },
  { id:55, name:'Gold Earrings',             category:'Earrings',     description:'Heritage jhumka-style earrings in 22KT gold with traditional motifs.',        image:'/earrings102.jpg',       tag:'Heritage',    featured:false },
  { id:56, name:'Gold Earrings',             category:'Earrings',     description:'Exclusive 22KT gold earrings with premium finish and ornate design.',         image:'/earrings104.jpg',       tag:'Exclusive',   featured:false },
  { id:57, name:'Gold Earrings',             category:'Earrings',     description:'Trending 22KT gold earrings with contemporary meets traditional design.',     image:'/earrings105.jpg',       tag:'Trending',    featured:false },
  { id:58, name:'Gold Earrings',             category:'Earrings',     description:'New arrival earrings in 22KT gold with delicate filigree work.',              image:'/earrings106.jpg',       tag:'New Arrival', featured:false },
  { id:59, name:'Gold Earrings',             category:'Earrings',     description:'Bridal earrings in 22KT gold with kundan stones and pearl drops.',            image:'/earrings107.jpg',       tag:'Bridal Pick', featured:false },
  { id:60, name:'Jadau Necklace',            category:'Necklaces',    description:'Exquisite Jadau necklace with uncut diamonds and precious stone settings.',   image:'/Jadau Necklace1.jpg',   tag:'Luxury',      featured:true  },
  { id:61, name:'Jadau Necklace',            category:'Necklaces',    description:'Traditional Jadau necklace with Polki diamonds in 22KT gold setting.',       image:'/Jadau Necklace3.jpg',   tag:'Traditional', featured:false },
  { id:62, name:'Jadau Necklace',            category:'Necklaces',    description:'Bridal Jadau necklace with emerald drops and kundan work in 22KT gold.',     image:'/Jadau Necklace4.jpg',   tag:'Bridal Pick', featured:false },
  { id:63, name:'Jadau Necklace',            category:'Necklaces',    description:'Heritage Jadau necklace with ruby and emerald accents, fit for royalty.',    image:'/Jadau Necklace5.jpg',   tag:'Heritage',    featured:false },
  { id:64, name:'Jadau Necklace',            category:'Necklaces',    description:'Premium Jadau necklace with handcrafted motifs and precious stone inlay.',   image:'/Jadau Necklace6.jpg',   tag:'Premium',     featured:false },
  { id:65, name:'Jadau Necklace',            category:'Necklaces',    description:'Exclusive Jadau necklace with Polki diamonds and meenakari detailing.',      image:'/Jadau Necklace7.jpg',   tag:'Exclusive',   featured:false },
  { id:66, name:'Jadau Necklace',            category:'Necklaces',    description:'Bestselling Jadau necklace — a statement piece for weddings and events.',    image:'/Jadau Necklace8.jpg',   tag:'Bestseller',  featured:false },
  { id:67, name:'Gold Choker',               category:'Chokers',      description:'Elegant 22KT gold choker with intricate hand-engraved traditional patterns.', image:'/Choker101.jpg',         tag:'Classic',     featured:false },
  { id:68, name:'Gold Choker',               category:'Chokers',      description:'Heritage-style gold choker with antique finish and temple motifs.',           image:'/Choker102.jpg',         tag:'Heritage',    featured:false },
  { id:69, name:'Gold Choker',               category:'Chokers',      description:'Bridal choker in 22KT gold with kundan stones and floral patterns.',         image:'/Choker103.jpg',         tag:'Bridal Pick', featured:true  },
  { id:70, name:'Gold Choker',               category:'Chokers',      description:'Exclusive choker necklace with bold design and premium gold craftsmanship.',  image:'/choker104.jpg',         tag:'Exclusive',   featured:false },
  { id:71, name:'Gold Choker',               category:'Chokers',      description:'Trending 22KT gold choker with contemporary traditional fusion design.',     image:'/choker105.jpg',         tag:'Trending',    featured:false },
  { id:72, name:'Gold Choker',               category:'Chokers',      description:'New arrival gold choker with delicate beaded and filigree detailing.',       image:'/choker107.jpg',         tag:'New Arrival', featured:false },
  { id:73, name:'Long Haar',                 category:'Necklaces',    description:'Majestic long haar in 22KT gold with traditional coin and temple motifs.',   image:'/long haar1.jpg',        tag:'Traditional', featured:false },
  { id:74, name:'Long Haar',                 category:'Necklaces',    description:'Elegant long gold haar with intricate link design and antique gold finish.', image:'/long haar2.jpg',        tag:'Heritage',    featured:false },
  { id:75, name:'Long Haar',                 category:'Necklaces',    description:'Bridal long haar in 22KT gold — a timeless statement for the wedding day.', image:'/long haar3.jpg',        tag:'Bridal Pick', featured:false },
  { id:76, name:'Long Haar',                 category:'Necklaces',    description:'Premium long haar with layered design and fine 22KT gold craftsmanship.',   image:'/long haar4.jpg',        tag:'Premium',     featured:false },
  { id:77, name:'Long Haar',                 category:'Necklaces',    description:'Luxury long haar necklace in 22KT gold with bold statement design.',        image:'/long haar6.jpg',        tag:'Luxury',      featured:false },
  { id:78, name:'Pendant Set',               category:'Pendants',     description:'Elegant 22KT gold pendant with matching earrings and delicate design.',      image:'/pandent set1.jpg',      tag:'Classic',     featured:false },
  { id:79, name:'Pendant Set',               category:'Pendants',     description:'Heritage gold pendant with traditional motifs and antique finish.',          image:'/pandent set2.jpg',      tag:'Heritage',    featured:false },
  { id:80, name:'Pendant Set',               category:'Pendants',     description:'Bridal pendant in 22KT gold with kundan stones and pearl drops.',           image:'/pandent set3.jpg',      tag:'Bridal Pick', featured:false },
  { id:81, name:'Pendant Set',               category:'Pendants',     description:'Exclusive pendant with intricate handcrafted gold motifs.',                 image:'/pandent set4.jpg',      tag:'Exclusive',   featured:false },
  { id:82, name:'Pendant Set',               category:'Pendants',     description:'Trending pendant — contemporary gold design meets traditional art.',       image:'/pandent set5.jpg',      tag:'Trending',    featured:false },
  { id:83, name:'Pendant Set',               category:'Pendants',     description:'New arrival pendant in 22KT gold with modern heritage styling.',           image:'/pandent set6.jpg',      tag:'New Arrival', featured:false },
  { id:84, name:'Pendant Set',               category:'Pendants',     description:'Premium gold pendant with fine filigree work and elegant design.',         image:'/pandent set7.jpg',      tag:'Premium',     featured:false },
  { id:85, name:'Pendant Set',               category:'Pendants',     description:'Festive pendant in 22KT gold, perfect for celebrations and events.',       image:'/pandent set8.jpg',      tag:'Festive',     featured:false },
  { id:86, name:'Gents Gold Ring',           category:"Men's Ring",   description:'Bold 22KT gold ring for men with classic band and fine engraving.',          image:'/gents ring1.jpg',       tag:'Classic',     featured:false },
  { id:87, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Heritage men's gold ring with traditional design and antique finish.",       image:'/gents ring2.jpg',       tag:'Heritage',    featured:false },
  { id:88, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Exclusive men's 22KT gold ring with bold stone setting.",                    image:'/gents ring3.jpg',       tag:'Exclusive',   featured:false },
  { id:89, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Premium men's gold signet ring with elegant design and polished finish.",    image:'/gents ring4.jpg',       tag:'Premium',     featured:false },
  { id:90, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Trending men's gold ring with contemporary meets traditional styling.",      image:'/gents ring5.jpg',       tag:'Trending',    featured:false },
  { id:91, name:'Gents Gold Ring',           category:"Men's Ring",   description:"New arrival men's ring in 22KT gold with intricate detailing.",              image:'/gents ring6.jpg',       tag:'New Arrival', featured:false },
  { id:92, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Luxury men's gold ring — a bold statement piece for special occasions.",    image:'/gents ring7.jpg',       tag:'Luxury',      featured:false },
  { id:93, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Bestselling men's 22KT gold ring with classic band and stone accent.",      image:'/gents ring8.jpg',       tag:'Bestseller',  featured:false },
  { id:94, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Traditional men's gold ring with temple-inspired motifs.",                   image:'/gents ring9.jpg',       tag:'Traditional', featured:false },
  { id:95, name:'Gents Gold Ring',           category:"Men's Ring",   description:"Bridal men's gold ring — perfect for grooms seeking bold elegance.",        image:'/gents ring10.jpg',      tag:'Bridal Pick', featured:false },
  { id:96,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Delicate 22KT gold ring for women with floral motif and fine craftsmanship.', image:'/ladies ring1.jpg',    tag:'Classic',     featured:false },
  { id:97,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Heritage ladies gold ring with traditional design and antique finish.',       image:'/ladies ring2.jpg',    tag:'Heritage',    featured:false },
  { id:98,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Exclusive ladies 22KT gold ring with kundan stone setting.',                  image:'/ladies ring3.jpg',    tag:'Exclusive',   featured:false },
  { id:99,  name:'Ladies Gold Ring',         category:"Women's Ring", description:'Premium ladies gold ring with elegant diamond-cut band design.',              image:'/ladies ring4.jpg',    tag:'Premium',     featured:false },
  { id:100, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Trending ladies gold ring with contemporary floral pattern in 22KT.',        image:'/ladies ring5.jpg',    tag:'Trending',    featured:false },
  { id:101, name:'Ladies Gold Ring',         category:"Women's Ring", description:'New arrival ladies ring in 22KT gold with intricate meenakari detailing.',   image:'/ladies ring6.jpg',    tag:'New Arrival', featured:false },
  { id:102, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Luxury ladies gold ring — a statement piece for weddings and events.',       image:'/ladies ring7.jpg',    tag:'Luxury',      featured:false },
  { id:103, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Bestselling ladies 22KT gold ring with classic solitaire-style setting.',    image:'/ladies ring8.jpg',    tag:'Bestseller',  featured:true  },
  { id:104, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Traditional ladies gold ring with temple-inspired floral motifs.',            image:'/ladies ring9.jpg',    tag:'Traditional', featured:false },
  { id:105, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Bridal ladies ring in 22KT gold with kundan and pearl accent.',              image:'/ladies ring10.jpg',   tag:'Bridal Pick', featured:false },
  { id:106, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Festive ladies ring in 22KT gold with vibrant stone inlay work.',            image:'/ladies ring11.jpg',   tag:'Festive',     featured:false },
  { id:107, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Vintage-style ladies gold ring with intricate hand-carved detailing.',       image:'/ladies ring12.jpg',   tag:'Vintage',     featured:false },
  { id:108, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Classic ladies gold ring with bold stone setting and polished finish.',       image:'/ladies ring13.jpg',   tag:'Classic',     featured:false },
  { id:109, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Heritage ladies ring in 22KT gold with antique finish and ornate border.',   image:'/ladies ring14.jpg',   tag:'Heritage',    featured:false },
  { id:110, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Exclusive ladies ring with Polki stone and 22KT gold temple-style setting.', image:'/ladies ring15.jpg',   tag:'Exclusive',   featured:false },
  { id:111, name:'Ladies Gold Ring',         category:"Women's Ring", description:'Premium bridal ladies ring with diamond-cut band and floral crown setting.',  image:'/ladies ring16.jpg',   tag:'Premium',     featured:false },
  { id:112, name:'Gold Chain',               category:'Chains',       description:'Elegant 22KT gold chain with classic link design, perfect for everyday wear.',   image:'/chain.jpg',    tag:'Classic',     featured:true  },
  { id:113, name:'Gold Chain',               category:'Chains',       description:'Lightweight 22KT gold chain ideal for pendants and daily use.',                   image:'/chain1.jpg',   tag:'Everyday',    featured:false },
  { id:114, name:'Figaro Gold Chain',        category:'Chains',       description:'Italian figaro link chain in 22KT gold — timeless and versatile.',               image:'/chain2.jpg',   tag:'Trending',    featured:false },
  { id:115, name:'Rope Gold Chain',          category:'Chains',       description:'Twisted rope design in 22KT gold, a bold statement piece.',                      image:'/chain3.jpg',   tag:'Bestseller',  featured:true  },
  { id:116, name:'Box Link Chain',           category:'Chains',       description:'Square box link chain in 22KT gold — sleek and modern.',                         image:'/chain4.jpg',   tag:'New Arrival', featured:false },
  { id:117, name:'Heritage Gold Chain',      category:'Chains',       description:'Traditional heritage link chain in 22KT gold with antique finish.',              image:'/chain5.jpg',   tag:'Heritage',    featured:false },
  { id:118, name:'Designer Gold Chain',      category:'Chains',       description:'Designer pattern chain in 22KT gold, crafted for special occasions.',            image:'/chain6.jpg',   tag:'Exclusive',   featured:false },
  { id:119, name:'Curb Link Chain',          category:'Chains',       description:'Heavy curb link chain in 22KT gold — ideal for men and women alike.',            image:'/chain7.jpg',   tag:'Premium',     featured:false },
  { id:120, name:'Temple Gold Chain',        category:'Chains',       description:'Temple-art inspired chain in 22KT gold with traditional motifs.',                image:'/chain8.jpg',   tag:'Traditional', featured:false },
  { id:121, name:'Fancy Gold Chain',         category:'Chains',       description:'Fancy pattern gold chain in 22KT, perfect for gifting.',                        image:'/chain9.jpg',   tag:'Festive',     featured:false },
  { id:122, name:'Bridal Gold Chain',        category:'Chains',       description:'Heavy bridal chain in 22KT gold with intricate detailing.',                      image:'/chain10.jpg',  tag:'Bridal Pick', featured:false },
  { id:123, name:'Long Gold Chain',          category:'Chains',       description:'Long layering chain in 22KT gold, versatile for all looks.',                     image:'/chain11.jpg',  tag:'Classic',     featured:false },
];

const WA = '918377911745';
function waLink(name: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I'm interested in the *${name.trim()}*. Could you share details? 🙏`)}`;
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({ p, wished, onOpen, onWish }: {
  p: typeof allProducts[0];
  wished: boolean;
  onOpen: () => void;
  onWish: (id: number, e: React.MouseEvent) => void;
}) {
  const [hov, setHov] = useState(false);
  const ts = TAG[p.tag] || { bg: '#111', color: '#fff' };

  return (
    <div
      style={{ 
        background: C.bgCard, 
        position: 'relative', 
        cursor: 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image */}
      <div
        onClick={onOpen}
        style={{
          position: 'relative', aspectRatio: '1/1',
          overflow: 'hidden', background: '#F5F5F5', cursor: 'pointer',
        }}
      >
        <img
          src={p.image} alt={p.name.trim()}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hov ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            display: 'block',
          }}
        />

        {/* Badge */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 8px', borderRadius: 2,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
          background: ts.bg, color: ts.color,
          fontFamily: 'Raleway, sans-serif',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {p.tag === 'New Arrival' ? 'LATEST' : p.tag.toUpperCase()}
        </span>

        {/* Heart */}
        <button
          onClick={e => onWish(p.id, e)}
          style={{
            position: 'absolute', top: 9, right: 9,
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)',
            border: `1px solid ${wished ? '#C2185B' : 'rgba(0,0,0,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'
          }}>
          <Heart size={12} fill={wished ? '#C2185B' : 'none'} color={wished ? '#C2185B' : '#aaa'} />
        </button>

        {/* Quick view hover pill */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%',
          transform: hov ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(8px)',
          opacity: hov ? 1 : 0, transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          background: 'rgba(255,255,255,0.98)', padding: '7px 18px',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          fontFamily: 'Raleway, sans-serif', color: C.gold,
          border: `1px solid ${C.gold}`,
          borderRadius: 2, whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(194, 24, 91, 0.15)',
        }}>
          QUICK VIEW
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 12px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <p style={{ fontSize: 10, color: C.textLight, marginBottom: 4, fontFamily: 'Raleway, sans-serif', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {p.category}
        </p>
        <p
          onClick={onOpen}
          style={{
            fontSize: 15, fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 500, color: C.text, lineHeight: 1.3,
            marginBottom: 14, cursor: 'pointer', flexGrow: 1,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
          {p.name.trim()}
        </p>

        {/* WhatsApp button */}
        <a
          href={waLink(p.name)}
          target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '9px 0',
            background: hov ? '#1ebe5b' : '#25D366',
            color: '#fff', borderRadius: 2,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            fontFamily: 'Raleway, sans-serif',
            textDecoration: 'none',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: hov ? '0 4px 12px rgba(37, 211, 102, 0.3)' : 'none',
          }}
        >
          <MessageCircle size={13} />
          Enquire on WhatsApp
        </a>
      </div>
    </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 1, background: C.border }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ background: C.bgCard }}>
              <div className="animate-pulse" style={{ aspectRatio: '1/1', background: '#F2F2F2' }} />
              <div style={{ padding: 12 }}>
                <div className="animate-pulse" style={{ height: 10, width: '40%', background: '#EEE', borderRadius: 2, marginBottom: 8 }} />
                <div className="animate-pulse" style={{ height: 14, width: '75%', background: '#E8E8E8', borderRadius: 2, marginBottom: 12 }} />
                <div className="animate-pulse" style={{ height: 32, background: '#E0E0E0', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ minHeight: '100vh', background: C.bg }}>

      {/* ── Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, paddingTop: 80, paddingBottom: 20 }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', color: C.textLight, fontFamily: 'Cinzel, serif', marginBottom: 6 }}>
              
            </p>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 300, color: C.text, lineHeight: 1.1, margin: 0 }}>
              Jewellery Collection
            </h1>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textLight }} />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search pieces..."
              style={{
                width: '100%', paddingLeft: 34, paddingRight: q ? 30 : 12,
                paddingTop: 9, paddingBottom: 9,
                border: `1px solid ${q ? C.gold : C.border}`,
                borderRadius: 2, fontSize: 13, color: C.text,
                background: '#fff', outline: 'none',
                fontFamily: 'Raleway, sans-serif',
                transition: 'border-color 0.4s ease', boxSizing: 'border-box',
              }}
            />
            {q && (
              <button onClick={() => setQ('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={12} style={{ color: C.textLight }} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Category tabs ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 40 }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', overflowX: 'auto', display: 'flex', scrollbarWidth: 'none' }}>
          {categories.map(cat => {
            const isActive = tab === cat;
            const count = cat === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setTab(cat)}
                style={{
                  flexShrink: 0,
                  padding: '13px 16px',
                  fontSize: 13,
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.text : C.textLight,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${C.text}` : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  marginBottom: -1,
                }}
              >
                {cat} <span style={{ fontSize: 11, color: isActive ? C.text : C.textLight, transition: 'color 0.4s ease' }}>({count})</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Grid ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {list.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ padding: '80px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: C.textLight, marginBottom: 20 }}>Nothing found</p>
              <button
                onClick={() => { setTab('All'); setQ(''); }}
                style={{ padding: '10px 28px', background: C.text, color: '#fff', border: 'none', borderRadius: 2, fontSize: 13, cursor: 'pointer', fontFamily: 'Raleway, sans-serif', transition: 'background 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = C.textMid}
                onMouseLeave={e => e.currentTarget.style.background = C.text}
              >
                Show all
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={tab + q}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 1,
                background: C.border,
                borderTop: `1px solid ${C.border}`,
              }}
            >
              {list.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5), duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Card
                    p={p}
                    wished={wish.includes(p.id)}
                    onOpen={() => setSel(p)}
                    onWish={toggleWish}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {list.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ padding: '36px 20px', textAlign: 'center', borderTop: `1px solid ${C.border}` }}
          >
            <p style={{ fontSize: 12, color: C.textLight, fontFamily: 'Raleway, sans-serif', margin: 0, letterSpacing: '0.04em' }}>
              Showing {list.length} of {allProducts.length} pieces · 22KT BIS Hallmark Certified
            </p>
            <p style={{ fontSize: 12, color: C.textLight, fontFamily: 'Raleway, sans-serif', marginTop: 6, letterSpacing: '0.02em' }}>
              Looking for something specific?{' '}
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm looking for a specific piece. Can you help?")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ color: C.gold, textDecoration: 'none', borderBottom: `1px solid ${C.gold}`, transition: 'opacity 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Ask us on WhatsApp
              </a>
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {sel && <ProductModal product={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
