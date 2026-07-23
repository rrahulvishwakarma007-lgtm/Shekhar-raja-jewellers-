// ════════════════════════════════════════════════════════════════════════════
// src/pages/PrivateCatalogue.tsx
// Photo upload: Owner → Ready Stock | Client → Ordered Stock
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, LayoutGroup, Variants } from 'framer-motion';
import {
  Clock, Lock, ArrowRight, MessageCircle, Diamond,
  AlertCircle, Package, ShoppingBag, Search, X, Sparkles, Crown,
  Camera, Upload, Image as ImageIcon, ChevronLeft, ChevronRight, Trash2, ZoomIn,
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

// ══════════════════════════════════════════════════════════════════════════════
// PHOTO STORE — localStorage, base64, compressed
// ══════════════════════════════════════════════════════════════════════════════
const PHOTO_KEY = 'srj_catalogue_photos';

type PhotoMap = Record<string, string[]>; // productId → array of base64 data URLs

function loadPhotos(): PhotoMap {
  try { return JSON.parse(localStorage.getItem(PHOTO_KEY) ?? '{}'); }
  catch { return {}; }
}

function savePhotos(map: PhotoMap) {
  try { localStorage.setItem(PHOTO_KEY, JSON.stringify(map)); }
  catch (e) { console.warn('Photo storage full', e); }
}

// Compress image to max 800px, quality 0.75
function compressImage(file: File, maxPx = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width  * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = ev.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Products ──────────────────────────────────────────────────────────────────
export const ALL_PRODUCTS: Record<string, any[]> = {
  bangles: [
    { id:'b1', name:'Classic Gold Bangles',   category:'Bangles',   description:'Set of 4 intricately designed 22K gold bangles.',  image:'/bangle1.png', tag:'Classic'    },
    { id:'b2', name:'Designer Bangles',        category:'Bangles',   description:'Designer gold bangles with enamel work.',           image:'/bangle2.png', tag:'Designer'   },
    { id:'b3', name:'Antique Finish Bangles',  category:'Bangles',   description:'Antique finish 22K bangles with stone work.',       image:'/bangle3.png', tag:'Heritage'   },
    { id:'b4', name:'Bridal Bangles Set',      category:'Bangles',   description:'Heavy bridal bangle set for your special day.',     image:'/bangle4.png', tag:'Bridal'     },
    { id:'b5', name:'Peacock Bangles',         category:'Bangles',   description:'Peacock motif 22K gold bangles.',                   image:'/bangle5.png', tag:'Exclusive'  },
    { id:4,  name:'22KT Gold Bangles Set',     category:'Bangles',   description:'Set of 4 intricately designed bangles.',           image:'/bangle3.png', tag:'Classic'     },
    { id:12, name:'Gold Bangles',              category:'Bangles',   description:'Heavy gold kada with traditional carvings.',        image:'/bangle9.png', tag:'Heritage'    },
    { id:20, name:'Gold Bangle Set',           category:'Bangles',   description:'Elegant 22KT gold bangles with fine finish.',       image:'/bangleA.jpg', tag:'New Arrival' },
    { id:21, name:'Designer Bangle',           category:'Bangles',   description:'Intricate designer bangles in 22KT gold.',          image:'/bangleB.jpg', tag:'Trending'    },
    { id:22, name:'Antique Bangle',            category:'Bangles',   description:'Antique-finish 22KT gold bangles.',                 image:'/bangleC.jpg', tag:'Heritage'    },
    { id:23, name:'Bridal Bangle',             category:'Bangles',   description:'Heavy bridal bangles in 22KT gold.',                image:'/bangleD.jpg', tag:'Bridal Pick' },
    { id:24, name:'Festive Bangle',            category:'Bangles',   description:'Gold bangles ideal for festivals.',                  image:'/bangleE.jpg', tag:'Festive'     },
  ],
  rings: [
    { id:'r1', name:'Solitaire Ring',          category:'Rings',     description:'Brilliant solitaire diamond in 18K gold.',         image:'/ring1.png',  tag:'Premium'    },
    { id:'r2', name:'Polki Diamond Ring',       category:'Rings',     description:'Uncut polki diamonds set in 22K gold.',            image:'/ring2.png',  tag:'Exclusive'  },
    { id:'r3', name:'Classic Gold Ring',        category:'Rings',     description:'Classic 22K gold ring with intricate design.',     image:'/ring3.png',  tag:'Classic'    },
    { id:'r4', name:'Floral Ring',             category:'Rings',     description:'Beautiful floral motif 22K gold ring.',            image:'/ring6.png',  tag:'Trending'   },
    { id:'r5', name:'Gents Statement Ring',     category:'Rings',     description:'Bold statement ring for men in 22K gold.',         image:'/ring7.png',  tag:'Men'        },
  ],
  womens_ring: [
    { id:96, name:"Ladies Gold Ring",  category:"Women's Ring", description:"Delicate 22KT gold ring with floral motif.", image:'/ladies ring1.jpg',  tag:'Classic'    },
    { id:97, name:"Ladies Gold Ring",  category:"Women's Ring", description:"Heritage ladies gold ring.",                 image:'/ladies ring2.jpg',  tag:'Heritage'   },
    { id:98, name:"Ladies Gold Ring",  category:"Women's Ring", description:"Exclusive 22KT gold ring with kundan.",      image:'/ladies ring3.jpg',  tag:'Exclusive'  },
    { id:99, name:"Ladies Gold Ring",  category:"Women's Ring", description:"Premium ladies gold ring.",                  image:'/ladies ring4.jpg',  tag:'Premium'    },
    { id:100, name:"Ladies Gold Ring", category:"Women's Ring", description:"Trending ladies gold ring.",                 image:'/ladies ring5.jpg',  tag:'Trending'   },
    { id:101, name:"Ladies Gold Ring", category:"Women's Ring", description:"New arrival ladies ring.",                  image:'/ladies ring6.jpg',  tag:'New Arrival'},
  ],
  mens_ring: [
    { id:86, name:"Gents Gold Ring", category:"Men's Ring", description:"Bold 22KT gold ring for men.",       image:'/gents ring1.jpg',  tag:'Classic'   },
    { id:87, name:"Gents Gold Ring", category:"Men's Ring", description:"Heritage men's gold ring.",           image:'/gents ring2.jpg',  tag:'Heritage'  },
    { id:88, name:"Gents Gold Ring", category:"Men's Ring", description:"Exclusive men's 22KT gold ring.",    image:'/gents ring3.jpg',  tag:'Exclusive' },
    { id:89, name:"Gents Gold Ring", category:"Men's Ring", description:"Premium men's gold signet ring.",    image:'/gents ring4.jpg',  tag:'Premium'   },
    { id:90, name:"Gents Gold Ring", category:"Men's Ring", description:"Trending men's gold ring.",          image:'/gents ring5.jpg',  tag:'Trending'  },
  ],
  necklaces: [
    { id:'n1', name:'Maharani Bridal Necklace',category:'Necklaces', description:'Grand bridal necklace in 22K gold.',              image:'/necklace88.png', tag:'Bridal'     },
    { id:'n2', name:'Temple Gold Haar',         category:'Necklaces', description:'Traditional temple necklace with Lakshmi coins.', image:'/temple.png',     tag:'Heritage'   },
    { id:'n3', name:'Kundan Choker',            category:'Necklaces', description:'Royal Kundan choker with meenakari work.',        image:'/necklace1.jpg',  tag:'Royal'      },
    { id:1,   name:'Kundan Bridal Necklace',   category:'Necklaces', description:'Exquisite kundan work with meenakari detailing.', image:'/antique1.jpg',   tag:'Bestseller' },
    { id:6,   name:'Temple Gold Haar',          category:'Necklaces', description:'Traditional temple necklace with Lakshmi coins.', image:'/necklace88.png', tag:'Traditional'},
    { id:8,   name:'Antique Necklace Set',      category:'Necklaces', description:'Complete antique temple set.',                    image:'/necklace22.png', tag:'Trending'   },
    { id:9,   name:'Meenakari Bridal Set',      category:'Necklaces', description:'Colorful meenakari work bridal set.',             image:'/necklace3.jpg',  tag:'Bridal Pick'},
    { id:46,  name:'Turkish Necklace',          category:'Necklaces', description:'Grand Turkish-style necklace in 22KT gold.',      image:'/turkish necklace1.jpg', tag:'Exclusive' },
    { id:47,  name:'Turkish Necklace',          category:'Necklaces', description:'Ornate Turkish necklace with antique finish.',    image:'/turkish necklace2.jpg', tag:'Heritage'  },
    { id:60,  name:'Jadau Necklace',            category:'Necklaces', description:'Exquisite Jadau necklace with uncut diamonds.',   image:'/Jadau Necklace1.jpg', tag:'Luxury'   },
    { id:73,  name:'Long Haar',                 category:'Necklaces', description:'Majestic long haar with traditional motifs.',     image:'/long haar1.jpg', tag:'Traditional'},
  ],
  chokers: [
    { id:67, name:'Gold Choker', category:'Chokers', description:'Elegant 22KT gold choker with traditional patterns.', image:'/Choker101.jpg', tag:'Classic'    },
    { id:68, name:'Gold Choker', category:'Chokers', description:'Heritage-style gold choker.',                          image:'/Choker102.jpg', tag:'Heritage'   },
    { id:69, name:'Gold Choker', category:'Chokers', description:'Bridal choker in 22KT gold with kundan stones.',       image:'/Choker103.jpg', tag:'Bridal Pick'},
    { id:70, name:'Gold Choker', category:'Chokers', description:'Exclusive choker with bold gold craftsmanship.',        image:'/choker104.jpg', tag:'Exclusive'  },
  ],
  earrings: [
    { id:'e1', name:'Antique Gold Jhumkas',  category:'Earrings', description:'Traditional temple-style jhumkas.',       image:'/earring1.jpg',    tag:'Heritage'  },
    { id:'e2', name:'Chandbali Earrings',    category:'Earrings', description:'Royal chandbali with stone work.',         image:'/earring5.jpg',    tag:'Exclusive' },
    { id:'e3', name:'Antique Earrings Set',  category:'Earrings', description:'Exquisite antique finish earring set.',    image:'/earrings13.png',  tag:'Limited'   },
    { id:54,   name:'Gold Earrings',         category:'Earrings', description:'Classic gold earrings with detailing.',    image:'/earrings101.jpg', tag:'Classic'   },
    { id:55,   name:'Gold Earrings',         category:'Earrings', description:'Heritage jhumka-style earrings.',          image:'/earrings102.jpg', tag:'Heritage'  },
    { id:56,   name:'Gold Earrings',         category:'Earrings', description:'Exclusive 22KT gold earrings.',            image:'/earrings104.jpg', tag:'Exclusive' },
    { id:57,   name:'Gold Earrings',         category:'Earrings', description:'Trending 22KT gold earrings.',             image:'/earrings105.jpg', tag:'Trending'  },
  ],
  pendants: [
    { id:78, name:'Pendant', category:'Pendants', description:'Elegant 22KT gold pendant.',           image:'/pandent set1.jpg', tag:'Classic'   },
    { id:79, name:'Pendant', category:'Pendants', description:'Heritage gold pendant.',                image:'/pandent set2.jpg', tag:'Heritage'  },
    { id:80, name:'Pendant', category:'Pendants', description:'Bridal pendant with kundan stones.',    image:'/pandent set3.jpg', tag:'Bridal Pick'},
    { id:81, name:'Pendant', category:'Pendants', description:'Exclusive pendant with handcrafted motifs.', image:'/pandent set4.jpg', tag:'Exclusive'},
  ],
  bridal: [
    { id:'br1', name:'Bridal Set – Maharani', category:'Bridal', description:'Complete necklace, earrings & maang tikka.', image:'/bridal.png',     tag:'Bestseller'},
    { id:'br2', name:'Kundan Bridal Choker',  category:'Bridal', description:'Exquisite kundan bridal choker.',              image:'/necklace88.png', tag:'Premium'   },
  ],
  chains: [
    { id:'c1', name:'Figaro Gold Chain', category:'Chains', description:'Italian figaro chain in 22K gold.', image:'/chain2.png', tag:'Classic' },
    { id:'c2', name:'Rope Gold Chain',   category:'Chains', description:'Elegant rope chain in 22K gold.',   image:'/chain4.png', tag:'Trending'},
  ],
  antique: [
    { id:'a1', name:'Antique Temple Set',      category:'Antique', description:'Full antique temple jewellery set.',      image:'/antique2.jpg', tag:'Heritage'},
    { id:'a2', name:'Antique Choker Necklace', category:'Antique', description:'Traditional antique choker necklace.',    image:'/antique3.jpg', tag:'Limited' },
  ],
};

const TAG_COLORS: Record<string, string> = {
  Classic:'bg-amber-100 text-amber-800', Premium:'bg-purple-100 text-purple-800',
  Heritage:'bg-stone-100 text-stone-700', Bridal:'bg-pink-100 text-pink-800',
  Exclusive:'bg-rose-100 text-rose-800', Royal:'bg-indigo-100 text-indigo-800',
  Bestseller:'bg-green-100 text-green-800', Trending:'bg-blue-100 text-blue-800',
  Limited:'bg-red-100 text-red-800', Designer:'bg-violet-100 text-violet-800',
  Men:'bg-slate-100 text-slate-700', Traditional:'bg-orange-100 text-orange-800',
  'Bridal Pick':'bg-pink-100 text-pink-800', Festive:'bg-lime-100 text-lime-800',
  Everyday:'bg-gray-100 text-gray-800', 'New Arrival':'bg-teal-100 text-teal-800',
  Luxury:'bg-yellow-100 text-yellow-800', Vintage:'bg-stone-200 text-stone-800',
};

function decodeToken(t: string): { category: string; expiry: number } | null {
  try { const d = atob(t); const [cat,exp] = d.split('|'); return { category:cat, expiry:parseInt(exp) }; }
  catch { return null; }
}
function formatTime(ms: number) {
  if (ms <= 0) return '00:00';
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

// ── Particles ─────────────────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({length:12},(_,i)=>i).map(i => (
        <motion.div key={i} className="absolute"
          style={{ left:`${8+(i*7.5)%90}%`, top:`${10+(i*13)%80}%` }}
          animate={{ y:[0,-25,0], opacity:[0.1,0.45,0.1], rotate:[0,180,360] }}
          transition={{ duration:5+(i%4), repeat:Infinity, delay:i*0.4, ease:'easeInOut' }}>
          <Diamond size={i%3===0?12:8} style={{ color:C.goldPale }} />
        </motion.div>
      ))}
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div animate={{ x:['0%','3%','-2%','0%'], y:['0%','-4%','3%','0%'] }}
        transition={{ duration:18, repeat:Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-40 filter blur-[100px]"
        style={{ background:'radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)' }} />
      <motion.div animate={{ x:['0%','-3%','2%','0%'], y:['0%','4%','-3%','0%'] }}
        transition={{ duration:22, repeat:Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-30 filter blur-[120px]"
        style={{ background:'radial-gradient(circle, rgba(194,24,91,0.2) 0%, transparent 70%)' }} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHOTO GALLERY LIGHTBOX
// ══════════════════════════════════════════════════════════════════════════════
function PhotoLightbox({ photos, startIdx, onClose, onDelete, canDelete }: {
  photos: string[]; startIdx: number;
  onClose: () => void; onDelete: (idx: number) => void; canDelete: boolean;
}) {
  const [idx, setIdx] = useState(startIdx);
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [photos.length]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }}
          exit={{ scale:0.85, opacity:0 }}
          className="relative max-w-2xl w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button onClick={onClose}
            className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={photos[idx]}
              initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
              transition={{ duration:0.25 }}
              className="w-full rounded-2xl object-contain max-h-[70vh]"
            />
          </AnimatePresence>

          {/* Controls */}
          {photos.length > 1 && (
            <>
              <button onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Counter + delete */}
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-white/50 text-xs font-raleway">{idx+1} / {photos.length}</span>
            {canDelete && (
              <motion.button
                whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}
                onClick={() => { onDelete(idx); if (idx >= photos.length - 1) setIdx(Math.max(0, idx-1)); }}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors text-xs font-raleway"
              >
                <Trash2 size={14} /> Delete Photo
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHOTO UPLOAD BUTTON + THUMBNAIL STRIP — per product card
// ══════════════════════════════════════════════════════════════════════════════
function ProductPhotoSection({ productId, isOwnerUpload, isReady }: {
  productId: string | number;
  isOwnerUpload: boolean; // true = owner, false = client
  isReady: boolean;
}) {
  const key        = String(productId);
  const inputRef   = useRef<HTMLInputElement>(null);
  const [photos, setPhotos]       = useState<string[]>(() => loadPhotos()[key] ?? []);
  const [lightbox, setLightbox]   = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const canUpload = isOwnerUpload ? isReady : !isReady; // owner→ready, client→ordered

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newPhotos: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file);
        newPhotos.push(compressed);
      }
      setPhotos(prev => {
        const updated = [...prev, ...newPhotos];
        const map = loadPhotos();
        map[key] = updated;
        savePhotos(map);
        return updated;
      });
    } catch (e) { console.error('Upload error', e); }
    finally { setUploading(false); }
  }, [key]);

  const deletePhoto = (idx: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_,i) => i !== idx);
      const map = loadPhotos();
      map[key] = updated;
      savePhotos(map);
      return updated;
    });
    if (lightbox !== null && lightbox >= idx) setLightbox(l => Math.max(0, (l ?? 1) - 1));
  };

  const uploadLabel = isOwnerUpload
    ? 'Add Product Photo'
    : 'Upload Reference Photo';

  const uploadHint = isOwnerUpload
    ? 'Add actual jewellery photo for client'
    : 'Upload your design reference or inspiration';

  return (
    <div className="mt-3">
      {/* Thumbnail strip */}
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {photos.map((src, i) => (
            <motion.button
              key={i}
              whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
              onClick={() => setLightbox(i)}
              className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-pink-300 transition-all shadow-sm"
            >
              <img src={src} alt={`photo-${i}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn size={12} className="text-white opacity-0 group-hover:opacity-100" />
              </div>
            </motion.button>
          ))}

          {/* +N badge if more than 4 */}
          {photos.length > 4 && (
            <div className="w-12 h-12 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center">
              <span className="font-cinzel text-[9px] font-bold" style={{ color:C.gold }}>
                +{photos.length - 4}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      {canUpload && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <motion.button
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-raleway text-xs font-medium border-dashed border-2 transition-all"
            style={{
              borderColor: isOwnerUpload ? C.green : C.gold,
              color:        isOwnerUpload ? C.green : C.gold,
              background:   isOwnerUpload ? 'rgba(46,125,50,0.04)' : `rgba(194,24,91,0.04)`,
            }}
            title={uploadHint}
          >
            {uploading ? (
              <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}>
                <Upload size={13} />
              </motion.div>
            ) : (
              <Camera size={13} />
            )}
            {uploading ? 'Uploading…' : uploadLabel}
            {photos.length > 0 && (
              <span className="ml-auto flex items-center gap-1 opacity-60">
                <ImageIcon size={11} /> {photos.length}
              </span>
            )}
          </motion.button>
        </>
      )}

      {/* Lightbox */}
      {lightbox !== null && photos.length > 0 && (
        <PhotoLightbox
          photos={photos}
          startIdx={lightbox}
          onClose={() => setLightbox(null)}
          onDelete={deletePhoto}
          canDelete={canUpload}
        />
      )}
    </div>
  );
}

// ── Expired / Invalid pages ───────────────────────────────────────────────────
function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background:C.bg }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center max-w-md">
        <motion.div animate={{ rotate:[0,-5,5,0] }} transition={{ duration:2, repeat:Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ background:`linear-gradient(135deg,${C.goldPale},#fff)`, border:`2px solid ${C.border}` }}>
          <AlertCircle size={40} style={{ color:C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color:C.text }}>Link Expired</h1>
        <p className="font-raleway text-base mb-8" style={{ color:C.textLight }}>
          This private catalogue link has expired. Please contact Shekhar Raja Jewellers for a new link.
        </p>
        <motion.a whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20The%20catalogue%20link%20expired.%20Please%20send%20a%20new%20one."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg"
          style={{ background:'#25D366' }}>
          <MessageCircle size={18} /> Request New Link on WhatsApp
        </motion.a>
        <div className="mt-6"><Link to="/" className="font-raleway text-sm" style={{ color:C.textLight }}>← Back to Home</Link></div>
      </motion.div>
    </div>
  );
}

function InvalidPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background:C.bg }}>
      <AmbientBackground />
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="text-center max-w-md relative z-10">
        <motion.div animate={{ scale:[1,1.05,1] }} transition={{ duration:3, repeat:Infinity }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
          style={{ background:`linear-gradient(135deg,${C.goldPale},#fff)`, border:`2px solid ${C.border}` }}>
          <Lock size={40} style={{ color:C.gold }} />
        </motion.div>
        <h1 className="font-cormorant text-4xl font-bold mb-3" style={{ color:C.text }}>Private Catalogue</h1>
        <p className="font-raleway text-base mb-8" style={{ color:C.textLight }}>
          You need a valid link from Shekhar Raja Jewellers to view this catalogue.
        </p>
        <motion.a whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          href="https://wa.me/918377911745?text=Hi!%20I%20would%20like%20to%20view%20your%20jewellery%20catalogue."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-raleway font-medium shadow-lg"
          style={{ background:'#25D366' }}>
          <MessageCircle size={18} /> Request Catalogue on WhatsApp
        </motion.a>
      </motion.div>
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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target:heroRef, offset:['start start','end start'] });
  const heroY   = useTransform(scrollYProgress, [0,1], ['0%','30%']);
  const heroOp  = useTransform(scrollYProgress, [0,0.7], [1,0]);
  const springY = useSpring(heroY, { stiffness:60, damping:20 });

  const token       = searchParams.get('token');
  const decoded     = token ? decodeToken(token) : null;
  const allProducts = decoded ? (ALL_PRODUCTS[decoded.category] ?? []) : [];
  const catLabel    = decoded?.category
    ? decoded.category.charAt(0).toUpperCase() + decoded.category.slice(1) : '';

  // Whether the current viewer is the "owner" (pass ?role=owner in the token URL)
  const isOwner = searchParams.get('role') === 'owner';

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

  const gridVariants: Variants = {
    hidden: { opacity:0 },
    show: { opacity:1, transition:{ staggerChildren:0.07 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity:0, y:30, scale:0.95 },
    show: { opacity:1, y:0, scale:1, transition:{ type:'spring', stiffness:100, damping:15 } },
    exit: { opacity:0, scale:0.9, transition:{ duration:0.2 } }
  };

  if (!token || !decoded) return <InvalidPage />;
  if (expired)            return <ExpiredPage />;

  const urgentColor = timeLeft < 5 * 60 * 1000 ? '#EF4444' : C.gold;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8 }}
      className="min-h-screen relative" style={{ background:C.bg }}>
      <AmbientBackground />

      {/* Toast */}
      <AnimatePresence>
        {orderedToast && (
          <motion.div
            initial={{ opacity:0, y:60, scale:0.85 }}
            animate={{ opacity:1, y:0, scale:1, transition:{ type:'spring', stiffness:300, damping:20 } }}
            exit={{ opacity:0, y:40, scale:0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background:'#2E7D32', color:'#fff', maxWidth:'90vw' }}>
            <motion.div className="absolute inset-0 bg-white/20"
              initial={{ x:'-100%' }} animate={{ x:'100%' }} transition={{ duration:0.8 }} />
            <ShoppingBag size={18} />
            <span className="font-raleway text-sm font-medium relative z-10">
              <strong>{orderedToast}</strong> moved to Ordered Stock ✓
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role badge */}
      {isOwner && (
        <div className="fixed top-20 right-4 z-50">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-cinzel tracking-wider shadow-lg"
               style={{ background:`linear-gradient(135deg,${C.goldDk},${C.gold})` }}>
            <Crown size={11} /> OWNER MODE
          </div>
        </div>
      )}

      {/* Upload guide banner */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity:0, y:-40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:1.2, duration:0.6 }}
          className="fixed top-16 left-0 right-0 z-30 flex justify-center pointer-events-none"
        >
          <div className="mx-4 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 pointer-events-auto"
               style={{ background:isOwner ? `rgba(46,125,50,0.92)` : `rgba(194,24,91,0.92)`,
                        backdropFilter:'blur(10px)' }}>
            <Camera size={14} className="text-white flex-shrink-0" />
            <span className="text-white font-raleway text-xs">
              {isOwner
                ? '📸 Owner: Tap "Add Product Photo" on Ready Stock items to upload jewellery photos'
                : '📷 You can upload a reference/inspiration photo on any Ordered item'}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative overflow-hidden shadow-2xl" style={{ minHeight:320 }}>
        <motion.div className="absolute inset-0"
          animate={{ scale:[1,1.05,1] }} transition={{ duration:15, repeat:Infinity }}
          style={{ background:`linear-gradient(135deg, #2D0A18 0%, #6D1B4E 45%, #880E4F 75%, #C2185B 100%)` }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage:'linear-gradient(rgba(248,187,217,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(248,187,217,0.3) 1px,transparent 1px)',
                   backgroundSize:'60px 60px' }} />
        <Particles />
        <motion.div animate={{ scale:[1,1.15,1], opacity:[0.3,0.5,0.3] }} transition={{ duration:4, repeat:Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none z-0"
          style={{ background:`radial-gradient(ellipse,rgba(194,24,91,0.35) 0%,transparent 70%)`, filter:'blur(40px)' }} />

        <motion.div style={{ y:springY, opacity:heroOp }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20">
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}
            className="flex items-center gap-3 mb-4">
            <motion.div animate={{ rotate:360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}>
              <Crown size={16} style={{ color:C.goldPale }} />
            </motion.div>
            <span className="font-cinzel text-[10px] tracking-[0.5em] text-white/60">PRIVATE · EXCLUSIVE · CURATED</span>
            <motion.div animate={{ rotate:-360 }} transition={{ duration:10, repeat:Infinity, ease:'linear' }}>
              <Crown size={16} style={{ color:C.goldPale }} />
            </motion.div>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:24, filter:'blur(10px)' }} animate={{ opacity:1, y:0, filter:'blur(0px)' }}
            transition={{ delay:0.3, duration:0.9 }}
            className="font-cormorant font-light text-white leading-tight" style={{ fontSize:'clamp(2.2rem,6vw,4rem)' }}>
            Shekhar Raja{' '}
            <motion.em className="italic not-italic font-semibold" style={{ color:C.goldPale }}
              animate={{ opacity:[0.85,1,0.85], textShadow:['0px 0px 0px rgba(248,187,217,0)','0px 0px 15px rgba(248,187,217,0.5)','0px 0px 0px rgba(248,187,217,0)'] }}
              transition={{ duration:3, repeat:Infinity }}>
              Jewellers
            </motion.em>
          </motion.h1>

          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.45 }}
            className="mt-3 flex items-center gap-3">
            <motion.div initial={{ width:0 }} animate={{ width:40 }} transition={{ delay:0.7, duration:0.8 }} className="h-px" style={{ background:`rgba(248,187,217,0.4)` }} />
            <span className="font-cinzel text-xs tracking-[0.4em]" style={{ color:C.goldPale }}>{catLabel.toUpperCase()} COLLECTION</span>
            <motion.div initial={{ width:0 }} animate={{ width:40 }} transition={{ delay:0.7, duration:0.8 }} className="h-px" style={{ background:`rgba(248,187,217,0.4)` }} />
          </motion.div>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
            className="font-raleway text-sm mt-4 max-w-md" style={{ color:'rgba(255,255,255,0.6)' }}>
            Handpicked exclusively for you. Each piece crafted with love &amp; heritage.
          </motion.p>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full"
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', backdropFilter:'blur(10px)' }}>
            <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:1, repeat:Infinity }}>
              <Clock size={14} style={{ color:urgentColor }} />
            </motion.div>
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color:urgentColor }}>{formatTime(timeLeft)}</span>
            <span className="font-raleway text-xs" style={{ color:'rgba(255,255,255,0.5)' }}>remaining</span>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            className="mt-4 flex items-center gap-1.5">
            <Lock size={11} style={{ color:'rgba(255,255,255,0.35)' }} />
            <span className="font-cinzel text-[9px] tracking-[0.3em]" style={{ color:'rgba(255,255,255,0.35)' }}>
              PRIVATE CATALOGUE · CONFIDENTIAL
            </span>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden z-10">
          <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,48 C300,0 900,0 1200,48 L1200,48 L0,48 Z" fill={C.bg} />
          </svg>
        </div>
      </div>

      {/* ── STICKY NAV ── */}
      <motion.div className="sticky top-0 z-40 backdrop-blur-md shadow-sm"
        style={{ background:'rgba(255,245,247,0.95)', borderBottom:`1px solid ${C.border}` }}
        initial={{ y:-100 }} animate={{ y:0 }} transition={{ delay:0.2, type:'spring', stiffness:100, damping:20 }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                 style={{ background:`linear-gradient(135deg,${C.gold},${C.goldDk})` }}>
              <Diamond size={12} className="text-white" />
            </div>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.25em]" style={{ color:C.textLight }}>SHEKHAR RAJA JEWELLERS</p>
              <h2 className="font-cormorant text-base font-bold leading-none" style={{ color:C.text }}>{catLabel} Collection</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
               style={{ background:`rgba(194,24,91,0.08)`, border:`1px solid ${C.border}` }}>
            <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:1, repeat:Infinity }}>
              <Clock size={13} style={{ color:urgentColor }} />
            </motion.div>
            <span className="font-cinzel text-sm font-bold tabular-nums" style={{ color:urgentColor }}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <motion.div className="h-0.5"
          style={{ background:`linear-gradient(to right,${C.gold},${C.goldLt})`,
                   width:`${Math.max(0,Math.min(100,(timeLeft/3600000)*100))}%`,
                   transition:'width 1s linear', boxShadow:`0 0 8px ${C.goldLt}` }} />
      </motion.div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">

        {/* Stock summary */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.7 }} className="grid grid-cols-2 gap-4 mb-8">

          {/* Ready Stock */}
          <motion.button whileHover={{ y:-4, scale:1.01 }} whileTap={{ scale:0.97 }}
            onClick={() => setActiveFilter(f => f==='ready'?'all':'ready')}
            className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300"
            style={{ background:activeFilter==='ready'?C.green:C.greenBg, border:`2px solid ${activeFilter==='ready'?C.green:'rgba(46,125,50,0.2)'}` }}>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x:'-100%' }} whileHover={{ x:'100%' }} transition={{ duration:0.7 }} />
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                 style={{ background:activeFilter==='ready'?'rgba(255,255,255,0.2)':'rgba(46,125,50,0.12)' }}>
              <Package size={20} style={{ color:activeFilter==='ready'?'#fff':C.green }} />
            </div>
            <div className="relative z-10">
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color:activeFilter==='ready'?'rgba(255,255,255,0.8)':'#4a7c59' }}>READY STOCK</p>
              <motion.p key={readyCount} initial={{ scale:1.2, opacity:0 }} animate={{ scale:1, opacity:1 }}
                className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                style={{ color:activeFilter==='ready'?'#fff':C.green }}>{readyCount}</motion.p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color:activeFilter==='ready'?'rgba(255,255,255,0.6)':'#4a7c59' }}>pieces available</p>
              {isOwner && (
                <p className="font-cinzel text-[8px] tracking-wider mt-1 flex items-center gap-1"
                   style={{ color:activeFilter==='ready'?'rgba(255,255,255,0.5)':'rgba(46,125,50,0.6)' }}>
                  <Camera size={9} /> Upload jewellery photos
                </p>
              )}
            </div>
          </motion.button>

          {/* Ordered Stock */}
          <motion.button whileHover={{ y:-4, scale:1.01 }} whileTap={{ scale:0.97 }}
            onClick={() => setActiveFilter(f => f==='ordered'?'all':'ordered')}
            className="relative overflow-hidden flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl text-left transition-all duration-300"
            style={{ background:activeFilter==='ordered'?C.gold:`rgba(194,24,91,0.06)`, border:`2px solid ${activeFilter==='ordered'?C.gold:C.border}` }}>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x:'-100%' }} whileHover={{ x:'100%' }} transition={{ duration:0.7 }} />
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                 style={{ background:activeFilter==='ordered'?'rgba(255,255,255,0.2)':`rgba(194,24,91,0.10)` }}>
              <ShoppingBag size={20} style={{ color:activeFilter==='ordered'?'#fff':C.gold }} />
            </div>
            <div className="relative z-10">
              <p className="font-cinzel text-[9px] tracking-[0.25em]"
                 style={{ color:activeFilter==='ordered'?'rgba(255,255,255,0.8)':C.textMid }}>ORDERED STOCK</p>
              <motion.p key={orderedCount} initial={{ scale:1.2, opacity:0 }} animate={{ scale:1, opacity:1 }}
                className="font-cormorant text-3xl font-bold leading-none mt-0.5"
                style={{ color:activeFilter==='ordered'?'#fff':C.gold }}>{orderedCount}</motion.p>
              <p className="font-raleway text-xs mt-0.5"
                 style={{ color:activeFilter==='ordered'?'rgba(255,255,255,0.6)':C.textLight }}>pieces ordered</p>
              {!isOwner && (
                <p className="font-cinzel text-[8px] tracking-wider mt-1 flex items-center gap-1"
                   style={{ color:activeFilter==='ordered'?'rgba(255,255,255,0.5)':'rgba(194,24,91,0.5)' }}>
                  <Camera size={9} /> Upload your reference photo
                </p>
              )}
            </div>
          </motion.button>
        </motion.div>

        {/* Search + Filter */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ delay:0.2 }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:searchQuery?C.gold:C.textLight }} />
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Search by name, category or tag…"
              className="w-full pl-10 pr-9 py-3 rounded-xl font-raleway text-sm outline-none"
              style={{ background:'#fff', border:`1.5px solid ${C.border}`, color:C.text }} />
            <AnimatePresence>
              {searchQuery && (
                <motion.button initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
                  onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-50 p-1 rounded-full">
                  <X size={13} style={{ color:C.gold }} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <LayoutGroup>
            <div className="flex rounded-xl overflow-hidden p-1"
                 style={{ border:`1.5px solid ${C.border}`, background:'#fff' }}>
              {(['all','ready','ordered'] as const).map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className="relative flex-1 px-3 sm:px-4 py-2 font-cinzel text-[9px] tracking-[0.2em] whitespace-nowrap outline-none"
                  style={{ color:activeFilter===f?'#fff':C.textLight }}>
                  {activeFilter===f && (
                    <motion.div layoutId="activeFilterBg" className="absolute inset-0 rounded-lg -z-10 shadow-sm"
                      style={{ background:f==='ready'?C.green:f==='ordered'?C.gold:C.goldDk }}
                      transition={{ type:'spring', stiffness:300, damping:25 }} />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1 font-semibold">
                    {f==='ready' && <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                    {f==='ordered' && <Diamond size={8} className="text-white opacity-80" />}
                    {f.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <motion.a whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            href="https://wa.me/918377911745?text=Hi!%20I%20am%20viewing%20the%20private%20catalogue."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-white text-sm px-5 py-3 rounded-xl font-raleway flex-shrink-0 shadow-md"
            style={{ background:'#25D366' }}>
            <MessageCircle size={14} /> WhatsApp
          </motion.a>
        </motion.div>

        <p className="font-raleway text-xs mb-5" style={{ color:C.textLight }}>
          Showing <strong style={{ color:C.text }}>{visibleProducts.length}</strong> of {allProducts.length} pieces
          {activeFilter!=='all' && ` · ${activeFilter==='ready'?'Ready':'Ordered'} stock only`}
          {searchQuery && ` · "${searchQuery}"`}
        </p>

        {/* Product Grid */}
        {visibleProducts.length === 0 ? (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center py-24">
            <motion.div animate={{ scale:[1,1.08,1] }} transition={{ duration:2, repeat:Infinity }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background:`rgba(194,24,91,0.08)` }}>
              <Search size={24} style={{ color:C.textLight }} />
            </motion.div>
            <p className="font-cormorant text-2xl" style={{ color:C.textLight }}>No products found</p>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="mt-4 font-raleway text-sm underline" style={{ color:C.gold }}>
              Clear filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div variants={gridVariants} initial="hidden" animate="show"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => {
                const isReady = (stockMap[product.id] ?? 'ready') === 'ready';
                return (
                  <motion.div key={product.id} layout variants={itemVariants}
                    whileHover={{ y:-7, scale:1.02 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group flex flex-col relative"
                    style={{ border:`1px solid ${C.bgDeep}` }}
                    onClick={() => setSelectedProduct(product)}>
                    {/* Glass sheen */}
                    <motion.div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x:'-150%', skewX:-20 }} whileHover={{ x:'150%' }} transition={{ duration:0.8 }} />

                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio:'1/1' }}>
                      <motion.img src={product.image} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e:any) => { e.target.src='/bridal.png'; }}
                        style={{ filter:isReady?'none':'grayscale(35%) brightness(0.9)' }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                           style={{ background:'linear-gradient(to top,rgba(136,14,79,0.3) 0%,transparent 60%)' }} />
                      <motion.div initial={{ opacity:0, y:10 }} whileHover={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
                        className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2 shadow-xl">
                          <span className="font-cinzel text-xs font-bold" style={{ color:C.gold }}>VIEW PIECE</span>
                          <ArrowRight size={12} style={{ color:C.gold }} />
                        </div>
                      </motion.div>
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`text-[10px] font-cinzel font-bold tracking-wider px-2.5 py-1 rounded-md shadow-sm ${TAG_COLORS[product.tag]??'bg-gray-100 text-gray-700'}`}>
                          {product.tag}
                        </span>
                      </div>
                      {isReady && (
                        <motion.div className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-full shadow-sm"
                          animate={{ scale:[1,1.15,1], opacity:[0.8,1,0.8] }} transition={{ duration:2.5, repeat:Infinity }}>
                          <Sparkles size={13} style={{ color:'#2E7D32' }} />
                        </motion.div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:3, repeat:Infinity }}
                          className="w-1.5 h-1.5 rounded-full" style={{ background:C.gold }} />
                        <span className="font-cinzel text-[9px] font-bold tracking-[0.2em]" style={{ color:C.gold }}>
                          {product.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-cormorant text-xl font-semibold leading-tight mb-1" style={{ color:C.text }}>
                        {product.name}
                      </h3>
                      <p className="font-raleway text-xs leading-relaxed mt-auto line-clamp-2 mb-3" style={{ color:C.textLight }}>
                        {product.description}
                      </p>

                      {/* ── PHOTO UPLOAD SECTION ── */}
                      <div onClick={e => e.stopPropagation()}>
                        <ProductPhotoSection
                          productId={product.id}
                          isOwnerUpload={isOwner}
                          isReady={isReady}
                        />
                      </div>

                      <div className="h-px w-full my-3" style={{ background:`linear-gradient(to right,transparent,${C.border},transparent)` }} />

                      {/* Enquire CTA */}
                      <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                        onClick={(e) => { e.stopPropagation(); handleEnquire(product); }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-xs font-bold transition-all"
                        style={{
                          background: isReady?'#25D366':`rgba(194,24,91,0.04)`,
                          color:      isReady?'#fff':C.gold,
                          border:     isReady?'none':`1px solid ${C.goldPale}`,
                          boxShadow:  isReady?'0 4px 15px rgba(37,211,102,0.25)':'none',
                        }}>
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

        {/* Footer */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mt-20 pb-10">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="h-px w-16 sm:w-24" style={{ background:`linear-gradient(to right,transparent,${C.goldLt})` }} />
            <motion.div animate={{ rotate:360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}>
              <Diamond size={16} style={{ color:C.gold }} />
            </motion.div>
            <span className="font-cinzel text-xs font-bold tracking-[0.35em]" style={{ color:C.textMid }}>SHEKHAR RAJA JEWELLERS</span>
            <motion.div animate={{ rotate:-360 }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}>
              <Diamond size={16} style={{ color:C.gold }} />
            </motion.div>
            <div className="h-px w-16 sm:w-24" style={{ background:`linear-gradient(to left,transparent,${C.goldLt})` }} />
          </div>
          <p className="font-raleway text-xs" style={{ color:C.textLight }}>
            This catalogue is confidential and intended for the recipient only.
          </p>
        </motion.div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </motion.div>
  );
}