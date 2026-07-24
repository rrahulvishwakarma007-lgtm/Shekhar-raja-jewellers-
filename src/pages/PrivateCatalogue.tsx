// ════════════════════════════════════════════════════════════════════════════
// src/pages/PrivateCatalogue.tsx
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import {
  Clock, Lock, ArrowRight, MessageCircle, Diamond,
  AlertCircle, Package, ShoppingBag, Search, X, Sparkles, Crown,
  Upload, Camera, Plus, Trash2, Eye, CheckCircle, ImagePlus,
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import { loadStockMap, moveToOrdered, type StockStatus } from '../lib/stockStore';

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

// ── Uploaded photo interface ──────────────────────────────────────────────────
interface UploadedPhoto {
  id:        string;
  dataUrl:   string;
  name:      string;
  uploadedBy:'owner' | 'client';
  stockType: 'ready' | 'ordered';
  timestamp: number;
  caption?:  string;
}

// ── localStorage helpers for uploaded photos ──────────────────────────────────
const PHOTO_STORE_KEY = 'srj_catalogue_photos';

function loadPhotos(catalogueToken: string): UploadedPhoto[] {
  try {
    const raw = localStorage.getItem(`${PHOTO_STORE_KEY}_${catalogueToken}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function savePhotos(catalogueToken: string, photos: UploadedPhoto[]) {
  try {
    localStorage.setItem(`${PHOTO_STORE_KEY}_${catalogueToken}`, JSON.stringify(photos));
  } catch { /* quota exceeded  -  ignore */ }
}

// ── Products (same as before — abbreviated here, full list preserved) ─────────
export const ALL_PRODUCTS: Record<string, any[]> = {
  bangles: [
    { id:'b1', name:'Classic Gold Bangles',   category:'Bangles', description:'Set of 4 intricately designed 22K gold bangles.',       image:'/bangle1.png',   tag:'Classic'    },
    { id:'b2', name:'Designer Bangles',        category:'Bangles', description:'Designer gold bangles with enamel work.',                image:'/bangle2.png',   tag:'Designer'   },
    { id:'b3', name:'Antique Finish Bangles',  category:'Bangles', description:'Antique finish 22K bangles with stone work.',            image:'/bangle3.png',   tag:'Heritage'   },
    { id:'b4', name:'Bridal Bangles Set',      category:'Bangles', description:'Heavy bridal bangle set for your special day.',          image:'/bangle4.png',   tag:'Bridal'     },
    { id:'b5', name:'Peacock Bangles',         category:'Bangles', description:'Peacock motif 22K gold bangles.',                        image:'/bangle5.png',   tag:'Exclusive'  },
    { id:4,  name:'22KT Gold Bangles Set',     category:'Bangles', description:'Set of 4 intricately designed bangles.',                 image:'/bangle3.png',   tag:'Classic'    },
    { id:12, name:'Gold Bangles',              category:'Bangles', description:'Heavy gold kada with traditional carvings.',             image:'/bangle9.png',   tag:'Heritage'   },
    { id:20, name:'Gold Bangle Set',           category:'Bangles', description:'Elegant 22KT gold bangles with fine finish.',            image:'/bangleA.jpg',   tag:'New Arrival'},
    { id:21, name:'Designer Bangle',           category:'Bangles', description:'Intricate designer bangles in 22KT gold.',               image:'/bangleB.jpg',   tag:'Trending'   },
    { id:22, name:'Antique Bangle',            category:'Bangles', description:'Antique-finish 22KT gold bangles.',                      image:'/bangleC.jpg',   tag:'Heritage'   },
    { id:23, name:'Bridal Bangle',             category:'Bangles', description:'Heavy bridal bangles in 22KT gold.',                     image:'/bangleD.jpg',   tag:'Bridal Pick'},
    { id:34, name:'Gold Bangle 100',           category:'Bangles', description:'Intricately crafted 22KT gold bangle.',                  image:'/bangle100.jpg', tag:'New Arrival'},
    { id:35, name:'Gold Bangle 101',           category:'Bangles', description:'Classic 22KT gold bangle.',                              image:'/bangle101.jpg', tag:'Classic'    },
    { id:36, name:'Gold Bangle 102',           category:'Bangles', description:'Heritage-inspired gold bangle.',                         image:'/bangle102.jpg', tag:'Heritage'   },
    { id:37, name:'Gold Bangle 103',           category:'Bangles', description:'Elegant 22KT gold bangle.',                              image:'/bangle103.jpg', tag:'Festive'    },
    { id:38, name:'Gold Bangle 104',           category:'Bangles', description:'Traditional gold bangle with temple motifs.',            image:'/bangle104.jpg', tag:'Traditional'},
    { id:39, name:'Gold Bangle 106',           category:'Bangles', description:'Premium 22KT gold bangle.',                              image:'/bangle106.jpg', tag:'Premium'    },
    { id:40, name:'Gold Bangle 107',           category:'Bangles', description:'Trending designer bangle.',                              image:'/bangle107.jpg', tag:'Trending'   },
    { id:41, name:'Gold Bangle 108',           category:'Bangles', description:'Bridal-pick 22KT gold bangle set.',                      image:'/bangle108.jpg', tag:'Bridal Pick'},
  ],
  rings: [
    { id:'r1', name:'Solitaire Ring',         category:'Rings', description:'Brilliant solitaire diamond in 18K gold.',                image:'/ring1.png', tag:'Premium'   },
    { id:'r2', name:'Polki Diamond Ring',      category:'Rings', description:'Uncut polki diamonds set in 22K gold.',                  image:'/ring2.png', tag:'Exclusive' },
    { id:'r3', name:'Classic Gold Ring',       category:'Rings', description:'Classic 22K gold ring with intricate design.',           image:'/ring3.png', tag:'Classic'   },
    { id:'r4', name:'Floral Ring',            category:'Rings', description:'Beautiful floral motif 22K gold ring.',                  image:'/ring6.png', tag:'Trending'  },
    { id:'r5', name:'Gents Statement Ring',   category:'Rings', description:'Bold statement ring for men in 22K gold.',               image:'/ring7.png', tag:'Men'       },
  ],
  womens_ring: [
    { id:7,  name:"Ruby & Emerald Ring",      category:"Women's Ring", description:'Stunning cocktail ring with precious gemstones.',  image:'/ring7.png',           tag:'Limited'    },
    { id:14, name:'Solitaire Engagement Ring',category:"Women's Ring", description:'Brilliant solitaire in a classic six-prong setting.',image:'/ring6.png',         tag:'Premium'    },
    { id:17, name:'Gold Band Ring',           category:"Women's Ring", description:'Classic gold band with elegant minimal design.',    image:'/ring5.png',           tag:'Classic'    },
    { id:19, name:'Vintage Diamond Ring',     category:"Women's Ring", description:'Vintage-inspired design with intricate detailing.', image:'/ring1.png',           tag:'Vintage'    },
    { id:96, name:'Ladies Gold Ring 1',       category:"Women's Ring", description:'Delicate 22KT gold ring with floral motif.',       image:'/ladies ring1.jpg',    tag:'Classic'    },
    { id:97, name:'Ladies Gold Ring 2',       category:"Women's Ring", description:'Heritage ladies gold ring.',                       image:'/ladies ring2.jpg',    tag:'Heritage'   },
    { id:98, name:'Ladies Gold Ring 3',       category:"Women's Ring", description:'Exclusive ladies 22KT gold ring.',                 image:'/ladies ring3.jpg',    tag:'Exclusive'  },
    { id:99, name:'Ladies Gold Ring 4',       category:"Women's Ring", description:'Premium ladies gold ring.',                        image:'/ladies ring4.jpg',    tag:'Premium'    },
    { id:100,name:'Ladies Gold Ring 5',       category:"Women's Ring", description:'Trending ladies gold ring.',                       image:'/ladies ring5.jpg',    tag:'Trending'   },
    { id:101,name:'Ladies Gold Ring 6',       category:"Women's Ring", description:'New arrival ladies ring in 22KT gold.',            image:'/ladies ring6.jpg',    tag:'New Arrival'},
    { id:102,name:'Ladies Gold Ring 7',       category:"Women's Ring", description:'Luxury ladies gold ring.',                         image:'/ladies ring7.jpg',    tag:'Luxury'     },
    { id:103,name:'Ladies Gold Ring 8',       category:"Women's Ring", description:'Bestselling ladies 22KT gold ring.',               image:'/ladies ring8.jpg',    tag:'Bestseller' },
    { id:104,name:'Ladies Gold Ring 9',       category:"Women's Ring", description:'Traditional ladies gold ring.',                    image:'/ladies ring9.jpg',    tag:'Traditional'},
    { id:105,name:'Ladies Gold Ring 10',      category:"Women's Ring", description:'Bridal ladies ring in 22KT gold.',                 image:'/ladies ring10.jpg',   tag:'Bridal Pick'},
    { id:110,name:'Ladies Gold Ring 15',      category:"Women's Ring", description:'Exclusive ladies ring with Polki stone.',          image:'/ladies ring15.jpg',   tag:'Exclusive'  },
    { id:111,name:'Ladies Gold Ring 16',      category:"Women's Ring", description:'Premium bridal ladies ring.',                      image:'/ladies ring16.jpg',   tag:'Premium'    },
  ],
  mens_ring: [
    { id:86, name:'Gents Gold Ring 1',  category:"Men's Ring", description:'Bold 22KT gold ring for men.',              image:'/gents ring1.jpg',  tag:'Classic'    },
    { id:87, name:'Gents Gold Ring 2',  category:"Men's Ring", description:"Heritage men's gold ring.",                 image:'/gents ring2.jpg',  tag:'Heritage'   },
    { id:88, name:'Gents Gold Ring 3',  category:"Men's Ring", description:"Exclusive men's 22KT gold ring.",           image:'/gents ring3.jpg',  tag:'Exclusive'  },
    { id:89, name:'Gents Gold Ring 4',  category:"Men's Ring", description:"Premium men's gold signet ring.",           image:'/gents ring4.jpg',  tag:'Premium'    },
    { id:90, name:'Gents Gold Ring 5',  category:"Men's Ring", description:"Trending men's gold ring.",                 image:'/gents ring5.jpg',  tag:'Trending'   },
    { id:91, name:'Gents Gold Ring 6',  category:"Men's Ring", description:"New arrival men's ring.",                   image:'/gents ring6.jpg',  tag:'New Arrival'},
    { id:93, name:'Gents Gold Ring 8',  category:"Men's Ring", description:"Bestselling men's 22KT gold ring.",         image:'/gents ring8.jpg',  tag:'Bestseller' },
    { id:94, name:'Gents Gold Ring 9',  category:"Men's Ring", description:"Traditional men's gold ring.",              image:'/gents ring9.jpg',  tag:'Traditional'},
    { id:95, name:'Gents Gold Ring 10', category:"Men's Ring", description:"Bridal men's gold ring.",                   image:'/gents ring10.jpg', tag:'Bridal Pick'},
  ],
  necklaces: [
    { id:1,  name:'Kundan Bridal Necklace', category:'Necklaces', description:'Exquisite kundan work with meenakari detailing.', image:'/antique1.jpg',          tag:'Bestseller' },
    { id:6,  name:'Temple Gold Haar',       category:'Necklaces', description:'Traditional temple necklace with Lakshmi coins.', image:'/necklace88.png',        tag:'Traditional'},
    { id:9,  name:'Meenakari Bridal Set',   category:'Necklaces', description:'Colorful meenakari work bridal set.',             image:'/necklace3.jpg',         tag:'Bridal Pick'},
    { id:13, name:'Heritage Necklace',      category:'Necklaces', description:'Elegant heritage necklace.',                      image:'/bridal-necklace.jpg',   tag:'New Arrival'},
    { id:29, name:'Bridal Necklace A',      category:'Necklaces', description:'Stunning 22KT bridal necklace.',                  image:'/necklaceA.jpg',         tag:'Bridal Pick'},
    { id:46, name:'Turkish Necklace 1',     category:'Necklaces', description:'Grand Turkish-style necklace.',                   image:'/turkish necklace1.jpg', tag:'Exclusive'  },
    { id:60, name:'Jadau Necklace 1',       category:'Necklaces', description:'Exquisite Jadau necklace.',                       image:'/Jadau Necklace1.jpg',   tag:'Luxury'     },
    { id:73, name:'Long Haar 1',            category:'Necklaces', description:'Majestic long haar in 22KT gold.',                image:'/long haar1.jpg',        tag:'Traditional'},
    { id:42, name:'Short Necklace 1',       category:'Necklaces', description:'Delicate short necklace in 22KT gold.',           image:'/short necklace1.jpg',   tag:'Everyday'   },
  ],
  earrings: [
    { id:3,  name:'Antique Gold Jhumkas',   category:'Earrings', description:'Traditional temple-style jhumkas.',               image:'/earrings13.png', tag:'Heritage'   },
    { id:11, name:'Diamond Studs',          category:'Earrings', description:'Classic diamond studs for everyday elegance.',    image:'/ring4.png',      tag:'Everyday'   },
    { id:54, name:'Gold Earrings 101',      category:'Earrings', description:'Classic gold earrings with intricate detailing.', image:'/earrings101.jpg',tag:'Classic'    },
    { id:56, name:'Gold Earrings 104',      category:'Earrings', description:'Exclusive 22KT gold earrings.',                   image:'/earrings104.jpg',tag:'Exclusive'  },
    { id:57, name:'Gold Earrings 105',      category:'Earrings', description:'Trending 22KT gold earrings.',                    image:'/earrings105.jpg',tag:'Trending'   },
    { id:59, name:'Gold Earrings 107',      category:'Earrings', description:'Bridal earrings in 22KT gold.',                   image:'/earrings107.jpg',tag:'Bridal Pick'},
  ],
  chokers: [
    { id:67, name:'Gold Choker 101', category:'Chokers', description:'Elegant 22KT gold choker.', image:'/Choker101.jpg', tag:'Classic'    },
    { id:68, name:'Gold Choker 102', category:'Chokers', description:'Heritage-style gold choker.',image:'/Choker102.jpg', tag:'Heritage'   },
    { id:69, name:'Gold Choker 103', category:'Chokers', description:'Bridal choker in 22KT gold.',image:'/Choker103.jpg', tag:'Bridal Pick'},
    { id:70, name:'Gold Choker 104', category:'Chokers', description:'Exclusive choker necklace.', image:'/choker104.jpg', tag:'Exclusive'  },
    { id:71, name:'Gold Choker 105', category:'Chokers', description:'Trending 22KT gold choker.', image:'/choker105.jpg', tag:'Trending'   },
  ],
  pendants: [
    { id:78, name:'Pendant Set 1', category:'Pendants', description:'Elegant 22KT gold pendant set.', image:'/pandent set1.jpg', tag:'Classic'    },
    { id:79, name:'Pendant Set 2', category:'Pendants', description:'Heritage gold pendant.',          image:'/pandent set2.jpg', tag:'Heritage'   },
    { id:80, name:'Pendant Set 3', category:'Pendants', description:'Bridal pendant in 22KT gold.',   image:'/pandent set3.jpg', tag:'Bridal Pick'},
    { id:81, name:'Pendant Set 4', category:'Pendants', description:'Exclusive pendant.',              image:'/pandent set4.jpg', tag:'Exclusive'  },
    { id:84, name:'Pendant Set 7', category:'Pendants', description:'Premium gold pendant.',           image:'/pandent set7.jpg', tag:'Premium'    },
    { id:85, name:'Pendant Set 8', category:'Pendants', description:'Festive pendant in 22KT gold.',  image:'/pandent set8.jpg', tag:'Festive'    },
  ],
  bridal: [
    { id:'br1', name:'Bridal Set - Maharani', category:'Bridal', description:'Complete necklace, earrings & maang tikka.', image:'/bridal.png',          tag:'Bestseller' },
    { id:9,     name:'Meenakari Bridal Set',  category:'Bridal', description:'Colorful meenakari work bridal set.',        image:'/necklace3.jpg',        tag:'Bridal Pick'},
    { id:50,    name:'Turkish Bridal Necklace',category:'Bridal',description:'Bridal Turkish necklace with kundan.',        image:'/turkish necklace5.jpg',tag:'Bridal Pick'},
    { id:75,    name:'Bridal Long Haar',       category:'Bridal', description:'Bridal long haar in 22KT gold.',            image:'/long haar3.jpg',       tag:'Bridal Pick'},
    { id:80,    name:'Bridal Pendant Set',     category:'Bridal', description:'Bridal pendant with kundan stones.',         image:'/pandent set3.jpg',     tag:'Bridal Pick'},
  ],
  chains: [
    { id:'c1', name:'Figaro Gold Chain', category:'Chains', description:'Italian figaro chain in 22K gold.', image:'/chain2.png', tag:'Classic'  },
    { id:'c2', name:'Rope Gold Chain',   category:'Chains', description:'Elegant rope chain in 22K gold.',   image:'/chain4.png', tag:'Trending' },
  ],
  antique: [
    { id:2,  name:'Diamond Eternity Ring', category:'Antique', description:'A stunning circle of brilliant diamonds.',     image:'/ring2.png',      tag:'Premium'    },
    { id:5,  name:'Polki Diamond Ring',    category:'Antique', description:'Uncut polki diamonds set in 22KT gold.',       image:'/ring6.png',      tag:'Exclusive'  },
    { id:10, name:'Festive Gold Set',      category:'Antique', description:'Elegant gold set perfect for festive occasions.',image:'/bangle5.png',  tag:'Festive'    },
    { id:15, name:'Antique Choker Set',    category:'Antique', description:'Beautiful antique choker set.',                image:'/necklace15.png', tag:'Traditional'},
  ],
};

const TAG_COLORS: Record<string, string> = {
  Classic:'bg-amber-100 text-amber-800', Premium:'bg-purple-100 text-purple-800',
  Heritage:'bg-stone-100 text-stone-700', Bridal:'bg-pink-100 text-pink-800',
  'Bridal Pick':'bg-pink-100 text-pink-800', Exclusive:'bg-rose-100 text-rose-800',
  Bestseller:'bg-green-100 text-green-800', Trending:'bg-blue-100 text-blue-800',
  Limited:'bg-red-100 text-red-800', Traditional:'bg-orange-100 text-orange-800',
  Luxury:'bg-yellow-100 text-yellow-800', 'New Arrival':'bg-teal-100 text-teal-800',
  Festive:'bg-lime-100 text-lime-800', Everyday:'bg-gray-100 text-gray-700',
  Vintage:'bg-stone-200 text-stone-800', Designer:'bg-violet-100 text-violet-800',
  Men:'bg-slate-100 text-slate-700',
};

function decodeToken(t: string): { category: string; expiry: number; isOwner?: boolean } | null {
  try {
    const d = atob(t);
    const [cat, exp, role] = d.split('|');
    return { category: cat, expiry: parseInt(exp), isOwner: role === 'owner' };
  } catch { return null; }
}

function formatTime(ms: number) {
  if (ms <= 0) return '00:00';
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ── Particles ─────────────────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div key={i} className="absolute"
          style={{ left: `${8 + (i * 7.5) % 90}%`, top: `${10 + (i * 13) % 80}%` }}
          animate={{ y: [0, -25, 0], opacity: [0.1, 0.45, 0.1], rotate: [0, 180, 360] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}>
          <Diamond size={i % 3 === 0 ? 12 : 8} style={{ color: C.goldPale }} />
        </motion.div>
      ))}
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div animate={{ x: ['0%', '3%', '-2%', '0%'], y: ['0%', '-4%', '3%', '0%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-40 mix-blend-multiply filter blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)' }} />
      <motion.div animate={{ x: ['0%', '-3%', '2%', '0%'], y: ['0%', '4%', '-3%', '0%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-30 mix-blend-multiply filter blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(194,24,91,0.2) 0%, transparent 70%)' }} />
    </div>
  );
}

function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${C.goldPale}, #fff)`, border: `2px solid ${C.border}` }}>
          <AlertCircle size={40} style={{ color: C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Oh! No, Link Expired</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          This private catalogue link has expired. Please contact Shekhar Raja Jewellers for a new link.
        </p>
        <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20The%20catalogue%20link%20expired.%20Please%20send%20a%20new%20one."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg"
          style={{ background: '#25D366' }}>
          <MessageCircle size={18} /> Request New Link on WhatsApp
        </motion.a>
        <div className="mt-6">
          <Link to="/" className="font-raleway text-sm" style={{ color: C.textLight }}><- Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}

function InvalidPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: C.bg }}>
      <AmbientBackground />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md relative z-10">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ background: `linear-gradient(135deg, ${C.goldPale}, #fff)`, border: `2px solid ${C.border}` }}>
          <Lock size={40} style={{ color: C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color: C.text }}>Private Catalogue</h1>
        <p className="font-raleway text-base mb-8" style={{ color: C.textLight }}>
          You need a valid link from Shekhar Raja Jewellers to view this catalogue.
        </p>
        <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20I%20would%20like%20to%20view%20your%20jewellery%20catalogue."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg"
          style={{ background: '#25D366' }}>
          <MessageCircle size={18} /> Request Catalogue on WhatsApp
        </motion.a>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// UPLOAD PANEL COMPONENT
// Owner → uploads to Ready Stock
// Client → uploads to Ordered Stock
// ══════════════════════════════════════════════════════════════════════════════
interface UploadPanelProps {
  isOwner:       boolean;
  token:         string;
  photos:        UploadedPhoto[];
  onPhotosChange:(photos: UploadedPhoto[]) => void;
}

function UploadPanel({ isOwner, token, photos, onPhotosChange }: UploadPanelProps) {
  const inputRef    = useRef<HTMLInputElement>(null);
  const [caption, setCaption]   = useState('');
  const [preview, setPreview]   = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [viewPhoto, setViewPhoto] = useState<UploadedPhoto | null>(null);

  const role: 'owner' | 'client'         = isOwner ? 'owner' : 'client';
  const stockType: 'ready' | 'ordered'   = isOwner ? 'ready' : 'ordered';
  const accentColor                       = isOwner ? C.green  : C.gold;
  const label                             = isOwner ? 'Ready Stock' : 'Ordered Stock';

  const myPhotos = photos.filter(p => p.stockType === stockType);

  const readFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleSave = () => {
    if (!preview) return;
    const newPhoto: UploadedPhoto = {
      id:         `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      dataUrl:    preview,
      name:       caption.trim() || `${label} Photo ${myPhotos.length + 1}`,
      uploadedBy: role,
      stockType,
      timestamp:  Date.now(),
      caption:    caption.trim(),
    };
    const updated = [...photos, newPhoto];
    onPhotosChange(updated);
    savePhotos(token, updated);
    setPreview(null);
    setCaption('');
  };

  const handleDelete = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    onPhotosChange(updated);
    savePhotos(token, updated);
  };

  const handleSendToWA = (photo: UploadedPhoto) => {
    const msg = isOwner
      ? `Hi! Here's a jewellery piece I'm adding to the Ready Stock catalogue: *${photo.name}*`
      : `Hi Shekhar Raja Jewellers! I would like to order this jewellery: *${photo.name}*. Please share details and pricing.`;
    window.open(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
             style={{ background: isOwner ? 'rgba(46,125,50,0.12)' : `rgba(194,24,91,0.1)` }}>
          {isOwner ? <Package size={16} style={{ color: C.green }} /> : <ShoppingBag size={16} style={{ color: C.gold }} />}
        </div>
        <div>
          <h3 className="font-cinzel text-xs tracking-[0.2em]" style={{ color: accentColor }}>
            {isOwner ? 'OWNER UPLOAD' : 'CLIENT UPLOAD'}
          </h3>
          <p className="font-raleway text-xs" style={{ color: C.textLight }}>
            {isOwner
              ? 'Upload jewellery photos to Ready Stock'
              : 'Upload your reference jewellery photo to order'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full"
             style={{ background: isOwner ? 'rgba(46,125,50,0.1)' : `rgba(194,24,91,0.08)`, border: `1px solid ${isOwner ? 'rgba(46,125,50,0.2)' : C.border}` }}>
          <span className="font-cormorant text-xl font-bold" style={{ color: accentColor }}>{myPhotos.length}</span>
          <span className="font-raleway text-[10px]" style={{ color: accentColor }}>photos</span>
        </div>
      </div>

      {/* Drop Zone / Upload Area */}
      {!preview ? (
        <motion.div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="relative flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer transition-all duration-300 border-2 border-dashed py-8 px-4"
          style={{
            borderColor: dragging ? accentColor : isOwner ? 'rgba(46,125,50,0.3)' : C.border,
            background:  dragging
              ? isOwner ? 'rgba(46,125,50,0.06)' : `rgba(194,24,91,0.04)`
              : 'rgba(255,255,255,0.7)',
          }}>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: isOwner ? 'rgba(46,125,50,0.1)' : `rgba(194,24,91,0.08)` }}>
            <ImagePlus size={24} style={{ color: accentColor }} />
          </motion.div>
          <div className="text-center">
            <p className="font-cinzel text-xs tracking-[0.15em]" style={{ color: accentColor }}>
              {isOwner ? 'TAP TO ADD TO READY STOCK' : 'TAP TO UPLOAD YOUR REFERENCE'}
            </p>
            <p className="font-raleway text-xs mt-1" style={{ color: C.textLight }}>
              {isOwner
                ? 'Photos you upload will appear in Ready Stock for the client'
                : 'Upload a photo of jewellery you want to order'}
            </p>
            <p className="font-raleway text-[10px] mt-1" style={{ color: C.textLight }}>
              JPG, PNG, WEBP * Max 10MB * Drag & drop supported
            </p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />
        </motion.div>
      ) : (
        /* Preview before saving */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl overflow-hidden border-2"
          style={{ borderColor: accentColor, background: '#fff' }}>
          <div className="relative" style={{ aspectRatio: '4/3' }}>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
              <X size={14} style={{ color: C.text }} />
            </button>
            <div className="absolute bottom-3 left-3 right-3">
              <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/70">
                {isOwner ? '-> READY STOCK' : '-> ORDERED STOCK'}
              </span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <input
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder={isOwner ? 'Add a product name or note...' : 'Describe what you want to order...'}
              className="w-full px-4 py-2.5 rounded-xl font-raleway text-sm outline-none"
              style={{ background: C.bg, border: `1.5px solid ${C.border}`, color: C.text }}
            />
            <div className="flex gap-2">
              <button onClick={() => setPreview(null)}
                className="flex-1 py-2.5 rounded-xl font-raleway text-sm border"
                style={{ borderColor: C.border, color: C.textLight }}>
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl font-raleway text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: accentColor }}>
                <CheckCircle size={14} />
                {isOwner ? 'Add to Ready Stock' : 'Add to My Order'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploaded photos grid */}
      {myPhotos.length > 0 && (
        <div className="mt-4">
          <p className="font-cinzel text-[9px] tracking-[0.25em] mb-3" style={{ color: C.textLight }}>
            {isOwner ? 'ADDED TO READY STOCK' : 'YOUR ORDERED ITEMS'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <AnimatePresence>
              {myPhotos.map(photo => (
                <motion.div key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="relative group rounded-xl overflow-hidden cursor-pointer"
                  style={{ aspectRatio: '1/1', border: `1.5px solid ${isOwner ? 'rgba(46,125,50,0.2)' : C.border}` }}
                  onClick={() => setViewPhoto(photo)}>
                  <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5"
                       style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <button onClick={e => { e.stopPropagation(); setViewPhoto(photo); }}
                      className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                      <Eye size={12} style={{ color: C.text }} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleSendToWA(photo); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: '#25D366' }}>
                      <MessageCircle size={12} className="text-white" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(photo.id); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: '#EF4444' }}>
                      <Trash2 size={12} className="text-white" />
                    </button>
                  </div>
                  {/* Stock type badge */}
                  <div className="absolute bottom-1 left-1">
                    <span className="font-cinzel text-[8px] px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: isOwner ? 'rgba(46,125,50,0.85)' : 'rgba(194,24,91,0.85)' }}>
                      {isOwner ? 'v READY' : ' ORDERED'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Add more button */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl flex items-center justify-center cursor-pointer border-2 border-dashed"
              style={{ aspectRatio: '1/1', borderColor: isOwner ? 'rgba(46,125,50,0.25)' : C.border }}>
              <Plus size={20} style={{ color: accentColor }} />
            </motion.div>
          </div>
        </div>
      )}

      {/* Full-screen photo viewer */}
      <AnimatePresence>
        {viewPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setViewPhoto(null)}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              className="relative max-w-lg w-full rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <img src={viewPhoto.dataUrl} alt={viewPhoto.name} className="w-full object-contain max-h-[70vh]" />
              <div className="p-4" style={{ background: '#1a0a12' }}>
                <p className="font-cormorant text-lg text-white font-semibold">{viewPhoto.name}</p>
                {viewPhoto.caption && (
                  <p className="font-raleway text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{viewPhoto.caption}</p>
                )}
                <div className="flex gap-3 mt-4">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleSendToWA(viewPhoto)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-sm font-semibold text-white"
                    style={{ background: '#25D366' }}>
                    <MessageCircle size={15} /> Send on WhatsApp
                  </motion.button>
                  <button onClick={() => setViewPhoto(null)}
                    className="px-5 py-3 rounded-xl font-raleway text-sm border"
                    style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PrivateCatalogue() {
  const [searchParams]                        = useSearchParams();
  const [timeLeft, setTimeLeft]               = useState(0);
  const [expired, setExpired]                 = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockMap, setStockMap]               = useState<Record<string, StockStatus>>(() => loadStockMap());
  const [orderedToast, setOrderedToast]       = useState<string | null>(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [activeFilter, setActiveFilter]       = useState<'all' | 'ready' | 'ordered'>('all');
  const [photos, setPhotos]                   = useState<UploadedPhoto[]>([]);
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOp  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 60, damping: 20 });

  const token   = searchParams.get('token');
  const decoded = token ? decodeToken(token) : null;
  const isOwner = decoded?.isOwner ?? false;

  const catProducts = decoded ? (ALL_PRODUCTS[decoded.category] ?? []) : [];
  const catLabel    = decoded?.category
    ? decoded.category.charAt(0).toUpperCase() + decoded.category.slice(1)
    : '';

  // Load saved photos on mount
  useEffect(() => {
    if (token) setPhotos(loadPhotos(token));
  }, [token]);

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

  // Count uploaded photos in each section
  const ownerPhotos  = photos.filter(p => p.stockType === 'ready');
  const clientPhotos = photos.filter(p => p.stockType === 'ordered');

  // Merge uploaded owner photos into product list for ready stock display
  const uploadedAsProducts = ownerPhotos.map(p => ({
    id:          `upload_${p.id}`,
    name:        p.name,
    category:    catLabel,
    description: p.caption || 'Added to ready stock by Shekhar Raja Jewellers',
    image:       p.dataUrl,
    tag:         'New Arrival',
    isUploaded:  true,
  }));

  const allItems = [...catProducts, ...uploadedAsProducts];

  const readyCount   = allItems.filter(p => (stockMap[p.id] ?? 'ready') === 'ready').length;
  const orderedCount = allItems.filter(p => (stockMap[p.id] ?? 'ready') === 'ordered').length + clientPhotos.length;

  const visibleProducts = useMemo(() => {
    return allItems.filter(p => {
      const status = stockMap[p.id] ?? 'ready';
      const matchFilter =
        activeFilter === 'all'   ? true :
        activeFilter === 'ready' ? status === 'ready' :
                                   status === 'ordered';
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q
        || p.name.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q)
        || (p.tag ?? '').toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [allItems, stockMap, activeFilter, searchQuery]);

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

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show:   { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit:   { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (!token || !decoded) return <InvalidPage />;
  if (expired)            return <ExpiredPage />;

  const urgentColor = timeLeft < 5 * 60 * 1000 ? '#EF4444' : C.gold;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="min-h-screen relative" style={{ background: C.bg }}>
      <AmbientBackground />

      {/* ── Toast ── */}
      <AnimatePresence>
        {orderedToast && (
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: '#2E7D32', color: '#fff', maxWidth: '90vw' }}>
            <motion.div className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 0.8 }} />
            <ShoppingBag size={18} />
            <span className="font-raleway text-sm font-medium relative z-10">
              <strong>{orderedToast}</strong> moved to Ordered Stock v
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <div ref={heroRef} className="relative overflow-hidden shadow-2xl" style={{ minHeight: 300 }}>
        <motion.div className="absolute inset-0"
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ background: `linear-gradient(135deg, #2D0A18 0%, #6D1B4E 45%, #880E4F 75%, #C2185B 100%)` }} />
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'linear-gradient(rgba(248,187,217,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(248,187,217,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <Particles />
        <motion.div style={{ y: springY, opacity: heroOp }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-14 sm:py-18">
          <div className="flex items-center gap-3 mb-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
              <Crown size={16} style={{ color: C.goldPale }} />
            </motion.div>
            <span className="font-cinzel text-[10px] tracking-[0.5em] text-white/60">PRIVATE . EXCLUSIVE . CURATED</span>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
              <Crown size={16} style={{ color: C.goldPale }} />
            </motion.div>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }}
            className="font-cormorant font-light text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.6rem)' }}>
            Shekhar Raja <em className="italic font-semibold" style={{ color: C.goldPale }}>Jewellers</em>
          </motion.h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-px w-10" style={{ background: 'rgba(248,187,217,0.4)' }} />
            <span className="font-cinzel text-xs tracking-[0.4em]" style={{ color: C.goldPale }}>
              {catLabel.toUpperCase()} COLLECTION
            </span>
            <div className="h-px w-10" style={{ background: 'rgba(248,187,217,0.4)' }} />
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Clock size={14} style={{ color: urgentColor }} />
            </motion.div>
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: urgentColor }}>
              {formatTime(timeLeft)}
            </span>
            <span className="font-raleway text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>remaining</span>
          </motion.div>
          {/* Role badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: isOwner ? 'rgba(46,125,50,0.25)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {isOwner ? <Package size={11} className="text-white/70" /> : <Lock size={11} className="text-white/50" />}
            <span className="font-cinzel text-[9px] tracking-[0.3em] text-white/60">
              {isOwner ? 'OWNER ACCESS . CAN UPLOAD TO READY STOCK' : 'CLIENT VIEW . PRIVATE CATALOGUE'}
            </span>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden z-10">
          <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,48 C300,0 900,0 1200,48 L1200,48 L0,48 Z" fill={C.bg} />
          </svg>
        </div>
      </div>

      {/* ── Sticky nav ── */}
      <motion.div className="sticky top-0 z-40 backdrop-blur-md shadow-sm"
        style={{ background: 'rgba(255,245,247,0.95)', borderBottom: `1px solid ${C.border}` }}
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 20 }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                 style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDk})` }}>
              <Diamond size={12} className="text-white" />
            </div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]" style={{ color: C.textLight }}>SHEKHAR RAJA JEWELLERS</p>
              <h2 className="font-cormorant text-base font-bold leading-none" style={{ color: C.text }}>{catLabel} Collection</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Upload toggle button */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadPanel(p => !p)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full font-cinzel text-[10px] tracking-[0.12em] transition-all"
              style={{
                background: showUploadPanel ? C.gold : `rgba(194,24,91,0.08)`,
                color:      showUploadPanel ? '#fff'  : C.gold,
                border:     `1px solid ${C.border}`,
              }}>
              <Camera size={13} />
              {showUploadPanel ? 'Hide Upload' : 'Upload Photo'}
            </motion.button>
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                 style={{ background: `rgba(194,24,91,0.08)`, border: `1px solid ${C.border}` }}>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <Clock size={13} style={{ color: urgentColor }} />
              </motion.div>
              <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color: urgentColor }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        <motion.div className="h-0.5"
          style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLt})`,
                   width: `${Math.max(0, Math.min(100, (timeLeft / 3600000) * 100))}%`,
                   transition: 'width 1s linear', boxShadow: `0 0 8px ${C.goldLt}` }} />
      </motion.div>

      {/* ══ BODY ══ */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">

        {/* ── UPLOAD PANELS (collapsible) ── */}
        <AnimatePresence>
          {showUploadPanel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pt-2">
                {/* Owner Panel  -  Ready Stock */}
                <div className="rounded-2xl p-5 border-2"
                     style={{ background: 'rgba(46,125,50,0.04)', borderColor: 'rgba(46,125,50,0.2)' }}>
                  <UploadPanel
                    isOwner={true}
                    token={token!}
                    photos={photos}
                    onPhotosChange={setPhotos}
                  />
                </div>
                {/* Client Panel  -  Ordered Stock */}
                <div className="rounded-2xl p-5 border-2"
                     style={{ background: `rgba(194,24,91,0.03)`, borderColor: C.border }}>
                  <UploadPanel
                    isOwner={false}
                    token={token!}
                    photos={photos}
                    onPhotosChange={setPhotos}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STOCK SUMMARY CARDS ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.7 }}
          className="grid grid-cols-2 gap-4 mb-8">

          {/* Ready Stock Card */}
          <motion.button whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(46,125,50,0.25)' }} whileTap={{ scale: 0.97 }}
            onClick={() => setActiveFilter(f => f === 'ready' ? 'all' : 'ready')}
            className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300"
            style={{
              background: activeFilter === 'ready' ? C.green : C.greenBg,
              border: `2px solid ${activeFilter === 'ready' ? C.green : 'rgba(46,125,50,0.2)'}`,
            }}>
            <motion.div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.7 }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                 style={{ background: activeFilter === 'ready' ? 'rgba(255,255,255,0.2)' : 'rgba(46,125,50,0.12)' }}>
              <Package size={20} style={{ color: activeFilter === 'ready' ? '#fff' : C.green }} />
            </div>
            <div className="relative z-10">
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.8)' : '#4a7c59' }}>READY STOCK</p>
              <p className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                 style={{ color: activeFilter === 'ready' ? '#fff' : C.green }}>{readyCount}</p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ready' ? 'rgba(255,255,255,0.6)' : '#4a7c59' }}>
                pieces . {ownerPhotos.length} owner uploads
              </p>
            </div>
          </motion.button>

          {/* Ordered Stock Card */}
          <motion.button whileHover={{ y: -4, boxShadow: `0 12px 30px rgba(194,24,91,0.25)` }} whileTap={{ scale: 0.97 }}
            onClick={() => setActiveFilter(f => f === 'ordered' ? 'all' : 'ordered')}
            className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300"
            style={{
              background: activeFilter === 'ordered' ? C.gold : `rgba(194,24,91,0.06)`,
              border: `2px solid ${activeFilter === 'ordered' ? C.gold : C.border}`,
            }}>
            <motion.div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.7 }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                 style={{ background: activeFilter === 'ordered' ? 'rgba(255,255,255,0.2)' : `rgba(194,24,91,0.10)` }}>
              <ShoppingBag size={20} style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }} />
            </div>
            <div className="relative z-10">
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.8)' : C.textMid }}>ORDERED STOCK</p>
              <p className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                 style={{ color: activeFilter === 'ordered' ? '#fff' : C.gold }}>{orderedCount}</p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color: activeFilter === 'ordered' ? 'rgba(255,255,255,0.6)' : C.textLight }}>
                pieces . {clientPhotos.length} client uploads
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* ── SEARCH + FILTER ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: searchQuery ? C.gold : C.textLight }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, category or tag..."
              className="w-full pl-10 pr-9 py-3 rounded-xl font-raleway text-sm outline-none"
              style={{ background: '#fff', border: `1.5px solid ${C.border}`, color: C.text }} />
            <AnimatePresence>
              {searchQuery && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-rose-50">
                  <X size={12} style={{ color: C.gold }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            {(['all', 'ready', 'ordered'] as const).map(f => (
              <motion.button key={f} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-3 rounded-xl font-cinzel text-[10px] tracking-[0.15em] transition-all"
                style={{
                  background: activeFilter === f
                    ? f === 'ready' ? C.green : f === 'ordered' ? C.gold : C.goldDk
                    : '#fff',
                  color:  activeFilter === f ? '#fff' : C.textLight,
                  border: `1.5px solid ${activeFilter === f ? 'transparent' : C.border}`,
                }}>
                {f === 'all' ? 'ALL' : f === 'ready' ? 'READY' : 'ORDERED'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="font-raleway text-xs" style={{ color: C.textLight }}>
            Showing <strong style={{ color: C.text }}>{visibleProducts.length}</strong> pieces
          </p>
          <p className="font-cinzel text-[9px] tracking-[0.2em]" style={{ color: C.textLight }}>
            {catLabel.toUpperCase()} COLLECTION
          </p>
        </div>

        {/* ── GRID ── */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: `rgba(194,24,91,0.08)` }}>
              <Search size={24} style={{ color: C.textLight }} />
            </div>
            <p className="font-cormorant text-2xl" style={{ color: C.textLight }}>No products found</p>
            <button onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="mt-4 font-raleway text-sm underline" style={{ color: C.gold }}>
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div variants={gridVariants} initial="hidden" animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map(product => {
                const isReady    = (stockMap[product.id] ?? 'ready') === 'ready';
                const isUploaded = (product as any).isUploaded;
                return (
                  <motion.div key={product.id} layout variants={itemVariants}
                    whileHover={{ y: -7, scale: 1.02, boxShadow: '0 12px 30px rgba(194,24,91,0.15)' }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group flex flex-col relative"
                    style={{ border: `1px solid ${isUploaded ? 'rgba(46,125,50,0.25)' : C.bgDeep}` }}
                    onClick={() => setSelectedProduct(product)}>

                    {/* Sheen */}
                    <motion.div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-150%', skewX: -20 }} whileHover={{ x: '150%' }} transition={{ duration: 0.8 }} />

                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
                      <motion.img src={product.image} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e: any) => { e.target.src = '/bridal.png'; }}
                        style={{ filter: isReady ? 'none' : 'grayscale(35%) brightness(0.9)' }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                           style={{ background: 'linear-gradient(to top, rgba(136,14,79,0.3) 0%, transparent 60%)' }} />
                      <motion.div initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2 shadow-xl">
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
                      {/* Uploaded badge */}
                      {isUploaded && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full"
                             style={{ background: 'rgba(46,125,50,0.9)' }}>
                          <Upload size={9} className="text-white" />
                          <span className="font-cinzel text-[8px] text-white">OWNER</span>
                        </div>
                      )}
                      {/* Sparkle for ready */}
                      {isReady && !isUploaded && (
                        <motion.div className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm"
                          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 2.5, repeat: Infinity }}>
                          <Sparkles size={13} style={{ color: '#2E7D32' }} />
                        </motion.div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
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
                      <div className="h-px w-full my-4" style={{ background: `linear-gradient(to right, transparent, ${C.border}, transparent)` }} />
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={e => { e.stopPropagation(); handleEnquire(product); }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-xs font-bold transition-all relative overflow-hidden"
                        style={{
                          background: isReady ? '#25D366' : `rgba(194,24,91,0.04)`,
                          color:      isReady ? '#fff'    : C.gold,
                          border