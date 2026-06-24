import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, X, Search, Crown, ShieldCheck } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Palette (matches live site) ───────────────────────────────────────────────
const C = {
  bg:         '#F5ECD7',
  bgDeep:     '#EDE0C8',
  bgCard:     '#FFFDF8',
  bgDark:     '#2C1A0E',
  bgDarkMid:  '#3D2510',
  gold:       '#B8862A',
  goldLight:  '#D4A843',
  goldPale:   '#F0D080',
  goldBorder: 'rgba(184,134,42,0.25)',
  goldBg:     'rgba(184,134,42,0.08)',
  text:       '#2C1A0E',
  textMid:    '#6B4E2A',
  textLight:  '#9A7B50',
  border:     'rgba(184,134,42,0.18)',
  shadow:     'rgba(44,26,14,0.10)',
  shadowMd:   'rgba(44,26,14,0.18)',
};

// ── Tag styles ────────────────────────────────────────────────────────────────
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

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { name: 'All',            image: null },
  { name: 'Antique',        image: '/antique2.jpg'      },
  { name: 'Necklaces',      image: '/necklace1.jpg'     },
  { name: 'Chokers',        image: '/antique3.jpg'      },
  { name: 'Earrings',       image: '/earring1.jpg'      },
  { name: 'Bangles',        image: '/bangle1.png'       },
  { name: "Men's Ring",     image: '/ring7.png'         },
  { name: 'Pendants',       image: '/pendant.png'       },
  { name: "Women's Ring",   image: '/ring2.png'         },
  { name: 'Chains',         image: '/chain2.png'        },
];

// ── Products ──────────────────────────────────────────────────────────────────
const allProducts = [

  // ── EXISTING (1–33) ──────────────────────────────────────────────────────
  { id:1,  name:'Kundan Bridal Necklace',    category:'Necklaces',    description:'Exquisite kundan work with meenakari detailing, perfect for the modern bride.',   image:'/antique1.jpg',        tag:'Bestseller',  featured:true  },
  { id:2,  name:'Diamond Eternity Ring',     category:'Antique',      description:'A stunning circle of brilliant diamonds symbolizing eternal love.',                image:'/ring2.png',           tag:'Premium',     featured:false },
  { id:3,  name:'Antique Gold Jhumkas',      category:'Earrings',     description:'Traditional temple-style jhumkas with intricate peacock motifs.',                  image:'/earrings13.png',      tag:'Heritage',    featured:false },
  { id:4,  name:'22KT Gold Bangles Set',     category:'Bangles',      description:'Set of 4 intricately designed bangles with traditional patterns.',                 image:'/bangle3.png',         tag:'Classic',     featured:false },
  { id:5,  name:'Polki Diamond Ring',        category:'Antique',      description:'Uncut polki diamonds set in 22KT gold with a classic design.',                    image:'/ring6.png',           tag:'Exclusive',   featured:true  },
  { id:6,  name:'Temple Gold Haar',          category:'Necklaces',    description:'Traditional temple necklace with goddess motifs and Lakshmi coins.',              image:'/necklace88.png',      tag:'Traditional', featured:false },
  { id:7,  name:'Ruby & Emerald Ring',       category:"Women's Ring", description:'Stunning cocktail ring with precious gemstones in kundan setting.',               image:'/ring7.png',           tag:'Limited',     featured:false },
  { id:8,  name:'Antique Necklace Set',      category:'Necklaces',    description:'Complete antique temple set with traditional craftsmanship.',                     image:'/necklace22.png',      tag:'Trending',    featured:false },
  { id:9,  name:'Meenakari Bridal Set',      category:'Necklaces',    description:'Colorful meenakari work bridal set with traditional motifs.',                     image:'/necklace3.jpg',       tag:'Bridal Pick', featured:true  },
  { id:10, name:'Festive Gold Set',          category:'Antique',      description:'Elegant gold set perfect for festive occasions.',                                  image:'/bangle5.png',         tag:'Festive',     featured:false },
  { id:11, name:'Diamond Studs',             category:'Earrings',     description:'Classic diamond studs for everyday elegance.',                                    image:'/ring4.png',           tag:'Everyday',    featured:false },
  { id:12, name:'Gold Bangles',              category:'Bangles',      description:'Heavy gold kada with traditional carvings.',                                      image:'/bangle9.png',         tag:'Heritage',    featured:false },
  { id:13, name:'Heritage Necklace',         category:'Necklaces',    description:'Elegant heritage necklace with traditional design.',                              image:'/bridal-necklace.jpg', tag:'New Arrival', featured:false },
  { id:14, name:'Solitaire Engagement Ring', category:"Women's Ring", description:'Brilliant solitaire in a classic six-prong setting.',                            image:'/ring6.png',           tag:'Premium',     featured:true  },
  { id:15, name:'Antique Choker Set',        category:'Antique',      description:'Beautiful antique choker set for festive celebrations.',                          image:'/necklace15.png',      tag:'Traditional', featured:false },
  { id:16, name:'Diamond Hoop Earrings',     category:'Earrings',     description:'Contemporary diamond hoops for modern elegance.',                                 image:'/earrings14.png',      tag:'Trending',    featured:false },
  { id:17, name:'Gold Band Ring',            category:"Women's Ring", description:'Classic gold band with elegant minimal design.',                                  image:'/ring5.png',           tag:'Classic',     featured:false },
  { id:18, name:'Diamond Cluster Ring',      category:'Antique',      description:'Beautiful cluster of diamonds in an elegant setting.',                            image:'/ring3.png',           tag:'Luxury',      featured:false },
  { id:19, name:'Vintage Diamond Ring',      category:"Women's Ring", description:'Vintage-inspired design with intricate detailing.',                               image:'/ring1.png',           tag:'Vintage',     featured:false },
  { id:20, name:'Gold Bangle Set A',         category:'Bangles',      description:'Elegant 22KT gold bangles with traditional carvings and fine finish.',           image:'/bangleA.jpg',         tag:'New Arrival', featured:false },
  { id:21, name:'Designer Bangle B',         category:'Bangles',      description:'Intricate designer bangles in 22KT gold, perfect for festive occasions.',        image:'/bangleB.jpg',         tag:'Trending',    featured:false },
  { id:22, name:'Antique Bangle C',          category:'Bangles',      description:'Antique-finish 22KT gold bangles with classic Indian motifs.',                   image:'/bangleC.jpg',         tag:'Heritage',    featured:false },
  { id:23, name:'Bridal Bangle Set D',       category:'Bangles',      description:'Heavy bridal bangles in 22KT gold with ornate detailing.',                       image:'/bangleD.jpg',         tag:'Bridal Pick', featured:false },
  { id:24, name:'Festive Bangle E',          category:'Bangles',      description:'Beautifully crafted gold bangles ideal for festivals.',                          image:'/bangleE.jpg',         tag:'Festive',     featured:false },
  { id:25, name:'Kundan Bangle F',           category:'Bangles',      description:'Kundan-studded 22KT gold bangles with vibrant meenakari work.',                  image:'/bangleF.jpg',         tag:'Exclusive',   featured:false },
  { id:26, name:'Classic Bangle G',          category:'Bangles',      description:'Timeless classic gold bangles with smooth finish and fine engraving.',           image:'/bangleG.jpg',         tag:'Classic',     featured:false },
  { id:27, name:'Temple Bangle H',           category:'Bangles',      description:'Temple-art inspired bangles in 22KT gold with goddess motifs.',                  image:'/bangleH.jpg',         tag:'Traditional', featured:false },
  { id:28, name:'Royal Bangle Set I',        category:'Bangles',      description:'Royal-style heavy gold bangles, a showstopper for every occasion.',              image:'/bangleI.jpg',         tag:'Premium',     featured:false },
  { id:29, name:'Bridal Necklace A',         category:'Necklaces',    description:'Stunning 22KT bridal necklace with kundan and polki work.',                     image:'/necklaceA.jpg',       tag:'Bridal Pick', featured:true  },
  { id:30, name:'Heritage Necklace B',       category:'Necklaces',    description:'Traditional heritage necklace in 22KT gold with antique finish.',               image:'/necklaceB.jpg',       tag:'Heritage',    featured:false },
  { id:31, name:'Temple Necklace C',         category:'Necklaces',    description:'Handcrafted temple necklace with goddess motifs and ruby accents.',              image:'/necklaceC.jpg',       tag:'Traditional', featured:false },
  { id:32, name:'Kundan Necklace D',         category:'Necklaces',    description:'Grand Kundan necklace with emerald and pearl drops in 22KT gold.',              image:'/necklaceD.jpg',       tag:'Exclusive',   featured:false },
  { id:33, name:'Gold Haar E',               category:'Necklaces',    description:'Elegant long haar in 22KT gold, ideal for festive and bridal wear.',            image:'/necklaceE.jpg',       tag:'New Arrival', featured:false },

  // ── NEW BANGLES (bangle100–108) ───────────────────────────────────────────
  { id:34, name:'Gold Bangle 100',           category:'Bangles',      description:'Intricately crafted 22KT gold bangle with traditional Indian motifs.',          image:'/bangle100.jpg',       tag:'New Arrival', featured:false },
  { id:35, name:'Gold Bangle 101',           category:'Bangles',      description:'Classic 22KT gold bangle with fine hand-engraved patterns.',                    image:'/bangle101.jpg',       tag:'Classic',     featured:false },
  { id:36, name:'Gold Bangle 102',           category:'Bangles',      description:'Heritage-inspired gold bangle with intricate filigree detailing.',              image:'/bangle102.jpg',       tag:'Heritage',    featured:false },
  { id:37, name:'Gold Bangle 103',           category:'Bangles',      description:'Elegant 22KT gold bangle perfect for festive and bridal occasions.',            image:'/bangle103.jpg',       tag:'Festive',     featured:false },
  { id:38, name:'Gold Bangle 104',           category:'Bangles',      description:'Traditional gold bangle with temple motifs and antique finish.',                image:'/bangle104.jpg',       tag:'Traditional', featured:false },
  { id:39, name:'Gold Bangle 106',           category:'Bangles',      description:'Premium 22KT gold bangle with polished finish and ornate borders.',             image:'/bangle106.jpg',       tag:'Premium',     featured:false },
  { id:40, name:'Gold Bangle 107',           category:'Bangles',      description:'Trending designer bangle in 22KT gold with modern-meets-traditional design.',  image:'/bangle107.jpg',       tag:'Trending',    featured:false },
  { id:41, name:'Gold Bangle 108',           category:'Bangles',      description:'Bridal-pick 22KT gold bangle set for the perfect wedding look.',               image:'/bangle108.jpg',       tag:'Bridal Pick', featured:false },

  // ── NEW SHORT NECKLACES ───────────────────────────────────────────────────
  { id:42, name:'Short Necklace 1',          category:'Necklaces',    description:'Delicate short necklace in 22KT gold, ideal for everyday and festive wear.',   image:'/short necklace1.jpg', tag:'Everyday',    featured:false },
  { id:43, name:'Short Necklace 2',          category:'Necklaces',    description:'Elegant short gold necklace with fine craftsmanship and classic design.',       image:'/short necklace2.jpg', tag:'Classic',     featured:false },
  { id:44, name:'Short Necklace 3',          category:'Necklaces',    description:'Trendy short necklace in 22KT gold with contemporary styling.',                image:'/short necklace3.jpg', tag:'Trending',    featured:false },
  { id:45, name:'Short Necklace 4',          category:'Necklaces',    description:'New arrival short necklace in 22KT gold with intricate link design.',          image:'/short necklace4.jpg', tag:'New Arrival', featured:false },

  // ── NEW TURKISH NECKLACES ─────────────────────────────────────────────────
  { id:46, name:'Turkish Necklace 1',        category:'Necklaces',    description:'Grand Turkish-style necklace in 22KT gold with bold layered design.',          image:'/turkish necklace1.jpg', tag:'Exclusive',   featured:true  },
  { id:47, name:'Turkish Necklace 2',        category:'Necklaces',    description:'Ornate Turkish necklace with antique gold finish and heritage motifs.',        image:'/turkish necklace2.jpg', tag:'Heritage',    featured:false },
  { id:48, name:'Turkish Necklace 3',        category:'Necklaces',    description:'Stunning Turkish-inspired necklace with traditional craftsmanship.',           image:'/turkish necklace3.jpg', tag:'Traditional', featured:false },
  { id:49, name:'Turkish Necklace 4',        category:'Necklaces',    description:'Premium Turkish necklace in 22KT gold with intricate detailing.',              image:'/turkish necklace4.jpg', tag:'Premium',     featured:false },
  { id:50, name:'Turkish Necklace 5',        category:'Necklaces',    description:'Bridal Turkish necklace with kundan accents and rich gold work.',              image:'/turkish necklace5.jpg', tag:'Bridal Pick', featured:false },
  { id:51, name:'Turkish Necklace 6',        category:'Necklaces',    description:'Festive Turkish necklace perfect for celebrations and special occasions.',     image:'/turkish necklace6.jpg', tag:'Festive',     featured:false },
  { id:52, name:'Turkish Necklace 7',        category:'Necklaces',    description:'Luxury Turkish-style gold necklace with bold statement design.',               image:'/turkish necklace7.jpg', tag:'Luxury',      featured:false },
  { id:53, name:'Turkish Necklace 8',        category:'Necklaces',    description:'Trending Turkish necklace in 22KT gold with modern heritage styling.',        image:'/turkish necklace8.jpg', tag:'Trending',    featured:false },

  // ── NEW EARRINGS (101–107, no 103) ───────────────────────────────────────
  { id:54, name:'Gold Earrings 101',         category:'Earrings',     description:'Classic gold earrings with intricate detailing, perfect for every occasion.',  image:'/earrings101.jpg',     tag:'Classic',     featured:false },
  { id:55, name:'Gold Earrings 102',         category:'Earrings',     description:'Heritage jhumka-style earrings in 22KT gold with traditional motifs.',        image:'/earrings102.jpg',     tag:'Heritage',    featured:false },
  { id:56, name:'Gold Earrings 104',         category:'Earrings',     description:'Exclusive 22KT gold earrings with premium finish and ornate design.',         image:'/earrings104.jpg',     tag:'Exclusive',   featured:false },
  { id:57, name:'Gold Earrings 105',         category:'Earrings',     description:'Trending 22KT gold earrings with contemporary meets traditional design.',     image:'/earrings105.jpg',     tag:'Trending',    featured:false },
  { id:58, name:'Gold Earrings 106',         category:'Earrings',     description:'New arrival earrings in 22KT gold with delicate filigree work.',              image:'/earrings106.jpg',     tag:'New Arrival', featured:false },
  { id:59, name:'Gold Earrings 107',         category:'Earrings',     description:'Bridal earrings in 22KT gold with kundan stones and pearl drops.',            image:'/earrings107.jpg',     tag:'Bridal Pick', featured:false },

  // ── NEW JADAU NECKLACES ───────────────────────────────────────────────────
  { id:60, name:'Jadau Necklace 1',          category:'Necklaces',    description:'Exquisite Jadau necklace with uncut diamonds and precious stone settings.',   image:'/Jadau Necklace1.jpg', tag:'Luxury',      featured:true  },
  { id:61, name:'Jadau Necklace 3',          category:'Necklaces',    description:'Traditional Jadau necklace with Polki diamonds in 22KT gold setting.',       image:'/Jadau Necklace3.jpg', tag:'Traditional', featured:false },
  { id:62, name:'Jadau Necklace 4',          category:'Necklaces',    description:'Bridal Jadau necklace with emerald drops and kundan work in 22KT gold.',     image:'/Jadau Necklace4.jpg', tag:'Bridal Pick', featured:false },
  { id:63, name:'Jadau Necklace 5',          category:'Necklaces',    description:'Heritage Jadau necklace with ruby and emerald accents, fit for royalty.',    image:'/Jadau Necklace5.jpg', tag:'Heritage',    featured:false },
  { id:64, name:'Jadau Necklace 6',          category:'Necklaces',    description:'Premium Jadau necklace with handcrafted motifs and precious stone inlay.',   image:'/Jadau Necklace6.jpg', tag:'Premium',     featured:false },
  { id:65, name:'Jadau Necklace 7',          category:'Necklaces',    description:'Exclusive Jadau necklace with Polki diamonds and meenakari detailing.',      image:'/Jadau Necklace7.jpg', tag:'Exclusive',   featured:false },
  { id:66, name:'Jadau Necklace 8',          category:'Necklaces',    description:'Bestselling Jadau necklace — a statement piece for weddings and events.',    image:'/Jadau Necklace8.jpg', tag:'Bestseller',  featured:false },

  // ── NEW CHOKERS ───────────────────────────────────────────────────────────
  { id:67, name:'Gold Choker 101',           category:'Chokers',      description:'Elegant 22KT gold choker with intricate hand-engraved traditional patterns.', image:'/Choker101.jpg',       tag:'Classic',     featured:false },
  { id:68, name:'Gold Choker 102',           category:'Chokers',      description:'Heritage-style gold choker with antique finish and temple motifs.',           image:'/Choker102.jpg',       tag:'Heritage',    featured:false },
  { id:69, name:'Gold Choker 103',           category:'Chokers',      description:'Bridal choker in 22KT gold with kundan stones and floral patterns.',         image:'/Choker103.jpg',       tag:'Bridal Pick', featured:true  },
  { id:70, name:'Gold Choker 104',           category:'Chokers',      description:'Exclusive choker necklace with bold design and premium gold craftsmanship.',  image:'/choker104.jpg',       tag:'Exclusive',   featured:false },
  { id:71, name:'Gold Choker 105',           category:'Chokers',      description:'Trending 22KT gold choker with contemporary traditional fusion design.',     image:'/choker105.jpg',       tag:'Trending',    featured:false },
  { id:72, name:'Gold Choker 107',           category:'Chokers',      description:'New arrival gold choker with delicate beaded and filigree detailing.',       image:'/choker107.jpg',       tag:'New Arrival', featured:false },

  // ── NEW LONG HAAR ─────────────────────────────────────────────────────────
  { id:73, name:'Long Haar 1',               category:'Necklaces',    description:'Majestic long haar in 22KT gold with traditional coin and temple motifs.',   image:'/long haar1.jpg',      tag:'Traditional', featured:false },
  { id:74, name:'Long Haar 2',               category:'Necklaces',    description:'Elegant long gold haar with intricate link design and antique gold finish.', image:'/long haar2.jpg',      tag:'Heritage',    featured:false },
  { id:75, name:'Long Haar 3',               category:'Necklaces',    description:'Bridal long haar in 22KT gold — a timeless statement for the wedding day.', image:'/long haar3.jpg',      tag:'Bridal Pick', featured:false },
  { id:76, name:'Long Haar 4',               category:'Necklaces',    description:'Premium long haar with layered design and fine 22KT gold craftsmanship.',   image:'/long haar4.jpg',      tag:'Premium',     featured:false },
  { id:77, name:'Long Haar 6',               category:'Necklaces',    description:'Luxury long haar necklace in 22KT gold with bold statement design.',        image:'/long haar6.jpg',      tag:'Luxury',      featured:false },

  // ── NEW PENDANT SETS ──────────────────────────────────────────────────────
  { id:78, name:'Pendant Set 1',             category:'Pendants',     description:'Elegant 22KT gold pendant set with matching earrings and delicate design.',  image:'/pandent set1.jpg',    tag:'Classic',     featured:false },
  { id:79, name:'Pendant Set 2',             category:'Pendants',     description:'Heritage gold pendant set with traditional motifs and antique finish.',      image:'/pandent set2.jpg',    tag:'Heritage',    featured:false },
  { id:80, name:'Pendant Set 3',             category:'Pendants',     description:'Bridal pendant set in 22KT gold with kundan stones and pearl drops.',       image:'/pandent set3.jpg',    tag:'Bridal Pick', featured:false },
  { id:81, name:'Pendant Set 4',             category:'Pendants',     description:'Exclusive pendant set with intricate handcrafted gold motifs.',              image:'/pandent set4.jpg',    tag:'Exclusive',   featured:false },
  { id:82, name:'Pendant Set 5',             category:'Pendants',     description:'Trending pendant set — contemporary gold design meets traditional art.',    image:'/pandent set5.jpg',    tag:'Trending',    featured:false },
  { id:83, name:'Pendant Set 6',             category:'Pendants',     description:'New arrival pendant set in 22KT gold with modern heritage styling.',        image:'/pandent set6.jpg',    tag:'New Arrival', featured:false },
  { id:84, name:'Pendant Set 7',             category:'Pendants',     description:'Premium gold pendant set with fine filigree work and elegant design.',      image:'/pandent set7.jpg',    tag:'Premium',     featured:false },
  { id:85, name:'Pendant Set 8',             category:'Pendants',     description:'Festive pendant set in 22KT gold, perfect for celebrations and events.',    image:'/pandent set8.jpg',    tag:'Festive',     featured:false },

  // ── NEW GENTS RINGS (1–10) ────────────────────────────────────────────────
  { id:86, name:"Gents Gold Ring 1",         category:"Men's Ring",   description:"Bold 22KT gold ring for men with classic band and fine engraving.",          image:'/gents ring1.jpg',     tag:'Classic',     featured:false },
  { id:87, name:"Gents Gold Ring 2",         category:"Men's Ring",   description:"Heritage men's gold ring with traditional design and antique finish.",       image:'/gents ring2.jpg',     tag:'Heritage',    featured:false },
  { id:88, name:"Gents Gold Ring 3",         category:"Men's Ring",   description:"Exclusive men's 22KT gold ring with bold stone setting.",                    image:'/gents ring3.jpg',     tag:'Exclusive',   featured:false },
  { id:89, name:"Gents Gold Ring 4",         category:"Men's Ring",   description:"Premium men's gold signet ring with elegant design and polished finish.",    image:'/gents ring4.jpg',     tag:'Premium',     featured:false },
  { id:90, name:"Gents Gold Ring 5",         category:"Men's Ring",   description:"Trending men's gold ring with contemporary meets traditional styling.",      image:'/gents ring5.jpg',     tag:'Trending',    featured:false },
  { id:91, name:"Gents Gold Ring 6",         category:"Men's Ring",   description:"New arrival men's ring in 22KT gold with intricate detailing.",              image:'/gents ring6.jpg',     tag:'New Arrival', featured:false },
  { id:92, name:"Gents Gold Ring 7",         category:"Men's Ring",   description:"Luxury men's gold ring — a bold statement piece for special occasions.",    image:'/gents ring7.jpg',     tag:'Luxury',      featured:false },
  { id:93, name:"Gents Gold Ring 8",         category:"Men's Ring",   description:"Bestselling men's 22KT gold ring with classic band and stone accent.",      image:'/gents ring8.jpg',     tag:'Bestseller',  featured:false },
  { id:94, name:"Gents Gold Ring 9",         category:"Men's Ring",   description:"Traditional men's gold ring with temple-inspired motifs.",                   image:'/gents ring9.jpg',     tag:'Traditional', featured:false },
  { id:95, name:"Gents Gold Ring 10",        category:"Men's Ring",   description:"Bridal men's gold ring — perfect for grooms seeking bold elegance.",        image:'/gents ring10.jpg',    tag:'Bridal Pick', featured:false },

  // ── NEW LADIES RINGS (1–16) ───────────────────────────────────────────────
  { id:96,  name:"Ladies Gold Ring 1",       category:"Women's Ring", description:"Delicate 22KT gold ring for women with floral motif and fine craftsmanship.", image:'/ladies ring1.jpg',    tag:'Classic',     featured:false },
  { id:97,  name:"Ladies Gold Ring 2",       category:"Women's Ring", description:"Heritage ladies gold ring with traditional design and antique finish.",       image:'/ladies ring2.jpg',    tag:'Heritage',    featured:false },
  { id:98,  name:"Ladies Gold Ring 3",       category:"Women's Ring", description:"Exclusive ladies 22KT gold ring with kundan stone setting.",                  image:'/ladies ring3.jpg',    tag:'Exclusive',   featured:false },
  { id:99,  name:"Ladies Gold Ring 4",       category:"Women's Ring", description:"Premium ladies gold ring with elegant diamond-cut band design.",              image:'/ladies ring4.jpg',    tag:'Premium',     featured:false },
  { id:100, name:"Ladies Gold Ring 5",       category:"Women's Ring", description:"Trending ladies gold ring with contemporary floral pattern in 22KT.",        image:'/ladies ring5.jpg',    tag:'Trending',    featured:false },
  { id:101, name:"Ladies Gold Ring 6",       category:"Women's Ring", description:"New arrival ladies ring in 22KT gold with intricate meenakari detailing.",   image:'/ladies ring6.jpg',    tag:'New Arrival', featured:false },
  { id:102, name:"Ladies Gold Ring 7",       category:"Women's Ring", description:"Luxury ladies gold ring — a statement piece for weddings and events.",       image:'/ladies ring7.jpg',    tag:'Luxury',      featured:false },
  { id:103, name:"Ladies Gold Ring 8",       category:"Women's Ring", description:"Bestselling ladies 22KT gold ring with classic solitaire-style setting.",    image:'/ladies ring8.jpg',    tag:'Bestseller',  featured:true  },
  { id:104, name:"Ladies Gold Ring 9",       category:"Women's Ring", description:"Traditional ladies gold ring with temple-inspired floral motifs.",            image:'/ladies ring9.jpg',    tag:'Traditional', featured:false },
  { id:105, name:"Ladies Gold Ring 10",      category:"Women's Ring", description:"Bridal ladies ring in 22KT gold with kundan and pearl accent.",              image:'/ladies ring10.jpg',   tag:'Bridal Pick', featured:false },
  { id:106, name:"Ladies Gold Ring 11",      category:"Women's Ring", description:"Festive ladies ring in 22KT gold with vibrant stone inlay work.",            image:'/ladies ring11.jpg',   tag:'Festive',     featured:false },
  { id:107, name:"Ladies Gold Ring 12",      category:"Women's Ring", description:"Vintage-style ladies gold ring with intricate hand-carved detailing.",       image:'/ladies ring12.jpg',   tag:'Vintage',     featured:false },
  { id:108, name:"Ladies Gold Ring 13",      category:"Women's Ring", description:"Classic ladies gold ring with bold stone setting and polished finish.",       image:'/ladies ring13.jpg',   tag:'Classic',     featured:false },
  { id:109, name:"Ladies Gold Ring 14",      category:"Women's Ring", description:"Heritage ladies ring in 22KT gold with antique finish and ornate border.",   image:'/ladies ring14.jpg',   tag:'Heritage',    featured:false },
  { id:110, name:"Ladies Gold Ring 15",      category:"Women's Ring", description:"Exclusive ladies ring with Polki stone and 22KT gold temple-style setting.", image:'/ladies ring15.jpg',   tag:'Exclusive',   featured:false },
  { id:111, name:"Ladies Gold Ring 16",      category:"Women's Ring", description:"Premium bridal ladies ring with diamond-cut band and floral crown setting.",  image:'/ladies ring16.jpg',   tag:'Premium',     featured:false },
];

// ── Animated count-up number ───────────────────────────────────────────────────
function CountUp({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * to));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(to);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Collections() {
  const [activeTab, setActiveTab]             = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [hoveredId, setHoveredId]             = useState<number | null>(null);
  const [heroIndex, setHeroIndex]             = useState(0);

  const featuredPool = allProducts.filter(p => p.featured);

  // Rotate hero spotlight every 4.2s
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex(i => (i + 1) % featuredPool.length);
    }, 4200);
    return () => clearInterval(t);
  }, [featuredPool.length]);

  const heroProduct = featuredPool[heroIndex] || allProducts[0];

  const filteredProducts = allProducts.filter(p => {
    const matchCat = activeTab === 'All' || p.category === activeTab;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>

      {/* ══════════════════════════════════════════════
          HERO — cinematic split: copy + rotating spotlight
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: C.bgDark }}>
        {/* Ambient gold wash */}
        <div className="absolute inset-0 opacity-25 pointer-events-none"
             style={{ backgroundImage: `radial-gradient(ellipse 70% 50% at 15% 10%, ${C.gold} 0%, transparent 65%)` }} />
        <div className="absolute inset-0 opacity-15 pointer-events-none"
             style={{ backgroundImage: `radial-gradient(ellipse 50% 60% at 100% 100%, ${C.goldLight} 0%, transparent 60%)` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10"
             style={{ paddingTop: '6.5rem', paddingBottom: '4rem' }}>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

            {/* ── Left: copy + stats ── */}
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
                          style={{ background: 'rgba(184,134,42,0.15)', border: `1px solid ${C.goldBorder}` }}>
                <Crown size={11} style={{ color: C.gold }} />
                <span className="font-cinzel text-[10px] tracking-[0.4em]" style={{ color: C.gold }}>
                  EST. 1987 · JABALPUR
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                         className="font-cormorant font-light text-white leading-[0.95] mb-5"
                         style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}>
                Exquisite <em className="italic" style={{ color: C.gold }}>Jewellery</em>,<br />
                Crafted for <em className="italic" style={{ color: C.gold }}>Eternity</em>.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                        className="font-raleway text-[15px] font-light max-w-md mb-10 leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}>
                A curated vault of 22K BIS Hallmark certified gold — each piece hand-finished by
                third-generation artisans of Shekhar Raja Jewellers.
              </motion.p>

              {/* Stat row — signature element */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
                          className="flex items-center gap-8 sm:gap-12">
                <div>
                  <p className="font-cormorant text-3xl sm:text-4xl font-semibold" style={{ color: C.gold }}>
                    <CountUp to={allProducts.length} suffix="+" />
                  </p>
                  <p className="font-raleway text-[10px] tracking-[0.2em] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    HANDCRAFTED PIECES
                  </p>
                </div>
                <div className="h-10 w-px" style={{ background: C.goldBorder }} />
                <div>
                  <p className="font-cormorant text-3xl sm:text-4xl font-semibold" style={{ color: C.gold }}>
                    <CountUp to={39} />
                  </p>
                  <p className="font-raleway text-[10px] tracking-[0.2em] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    YEARS OF LEGACY
                  </p>
                </div>
                <div className="h-10 w-px" style={{ background: C.goldBorder }} />
                <div className="flex items-center gap-2">
                  <ShieldCheck size={22} style={{ color: C.gold }} />
                  <p className="font-raleway text-[11px] leading-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    22K BIS<br />Hallmark
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Right: rotating spotlight card ── */}
            <div className="relative hidden sm:block" style={{ aspectRatio: '4/5' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroProduct.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setSelectedProduct(heroProduct)}
                  className="absolute inset-0 rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.45)' }}
                >
                  <img src={heroProduct.image} alt={heroProduct.name}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(20,12,6,0.9) 100%)' }} />

                  <div className="absolute top-5 left-5">
                    <span className="font-cinzel text-[9px] tracking-[0.15em] px-3 py-1.5 rounded-full"
                          style={{ background: 'rgba(245,236,215,0.92)', color: C.bgDark }}>
                      ★ FEATURED
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-cinzel text-[10px] tracking-[0.2em] mb-1.5" style={{ color: C.goldPale }}>
                      {heroProduct.category.toUpperCase()}
                    </p>
                    <h3 className="font-cormorant text-2xl font-semibold text-white mb-3">{heroProduct.name}</h3>
                    <div className="flex items-center gap-1.5 font-raleway text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      View piece <ArrowRight size={12} />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel dots */}
              <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2">
                {featuredPool.map((_, i) => (
                  <button key={i} onClick={() => setHeroIndex(i)}
                          className="h-1 rounded-full transition-all duration-300"
                          style={{
                            width: i === heroIndex ? 24 : 8,
                            background: i === heroIndex ? C.gold : 'rgba(245,236,215,0.25)',
                          }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATEGORY RAIL — circular portraits, horizontal scroll
      ══════════════════════════════════════════════ */}
      <section className="relative" style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const isActive = activeTab === cat.name;
              const count = cat.name === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat.name).length;
              return (
                <button key={cat.name} onClick={() => setActiveTab(cat.name)}
                        className="flex-shrink-0 flex flex-col items-center gap-2 group">
                  <div className="relative rounded-full p-[2px] transition-all duration-300"
                       style={{
                         background: isActive
                           ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`
                           : 'transparent',
                       }}>
                    <div className="rounded-full overflow-hidden transition-all duration-300"
                         style={{
                           width: 64, height: 64,
                           border: `2px solid ${isActive ? C.bgCard : C.goldBorder}`,
                           opacity: isActive ? 1 : 0.75,
                           transform: isActive ? 'scale(1)' : 'scale(0.94)',
                         }}>
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: C.bgDark }}>
                          <Sparkles size={18} style={{ color: C.gold }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-cinzel text-[8.5px] tracking-[0.12em] whitespace-nowrap transition-colors"
                        style={{ color: isActive ? C.gold : C.textLight, fontWeight: isActive ? 700 : 400 }}>
                    {cat.name.toUpperCase()}
                  </span>
                  <span className="font-raleway text-[8px] -mt-1.5" style={{ color: C.textLight, opacity: 0.6 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section className="py-6" style={{ background: C.bgDeep }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative max-w-md mx-auto">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.textLight }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search jewellery..."
              className="w-full pl-10 pr-4 py-3 rounded-full font-raleway text-sm outline-none"
              style={{
                background: C.bgCard,
                border: `1px solid ${C.goldBorder}`,
                color: C.text,
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={13} style={{ color: C.textLight }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          GRID — magnetic-tilt cards
      ══════════════════════════════════════════════ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-center py-24">
                <p className="font-cormorant text-3xl" style={{ color: C.textLight }}>No pieces found</p>
                <p className="font-raleway text-sm mt-2" style={{ color: C.textLight }}>Try a different category or search</p>
              </motion.div>
            ) : (
              <motion.div key={activeTab + searchQuery}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, i) => {
                  const isHov = hoveredId === product.id;
                  const tagStyle = TAG[product.tag] || TAG['Classic'];
                  return (
                    <motion.div key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.03, 0.4), duration: 0.4 }}
                                onHoverStart={() => setHoveredId(product.id)}
                                onHoverEnd={() => setHoveredId(null)}
                                onClick={() => setSelectedProduct(product)}
                                className="cursor-pointer rounded-xl overflow-hidden"
                                style={{
                                  background: C.bgCard,
                                  border: `1px solid ${isHov ? C.gold : C.border}`,
                                  boxShadow: isHov ? `0 20px 45px ${C.shadowMd}` : `0 4px 16px ${C.shadow}`,
                                  transform: isHov ? 'translateY(-6px)' : 'translateY(0)',
                                  transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                                }}>

                      {/* Image */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                        <img src={product.image} alt={product.name}
                             className="w-full h-full object-cover transition-transform duration-500"
                             style={{ transform: isHov ? 'scale(1.08)' : 'scale(1)' }} />

                        {/* Overlay */}
                        <div className="absolute inset-0 transition-opacity duration-400"
                             style={{ background: 'linear-gradient(to top, rgba(44,26,14,0.75) 0%, rgba(44,26,14,0.1) 50%, transparent 100%)',
                                      opacity: isHov ? 1 : 0 }} />
                        <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-400"
                             style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
                                      opacity: isHov ? 1 : 0 }} />

                        {/* Tag */}
                        <div className="absolute top-3 left-3">
                          <span className="font-cinzel text-[9px] tracking-[0.1em] px-2.5 py-1 rounded-full"
                                style={{ background: tagStyle.bg, color: tagStyle.text }}>
                            {product.tag}
                          </span>
                        </div>

                        {/* Featured star */}
                        {product.featured && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                               style={{ background: `linear-gradient(135deg,${C.gold},${C.goldPale})` }}>
                            <span className="text-[10px] font-bold" style={{ color: C.bgDark }}>★</span>
                          </div>
                        )}

                        {/* View CTA */}
                        <div className="absolute bottom-4 left-4 right-4 transition-all duration-400"
                             style={{ opacity: isHov ? 1 : 0, transform: isHov ? 'translateY(0)' : 'translateY(8px)' }}>
                          <div className="flex items-center justify-between backdrop-blur-md rounded-xl px-4 py-2.5"
                               style={{ background: 'rgba(245,236,215,0.18)', border: '1px solid rgba(245,236,215,0.25)' }}>
                            <span className="font-raleway text-xs text-white">View Details</span>
                            <ArrowRight size={13} style={{ color: C.goldPale }} />
                          </div>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="px-4 py-4">
                        <p className="font-cinzel text-[9px] tracking-[0.2em] mb-1.5" style={{ color: C.gold }}>
                          {product.category.toUpperCase()}
                        </p>
                        <h3 className="font-cormorant text-[17px] font-semibold leading-tight transition-colors duration-200"
                            style={{ color: isHov ? C.gold : C.text }}>
                          {product.name}
                        </h3>
                        <p className="font-raleway text-[11px] leading-relaxed mt-1.5 line-clamp-2"
                           style={{ color: C.textLight }}>
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-3"
                             style={{ borderTop: `1px solid ${C.border}` }}>
                          <span className="font-cinzel text-[9px] tracking-[0.12em]" style={{ color: C.textLight }}>
                            ENQUIRE ON WHATSAPP
                          </span>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                               style={{ background: isHov ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : C.goldBg,
                                        border: `1px solid ${C.goldBorder}` }}>
                            <ArrowRight size={10} style={{ color: isHov ? '#fff' : C.gold }} />
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
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="mt-16 text-center">
              <div className="inline-flex items-center gap-4">
                <div className="h-px w-14" style={{ background: `linear-gradient(to right, transparent, ${C.goldBorder})` }} />
                <Sparkles size={13} style={{ color: C.gold }} />
                <span className="font-cinzel text-[10px] tracking-[0.28em]" style={{ color: C.textLight }}>
                  {filteredProducts.length} PIECES SHOWN
                </span>
                <Sparkles size={13} style={{ color: C.gold }} />
                <div className="h-px w-14" style={{ background: `linear-gradient(to left, transparent, ${C.goldBorder})` }} />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>

    </div>
  );
}
