// ════════════════════════════════════════════════════════════════════════════
// src/pages/PrivateCatalogue.tsx
// ════════════════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, LayoutGroup, Variants } from 'framer-motion';
import {
  Clock, Lock, ArrowRight, MessageCircle, Diamond,
  AlertCircle, Package, ShoppingBag, Search, X, Sparkles, Crown,
  Camera, Trash2, Eye, Plus, Weight, Gem,
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import { loadStockMap, moveToOrdered, type StockStatus } from '../lib/stockStore';
import {
  loadClientItems,
  saveClientItem,
  deleteClientItem,
  migrateFromLocalStorage,
  type ClientItem,
} from '../lib/clientPhotoStore';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
  bgDeep:    '#FCE4EC',
  bgCard:    '#FFFFFF',
  gold:      '#C2185B',
  goldDk:    '#880E4F',
  goldLt:    '#E91E8C',
  goldPale:  '#F8BBD9',
  text:      '#1A0010',
  textMid:   '#6D1B4E',
  textLight: '#AD6888',
  border:    'rgba(194,24,91,0.15)',
  green:     '#2E7D32',
  greenBg:   'rgba(46,125,50,0.08)',
  white:     '#FFFFFF',
};

// ── Products ──────────────────────────────────────────────────────────────────
export const ALL_PRODUCTS: Record<string, any[]> = {
  bangles: [
    { id:'b1', name:'Classic Gold Bangles',   category:'Bangles',   description:'Set of 4 intricately designed 22K gold bangles.',  image:'/bangle1.png', tag:'Classic'    },
    { id:'b2', name:'Designer Bangles',        category:'Bangles',   description:'Designer gold bangles with enamel work.',           image:'/bangle2.png', tag:'Designer'   },
    { id:'b3', name:'Antique Finish Bangles',  category:'Bangles',   description:'Antique finish 22K bangles with stone work.',       image:'/bangle3.png', tag:'Heritage'   },
    { id:'b4', name:'Bridal Bangles Set',      category:'Bangles',   description:'Heavy bridal bangle set for your special day.',     image:'/bangle4.png', tag:'Bridal'     },
    { id:'b5', name:'Peacock Bangles',         category:'Bangles',   description:'Peacock motif 22K gold bangles.',                   image:'/bangle5.png', tag:'Exclusive'  },
    { id:4,  name:'22KT Gold Bangles Set',     category:'Bangles',      description:'Set of 4 intricately designed bangles with traditional patterns.',                 image:'/bangle3.png',         tag:'Classic' },
    { id:12, name:'Gold Bangles',              category:'Bangles',      description:'Heavy gold kada with traditional carvings.',                                      image:'/bangle9.png',         tag:'Heritage' },
    { id:20, name:'Gold Bangle Set ',          category:'Bangles',      description:'Elegant 22KT gold bangles with traditional carvings and fine finish.',           image:'/bangleA.jpg',         tag:'New Arrival' },
    { id:21, name:'Designer Bangle ',          category:'Bangles',      description:'Intricate designer bangles in 22KT gold, perfect for festive occasions.',        image:'/bangleB.jpg',         tag:'Trending' },
    { id:22, name:'Antique Bangle ',           category:'Bangles',      description:'Antique-finish 22KT gold bangles with classic Indian motifs.',                   image:'/bangleC.jpg',         tag:'Heritage' },
    { id:23, name:'Bridal Bangle ',            category:'Bangles',      description:'Heavy bridal bangles in 22KT gold with ornate detailing.',                       image:'/bangleD.jpg',         tag:'Bridal Pick' },
    { id:24, name:'Festive Bangle ',           category:'Bangles',      description:'Beautifully crafted gold bangles ideal for festivals.',                          image:'/bangleE.jpg',         tag:'Festive' },
    { id:25, name:'Kundan Bangle ',            category:'Bangles',      description:'Kundan-studded 22KT gold bangles with vibrant meenakari work.',                  image:'/bangleF.jpg',         tag:'Exclusive' },
    { id:26, name:'Classic Bangle ',           category:'Bangles',      description:'Timeless classic gold bangles with smooth finish and fine engraving.',           image:'/bangleG.jpg',         tag:'Classic' },
    { id:27, name:'Temple Bangle ',            category:'Bangles',      description:'Temple-art inspired bangles in 22KT gold with goddess motifs.',                  image:'/bangleH.jpg',         tag:'Traditional' },
    { id:28, name:'Royal Bangle ',             category:'Bangles',      description:'Royal-style heavy gold bangles, a showstopper for every occasion.',              image:'/bangleI.jpg',         tag:'Premium' },
    { id:34, name:'Gold Bangle ',              category:'Bangles',      description:'Intricately crafted 22KT gold bangle with traditional Indian motifs.',          image:'/bangle100.jpg',       tag:'New Arrival' },
    { id:35, name:'Gold Bangle ',              category:'Bangles',      description:'Classic 22KT gold bangle with fine hand-engraved patterns.',                    image:'/bangle101.jpg',       tag:'Classic' },
    { id:36, name:'Gold Bangle ',              category:'Bangles',      description:'Heritage-inspired gold bangle with intricate filigree detailing.',              image:'/bangle102.jpg',       tag:'Heritage' },
    { id:37, name:'Gold Bangle ',              category:'Bangles',      description:'Elegant 22KT gold bangle perfect for festive and bridal occasions.',            image:'/bangle103.jpg',       tag:'Festive' },
    { id:38, name:'Gold Bangle ',              category:'Bangles',      description:'Traditional gold bangle with temple motifs and antique finish.',                image:'/bangle104.jpg',       tag:'Traditional' },
    { id:39, name:'Gold Bangle ',              category:'Bangles',      description:'Premium 22KT gold bangle with polished finish and ornate borders.',             image:'/bangle106.jpg',       tag:'Premium' },
    { id:40, name:'Gold Bangle ',              category:'Bangles',      description:'Trending designer bangle in 22KT gold with modern-meets-traditional design.',  image:'/bangle107.jpg',       tag:'Trending' },
    { id:41, name:'Gold Bangle ',              category:'Bangles',      description:'Bridal-pick 22KT gold bangle set for the perfect wedding look.',               image:'/bangle108.jpg',       tag:'Bridal Pick' },
  ],
  rings: [
    { id:'r1', name:'Solitaire Ring',          category:'Rings',     description:'Brilliant solitaire diamond in 18K gold.',         image:'/ring1.png',      tag:'Premium'   },
    { id:'r2', name:'Polki Diamond Ring',       category:'Rings',     description:'Uncut polki diamonds set in 22K gold.',            image:'/ring2.png',      tag:'Exclusive' },
    { id:'r3', name:'Classic Gold Ring',        category:'Rings',     description:'Classic 22K gold ring with intricate design.',     image:'/ring3.png',      tag:'Classic'   },
    { id:'r4', name:'Floral Ring',             category:'Rings',     description:'Beautiful floral motif 22K gold ring.',            image:'/ring6.png',      tag:'Trending'  },
    { id:'r5', name:'Gents Statement Ring',     category:'Rings',     description:'Bold statement ring for men in 22K gold.',         image:'/ring7.png',      tag:'Men'       },
  ],
  womens_ring: [
    { id:7,  name:'Ruby & Emerald Ring',       category:"Women's Ring", description:'Stunning cocktail ring with precious gemstones in kundan setting.',               image:'/ring7.png',           tag:'Limited' },
    { id:14, name:'Solitaire Engagement Ring', category:"Women's Ring", description:'Brilliant solitaire in a classic six-prong setting.',                            image:'/ring6.png',           tag:'Premium' },
    { id:17, name:'Gold Band Ring',            category:"Women's Ring", description:'Classic gold band with elegant minimal design.',                                  image:'/ring5.png',           tag:'Classic' },
    { id:19, name:'Vintage Diamond Ring',      category:"Women's Ring", description:'Vintage-inspired design with intricate detailing.',                               image:'/ring1.png',           tag:'Vintage' },
    { id:96,  name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Delicate 22KT gold ring for women with floral motif and fine craftsmanship.", image:'/ladies ring1.jpg',    tag:'Classic' },
    { id:97,  name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Heritage ladies gold ring with traditional design and antique finish.",       image:'/ladies ring2.jpg',    tag:'Heritage' },
    { id:98,  name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Exclusive ladies 22KT gold ring with kundan stone setting.",                  image:'/ladies ring3.jpg',    tag:'Exclusive' },
    { id:99,  name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Premium ladies gold ring with elegant diamond-cut band design.",              image:'/ladies ring4.jpg',    tag:'Premium' },
    { id:100, name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Trending ladies gold ring with contemporary floral pattern in 22KT.",        image:'/ladies ring5.jpg',    tag:'Trending' },
    { id:101, name:"Ladies Gold Ring ",       category:"Women's Ring", description:"New arrival ladies ring in 22KT gold with intricate meenakari detailing.",   image:'/ladies ring6.jpg',    tag:'New Arrival' },
    { id:102, name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Luxury ladies gold ring — a statement piece for weddings and events.",       image:'/ladies ring7.jpg',    tag:'Luxury' },
    { id:103, name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Bestselling ladies 22KT gold ring with classic solitaire-style setting.",    image:'/ladies ring8.jpg',    tag:'Bestseller' },
    { id:104, name:"Ladies Gold Ring ",       category:"Women's Ring", description:"Traditional ladies gold ring with temple-inspired floral motifs.",            image:'/ladies ring9.jpg',    tag:'Traditional' },
    { id:105, name:"Ladies Gold Ring ",      category:"Women's Ring", description:"Bridal ladies ring in 22KT gold with kundan and pearl accent.",              image:'/ladies ring10.jpg',   tag:'Bridal Pick' },
    { id:106, name:"Ladies Gold Ring ",      category:"Women's Ring", description:"Festive ladies ring in 22KT gold with vibrant stone inlay work.",            image:'/ladies ring11.jpg',   tag:'Festive' },
    { id:107, name:"Ladies Gold Ring ",      category:"Women's Ring", description:"Vintage-style ladies gold ring with intricate hand-carved detailing.",       image:'/ladies ring12.jpg',   tag:'Vintage' },
    { id:108, name:"Ladies Gold Ring ",      category:"Women's Ring", description:"Classic ladies gold ring with bold stone setting and polished finish.",       image:'/ladies ring13.jpg',   tag:'Classic' },
    { id:109, name:"Ladies Gold Ring ",      category:"Women's Ring", description:"Heritage ladies ring in 22KT gold with antique finish and ornate border.",   image:'/ladies ring14.jpg',   tag:'Heritage' },
    { id:110, name:"Ladies Gold Ring ",      category:"Women's Ring", description:"Exclusive ladies ring with Polki stone and 22KT gold temple-style setting.", image:'/ladies ring15.jpg',   tag:'Exclusive' },
    { id:111, name:"Ladies Gold Ring ",      category:"Women's Ring", description:"Premium bridal ladies ring with diamond-cut band and floral crown setting.",  image:'/ladies ring16.jpg',   tag:'Premium' },
  ],
  mens_ring: [
    { id:86, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Bold 22KT gold ring for men with classic band and fine engraving.",          image:'/gents ring1.jpg',     tag:'Classic' },
    { id:87, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Heritage men's gold ring with traditional design and antique finish.",       image:'/gents ring2.jpg',     tag:'Heritage' },
    { id:88, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Exclusive men's 22KT gold ring with bold stone setting.",                    image:'/gents ring3.jpg',     tag:'Exclusive' },
    { id:89, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Premium men's gold signet ring with elegant design and polished finish.",    image:'/gents ring4.jpg',     tag:'Premium' },
    { id:90, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Trending men's gold ring with contemporary meets traditional styling.",      image:'/gents ring5.jpg',     tag:'Trending' },
    { id:91, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"New arrival men's ring in 22KT gold with intricate detailing.",              image:'/gents ring6.jpg',     tag:'New Arrival' },
    { id:92, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Luxury men's gold ring — a bold statement piece for special occasions.",    image:'/gents ring7.jpg',     tag:'Luxury' },
    { id:93, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Bestselling men's 22KT gold ring with classic band and stone accent.",      image:'/gents ring8.jpg',     tag:'Bestseller' },
    { id:94, name:"Gents Gold Ring ",         category:"Men's Ring",   description:"Traditional men's gold ring with temple-inspired motifs.",                   image:'/gents ring9.jpg',     tag:'Traditional' },
    { id:95, name:"Gents Gold Ring ",        category:"Men's Ring",   description:"Bridal men's gold ring — perfect for grooms seeking bold elegance.",        image:'/gents ring10.jpg',    tag:'Bridal Pick' },
  ],
  necklaces: [
    { id:'n1', name:'Maharani Bridal Necklace',category:'Necklaces', description:'Grand bridal necklace in 22K gold.',              image:'/necklace88.png', tag:'Bridal'    },
    { id:'n2', name:'Temple Gold Haar',         category:'Necklaces', description:'Traditional temple necklace with Lakshmi coins.', image:'/temple.png',     tag:'Heritage'  },
    { id:'n3', name:'Kundan Choker',            category:'Necklaces', description:'Royal Kundan choker with meenakari work.',        image:'/necklace1.jpg',  tag:'Royal'     },
    { id:1,  name:'Kundan Bridal Necklace',    category:'Necklaces',    description:'Exquisite kundan work with meenakari detailing, perfect for the modern bride.',   image:'/antique1.jpg',        tag:'Bestseller' },
    { id:6,  name:'Temple Gold Haar',          category:'Necklaces',    description:'Traditional temple necklace with goddess motifs and Lakshmi coins.',              image:'/necklace88.png',      tag:'Traditional' },
    { id:8,  name:'Antique Necklace Set',      category:'Necklaces',    description:'Complete antique temple set with traditional craftsmanship.',                     image:'/necklace22.png',      tag:'Trending' },
    { id:9,  name:'Meenakari Bridal Set',      category:'Necklaces',    description:'Colorful meenakari work bridal set with traditional motifs.',                     image:'/necklace3.jpg',       tag:'Bridal Pick' },
    { id:13, name:'Heritage Necklace',         category:'Necklaces',    description:'Elegant heritage necklace with traditional design.',                              image:'/bridal-necklace.jpg', tag:'New Arrival' },
    { id:29, name:'Bridal Necklace ',          category:'Necklaces',    description:'Stunning 22KT bridal necklace with kundan and polki work.',                     image:'/necklaceA.jpg',       tag:'Bridal Pick' },
    { id:30, name:'Heritage Necklace ',        category:'Necklaces',    description:'Traditional heritage necklace in 22KT gold with antique finish.',               image:'/necklaceB.jpg',       tag:'Heritage' },
    { id:31, name:'Temple Necklace ',          category:'Necklaces',    description:'Handcrafted temple necklace with goddess motifs and ruby accents.',              image:'/necklaceC.jpg',       tag:'Traditional' },
    { id:32, name:'Kundan Necklace ',          category:'Necklaces',    description:'Grand Kundan necklace with emerald and pearl drops in 22KT gold.',              image:'/necklaceD.jpg',       tag:'Exclusive' },
    { id:33, name:'Gold Haar ',                category:'Necklaces',    description:'Elegant long haar in 22KT gold, ideal for festive and bridal wear.',            image:'/necklaceE.jpg',       tag:'New Arrival' },
    { id:42, name:'Short Necklace ',           category:'Necklaces',    description:'Delicate short necklace in 22KT gold, ideal for everyday and festive wear.',   image:'/short necklace1.jpg', tag:'Everyday' },
    { id:43, name:'Short Necklace ',           category:'Necklaces',    description:'Elegant short gold necklace with fine craftsmanship and classic design.',       image:'/short necklace2.jpg', tag:'Classic' },
    { id:44, name:'Short Necklace ',           category:'Necklaces',    description:'Trendy short necklace in 22KT gold with contemporary styling.',                image:'/short necklace3.jpg', tag:'Trending' },
    { id:45, name:'Short Necklace ',           category:'Necklaces',    description:'New arrival short necklace in 22KT gold with intricate link design.',          image:'/short necklace4.jpg', tag:'New Arrival' },
    { id:46, name:'Turkish Necklace ',         category:'Necklaces',    description:'Grand Turkish-style necklace in 22KT gold with bold layered design.',          image:'/turkish necklace1.jpg', tag:'Exclusive' },
    { id:47, name:'Turkish Necklace ',         category:'Necklaces',    description:'Ornate Turkish necklace with antique gold finish and heritage motifs.',        image:'/turkish necklace2.jpg', tag:'Heritage' },
    { id:48, name:'Turkish Necklace ',         category:'Necklaces',    description:'Stunning Turkish-inspired necklace with traditional craftsmanship.',           image:'/turkish necklace3.jpg', tag:'Traditional' },
    { id:49, name:'Turkish Necklace ',         category:'Necklaces',    description:'Premium Turkish necklace in 22KT gold with intricate detailing.',              image:'/turkish necklace4.jpg', tag:'Premium' },
    { id:50, name:'Turkish Necklace ',         category:'Necklaces',    description:'Bridal Turkish necklace with kundan accents and rich gold work.',              image:'/turkish necklace5.jpg', tag:'Bridal Pick' },
    { id:51, name:'Turkish Necklace ',         category:'Necklaces',    description:'Festive Turkish necklace perfect for celebrations and special occasions.',     image:'/turkish necklace6.jpg', tag:'Festive' },
    { id:52, name:'Turkish Necklace ',         category:'Necklaces',    description:'Luxury Turkish-style gold necklace with bold statement design.',               image:'/turkish necklace7.jpg', tag:'Luxury' },
    { id:53, name:'Turkish Necklace ',         category:'Necklaces',    description:'Trending Turkish necklace in 22KT gold with modern heritage styling.',        image:'/turkish necklace8.jpg', tag:'Trending' },
    { id:60, name:'Jadau Necklace ',           category:'Necklaces',    description:'Exquisite Jadau necklace with uncut diamonds and precious stone settings.',   image:'/Jadau Necklace1.jpg', tag:'Luxury' },
    { id:61, name:'Jadau Necklace ',           category:'Necklaces',    description:'Traditional Jadau necklace with Polki diamonds in 22KT gold setting.',       image:'/Jadau Necklace3.jpg', tag:'Traditional' },
    { id:62, name:'Jadau Necklace ',           category:'Necklaces',    description:'Bridal Jadau necklace with emerald drops and kundan work in 22KT gold.',     image:'/Jadau Necklace4.jpg', tag:'Bridal Pick' },
    { id:63, name:'Jadau Necklace ',           category:'Necklaces',    description:'Heritage Jadau necklace with ruby and emerald accents, fit for royalty.',    image:'/Jadau Necklace5.jpg', tag:'Heritage' },
    { id:64, name:'Jadau Necklace ',           category:'Necklaces',    description:'Premium Jadau necklace with handcrafted motifs and precious stone inlay.',   image:'/Jadau Necklace6.jpg', tag:'Premium' },
    { id:65, name:'Jadau Necklace ',           category:'Necklaces',    description:'Exclusive Jadau necklace with Polki diamonds and meenakari detailing.',      image:'/Jadau Necklace7.jpg', tag:'Exclusive' },
    { id:66, name:'Jadau Necklace ',           category:'Necklaces',    description:'Bestselling Jadau necklace — a statement piece for weddings and events.',    image:'/Jadau Necklace8.jpg', tag:'Bestseller' },
    { id:73, name:'Long Haar ',                category:'Necklaces',    description:'Majestic long haar in 22KT gold with traditional coin and temple motifs.',   image:'/long haar1.jpg',      tag:'Traditional' },
    { id:74, name:'Long Haar ',                category:'Necklaces',    description:'Elegant long gold haar with intricate link design and antique gold finish.', image:'/long haar2.jpg',      tag:'Heritage' },
    { id:75, name:'Long Haar ',                category:'Necklaces',    description:'Bridal long haar in 22KT gold — a timeless statement for the wedding day.', image:'/long haar3.jpg',      tag:'Bridal Pick' },
    { id:76, name:'Long Haar ',                category:'Necklaces',    description:'Premium long haar with layered design and fine 22KT gold craftsmanship.',   image:'/long haar4.jpg',      tag:'Premium' },
    { id:77, name:'Long Haar ',                category:'Necklaces',    description:'Luxury long haar necklace in 22KT gold with bold statement design.',        image:'/long haar6.jpg',      tag:'Luxury' },
  ],
  chokers: [
    { id:67, name:'Gold Choker ',            category:'Chokers',      description:'Elegant 22KT gold choker with intricate hand-engraved traditional patterns.', image:'/Choker101.jpg',       tag:'Classic' },
    { id:68, name:'Gold Choker ',            category:'Chokers',      description:'Heritage-style gold choker with antique finish and temple motifs.',           image:'/Choker102.jpg',       tag:'Heritage' },
    { id:69, name:'Gold Choker ',            category:'Chokers',      description:'Bridal choker in 22KT gold with kundan stones and floral patterns.',         image:'/Choker103.jpg',       tag:'Bridal Pick' },
    { id:70, name:'Gold Choker ',            category:'Chokers',      description:'Exclusive choker necklace with bold design and premium gold craftsmanship.',  image:'/choker104.jpg',       tag:'Exclusive' },
    { id:71, name:'Gold Choker ',            category:'Chokers',      description:'Trending 22KT gold choker with contemporary traditional fusion design.',     image:'/choker105.jpg',       tag:'Trending' },
    { id:72, name:'Gold Choker ',            category:'Chokers',      description:'New arrival gold choker with delicate beaded and filigree detailing.',       image:'/choker107.jpg',       tag:'New Arrival' },
  ],
  earrings: [
    { id:'e1', name:'Antique Gold Jhumkas',     category:'Earrings',  description:'Traditional temple-style jhumkas.',               image:'/earring1.jpg',   tag:'Heritage'  },
    { id:'e2', name:'Chandbali Earrings',       category:'Earrings',  description:'Royal chandbali with stone work.',                 image:'/earring5.jpg',   tag:'Exclusive' },
    { id:'e3', name:'Antique Earrings Set',     category:'Earrings',  description:'Exquisite antique finish earring set.',            image:'/earrings13.png', tag:'Limited'   },
    { id:3,  name:'Antique Gold Jhumkas',      category:'Earrings',     description:'Traditional temple-style jhumkas with intricate peacock motifs.',                  image:'/earrings13.png',      tag:'Heritage' },
    { id:11, name:'Diamond Studs',             category:'Earrings',     description:'Classic diamond studs for everyday elegance.',                                    image:'/ring4.png',           tag:'Everyday' },
    { id:16, name:'Diamond Hoop Earrings',     category:'Earrings',     description:'Contemporary diamond hoops for modern elegance.',                                 image:'/earrings14.png',      tag:'Trending' },
    { id:54, name:'Gold Earrings ',          category:'Earrings',     description:'Classic gold earrings with intricate detailing, perfect for every occasion.',  image:'/earrings101.jpg',     tag:'Classic' },
    { id:55, name:'Gold Earrings ',          category:'Earrings',     description:'Heritage jhumka-style earrings in 22KT gold with traditional motifs.',        image:'/earrings102.jpg',     tag:'Heritage' },
    { id:56, name:'Gold Earrings ',          category:'Earrings',     description:'Exclusive 22KT gold earrings with premium finish and ornate design.',         image:'/earrings104.jpg',     tag:'Exclusive' },
    { id:57, name:'Gold Earrings ',          category:'Earrings',     description:'Trending 22KT gold earrings with contemporary meets traditional design.',     image:'/earrings105.jpg',     tag:'Trending' },
    { id:58, name:'Gold Earrings ',          category:'Earrings',     description:'New arrival earrings in 22KT gold with delicate filigree work.',              image:'/earrings106.jpg',     tag:'New Arrival' },
    { id:59, name:'Gold Earrings ',          category:'Earrings',     description:'Bridal earrings in 22KT gold with kundan stones and pearl drops.',            image:'/earrings107.jpg',     tag:'Bridal Pick' },
  ],
  pendants: [
    { id:78, name:'Pendant ',             category:'Pendants',     description:'Elegant 22KT gold pendant with matching earrings and delicate design.',  image:'/pandent set1.jpg',    tag:'Classic' },
    { id:79, name:'Pendant ',             category:'Pendants',     description:'Heritage gold pendant with traditional motifs and antique finish.',      image:'/pandent set2.jpg',    tag:'Heritage' },
    { id:80, name:'Pendant ',             category:'Pendants',     description:'Bridal pendant  in 22KT gold with kundan stones and pearl drops.',       image:'/pandent set3.jpg',    tag:'Bridal Pick' },
    { id:81, name:'Pendant ',             category:'Pendants',     description:'Exclusive pendant with intricate handcrafted gold motifs.',              image:'/pandent set4.jpg',    tag:'Exclusive' },
    { id:82, name:'Pendant ',             category:'Pendants',     description:'Trending pendant — contemporary gold design meets traditional art.',    image:'/pandent set5.jpg',    tag:'Trending' },
    { id:83, name:'Pendant ',             category:'Pendants',     description:'New arrival pendant  in 22KT gold with modern heritage styling.',        image:'/pandent set6.jpg',    tag:'New Arrival' },
    { id:84, name:'Pendant ',             category:'Pendants',     description:'Premium gold pendant with fine filigree work and elegant design.',      image:'/pandent set7.jpg',    tag:'Premium' },
    { id:85, name:'Pendant ',             category:'Pendants',     description:'Festive pendant in 22KT gold, perfect for celebrations and events.',    image:'/pandent set8.jpg',    tag:'Festive' },
  ],
  bridal: [
    { id:'br1', name:'Bridal Set – Maharani',  category:'Bridal',    description:'Complete necklace, earrings & maang tikka.',       image:'/bridal.png',     tag:'Bestseller'},
    { id:'br2', name:'Kundan Bridal Choker',   category:'Bridal',    description:'Exquisite kundan bridal choker.',                  image:'/necklace88.png', tag:'Premium'   },
  ],
  chains: [
    { id:'c1', name:'Figaro Gold Chain',        category:'Chains',    description:'Italian figaro chain in 22K gold.',                image:'/chain2.png',     tag:'Classic'   },
    { id:'c2', name:'Rope Gold Chain',          category:'Chains',    description:'Elegant rope chain in 22K gold.',                  image:'/chain4.png',     tag:'Trending'  },
  ],
  antique: [
    { id:'a1', name:'Antique Temple Set',       category:'Antique',   description:'Full antique temple jewellery set.',               image:'/antique2.jpg',   tag:'Heritage'  },
    { id:'a2', name:'Antique Choker Necklace',  category:'Antique',   description:'Traditional antique choker necklace.',             image:'/antique3.jpg',   tag:'Limited'   },
    { id:2,  name:'Diamond Eternity Ring',     category:'Antique',      description:'A stunning circle of brilliant diamonds symbolizing eternal love.',                image:'/ring2.png',           tag:'Premium' },
    { id:5,  name:'Polki Diamond Ring',        category:'Antique',      description:'Uncut polki diamonds set in 22KT gold with a classic design.',                    image:'/ring6.png',           tag:'Exclusive' },
    { id:10, name:'Festive Gold Set',          category:'Antique',      description:'Elegant gold set perfect for festive occasions.',                                  image:'/bangle5.png',         tag:'Festive' },
    { id:15, name:'Antique Choker Set',        category:'Antique',      description:'Beautiful antique choker set for festive celebrations.',                          image:'/necklace15.png',      tag:'Traditional' },
    { id:18, name:'Diamond Cluster Ring',      category:'Antique',      description:'Beautiful cluster of diamonds in an elegant setting.',                            image:'/ring3.png',           tag:'Luxury' },
  ],
};

const TAG_COLORS: Record<string, string> = {
  // Legacy tags
  Classic: 'bg-amber-100 text-amber-800',
  Premium: 'bg-purple-100 text-purple-800',
  Heritage: 'bg-stone-100 text-stone-700',
  Bridal: 'bg-pink-100 text-pink-800',
  Exclusive: 'bg-rose-100 text-rose-800',
  Royal: 'bg-indigo-100 text-indigo-800',
  Bestseller: 'bg-green-100 text-green-800',
  Trending: 'bg-blue-100 text-blue-800',
  Limited: 'bg-red-100 text-red-800',
  Designer: 'bg-violet-100 text-violet-800',
  Men: 'bg-slate-100 text-slate-700',
  
  // Custom collection tags mapped seamlessly to match the Private Catalogue UI
  'Traditional': 'bg-orange-100 text-orange-800',
  'Bridal Pick': 'bg-pink-100 text-pink-800',
  'Festive': 'bg-lime-100 text-lime-800',
  'Everyday': 'bg-gray-100 text-gray-800',
  'New Arrival': 'bg-teal-100 text-teal-800',
  'Luxury': 'bg-yellow-100 text-yellow-800',
  'Vintage': 'bg-stone-200 text-stone-800',
};




// ── Carat / Material options ───────────────────────────────────────────────────
const CARAT_OPTIONS    = ['18K', '20K', '22K', '24K', 'Silver', 'Platinum', 'Other'];
const MATERIAL_OPTIONS = ['Yellow Gold', 'Rose Gold', 'White Gold', 'Silver', 'Diamond', 'Kundan', 'Meenakari', 'Platinum', 'Other'];

// ── Add Client Item Modal ─────────────────────────────────────────────────────
function AddClientItemModal({
  onClose, onAdded,
}: {
  onClose: () => void;
  onAdded: (item: ClientItem) => void;
}) {
  const [name,     setName]     = React.useState('');
  const [weight,   setWeight]   = React.useState('');
  const [carat,    setCarat]    = React.useState('22K');
  const [material, setMaterial] = React.useState('Yellow Gold');
  const [note,     setNote]     = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [saving,   setSaving]   = React.useState(false);
  const [uploadMsg, setUploadMsg] = React.useState('');
  const imgRef = React.useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!imageUrl) { alert('Please add a photo of your jewellery.'); return; }
    if (!name.trim()) { alert('Please enter a name or description.'); return; }
    setSaving(true);
    setUploadMsg('Uploading photo to cloud…');

    const itemData = {
      id:       `client_${Date.now()}`,
      name:     name.trim(),
      weight:   weight.trim(),
      carat,
      material,
      note:     note.trim(),
      addedAt:  Date.now(),
      base64:   imageUrl,   // passed to saveClientItem for Supabase upload
    };

    try {
      setUploadMsg('Saving to catalogue…');
      const saved = await saveClientItem(itemData);
      setUploadMsg('');
      onAdded(saved);
    } catch (err) {
      console.error('Save failed:', err);
      setUploadMsg('');
      alert('Upload failed. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background:'rgba(26,0,16,0.7)', backdropFilter:'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y:80, opacity:0, scale:0.97 }}
        animate={{ y:0,  opacity:1, scale:1 }}
        exit={{   y:60,  opacity:0, scale:0.97 }}
        transition={{ type:'spring', stiffness:320, damping:32 }}
        className="w-full sm:max-w-md bg-white sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight:'95dvh', borderRadius:'24px 24px 0 0' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top bar */}
        <div className="h-1 flex-shrink-0"
             style={{ background:`linear-gradient(90deg, #C2185B, #E91E8C, #C2185B)` }} />

        {/* Handle */}
        <div className="flex justify-center pt-3 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background:'rgba(194,24,91,0.2)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <ShoppingBag size={13} style={{ color:'#1D4ED8' }} />
              <span className="font-cinzel text-[9px] tracking-[0.3em]" style={{ color:'#1D4ED8' }}>
                ORDERED STOCK
              </span>
            </div>
            <h2 className="font-cormorant text-2xl font-bold" style={{ color:C.text }}>
              Add Your Jewellery
            </h2>
            <p className="font-raleway text-xs mt-0.5" style={{ color:C.textLight }}>
              Upload a photo with details for our team
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background:'rgba(194,24,91,0.07)', border:`1px solid ${C.border}` }}
          >
            <X size={16} style={{ color:C.textMid }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">

          {/* Photo picker */}
          <div className="mb-5">
            <input ref={imgRef} type="file" accept="image/*" capture="environment"
                   className="hidden" onChange={handleImage} />
            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio:'1/1' }}>
                <img src={imageUrl} alt="jewellery" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                     style={{ background:'rgba(0,0,0,0.4)' }}>
                  <button
                    onClick={() => imgRef.current?.click()}
                    className="bg-white text-sm font-raleway px-4 py-2 rounded-full flex items-center gap-2"
                    style={{ color:C.text }}
                  >
                    <Camera size={14} /> Change Photo
                  </button>
                </div>
                {/* checkmark */}
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={() => imgRef.current?.click()}
                className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 py-10 transition-all"
                style={{ border:`2px dashed rgba(194,24,91,0.3)`, background:'rgba(194,24,91,0.03)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                     style={{ background:'rgba(194,24,91,0.1)' }}>
                  <Camera size={26} style={{ color:C.gold }} />
                </div>
                <div className="text-center">
                  <p className="font-cormorant text-lg font-semibold" style={{ color:C.text }}>
                    Add Jewellery Photo
                  </p>
                  <p className="font-raleway text-xs mt-1" style={{ color:C.textLight }}>
                    Tap to take photo or choose from gallery
                  </p>
                </div>
              </motion.button>
            )}
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="font-cinzel text-[9px] tracking-[0.25em] mb-2 block" style={{ color:C.textLight }}>
              NAME / DESCRIPTION *
            </label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Gold Necklace, My Bangle Set…"
              className="w-full px-4 py-3 rounded-xl font-raleway text-sm outline-none"
              style={{ border:`1.5px solid ${C.border}`, background:'#fff', color:C.text }}
            />
          </div>

          {/* Weight + Carat row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-cinzel text-[9px] tracking-[0.25em] mb-2 block" style={{ color:C.textLight }}>
                WEIGHT (grams)
              </label>
              <input
                type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="e.g. 12.5"
                className="w-full px-4 py-3 rounded-xl font-raleway text-sm outline-none"
                style={{ border:`1.5px solid ${C.border}`, background:'#fff', color:C.text }}
              />
            </div>
            <div>
              <label className="font-cinzel text-[9px] tracking-[0.25em] mb-2 block" style={{ color:C.textLight }}>
                CARAT / PURITY
              </label>
              <select
                value={carat} onChange={e => setCarat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl font-raleway text-sm outline-none appearance-none"
                style={{ border:`1.5px solid ${C.border}`, background:'#fff', color:C.text }}
              >
                {CARAT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Material */}
          <div className="mb-4">
            <label className="font-cinzel text-[9px] tracking-[0.25em] mb-2 block" style={{ color:C.textLight }}>
              MATERIAL TYPE
            </label>
            <div className="flex flex-wrap gap-2">
              {MATERIAL_OPTIONS.map(m => (
                <button
                  key={m}
                  onClick={() => setMaterial(m)}
                  className="px-3 py-1.5 rounded-full text-xs font-raleway font-semibold transition-all"
                  style={{
                    background: material === m ? C.gold : 'rgba(194,24,91,0.06)',
                    color:      material === m ? '#fff'  : C.textMid,
                    border:     material === m ? 'none'  : `1px solid ${C.border}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="font-cinzel text-[9px] tracking-[0.25em] mb-2 block" style={{ color:C.textLight }}>
              ADDITIONAL NOTES
            </label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Any special instructions, condition, design preference…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl font-raleway text-sm outline-none resize-none"
              style={{ border:`1.5px solid ${C.border}`, background:'#fff', color:C.text }}
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
            onClick={handleSubmit} disabled={saving}
            className="w-full py-4 rounded-2xl font-cinzel text-sm tracking-[0.2em] text-white flex items-center justify-center gap-3 shadow-lg"
            style={{
              background:`linear-gradient(135deg, ${C.gold}, ${C.goldDk})`,
              boxShadow:`0 6px 24px rgba(194,24,91,0.3)`,
              opacity: saving ? 0.85 : 1,
            }}
          >
            {saving ? (
              <>
                <motion.div animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:'linear' }}>
                  <Plus size={16} />
                </motion.div>
                {uploadMsg || 'UPLOADING…'}
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                ADD TO ORDERED STOCK
              </>
            )}
          </motion.button>

          {saving && (
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                      className="font-raleway text-xs text-center mt-2"
                      style={{ color: C.textLight }}>
              📸 Photo is uploading to cloud storage — visible on all devices once done
            </motion.p>
          )}

          <p className="font-raleway text-xs text-center mt-3" style={{ color:C.textLight }}>
            Our team will review and contact you on WhatsApp
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Client Item Card ──────────────────────────────────────────────────────────
function ClientItemCard({
  item, onDelete, onEnquire,
}: {
  item: ClientItem;
  onDelete: () => void;
  onEnquire: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:20, scale:0.96 }}
      animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, scale:0.9 }}
      whileHover={{ y:-5, boxShadow:'0 14px 32px rgba(29,78,216,0.14)' }}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col"
      style={{ border:`2px solid rgba(29,78,216,0.15)`, boxShadow:'0 3px 14px rgba(29,78,216,0.07)' }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Blue top bar = client item */}
      <div className="h-1" style={{ background:'linear-gradient(90deg,#1D4ED8,#3B82F6)' }} />

      <div className="relative overflow-hidden" style={{ aspectRatio:'1/1' }}>
        <img
          src={item.imageUrl} alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {/* Client badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-cinzel text-[9px] tracking-wider px-2.5 py-1.5 rounded-full shadow-lg"
                style={{ background:'#1D4ED8', color:'#fff' }}>
            YOUR ITEM
          </span>
        </div>
        {/* Delete */}
        <motion.button
          whileTap={{ scale:0.9 }}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          style={{ background:'rgba(239,68,68,0.9)', color:'#fff' }}
        >
          <Trash2 size={13} />
        </motion.button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Blue dot + YOUR ITEM label */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background:'#1D4ED8' }} />
          <span className="font-cinzel text-[9px] tracking-[0.2em]" style={{ color:'#1D4ED8' }}>
            ORDERED STOCK
          </span>
        </div>

        <h3 className="font-cormorant text-lg font-semibold leading-tight" style={{ color:C.text }}>
          {item.name}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mt-1">
          {item.weight && (
            <span className="flex items-center gap-1 text-xs font-raleway px-2 py-1 rounded-lg"
                  style={{ background:'rgba(29,78,216,0.07)', color:'#1D4ED8' }}>
              <span className="font-bold">{item.weight}g</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-raleway px-2 py-1 rounded-lg"
                style={{ background:'rgba(194,24,91,0.07)', color:C.gold }}>
            {item.carat}
          </span>
          <span className="flex items-center gap-1 text-xs font-raleway px-2 py-1 rounded-lg"
                style={{ background:'rgba(46,125,50,0.07)', color:'#2E7D32' }}>
            {item.material}
          </span>
        </div>

        {/* Note */}
        {item.note && (
          <p className="font-raleway text-xs leading-relaxed" style={{ color:C.textLight }}>
            {item.note}
          </p>
        )}

        {/* Date */}
        <p className="font-raleway text-[10px]" style={{ color:'rgba(173,104,136,0.6)' }}>
          Added {new Date(item.addedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
        </p>

        <div className="h-px w-full my-1" style={{ background:`linear-gradient(to right, transparent, ${C.border}, transparent)` }} />

        {/* Enquire */}
        <motion.button
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          onClick={(e) => { e.stopPropagation(); onEnquire(); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-xs font-bold text-white"
          style={{ background:'#25D366', boxShadow:'0 4px 14px rgba(37,211,102,0.28)' }}
        >
          <MessageCircle size={13} /> Enquire on WhatsApp
        </motion.button>
      </div>
    </motion.div>
  );
}

function decodeToken(t: string): { category: string; expiry: number } | null {
  try { const d = atob(t); const [cat,exp] = d.split('|'); return { category:cat, expiry:parseInt(exp) }; }
  catch { return null; }
}

function formatTime(ms: number) {
  if (ms <= 0) return '00:00';
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

// ── Floating diamond particles ────────────────────────────────────────────────
function Particles() {
  const items = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map(i => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left:`${8 + (i * 7.5) % 90}%`, top:`${10 + (i * 13) % 80}%` }}
          animate={{ y: [0, -25, 0], opacity: [0.1, 0.45, 0.1], rotate: [0, 180, 360] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.4, ease:'easeInOut' }}
        >
          <Diamond size={i % 3 === 0 ? 12 : 8} style={{ color: C.goldPale }} />
        </motion.div>
      ))}
    </div>
  );
}

// ── Ambient Background Effect ──────────────────────────────────────────────────
function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{ 
          x: ['0%', '3%', '-2%', '0%'], 
          y: ['0%', '-4%', '3%', '0%'],
          scale: [1, 1.05, 0.95, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-40 mix-blend-multiply filter blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ 
          x: ['0%', '-3%', '2%', '0%'], 
          y: ['0%', '4%', '-3%', '0%'],
          scale: [1, 0.95, 1.05, 1]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-30 mix-blend-multiply filter blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(194,24,91,0.2) 0%, transparent 70%)' }}
      />
    </div>
  );
}

// ── Expired page ──────────────────────────────────────────────────────────────
function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center max-w-md">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`2px solid ${C.border}` }}
        >
          <AlertCircle size={40} style={{ color: C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Oh! No, Link Expired</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          This private catalogue link has expired. Please contact Shekhar Raja Jewellers for a new link.
        </p>
        <motion.a
          whileHover={{ scale:1.04, boxShadow: '0 10px 25px rgba(37,211,102,0.4)' }} whileTap={{ scale:0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20The%20catalogue%20link%20expired.%20Please%20send%20a%20new%20one."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg transition-shadow"
          style={{ background:'#25D366' }}
        >
          <MessageCircle size={18} /> Request New Link on WhatsApp
        </motion.a>
        <div className="mt-6">
          <Link to="/" className="font-raleway text-sm hover:underline transition-all" style={{ color: C.textLight }}>← Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Invalid page ──────────────────────────────────────────────────────────────
function InvalidPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: C.bg }}>
      <AmbientBackground />
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="text-center max-w-md relative z-10">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`2px solid ${C.border}` }}
        >
          <Lock size={40} style={{ color: C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Private Catalogue</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          You need a valid link from Shekhar Raja Jewellers to view this catalogue.
        </p>
        <motion.a
          whileHover={{ scale:1.04, boxShadow: '0 10px 25px rgba(37,211,102,0.4)' }} whileTap={{ scale:0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20I%20would%20like%20to%20view%20your%20jewellery%20catalogue."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg transition-shadow"
          style={{ background:'#25D366' }}
        >
          <MessageCircle size={18} /> Request Catalogue on WhatsApp
        </motion.a>
      </motion.div>
    </div>
  );
}

// ── SKELETON PRELOADER ────────────────────────────────────────────────────────
function PrivateCatalogueSkeleton() {
  return (
    <div className="min-h-screen relative" style={{ background: C.bg }}>
      <AmbientBackground />
      
      {/* Hero Header Skeleton */}
      <div className="relative overflow-hidden shadow-2xl flex flex-col items-center justify-center px-6 py-16 sm:py-20" style={{ minHeight: 320, background: `linear-gradient(135deg, #2D0A18 0%, #6D1B4E 45%, #880E4F 75%, #C2185B 100%)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'linear-gradient(rgba(248,187,217,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,187,217,0.3) 1px, transparent 1px)', backgroundSize:'60px 60px' }} />
        
        <div className="h-4 w-48 rounded-full animate-pulse mb-4 z-10" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="h-16 w-64 sm:w-96 rounded-2xl animate-pulse mb-6 z-10" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <div className="h-4 w-72 rounded-full animate-pulse mb-6 z-10" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="h-10 w-32 rounded-full animate-pulse z-10" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden z-10">
          <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,48 C300,0 900,0 1200,48 L1200,48 L0,48 Z" fill={C.bg} />
          </svg>
        </div>
      </div>

      {/* Nav Skeleton */}
      <div className="backdrop-blur-md shadow-sm" style={{ background:'rgba(255,245,247,0.95)', borderBottom:`1px solid ${C.border}` }}>
         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: C.goldPale }} />
              <div className="h-4 w-32 rounded-md animate-pulse" style={{ background: C.goldPale }} />
            </div>
            <div className="w-24 h-8 rounded-full animate-pulse" style={{ background: C.goldPale }} />
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Stock Cards Skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(248,187,217,0.3)' }} />
          <div className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(248,187,217,0.3)' }} />
        </div>

        {/* Search/Filter Skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 h-12 rounded-xl animate-pulse" style={{ background: 'rgba(248,187,217,0.2)' }} />
          <div className="w-full sm:w-64 h-12 rounded-xl animate-pulse" style={{ background: 'rgba(248,187,217,0.2)' }} />
          <div className="w-full sm:w-32 h-12 rounded-xl animate-pulse" style={{ background: 'rgba(248,187,217,0.2)' }} />
        </div>

        <div className="h-4 w-32 rounded animate-pulse mb-5" style={{ background: 'rgba(248,187,217,0.3)' }} />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-sm" style={{ background: C.bgCard, border: `1px solid ${C.border}` }}>
              <div className="w-full animate-pulse" style={{ aspectRatio: '1/1', background: 'rgba(248,187,217,0.2)' }} />
              <div className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="h-2 w-1/3 rounded animate-pulse" style={{ background: 'rgba(248,187,217,0.5)' }} />
                <div className="h-5 w-3/4 rounded animate-pulse" style={{ background: 'rgba(248,187,217,0.4)' }} />
                <div className="h-2 w-full rounded animate-pulse" style={{ background: 'rgba(248,187,217,0.2)' }} />
                <div className="h-10 w-full rounded-xl animate-pulse mt-2" style={{ background: 'rgba(248,187,217,0.3)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PrivateCatalogue() {
  const [searchParams]                        = useSearchParams();
  const [timeLeft, setTimeLeft]               = useState(0);
  const [expired, setExpired]                 = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockMap, setStockMap]               = useState<Record<string,StockStatus>>(() => loadStockMap());
  const [orderedToast, setOrderedToast]       = useState<string|null>(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [activeFilter, setActiveFilter]       = useState<'all'|'ready'|'ordered'>('all');
  const [isLoading, setIsLoading]             = useState(true);
  const [clientItems, setClientItems]           = useState<ClientItem[]>([]);
  const [showAddModal, setShowAddModal]         = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start','end start'] });
  const heroY   = useTransform(scrollYProgress, [0,1], ['0%', '30%']);
  const heroOp  = useTransform(scrollYProgress, [0,0.7], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 60, damping: 20 });

  const token      = searchParams.get('token');
  const decoded    = token ? decodeToken(token) : null;
  const allProducts = decoded ? (ALL_PRODUCTS[decoded.category] ?? []) : [];
  const catLabel   = decoded?.category
    ? decoded.category.charAt(0).toUpperCase() + decoded.category.slice(1)
    : '';

  // Countdown
  useEffect(() => {
    if (!decoded) return;
    const tick = () => {
      const rem = decoded.expiry - Date.now();
      if (rem <= 0) { setExpired(true); setTimeLeft(0); }
      else setTimeLeft(rem);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [decoded?.expiry]);

  // Preload images for skeleton
  useEffect(() => {
    if (!decoded || expired) return;
    
    const imagesToLoad = allProducts.map(p => p.image);
    
    if (imagesToLoad.length === 0) {
       setIsLoading(false);
       return;
    }

    const imagePromises = imagesToLoad.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Resolve anyway to avoid blocking on failed images
      });
    });

    // Wait for images to load, with a minimum simulated delay of 800ms
    Promise.all([
      ...imagePromises,
      new Promise(resolve => setTimeout(resolve, 800))
    ]).then(() => {
      setIsLoading(false);
    });
  }, [allProducts.length, decoded, expired]);

  const readyCount   = allProducts.filter(p => (stockMap[p.id] ?? 'ready') === 'ready').length;
  const orderedCount = allProducts.filter(p => (stockMap[p.id] ?? 'ready') === 'ordered').length;

  const visibleProducts = useMemo(() => {
    return allProducts.filter(p => {
      const status = stockMap[p.id] ?? 'ready';
      const matchFilter =
        activeFilter === 'all'     ? true :
        activeFilter === 'ready'   ? status === 'ready' :
                                     status === 'ordered';
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || p.name.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [allProducts, stockMap, activeFilter, searchQuery]);

  const handleEnquire = (product: any) => {
    const status = stockMap[product.id] ?? 'ready';
    if (status === 'ready') {
      moveToOrdered(product.id);
      setStockMap(prev => ({ ...prev, [product.id]: 'ordered' }));
      setOrderedToast(product.name);
      setTimeout(() => setOrderedToast(null), 3500);
    }
    const msg = `Hi! I'm interested in *${product.name}* (${product.category}) from the private catalogue. Please share details.`;
    window.open(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`, '_blank');
  };


  const handleClientAdd = (item: ClientItem) => {
    // item is already saved to Supabase/IndexedDB by AddClientItemModal before calling onAdded
    setClientItems(prev => [item, ...prev]);
    setShowAddModal(false);
  };

  // Load client items from Supabase on mount (with localStorage migration)
  useEffect(() => {
    migrateFromLocalStorage().catch(() => {});
    loadClientItems()
      .then(items => setClientItems(items))
      .catch(() => {});
  }, []);

  const handleClientDelete = (id: string) => {
    deleteClientItem(id, clientItems.find(i => i.id === id)?.imagePath).then(() => {
      setClientItems(prev => prev.filter(i => i.id !== id));
    }).catch(() => {
      // Still remove from UI even if cloud delete fails
      setClientItems(prev => prev.filter(i => i.id !== id));
    });
  };

  const handleClientEnquire = (item: ClientItem) => {
    const note = item.note ? '\n📝 Note: ' + item.note : '';
    const msg =
      'Hi Shekhar Raja Jewellers! 🙏\n\n' +
      'I have added a jewellery item for enquiry:\n\n' +
      '💎 ' + item.name + '\n' +
      '⚖️ Weight: ' + (item.weight || 'Not specified') + 'g\n' +
      '🔢 Carat: ' + item.carat + '\n' +
      '🧱 Material: ' + item.material +
      note +
      '\n\nPlease review and advise. Thank you!';
    window.open('https://wa.me/918377911745?text=' + encodeURIComponent(msg), '_blank');
  };

  // Load client items from IndexedDB on mount + migrate old localStorage data
  useEffect(() => {
    migrateFromLocalStorage().then(() => {
      idbLoad().then(items => setClientItems(items));
    });
  }, []);

  // Stagger grid animation variants
  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, y: 0, scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  if (!token || !decoded) return <InvalidPage />;
  if (expired)            return <ExpiredPage />;
  if (isLoading)          return <PrivateCatalogueSkeleton />;

  const urgentColor = timeLeft < 5 * 60 * 1000 ? '#EF4444' : C.gold;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="min-h-screen relative" style={{ background: C.bg }}>
      
      {/* Background Ambient Effect */}
      <AmbientBackground />

      {/* ── SUCCESS TOAST ── */}
      <AnimatePresence>
        {orderedToast && (
          <motion.div
            initial={{ opacity:0, y:60, scale:0.85 }}
            animate={{ opacity:1, y:0,  scale:1, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            exit={{   opacity:0, y:40,  scale:0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background:'#2E7D32', color:'#fff', maxWidth:'90vw', boxShadow:'0 12px 40px rgba(46,125,50,0.4)' }}
          >
            {/* Success sheen */}
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.div animate={{ rotate:[0, 15, -15, 0] }} transition={{ duration: 0.6, delay: 0.1 }}>
              <ShoppingBag size={18} />
            </motion.div>
            <span className="font-raleway text-sm font-medium relative z-10">
              <strong>{orderedToast}</strong> moved to Ordered Stock ✓
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          LUXURY HERO HEADER
      ══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative overflow-hidden shadow-2xl" style={{ minHeight: 320 }}>
        {/* Gradient background with slow pulse */}
        <motion.div 
          className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ background:`linear-gradient(135deg, #2D0A18 0%, #6D1B4E 45%, #880E4F 75%, #C2185B 100%)` }} 
        />

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage:'linear-gradient(rgba(248,187,217,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,187,217,0.3) 1px, transparent 1px)',
                      backgroundSize:'60px 60px' }} />

        <Particles />

        {/* Radial glow */}
        <motion.div
          animate={{ scale:[1,1.15,1], opacity:[0.3,0.5,0.3] }}
          transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none z-0"
          style={{ background:`radial-gradient(ellipse, rgba(194,24,91,0.35) 0%, transparent 70%)`, filter:'blur(40px)' }}
        />

        {/* Content */}
        <motion.div
          style={{ y: springY, opacity: heroOp }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20"
        >
          {/* Brand eyebrow */}
          <motion.div
            initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8, ease: "easeOut" }}
            className="flex items-center gap-3 mb-4"
          >
            <motion.div animate={{ rotate:360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}>
              <Crown size={16} style={{ color: C.goldPale }} />
            </motion.div>
            <span className="font-cinzel text-[10px] tracking-[0.5em] text-white/60">
              PRIVATE · EXCLUSIVE · CURATED
            </span>
            <motion.div animate={{ rotate:-360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}>
              <Crown size={16} style={{ color: C.goldPale }} />
            </motion.div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity:0, y:24, filter: 'blur(10px)' }} animate={{ opacity:1, y:0, filter: 'blur(0px)' }} transition={{ delay:0.3, duration:0.9, ease:[0.22,1,0.36,1] }}
            className="font-cormorant font-light text-white leading-tight"
            style={{ fontSize:'clamp(2.2rem, 6vw, 4rem)' }}
          >
            Shekhar Raja{' '}
            <motion.em
              className="italic not-italic font-semibold"
              style={{ color: C.goldPale }}
              animate={{ opacity:[0.85, 1, 0.85], textShadow: ['0px 0px 0px rgba(248,187,217,0)', '0px 0px 15px rgba(248,187,217,0.5)', '0px 0px 0px rgba(248,187,217,0)'] }}
              transition={{ duration:3, repeat:Infinity, ease: "easeInOut" }}
            >
              Jewellers
            </motion.em>
          </motion.h1>

          {/* Collection name */}
          <motion.div
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.45, duration:0.7 }}
            className="mt-3 flex items-center gap-3"
          >
            <motion.div initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.7, duration: 0.8 }} className="h-px" style={{ background:`rgba(248,187,217,0.4)` }} />
            <span className="font-cinzel text-xs tracking-[0.4em]" style={{ color: C.goldPale }}>
              {catLabel.toUpperCase()} COLLECTION
            </span>
            <motion.div initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.7, duration: 0.8 }} className="h-px" style={{ background:`rgba(248,187,217,0.4)` }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55, duration:0.7 }}
            className="font-raleway text-sm mt-4 max-w-md"
            style={{ color:'rgba(255,255,255,0.6)' }}
          >
            Handpicked exclusively for you. Each piece crafted with love &amp; heritage.
          </motion.p>

          {/* Countdown pill */}
          <motion.div
            initial={{ opacity:0, y:16, scale: 0.9 }} animate={{ opacity:1, y:0, scale: 1 }} transition={{ delay:0.65, type: "spring", stiffness: 200, damping: 20 }}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full relative overflow-hidden"
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(10px)' }}
          >
            <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:1, repeat:Infinity }}>
              <Clock size={14} style={{ color: urgentColor }} />
            </motion.div>
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: urgentColor }}>
              {formatTime(timeLeft)}
            </span>
            <span className="font-raleway text-xs" style={{ color:'rgba(255,255,255,0.5)' }}>
              remaining
            </span>
          </motion.div>

          {/* Lock badge */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8, duration: 1 }}
            className="mt-4 flex items-center gap-1.5"
          >
            <Lock size={11} style={{ color:'rgba(255,255,255,0.35)' }} />
            <span className="font-cinzel text-[9px] tracking-[0.3em]" style={{ color:'rgba(255,255,255,0.35)' }}>
              PRIVATE CATALOGUE · CONFIDENTIAL
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden z-10">
          <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,48 C300,0 900,0 1200,48 L1200,48 L0,48 Z" fill={C.bg} />
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STICKY NAV HEADER
      ══════════════════════════════════════════════════════════ */}
      <motion.div
        className="sticky top-0 z-40 backdrop-blur-md shadow-sm"
        style={{ background:'rgba(255,245,247,0.95)', borderBottom:`1px solid ${C.border}` }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                 style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.goldDk})` }}>
              <Diamond size={12} className="text-white" />
            </div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]" style={{ color: C.textLight }}>
                SHEKHAR RAJA JEWELLERS
              </p>
              <h2 className="font-cormorant text-base font-bold leading-none" style={{ color: C.text }}>
                {catLabel} Collection
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
               style={{ background:`rgba(194,24,91,0.08)`, border:`1px solid ${C.border}` }}>
            <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:1, repeat:Infinity }}>
              <Clock size={13} style={{ color: urgentColor }} />
            </motion.div>
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: urgentColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        {/* Animated progress bar */}
        <motion.div
          className="h-0.5"
          style={{ background:`linear-gradient(to right, ${C.gold}, ${C.goldLt})`,
                   width:`${Math.max(0, Math.min(100, (timeLeft/3600000)*100))}%`,
                   transition:'width 1s linear', boxShadow: `0 0 8px ${C.goldLt}` }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">

        {/* ── STOCK SUMMARY CARDS ── */}
        <motion.div
          initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {/* Ready Stock */}
          <motion.button
            whileHover={{ y:-4, scale: 1.01, boxShadow:'0 12px 30px rgba(46,125,50,0.25)' }}
            whileTap={{ scale:0.97 }}
            onClick={() => setActiveFilter(f => f === 'ready' ? 'all' : 'ready')}
            className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 group"
            style={{
              background: activeFilter === 'ready' ? C.green : C.greenBg,
              border:`2px solid ${activeFilter === 'ready' ? C.green : 'rgba(46,125,50,0.2)'}`,
            }}
          >
            {/* Glass Sheen */}
            <motion.div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.7, ease: "easeInOut" }} />
            
            <motion.div
              animate={activeFilter === 'ready' ? { scale:[1,1.1,1] } : {}} transition={{ duration:1.5, repeat:Infinity }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
              style={{ background: activeFilter === 'ready' ? 'rgba(255,255,255,0.2)' : 'rgba(46,125,50,0.12)' }}
            >
              <Package size={20} style={{ color: activeFilter === 'ready' ? '#fff' : C.green }} />
            </motion.div>
            <div className="relative z-10">
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.8)' : '#4a7c59' }}>
                READY STOCK
              </p>
              <motion.p
                key={readyCount} initial={{ scale:1.2, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type: "spring", stiffness: 200 }}
                className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                style={{ color: activeFilter === 'ready' ? '#fff' : C.green }}
              >
                {readyCount}
              </motion.p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.6)' : '#4a7c59' }}>
                pieces available
              </p>
            </div>
          </motion.button>

          {/* Ordered Stock */}
          <motion.button
            whileHover={{ y:-4, scale: 1.01, boxShadow:`0 12px 30px rgba(194,24,91,0.25)` }}
            whileTap={{ scale:0.97 }}
            onClick={() => setActiveFilter(f => f === 'ordered' ? 'all' : 'ordered')}
            className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 group"
            style={{
              background: activeFilter === 'ordered' ? C.gold : `rgba(194,24,91,0.06)`,
              border:`2px solid ${activeFilter === 'ordered' ? C.gold : C.border}`,
            }}
          >
            {/* Glass Sheen */}
            <motion.div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.7, ease: "easeInOut" }} />

            <motion.div
              animate={activeFilter === 'ordered' ? { scale:[1,1.1,1] } : {}} transition={{ duration:1.5, repeat:Infinity }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
              style={{ background: activeFilter === 'ordered' ? 'rgba(255,255,255,0.2)' : `rgba(194,24,91,0.10)` }}
            >
              <ShoppingBag size={20} style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }} />
            </motion.div>
            <div className="relative z-10">
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.8)' : C.textMid }}>
                ORDERED STOCK
              </p>
              <motion.p
                key={orderedCount} initial={{ scale:1.2, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type: "spring", stiffness: 200 }}
                className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }}
              >
                {orderedCount}
              </motion.p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.6)' : C.textLight }}>
                pieces ordered
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* ── SEARCH + FILTER ROW ── */}
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once: true }} transition={{ delay:0.2, duration:0.6 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 relative z-10"
        >
          {/* Search */}
          <div className="relative flex-1 group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: searchQuery ? C.gold : C.textLight }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, category or tag…"
              className="w-full pl-10 pr-9 py-3 rounded-xl font-raleway text-sm outline-none transition-all duration-300"
              style={{ background:'#fff', border:`1.5px solid ${C.border}`, color: C.text,
                       boxShadow:'0 2px 10px rgba(194,24,91,0.05)' }}
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity:0, scale:0.8, rotate: -90 }}
                  animate={{ opacity:1, scale:1, rotate: 0 }}
                  exit={{ opacity:0, scale:0.8, rotate: 90 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-50 p-1 rounded-full"
                >
                  <X size={13} style={{ color: C.gold }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filter tabs - Refactored for fluid LayoutGroup sliding */}
          <LayoutGroup>
            <div className="flex rounded-xl overflow-hidden p-1 relative z-0"
                 style={{ border:`1.5px solid ${C.border}`, background:'#fff', boxShadow: '0 2px 10px rgba(194,24,91,0.05)' }}>
              {(['all','ready','ordered'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="relative flex-1 px-3 sm:px-4 py-2 font-cinzel text-[9px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 outline-none"
                  style={{ color: activeFilter === f ? '#fff' : C.textLight }}
                >
                  {/* Active Background Indicator */}
                  {activeFilter === f && (
                    <motion.div
                      layoutId="activeFilterBg"
                      className="absolute inset-0 rounded-lg -z-10 shadow-sm"
                      style={{ background: f === 'ready' ? C.green : f === 'ordered' ? C.gold : C.goldDk }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5 font-semibold">
                     {f === 'ready' && <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                     {f === 'ordered' && <Diamond size={8} className="text-white opacity-80" />}
                     {f.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          {/* WhatsApp */}
          <motion.a
            whileHover={{ scale:1.04, boxShadow: '0 8px 20px rgba(37,211,102,0.3)' }} whileTap={{ scale:0.97 }}
            href="https://wa.me/918377911745?text=Hi!%20I%20am%20viewing%20the%20private%20catalogue."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-white text-sm px-5 py-3 rounded-xl font-raleway flex-shrink-0 shadow-md transition-shadow"
            style={{ background:'#25D366' }}
          >
            <MessageCircle size={14} /> WhatsApp
          </motion.a>
        </motion.div>

        {/* Count */}
        <motion.p
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once: true }} transition={{ delay:0.4 }}
          className="font-raleway text-xs mb-5"
          style={{ color: C.textLight }}
        >
          Showing <strong style={{ color: C.text }}>{visibleProducts.length}</strong> of {allProducts.length} pieces
          {activeFilter !== 'all' && ` · ${activeFilter === 'ready' ? 'Ready' : 'Ordered'} stock only`}
          {searchQuery && ` · "${searchQuery}"`}
        </motion.p>

        {/* ── PRODUCT GRID ── */}
        {visibleProducts.length === 0 ? (
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ scale:[1,1.08,1] }} transition={{ duration:2, repeat:Infinity }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background:`rgba(194,24,91,0.08)` }}
            >
              <Search size={24} style={{ color: C.textLight }} />
            </motion.div>
            <p className="font-cormorant text-2xl" style={{ color: C.textLight }}>No products found</p>
            <motion.button
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="mt-4 font-raleway text-sm underline"
              style={{ color: C.gold }}
            >
              Clear filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            variants={gridVariants} initial="hidden" animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10"
          >
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => {
                const isReady = (stockMap[product.id] ?? 'ready') === 'ready';
                return (
                  <motion.div
                    key={product.id}
                    layout
                    variants={itemVariants}
                    whileHover={{ y:-7, scale:1.02, boxShadow: '0 12px 30px rgba(194,24,91,0.15)' }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group flex flex-col relative"
                    style={{ boxShadow:'0 4px 15px rgba(194,24,91,0.05)', border: `1px solid ${C.bgDeep}` }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {/* Glass Sheen on Card Hover */}
                    <motion.div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: '-150%', skewX: -20 }} whileHover={{ x: '150%' }} transition={{ duration: 0.8, ease: "easeInOut" }} />

                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio:'1/1' }}>
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e:any) => { e.target.src = '/bridal.png'; }}
                        style={{ filter: isReady ? 'none' : 'grayscale(35%) brightness(0.9)' }}
                      />

                      {/* Elegant Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                           style={{ background:'linear-gradient(to top, rgba(136,14,79,0.3) 0%, transparent 60%)' }} />

                      {/* Hover CTA Button */}
                      <motion.div
                        initial={{ opacity:0, y: 10 }}
                        whileHover={{ opacity:1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center z-10"
                      >
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2 shadow-xl border border-white/50">
                          <span className="font-cinzel text-xs font-bold" style={{ color: C.gold }}>VIEW PIECE</span>
                          <ArrowRight size={12} style={{ color: C.gold }} />
                        </div>
                      </motion.div>

                      {/* Tag */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`text-[10px] font-cinzel font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm border border-black/5 ${TAG_COLORS[product.tag] ?? 'bg-gray-100 text-gray-700'}`}>
                          {product.tag}
                        </span>
                      </div>

                      {/* Sparkle effect for ready items */}
                      {isReady && (
                        <motion.div
                          className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm"
                          animate={{ scale:[1,1.15,1], opacity:[0.8,1,0.8] }}
                          transition={{ duration:2.5, repeat:Infinity, ease: "easeInOut" }}
                        >
                          <Sparkles size={13} style={{ color:'#2E7D32' }} />
                        </motion.div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <motion.div
                          animate={{ scale:[1,1.4,1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration:3, repeat:Infinity, ease: "easeInOut" }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: C.gold }}
                        />
                        <span className="font-cinzel text-[9px] font-bold tracking-[0.2em]" style={{ color: C.gold }}>
                          {product.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-cormorant text-xl font-semibold leading-tight mb-2 group-hover:text-pink-800 transition-colors" style={{ color: C.text }}>
                        {product.name}
                      </h3>
                      <p className="font-raleway text-xs leading-relaxed mt-auto line-clamp-2" style={{ color: C.textLight }}>
                        {product.description}
                      </p>

                      {/* Divider */}
                      <div className="h-px w-full my-4" style={{ background: `linear-gradient(to right, transparent, ${C.border}, transparent)` }} />

                      {/* CTA */}
                      <motion.button
                        whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                        onClick={(e) => { e.stopPropagation(); handleEnquire(product); }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-xs font-bold transition-all relative overflow-hidden"
                        style={{
                          background: isReady ? '#25D366' : `rgba(194,24,91,0.04)`,
                          color:      isReady ? '#fff'    : C.gold,
                          border:     isReady ? 'none'    : `1px solid ${C.goldPale}`,
                          boxShadow:  isReady ? '0 4px 15px rgba(37,211,102,0.25)' : 'none',
                        }}
                      >
                        <MessageCircle size={14} />
                        {isReady ? 'Order on WhatsApp' : 'Enquire Now'}
                      </motion.button>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}


        {/* ══════════════════════════════════════════════════════════
            CLIENT JEWELLERY SECTION — Ordered Stock additions
        ══════════════════════════════════════════════════════════ */}
        {(activeFilter === 'all' || activeFilter === 'ordered') && (
          <motion.div
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:0.1 }}
            className="mt-12"
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1" style={{ background:`linear-gradient(to right, transparent, rgba(29,78,216,0.25))` }} />
              <div className="flex items-center gap-2">
                <ShoppingBag size={15} style={{ color:'#1D4ED8' }} />
                <span className="font-cinzel text-xs tracking-[0.3em]" style={{ color:'#1D4ED8' }}>YOUR ITEMS</span>
              </div>
              <div className="h-px flex-1" style={{ background:`linear-gradient(to left, transparent, rgba(29,78,216,0.25))` }} />
            </div>

            {/* Add button */}
            <motion.button
              whileHover={{ scale:1.02, boxShadow:'0 8px 28px rgba(194,24,91,0.18)' }}
              whileTap={{ scale:0.98 }}
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl mb-6 font-raleway text-sm font-semibold transition-all"
              style={{
                border:`2px dashed rgba(29,78,216,0.3)`,
                background:'rgba(29,78,216,0.04)',
                color:'#1D4ED8',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background:'rgba(29,78,216,0.12)' }}>
                <Plus size={18} style={{ color:'#1D4ED8' }} />
              </div>
              <div className="text-left">
                <p className="font-cinzel text-xs tracking-[0.2em]">ADD YOUR JEWELLERY</p>
                <p className="font-raleway text-xs mt-0.5" style={{ color:'rgba(29,78,216,0.55)' }}>
                  Upload photo with weight, carat & material
                </p>
              </div>
            </motion.button>

            {/* Client items grid */}
            {clientItems.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {clientItems.map(item => (
                    <ClientItemCard
                      key={item.id}
                      item={item}
                      onDelete={() => handleClientDelete(item.id)}
                      onEnquire={() => handleClientEnquire(item)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {clientItems.length === 0 && (
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="text-center py-10"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                     style={{ background:'rgba(29,78,216,0.07)' }}>
                  <Camera size={24} style={{ color:'rgba(29,78,216,0.4)' }} />
                </div>
                <p className="font-cormorant text-xl" style={{ color:C.textLight }}>
                  No items added yet
                </p>
                <p className="font-raleway text-xs mt-1" style={{ color:'rgba(173,104,136,0.6)' }}>
                  Tap the button above to add your jewellery
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── FOOTER WATERMARK ── */}
        <motion.div
          initial={{ opacity:0, y: 20 }} whileInView={{ opacity:1, y: 0 }}
          viewport={{ once:true }} transition={{ delay:0.3, duration: 0.8 }}
          className="text-center mt-20 pb-10"
        >
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to right, transparent, ${C.goldLt})` }} />
            <motion.div animate={{ rotate:360, scale: [1, 1.2, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}>
              <Diamond size={16} style={{ color: C.gold }} />
            </motion.div>
            <span className="font-cinzel text-xs font-bold tracking-[0.35em]" style={{ color: C.textMid }}>
              SHEKHAR RAJA JEWELLERS
            </span>
            <motion.div animate={{ rotate:-360, scale: [1, 1.2, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}>
              <Diamond size={16} style={{ color: C.gold }} />
            </motion.div>
            <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to left, transparent, ${C.goldLt})` }} />
          </div>
          <p className="font-raleway text-xs" style={{ color: C.textLight }}>
            This catalogue is confidential and intended for the recipient only.
          </p>
        </motion.div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Add Client Jewellery Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddClientItemModal
            onClose={() => setShowAddModal(false)}
            onAdded={handleClientAdd}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
