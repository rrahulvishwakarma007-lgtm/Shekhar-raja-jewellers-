import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MessageCircle, Heart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductModal from '../components/ProductModal';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:         '#FFF5F7',
  bgDeep:     '#FFE4EC',
  bgCard:     '#FFFFFF',
  bgDark:     '#880E4F',
  gold:       '#C2185B',
  goldLight:  '#E91E8C',
  goldPale:   '#F8BBD9',
  goldBorder: 'rgba(194,24,91,0.25)',
  goldBg:     'rgba(194,24,91,0.08)',
  text:       '#1A0010',
  textMid:    '#6D1B4E',
  textLight:  '#AD6888',
  border:     'rgba(194,24,91,0.18)',
  shadow:     'rgba(194,24,91,0.08)',
  shadowMd:   'rgba(194,24,91,0.15)',
};

// ── Tag styles ────────────────────────────────────────────────────────────────
const TAG: Record<string, { bg: string; text: string }> = {
  'Bestseller':  { bg: '#dcfce7', text: '#166534' },
  'Premium':     { bg: '#f3e8ff', text: '#6b21a8' },
  'Heritage':    { bg: '#f5f5f4', text: '#44403c' },
  'Classic':     { bg: '#fef3c7', text: '#92400e' },
  'Exclusive':   { bg: '#ffe4e6', text: '#9f1239' },
  'Traditional': { bg: '#ffedd5', text: '#9a3412' },
  'Limited':     { bg: '#fee2e2', text: '#991b1b' },
  'Trending':    { bg: '#dbeafe', text: '#1e40af' },
  'Bridal Pick': { bg: '#fce7f3', text: '#9d174d' },
  'Festive':     { bg: '#ecfccb', text: '#3f6212' },
  'Everyday':    { bg: '#f3f4f6', text: '#1f2937' },
  'New Arrival': { bg: '#ccfbf1', text: '#115e59' },
  'Luxury':      { bg: '#fef08a', text: '#854d0e' },
  'Vintage':     { bg: '#e7e5e4', text: '#292524' },
};

// ── Categories ────────────────────────────────────────────────────────────────
const categories = [
  { name: 'All',            image: null,               emoji: '✨' },
  { name: 'Necklaces',      image: '/necklace1.jpg',   emoji: '📿' },
  { name: 'Chokers',        image: '/antique3.jpg',    emoji: '💫' },
  { name: 'Earrings',       image: '/earring1.jpg',    emoji: '💛' },
  { name: 'Bangles',        image: '/bangle1.png',     emoji: '🔮' },
  { name: "Men's Ring",     image: '/ring7.png',       emoji: '💍' },
  { name: "Women's Ring",   image: '/ring2.png',       emoji: '💎' },
  { name: 'Pendants',       image: '/pendant.png',     emoji: '🌟' },
  { name: 'Chains',         image: '/chain2.png',      emoji: '⛓️' },
  { name: 'Antique',        image: '/antique2.jpg',    emoji: '🏺' },
];

// ── Tag filter groups (user-friendly labels) ──────────────────────────────────
const tagGroups = [
  { label: 'All Styles', value: 'all' },
  { label: '💍 Bridal',   value: 'Bridal Pick' },
  { label: '🎉 Festive',  value: 'Festive' },
  { label: '🌟 New In',   value: 'New Arrival' },
  { label: '🔥 Trending', value: 'Trending' },
  { label: '👑 Luxury',   value: 'Luxury' },
  { label: '⭐ Bestseller', value: 'Bestseller' },
  { label: '🕌 Heritage', value: 'Heritage' },
  { label: '💫 Everyday', value: 'Everyday' },
];

// ── Products ──────────────────────────────────────────────────────────────────
const allProducts = [
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
  { id:20, name:'Gold Bangle Set',           category:'Bangles',      description:'Elegant 22KT gold bangles with traditional carvings and fine finish.',           image:'/bangleA.jpg',         tag:'New Arrival', featured:false },
  { id:21, name:'Designer Bangle',           category:'Bangles',      description:'Intricate designer bangles in 22KT gold, perfect for festive occasions.',        image:'/bangleB.jpg',         tag:'Trending',    featured:false },
  { id:22, name:'Antique Bangle',            category:'Bangles',      description:'Antique-finish 22KT gold bangles with classic Indian motifs.',                   image:'/bangleC.jpg',         tag:'Heritage',    featured:false },
  { id:23, name:'Bridal Bangle',             category:'Bangles',      description:'Heavy bridal bangles in 22KT gold with ornate detailing.',                       image:'/bangleD.jpg',         tag:'Bridal Pick', featured:false },
  { id:24, name:'Festive Bangle',            category:'Bangles',      description:'Beautifully crafted gold bangles ideal for festivals.',                          image:'/bangleE.jpg',         tag:'Festive',     featured:false },
  { id:25, name:'Kundan Bangle',             category:'Bangles',      description:'Kundan-studded 22KT gold bangles with vibrant meenakari work.',                  image:'/bangleF.jpg',         tag:'Exclusive',   featured:false },
  { id:26, name:'Classic Bangle',            category:'Bangles',      description:'Timeless classic gold bangles with smooth finish and fine engraving.',           image:'/bangleG.jpg',         tag:'Classic',     featured:false },
  { id:27, name:'Temple Bangle',             category:'Bangles',      description:'Temple-art inspired bangles in 22KT gold with goddess motifs.',                  image:'/bangleH.jpg',         tag:'Traditional', featured:false },
  { id:28, name:'Royal Bangle',              category:'Bangles',      description:'Royal-style heavy gold bangles, a showstopper for every occasion.',              image:'/bangleI.jpg',         tag:'Premium',     featured:false },
  { id:29, name:'Bridal Necklace',           category:'Necklaces',    description:'Stunning 22KT bridal necklace with kundan and polki work.',                     image:'/necklaceA.jpg',       tag:'Bridal Pick', featured:true  },
  { id:30, name:'Heritage Necklace',         category:'Necklaces',    description:'Traditional heritage necklace in 22KT gold with antique finish.',               image:'/necklaceB.jpg',       tag:'Heritage',    featured:false },
  { id:31, name:'Temple Necklace',           category:'Necklaces',    description:'Handcrafted temple necklace with goddess motifs and ruby accents.',              image:'/necklaceC.jpg',       tag:'Traditional', featured:false },
  { id:32, name:'Kundan Necklace',           category:'Necklaces',    description:'Grand Kundan necklace with emerald and pearl drops in 22KT gold.',              image:'/necklaceD.jpg',       tag:'Exclusive',   featured:false },
  { id:33, name:'Gold Haar',                 category:'Necklaces',    description:'Elegant long haar in 22KT gold, ideal for festive and bridal wear.',            image:'/necklaceE.jpg',       tag:'New Arrival', featured:false },
  { id:34, name:'Gold Bangle — Motif',       category:'Bangles',      description:'Intricately crafted 22KT gold bangle with traditional Indian motifs.',          image:'/bangle100.jpg',       tag:'New Arrival', featured:false },
  { id:35, name:'Gold Bangle — Engraved',    category:'Bangles',      description:'Classic 22KT gold bangle with fine hand-engraved patterns.',                    image:'/bangle101.jpg',       tag:'Classic',     featured:false },
  { id:36, name:'Gold Bangle — Filigree',    category:'Bangles',      description:'Heritage-inspired gold bangle with intricate filigree detailing.',              image:'/bangle102.jpg',       tag:'Heritage',    featured:false },
  { id:37, name:'Gold Bangle — Festive',     category:'Bangles',      description:'Elegant 22KT gold bangle perfect for festive and bridal occasions.',            image:'/bangle103.jpg',       tag:'Festive',     featured:false },
  { id:38, name:'Gold Bangle — Temple',      category:'Bangles',      description:'Traditional gold bangle with temple motifs and antique finish.',                image:'/bangle104.jpg',       tag:'Traditional', featured:false },
  { id:39, name:'Gold Bangle — Premium',     category:'Bangles',      description:'Premium 22KT gold bangle with polished finish and ornate borders.',             image:'/bangle106.jpg',       tag:'Premium',     featured:false },
  { id:40, name:'Gold Bangle — Designer',    category:'Bangles',      description:'Trending designer bangle in 22KT gold with modern-meets-traditional design.',  image:'/bangle107.jpg',       tag:'Trending',    featured:false },
  { id:41, name:'Gold Bangle — Bridal',      category:'Bangles',      description:'Bridal-pick 22KT gold bangle set for the perfect wedding look.',               image:'/bangle108.jpg',       tag:'Bridal Pick', featured:false },
  { id:42, name:'Short Necklace — Everyday', category:'Necklaces',    description:'Delicate short necklace in 22KT gold, ideal for everyday and festive wear.',   image:'/short necklace1.jpg', tag:'Everyday',    featured:false },
  { id:43, name:'Short Necklace — Classic',  category:'Necklaces',    description:'Elegant short gold necklace with fine craftsmanship and classic design.',       image:'/short necklace2.jpg', tag:'Classic',     featured:false },
  { id:44, name:'Short Necklace — Trendy',   category:'Necklaces',    description:'Trendy short necklace in 22KT gold with contemporary styling.',                image:'/short necklace3.jpg', tag:'Trending',    featured:false },
  { id:45, name:'Short Necklace — New In',   category:'Necklaces',    description:'New arrival short necklace in 22KT gold with intricate link design.',          image:'/short necklace4.jpg', tag:'New Arrival', featured:false },
  { id:46, name:'Turkish Necklace — Grand',  category:'Necklaces',    description:'Grand Turkish-style necklace in 22KT gold with bold layered design.',          image:'/turkish necklace1.jpg', tag:'Exclusive', featured:true  },
  { id:47, name:'Turkish Necklace — Antique',category:'Necklaces',    description:'Ornate Turkish necklace with antique gold finish and heritage motifs.',        image:'/turkish necklace2.jpg', tag:'Heritage',  featured:false },
  { id:48, name:'Turkish Necklace — Classic',category:'Necklaces',    description:'Stunning Turkish-inspired necklace with traditional craftsmanship.',           image:'/turkish necklace3.jpg', tag:'Traditional',featured:false },
  { id:49, name:'Turkish Necklace — Premium',category:'Necklaces',    description:'Premium Turkish necklace in 22KT gold with intricate detailing.',              image:'/turkish necklace4.jpg', tag:'Premium',   featured:false },
  { id:50, name:'Turkish Bridal Necklace',   category:'Necklaces',    description:'Bridal Turkish necklace with kundan accents and rich gold work.',              image:'/turkish necklace5.jpg', tag:'Bridal Pick',featured:false },
  { id:51, name:'Turkish Necklace — Festive',category:'Necklaces',    description:'Festive Turkish necklace perfect for celebrations and special occasions.',     image:'/turkish necklace6.jpg', tag:'Festive',   featured:false },
  { id:52, name:'Turkish Necklace — Luxury', category:'Necklaces',    description:'Luxury Turkish-style gold necklace with bold statement design.',               image:'/turkish necklace7.jpg', tag:'Luxury',    featured:false },
  { id:53, name:'Turkish Necklace — Trending',category:'Necklaces',   description:'Trending Turkish necklace in 22KT gold with modern heritage styling.',        image:'/turkish necklace8.jpg', tag:'Trending',  featured:false },
  { id:54, name:'Gold Earrings — Classic',   category:'Earrings',     description:'Classic gold earrings with intricate detailing, perfect for every occasion.',  image:'/earrings101.jpg',     tag:'Classic',     featured:false },
  { id:55, name:'Gold Earrings — Heritage',  category:'Earrings',     description:'Heritage jhumka-style earrings in 22KT gold with traditional motifs.',        image:'/earrings102.jpg',     tag:'Heritage',    featured:false },
  { id:56, name:'Gold Earrings — Exclusive', category:'Earrings',     description:'Exclusive 22KT gold earrings with premium finish and ornate design.',         image:'/earrings104.jpg',     tag:'Exclusive',   featured:false },
  { id:57, name:'Gold Earrings — Trending',  category:'Earrings',     description:'Trending 22KT gold earrings with contemporary meets traditional design.',     image:'/earrings105.jpg',     tag:'Trending',    featured:false },
  { id:58, name:'Gold Earrings — New In',    category:'Earrings',     description:'New arrival earrings in 22KT gold with delicate filigree work.',              image:'/earrings106.jpg',     tag:'New Arrival', featured:false },
  { id:59, name:'Bridal Gold Earrings',      category:'Earrings',     description:'Bridal earrings in 22KT gold with kundan stones and pearl drops.',            image:'/earrings107.jpg',     tag:'Bridal Pick', featured:false },
  { id:60, name:'Jadau Necklace — Luxury',   category:'Necklaces',    description:'Exquisite Jadau necklace with uncut diamonds and precious stone settings.',   image:'/Jadau Necklace1.jpg', tag:'Luxury',      featured:true  },
  { id:61, name:'Jadau Necklace — Traditional',category:'Necklaces',  description:'Traditional Jadau necklace with Polki diamonds in 22KT gold setting.',       image:'/Jadau Necklace3.jpg', tag:'Traditional', featured:false },
  { id:62, name:'Jadau Bridal Necklace',     category:'Necklaces',    description:'Bridal Jadau necklace with emerald drops and kundan work in 22KT gold.',     image:'/Jadau Necklace4.jpg', tag:'Bridal Pick', featured:false },
  { id:63, name:'Jadau Necklace — Heritage', category:'Necklaces',    description:'Heritage Jadau necklace with ruby and emerald accents, fit for royalty.',    image:'/Jadau Necklace5.jpg', tag:'Heritage',    featured:false },
  { id:64, name:'Jadau Necklace — Premium',  category:'Necklaces',    description:'Premium Jadau necklace with handcrafted motifs and precious stone inlay.',   image:'/Jadau Necklace6.jpg', tag:'Premium',     featured:false },
  { id:65, name:'Jadau Necklace — Exclusive',category:'Necklaces',    description:'Exclusive Jadau necklace with Polki diamonds and meenakari detailing.',      image:'/Jadau Necklace7.jpg', tag:'Exclusive',   featured:false },
  { id:66, name:'Jadau Necklace — Bestseller',category:'Necklaces',   description:'Bestselling Jadau necklace — a statement piece for weddings and events.',    image:'/Jadau Necklace8.jpg', tag:'Bestseller',  featured:false },
  { id:67, name:'Gold Choker — Classic',     category:'Chokers',      description:'Elegant 22KT gold choker with intricate hand-engraved traditional patterns.', image:'/Choker101.jpg',       tag:'Classic',     featured:false },
  { id:68, name:'Gold Choker — Heritage',    category:'Chokers',      description:'Heritage-style gold choker with antique finish and temple motifs.',           image:'/Choker102.jpg',       tag:'Heritage',    featured:false },
  { id:69, name:'Bridal Gold Choker',        category:'Chokers',      description:'Bridal choker in 22KT gold with kundan stones and floral patterns.',         image:'/Choker103.jpg',       tag:'Bridal Pick', featured:true  },
  { id:70, name:'Gold Choker — Exclusive',   category:'Chokers',      description:'Exclusive choker necklace with bold design and premium gold craftsmanship.',  image:'/choker104.jpg',       tag:'Exclusive',   featured:false },
  { id:71, name:'Gold Choker — Trending',    category:'Chokers',      description:'Trending 22KT gold choker with contemporary traditional fusion design.',     image:'/choker105.jpg',       tag:'Trending',    featured:false },
  { id:72, name:'Gold Choker — New In',      category:'Chokers',      description:'New arrival gold choker with delicate beaded and filigree detailing.',       image:'/choker107.jpg',       tag:'New Arrival', featured:false },
  { id:73, name:'Long Haar — Traditional',   category:'Necklaces',    description:'Majestic long haar in 22KT gold with traditional coin and temple motifs.',   image:'/long haar1.jpg',      tag:'Traditional', featured:false },
  { id:74, name:'Long Haar — Heritage',      category:'Necklaces',    description:'Elegant long gold haar with intricate link design and antique gold finish.', image:'/long haar2.jpg',      tag:'Heritage',    featured:false },
  { id:75, name:'Bridal Long Haar',          category:'Necklaces',    description:'Bridal long haar in 22KT gold — a timeless statement for the wedding day.', image:'/long haar3.jpg',      tag:'Bridal Pick', featured:false },
  { id:76, name:'Long Haar — Premium',       category:'Necklaces',    description:'Premium long haar with layered design and fine 22KT gold craftsmanship.',   image:'/long haar4.jpg',      tag:'Premium',     featured:false },
  { id:77, name:'Long Haar — Luxury',        category:'Necklaces',    description:'Luxury long haar necklace in 22KT gold with bold statement design.',        image:'/long haar6.jpg',      tag:'Luxury',      featured:false },
  { id:78, name:'Pendant — Classic',         category:'Pendants',     description:'Elegant 22KT gold pendant with matching earrings and delicate design.',  image:'/pandent set1.jpg',    tag:'Classic',     featured:false },
  { id:79, name:'Pendant — Heritage',        category:'Pendants',     description:'Heritage gold pendant with traditional motifs and antique finish.',      image:'/pandent set2.jpg',    tag:'Heritage',    featured:false },
  { id:80, name:'Bridal Pendant',            category:'Pendants',     description:'Bridal pendant in 22KT gold with kundan stones and pearl drops.',       image:'/pandent set3.jpg',    tag:'Bridal Pick', featured:false },
  { id:81, name:'Pendant — Exclusive',       category:'Pendants',     description:'Exclusive pendant with intricate handcrafted gold motifs.',              image:'/pandent set4.jpg',    tag:'Exclusive',   featured:false },
  { id:82, name:'Pendant — Trending',        category:'Pendants',     description:'Trending pendant — contemporary gold design meets traditional art.',    image:'/pandent set5.jpg',    tag:'Trending',    featured:false },
  { id:83, name:'Pendant — New In',          category:'Pendants',     description:'New arrival pendant in 22KT gold with modern heritage styling.',        image:'/pandent set6.jpg',    tag:'New Arrival', featured:false },
  { id:84, name:'Pendant — Premium',         category:'Pendants',     description:'Premium gold pendant with fine filigree work and elegant design.',      image:'/pandent set7.jpg',    tag:'Premium',     featured:false },
  { id:85, name:'Pendant — Festive',         category:'Pendants',     description:'Festive pendant in 22KT gold, perfect for celebrations and events.',    image:'/pandent set8.jpg',    tag:'Festive',     featured:false },
  { id:86, name:"Men's Ring — Classic",      category:"Men's Ring",   description:"Bold 22KT gold ring for men with classic band and fine engraving.",          image:'/gents ring1.jpg',     tag:'Classic',     featured:false },
  { id:87, name:"Men's Ring — Heritage",     category:"Men's Ring",   description:"Heritage men's gold ring with traditional design and antique finish.",       image:'/gents ring2.jpg',     tag:'Heritage',    featured:false },
  { id:88, name:"Men's Ring — Exclusive",    category:"Men's Ring",   description:"Exclusive men's 22KT gold ring with bold stone setting.",                    image:'/gents ring3.jpg',     tag:'Exclusive',   featured:false },
  { id:89, name:"Men's Ring — Premium",      category:"Men's Ring",   description:"Premium men's gold signet ring with elegant design and polished finish.",    image:'/gents ring4.jpg',     tag:'Premium',     featured:false },
  { id:90, name:"Men's Ring — Trending",     category:"Men's Ring",   description:"Trending men's gold ring with contemporary meets traditional styling.",      image:'/gents ring5.jpg',     tag:'Trending',    featured:false },
  { id:91, name:"Men's Ring — New In",       category:"Men's Ring",   description:"New arrival men's ring in 22KT gold with intricate detailing.",              image:'/gents ring6.jpg',     tag:'New Arrival', featured:false },
  { id:92, name:"Men's Ring — Luxury",       category:"Men's Ring",   description:"Luxury men's gold ring — a bold statement piece for special occasions.",    image:'/gents ring7.jpg',     tag:'Luxury',      featured:false },
  { id:93, name:"Men's Ring — Bestseller",   category:"Men's Ring",   description:"Bestselling men's 22KT gold ring with classic band and stone accent.",      image:'/gents ring8.jpg',     tag:'Bestseller',  featured:false },
  { id:94, name:"Men's Ring — Traditional",  category:"Men's Ring",   description:"Traditional men's gold ring with temple-inspired motifs.",                   image:'/gents ring9.jpg',     tag:'Traditional', featured:false },
  { id:95, name:"Men's Bridal Ring",         category:"Men's Ring",   description:"Bridal men's gold ring — perfect for grooms seeking bold elegance.",        image:'/gents ring10.jpg',    tag:'Bridal Pick', featured:false },
  { id:96,  name:"Ladies Ring — Classic",    category:"Women's Ring", description:"Delicate 22KT gold ring for women with floral motif and fine craftsmanship.", image:'/ladies ring1.jpg',   tag:'Classic',     featured:false },
  { id:97,  name:"Ladies Ring — Heritage",   category:"Women's Ring", description:"Heritage ladies gold ring with traditional design and antique finish.",       image:'/ladies ring2.jpg',   tag:'Heritage',    featured:false },
  { id:98,  name:"Ladies Ring — Exclusive",  category:"Women's Ring", description:"Exclusive ladies 22KT gold ring with kundan stone setting.",                  image:'/ladies ring3.jpg',   tag:'Exclusive',   featured:false },
  { id:99,  name:"Ladies Ring — Premium",    category:"Women's Ring", description:"Premium ladies gold ring with elegant diamond-cut band design.",              image:'/ladies ring4.jpg',   tag:'Premium',     featured:false },
  { id:100, name:"Ladies Ring — Trending",   category:"Women's Ring", description:"Trending ladies gold ring with contemporary floral pattern in 22KT.",        image:'/ladies ring5.jpg',   tag:'Trending',    featured:false },
  { id:101, name:"Ladies Ring — New In",     category:"Women's Ring", description:"New arrival ladies ring in 22KT gold with intricate meenakari detailing.",   image:'/ladies ring6.jpg',   tag:'New Arrival', featured:false },
  { id:102, name:"Ladies Ring — Luxury",     category:"Women's Ring", description:"Luxury ladies gold ring — a statement piece for weddings and events.",       image:'/ladies ring7.jpg',   tag:'Luxury',      featured:false },
  { id:103, name:"Ladies Ring — Bestseller", category:"Women's Ring", description:"Bestselling ladies 22KT gold ring with classic solitaire-style setting.",    image:'/ladies ring8.jpg',   tag:'Bestseller',  featured:true  },
  { id:104, name:"Ladies Ring — Traditional",category:"Women's Ring", description:"Traditional ladies gold ring with temple-inspired floral motifs.",            image:'/ladies ring9.jpg',   tag:'Traditional', featured:false },
  { id:105, name:"Ladies Bridal Ring",       category:"Women's Ring", description:"Bridal ladies ring in 22KT gold with kundan and pearl accent.",              image:'/ladies ring10.jpg',  tag:'Bridal Pick', featured:false },
  { id:106, name:"Ladies Ring — Festive",    category:"Women's Ring", description:"Festive ladies ring in 22KT gold with vibrant stone inlay work.",            image:'/ladies ring11.jpg',  tag:'Festive',     featured:false },
  { id:107, name:"Ladies Ring — Vintage",    category:"Women's Ring", description:"Vintage-style ladies gold ring with intricate hand-carved detailing.",       image:'/ladies ring12.jpg',  tag:'Vintage',     featured:false },
  { id:108, name:"Ladies Ring — Bold",       category:"Women's Ring", description:"Classic ladies gold ring with bold stone setting and polished finish.",       image:'/ladies ring13.jpg',  tag:'Classic',     featured:false },
  { id:109, name:"Ladies Ring — Ornate",     category:"Women's Ring", description:"Heritage ladies ring in 22KT gold with antique finish and ornate border.",   image:'/ladies ring14.jpg',  tag:'Heritage',    featured:false },
  { id:110, name:"Ladies Ring — Polki",      category:"Women's Ring", description:"Exclusive ladies ring with Polki stone and 22KT gold temple-style setting.", image:'/ladies ring15.jpg',  tag:'Exclusive',   featured:false },
  { id:111, name:"Ladies Ring — Bridal Crown",category:"Women's Ring",description:"Premium bridal ladies ring with diamond-cut band and floral crown setting.",  image:'/ladies ring16.jpg',  tag:'Premium',     featured:false },
  { id:112, name:'Gold Chain — Classic',     category:'Chains',       description:'Elegant 22KT gold chain with classic link design, perfect for everyday wear.',   image:'/chain.jpg',     tag:'Classic',     featured:true  },
  { id:113, name:'Gold Chain — Lightweight', category:'Chains',       description:'Lightweight 22KT gold chain ideal for pendants and daily use.',                  image:'/chain1.jpg',    tag:'Everyday',    featured:false },
  { id:114, name:'Figaro Gold Chain',        category:'Chains',       description:'Italian figaro link chain in 22KT gold — timeless and versatile.',               image:'/chain2.jpg',    tag:'Trending',    featured:false },
  { id:115, name:'Rope Gold Chain',          category:'Chains',       description:'Twisted rope design in 22KT gold, a bold statement piece.',                      image:'/chain3.jpg',    tag:'Bestseller',  featured:true  },
  { id:116, name:'Box Link Chain',           category:'Chains',       description:'Square box link chain in 22KT gold — sleek and modern.',                         image:'/chain4.jpg',    tag:'New Arrival', featured:false },
  { id:117, name:'Heritage Gold Chain',      category:'Chains',       description:'Traditional heritage link chain in 22KT gold with antique finish.',              image:'/chain5.jpg',    tag:'Heritage',    featured:false },
  { id:118, name:'Designer Gold Chain',      category:'Chains',       description:'Designer pattern chain in 22KT gold, crafted for special occasions.',            image:'/chain6.jpg',    tag:'Exclusive',   featured:false },
  { id:119, name:'Curb Link Chain',          category:'Chains',       description:'Heavy curb link chain in 22KT gold — ideal for men and women alike.',            image:'/chain7.jpg',    tag:'Premium',     featured:false },
  { id:120, name:'Temple Gold Chain',        category:'Chains',       description:'Temple-art inspired chain in 22KT gold with traditional motifs.',                image:'/chain8.jpg',    tag:'Traditional', featured:false },
  { id:121, name:'Fancy Gold Chain',         category:'Chains',       description:'Fancy pattern gold chain in 22KT, perfect for gifting.',                        image:'/chain9.jpg',    tag:'Festive',     featured:false },
  { id:122, name:'Bridal Gold Chain',        category:'Chains',       description:'Heavy bridal chain in 22KT gold with intricate detailing.',                      image:'/chain10.jpg',   tag:'Bridal Pick', featured:false },
  { id:123, name:'Long Gold Chain',          category:'Chains',       description:'Long layering chain in 22KT gold, versatile for all looks.',                     image:'/chain11.jpg',   tag:'Classic',     featured:false },
];

// ── WhatsApp enquiry link ─────────────────────────────────────────────────────
const WA_NUMBER = '918377911745';
function waLink(productName: string) {
  const msg = encodeURIComponent(`Hello! I'm interested in the *${productName}* from your collection. Could you please share more details and pricing? 🙏`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <div className="h-48 animate-pulse" style={{ background: `linear-gradient(165deg, ${C.bgDeep}, ${C.bgHeroPink ?? '#FFF5F7'})` }} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-hidden mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 h-10 w-24 rounded-full animate-pulse" style={{ background: C.goldBg }} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
              <div className="w-full" style={{ aspectRatio: '1/1', background: C.bgDeep }} />
              <div className="p-3 space-y-2">
                <div className="h-3 w-1/2 rounded" style={{ background: C.goldBg }} />
                <div className="h-4 w-3/4 rounded" style={{ background: C.goldBg }} />
                <div className="h-9 w-full rounded-xl mt-3" style={{ background: C.goldBg }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Collections() {
  const [isLoading, setIsLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag]           = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const [wishlist, setWishlist]             = useState<number[]>([]);
  const [showFilters, setShowFilters]       = useState(false);
  const [sortBy, setSortBy]                 = useState<'default' | 'featured'>('default');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Filter logic
  const filtered = allProducts.filter(p => {
    const catOk  = activeCategory === 'All' || p.category === activeCategory;
    const tagOk  = activeTag === 'all' || p.tag === activeTag;
    const q      = searchQuery.toLowerCase();
    const searchOk = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
    return catOk && tagOk && searchOk;
  }).sort((a, b) => sortBy === 'featured' ? (b.featured ? 1 : 0) - (a.featured ? 1 : 0) : 0);

  if (isLoading) return <Skeleton />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                style={{ background: C.bg, minHeight: '100vh' }}>

      {/* ── HERO — simple, warm, welcoming ── */}
      <section className="pt-24 pb-10 px-4 text-center"
               style={{ background: `linear-gradient(165deg, ${C.bgDeep} 0%, #FFF0F5 60%, ${C.bg} 100%)` }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-medium"
               style={{ background: C.goldBg, color: C.gold, border: `1px solid ${C.goldBorder}` }}>
            ✦ Est. 1987 · Jabalpur · 22K BIS Hallmark Certified
          </div>
          <h1 className="font-cormorant font-light mb-3"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)', color: C.text, lineHeight: 1.1 }}>
            Our <em className="italic" style={{ color: C.gold }}>Jewellery</em> Collection
          </h1>
          <p className="font-raleway text-sm max-w-lg mx-auto mb-6 leading-relaxed" style={{ color: C.textMid }}>
            Browse {allProducts.length}+ handcrafted pieces in 22K gold. Click any piece to view details and enquire on WhatsApp — we respond within minutes! 💬
          </p>
          {/* Quick action hints */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs" style={{ color: C.textLight }}>
            <span>👆 Tap any piece to enquire</span>
            <span>·</span>
            <span>❤️ Save your favourites</span>
            <span>·</span>
            <span>🔍 Search or filter below</span>
          </div>
        </motion.div>
      </section>

      {/* ── CATEGORY TABS — scrollable pill row ── */}
      <section className="sticky top-0 z-30 shadow-sm"
               style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-3 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const isActive = activeCategory === cat.name;
              const count = cat.name === 'All' ? allProducts.length
                : allProducts.filter(p => p.category === cat.name).length;
              return (
                <button key={cat.name}
                        onClick={() => { setActiveCategory(cat.name); setActiveTag('all'); }}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200"
                        style={{
                          background: isActive ? C.bgDark : C.bgCard,
                          color: isActive ? '#fff' : C.textMid,
                          border: `1px solid ${isActive ? C.bgDark : C.goldBorder}`,
                          fontFamily: 'Raleway, sans-serif',
                        }}>
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className="opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTER BAR ── */}
      <section className="py-4 px-4" style={{ background: C.bgDeep }}>
        <div className="max-w-6xl mx-auto flex gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textLight }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, type..."
              className="w-full pl-9 pr-8 py-2.5 rounded-full text-sm outline-none transition-all"
              style={{
                background: C.bgCard,
                border: `1.5px solid ${searchQuery ? C.gold : C.goldBorder}`,
                color: C.text,
                fontFamily: 'Raleway, sans-serif',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={13} style={{ color: C.textLight }} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button onClick={() => setShowFilters(v => !v)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: showFilters ? C.bgDark : C.bgCard,
                    color: showFilters ? '#fff' : C.textMid,
                    border: `1.5px solid ${showFilters ? C.bgDark : C.goldBorder}`,
                    fontFamily: 'Raleway, sans-serif',
                  }}>
            <SlidersHorizontal size={13} />
            Filter
            {activeTag !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-0.5" />}
          </button>

          {/* Sort */}
          <div className="relative hidden sm:block">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-7 py-2.5 rounded-full text-xs outline-none cursor-pointer"
              style={{
                background: C.bgCard,
                border: `1.5px solid ${C.goldBorder}`,
                color: C.textMid,
                fontFamily: 'Raleway, sans-serif',
              }}>
              <option value="default">Sort: Default</option>
              <option value="featured">Featured First</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                         style={{ color: C.textLight }} />
          </div>

          {/* Result count */}
          <span className="hidden sm:block text-xs flex-shrink-0" style={{ color: C.textLight, fontFamily: 'Raleway, sans-serif' }}>
            {filtered.length} pieces
          </span>
        </div>

        {/* Tag filter strip — shown when filter is open */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="max-w-6xl mx-auto overflow-hidden">
              <div className="flex gap-2 flex-wrap pt-3">
                {tagGroups.map(tg => (
                  <button key={tg.value}
                          onClick={() => setActiveTag(tg.value)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                          style={{
                            background: activeTag === tg.value ? C.gold : C.bgCard,
                            color: activeTag === tg.value ? '#fff' : C.textMid,
                            border: `1px solid ${activeTag === tg.value ? C.gold : C.goldBorder}`,
                            fontFamily: 'Raleway, sans-serif',
                          }}>
                    {tg.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-center py-24">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-cormorant text-2xl mb-2" style={{ color: C.textLight }}>Nothing found</p>
                <p className="font-raleway text-sm mb-6" style={{ color: C.textLight }}>
                  Try a different category or clear your search
                </p>
                <button onClick={() => { setActiveCategory('All'); setActiveTag('all'); setSearchQuery(''); }}
                        className="px-6 py-2.5 rounded-full text-sm font-medium"
                        style={{ background: C.bgDark, color: '#fff', fontFamily: 'Raleway, sans-serif' }}>
                  Show All Pieces
                </button>
              </motion.div>
            ) : (
              <motion.div key={activeCategory + activeTag + searchQuery + sortBy}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {filtered.map((product, i) => {
                  const tagStyle = TAG[product.tag] || TAG['Classic'];
                  const isWished = wishlist.includes(product.id);
                  return (
                    <motion.div key={product.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.025, 0.35), duration: 0.35 }}>

                      {/* ── CARD — clean, friendly, action-forward ── */}
                      <div className="rounded-2xl overflow-hidden flex flex-col h-full group cursor-pointer"
                           style={{
                             background: C.bgCard,
                             border: `1px solid ${C.border}`,
                             boxShadow: `0 2px 12px ${C.shadow}`,
                             transition: 'box-shadow 0.25s, border-color 0.25s',
                           }}
                           onClick={() => setSelectedProduct(product)}>

                        {/* Image area */}
                        <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                          <img src={product.image} alt={product.name}
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" />

                          {/* Dark overlay on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                               style={{ background: 'rgba(136,14,79,0.12)' }} />

                          {/* Tag badge */}
                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                                  style={{ background: tagStyle.bg, color: tagStyle.text, fontFamily: 'Raleway, sans-serif' }}>
                              {product.tag}
                            </span>
                          </div>

                          {/* Wishlist heart */}
                          <button onClick={e => toggleWishlist(product.id, e)}
                                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                                  style={{
                                    background: isWished ? '#fff0f5' : 'rgba(255,255,255,0.85)',
                                    border: `1px solid ${isWished ? C.gold : 'rgba(255,255,255,0.5)'}`,
                                    backdropFilter: 'blur(4px)',
                                  }}>
                            <Heart size={14} fill={isWished ? C.gold : 'none'}
                                   style={{ color: isWished ? C.gold : C.textLight }} />
                          </button>

                          {/* Featured ribbon */}
                          {product.featured && (
                            <div className="absolute bottom-2.5 left-2.5">
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(255,255,255,0.92)', color: C.bgDark, fontFamily: 'Cinzel, serif', letterSpacing: '0.08em' }}>
                                ★ FEATURED
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card body */}
                        <div className="p-3 flex flex-col flex-1">
                          <p className="text-[9px] tracking-widest mb-1 uppercase font-medium"
                             style={{ color: C.gold, fontFamily: 'Cinzel, serif' }}>
                            {product.category}
                          </p>
                          <h3 className="font-cormorant font-semibold text-[15px] leading-snug mb-1 line-clamp-2"
                              style={{ color: C.text }}>
                            {product.name}
                          </h3>
                          <p className="text-[11px] leading-relaxed line-clamp-2 mb-3 flex-1"
                             style={{ color: C.textLight, fontFamily: 'Raleway, sans-serif' }}>
                            {product.description}
                          </p>

                          {/* ── WhatsApp CTA — the most important action ── */}
                          <a href={waLink(product.name)}
                             target="_blank" rel="noopener noreferrer"
                             onClick={e => e.stopPropagation()}
                             className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                             style={{
                               background: '#25D366',
                               color: '#fff',
                               fontFamily: 'Raleway, sans-serif',
                               letterSpacing: '0.03em',
                             }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.5a.5.5 0 0 0 .61.61l5.758-1.508A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.503-5.21-1.382l-.373-.22-3.87 1.014 1.025-3.777-.243-.386A9.938 9.938 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            Enquire on WhatsApp
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-xs" style={{ color: C.textLight, fontFamily: 'Raleway, sans-serif' }}>
                Showing <strong style={{ color: C.gold }}>{filtered.length}</strong> of {allProducts.length} pieces
              </p>
              <p className="text-xs mt-1" style={{ color: C.textLight, fontFamily: 'Raleway, sans-serif' }}>
                Don't see what you're looking for?{' '}
                <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello! I\'m looking for a specific piece. Can you help me find it?')}`}
                   target="_blank" rel="noopener noreferrer"
                   style={{ color: C.gold, textDecoration: 'underline' }}>
                  Ask us on WhatsApp
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>

    </motion.div>
  );
}
