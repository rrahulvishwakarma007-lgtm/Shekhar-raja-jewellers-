// src/pages/CatalogueAdmin.tsx
// Dependency: npm install react-qr-code  (supports React 19)
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import {
  Copy, Check, Lock, Link as LinkIcon,
  Clock, Diamond, Eye, EyeOff, Download,
  QrCode, Share2, Printer, Package, ShoppingBag, RotateCcw, CheckCircle2
} from 'lucide-react';
import { loadStockMap, saveStockMap, type StockStatus } from '../lib/stockStore';
import { ALL_PRODUCTS } from './PrivateCatalogue';

const ADMIN_PASSWORD = 'srj@2025';

const C = {
  bg:       '#FFF5F7',
  gold:     '#C2185B',
  goldDk:   '#880E4F',
  goldPale: '#F8BBD9',
  text:     '#1A0010',
  textMid:  '#6D1B4E',
  textLight:'#AD6888',
  border:   'rgba(194,24,91,0.15)',
};

const CATEGORIES = [
  { key:'bangles',     label:'Bangles',      icon:'📿' },
  { key:'rings',       label:'Rings',        icon:'💍' }, // Retained for backwards compatibility on active links
  { key:'womens_ring', label:"Women's Ring", icon:'💍' },
  { key:'mens_ring',   label:"Men's Ring",   icon:'💍' },
  { key:'necklaces',   label:'Necklaces',    icon:'✨' },
  { key:'chokers',     label:'Chokers',      icon:'📿' },
  { key:'earrings',    label:'Earrings',     icon:'🌸' },
  { key:'pendants',    label:'Pendants',     icon:'💎' },
  { key:'bridal',      label:'Bridal',       icon:'👑' },
  { key:'chains',      label:'Chains',       icon:'⛓️' },
  { key:'antique',     label:'Antique',      icon:'🏛️' },
];

const DURATIONS = [
  { label:'10 minutes', value: 10 * 60 * 1000      },
  { label:'20 minutes', value: 20 * 60 * 1000      },
  { label:'30 minutes', value: 30 * 60 * 1000      },
  { label:'1 hour',     value: 60 * 60 * 1000      },
  { label:'2 hours',    value: 2  * 60 * 60 * 1000 },
  { label:'6 hours',    value: 6  * 60 * 60 * 1000 },
  { label:'24 hours',   value: 24 * 60 * 60 * 1000 },
];

function generateToken(category: string, durationMs: number) {
  return btoa(`${category}|${Date.now() + durationMs}`);
}

function buildLink(token: string) {
  return `${window.location.origin}/catalogue?token=${token}`;
}

// ── Download QR from the div wrapper ─────────────────────────────────────────
function downloadQRFromDiv(divEl: HTMLDivElement | null, filename: string) {
  if (!divEl) return;
  const svgEl = divEl.querySelector('svg');
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url     = URL.createObjectURL(svgBlob);
  const img     = new Image();
  img.onload    = () => {
    const canvas    = document.createElement('canvas');
    canvas.width    = 400; canvas.height = 400;
    const ctx       = canvas.getContext('2d')!;
    ctx.fillStyle   = '#FFFFFF';
    ctx.fillRect(0, 0, 400, 400);
    ctx.drawImage(img, 0, 0, 400, 400);
    const a         = document.createElement('a');
    a.download      = filename;
    a.href          = canvas.toDataURL('image/png');
    a.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

// ── Dynamically generates flat product list directly from PrivateCatalogue ──
const ALL_PRODUCTS_FLAT = Object.values(ALL_PRODUCTS).flat().map((p: any) => ({
  id: String(p.id),
  name: p.name,
  category: p.category
}));

export default function CatalogueAdmin() {
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [authed,        setAuthed]        = useState(false);
  const [wrongPass,     setWrongPass]     = useState(false);
  const [activeTab,     setActiveTab]     = useState<'links'|'stock'>('links');
  const [category,      setCategory]      = useState('bangles');
  const [duration,      setDuration]      = useState(DURATIONS[2].value);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink,    setCopiedLink]    = useState(false);
  const [showQR,        setShowQR]        = useState(false);
  const [history,       setHistory]       = useState<
    { link: string; cat: string; exp: string; label: string }[]
  >([]);
  const [stockMap,      setStockMap]      = useState<Record<string,StockStatus>>(() => loadStockMap());
  const [stockFilter,   setStockFilter]   = useState<'all'|'ready'|'ordered'>('all');

  // ref on the div wrapper — works with react-qr-code
  const qrWrapRef = useRef<HTMLDivElement>(null);

  // Persist stock changes
  const updateStock = (id: string, status: StockStatus) => {
    const next = { ...stockMap, [id]: status };
    setStockMap(next);
    saveStockMap(next);
  };

  const resetAllToReady = () => {
    const next: Record<string,StockStatus> = {};
    ALL_PRODUCTS_FLAT.forEach(p => { next[p.id] = 'ready'; });
    setStockMap(next);
    saveStockMap(next);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setWrongPass(false); }
    else setWrongPass(true);
  };

  const handleGenerate = () => {
    const token    = generateToken(category, duration);
    const link     = buildLink(token);
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? category;
    const durLabel = DURATIONS.find(d => d.value === duration)?.label ?? '';
    const expTime  = new Date(Date.now() + duration).toLocaleTimeString();
    setGeneratedLink(link);
    setShowQR(false);
    setHistory(prev => [{ link, cat: catLabel, exp: expTime, label: durLabel }, ...prev.slice(0, 9)]);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsApp = () => {
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? category;
    const durLabel = DURATIONS.find(d => d.value === duration)?.label ?? '';
    const msg = `✨ *Shekhar Raja Jewellers*\n\nHere is your private *${catLabel} Collection* catalogue:\n\n🔗 ${generatedLink}\n\n⏱️ *This link expires in ${durLabel}*\n\n_For personal viewing only. Do not share._`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDownloadQR = () => {
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? 'catalogue';
    downloadQRFromDiv(qrWrapRef.current, `SRJ-${catLabel}-catalogue-QR.png`);
  };

  const handlePrint = () => {
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? category;
    const durLabel = DURATIONS.find(d => d.value === duration)?.label ?? '';
    const svgEl    = qrWrapRef.current?.querySelector('svg');
    const svgData  = svgEl ? new XMLSerializer().serializeToString(svgEl) : '';
    const win      = window.open('', '_blank')!;
    win.document.write(`
      <html><head><title>SRJ Catalogue QR</title>
      <style>
        body{font-family:Georgia,serif;text-align:center;padding:40px;background:#fff;}
        .logo{font-size:28px;font-weight:bold;color:#880E4F;letter-spacing:4px;}
        .sub{font-size:12px;letter-spacing:8px;color:#AD6888;margin-top:4px;}
        svg{width:280px;height:280px;margin:30px auto;display:block;}
        .cat{font-size:22px;font-weight:bold;color:#1A0010;margin:16px 0 6px;}
        .info{font-size:13px;color:#6D1B4E;}
        .scan{font-size:14px;color:#AD6888;margin-top:20px;}
        .box{border:2px solid #F8BBD9;border-radius:20px;padding:30px;max-width:360px;margin:0 auto;}
      </style></head>
      <body>
        <div class="box">
          <div class="logo">SHEKHAR RAJA</div>
          <div class="sub">JEWELLERS</div>
          ${svgData}
          <div class="cat">${catLabel} Collection</div>
          <div class="info">Private Catalogue · Expires in ${durLabel}</div>
          <div class="scan">📱 Scan QR code to view the collection</div>
        </div>
        <script>window.onload=()=>window.print();</script>
      </body></html>
    `);
    win.document.close();
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm">
          <div className="bg-white rounded-3xl p-8 shadow-xl" style={{ border:`1px solid ${C.border}` }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                   style={{ background:`linear-gradient(135deg,${C.goldPale},#fff)`, border:`1.5px solid ${C.border}` }}>
                <Lock size={28} style={{ color: C.gold }} />
              </div>
              <h1 className="font-cormorant text-3xl font-bold" style={{ color: C.text }}> SRJ Catalogue Panel</h1>
              <p className="font-raleway text-sm mt-1" style={{ color: C.textLight }}>Catalogue Link & QR Generator</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Admin Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 rounded-xl font-raleway text-sm outline-none pr-12"
                  style={{ border:`1.5px solid ${wrongPass ? '#EF4444' : C.border}`, background:'#FFF5F7', color: C.text }}
                />
                <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: C.textLight }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {wrongPass && <p className="font-raleway text-xs text-red-500 text-center">Incorrect password.</p>}
              <button onClick={handleLogin}
                      className="w-full py-3 rounded-xl text-white font-raleway font-medium transition-all hover:-translate-y-0.5"
                      style={{ background:`linear-gradient(to right,${C.gold},${C.goldDk})` }}>
                Enter Shekhar Raja Jewellers Catalouge
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── ADMIN PANEL ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-8 pb-16 px-4" style={{ background: C.bg }}>
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Diamond size={13} style={{ color: C.gold }} />
            <span className="font-cinzel text-xs tracking-[0.25em]" style={{ color: C.gold }}>ADMIN PANEL</span>
            <Diamond size={13} style={{ color: C.gold }} />
          </div>
          <h1 className="font-cormorant text-4xl font-bold" style={{ color: C.text }}> Shekhar Raja Jewellers Special Collections</h1>
          <p className="font-raleway text-sm mt-1" style={{ color: C.textLight }}>
            Generate private links + QR codes for customers
          </p>
        </div>

        {/* ── Tab switcher ── */}
        <div className="flex gap-2 p-1 rounded-2xl mb-5 bg-white shadow-sm" style={{ border:`1px solid ${C.border}` }}>
          {[
            { key:'links', label:'Link Generator', icon:<QrCode size={15}/> },
            { key:'stock', label:'Stock Manager',  icon:<Package size={15}/> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as 'links'|'stock')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-raleway text-sm transition-all"
                    style={{
                      background: activeTab === tab.key ? C.gold : 'transparent',
                      color:      activeTab === tab.key ? '#fff' : C.textLight,
                      fontWeight: activeTab === tab.key ? 600 : 400,
                    }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════
            STOCK MANAGER TAB
        ════════════════════════════════════ */}
        {activeTab === 'stock' && (
          <div>
            {/* Summary pills */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label:'Total',   count: ALL_PRODUCTS_FLAT.length,                                               color: C.textMid  },
                { label:'Ready',   count: ALL_PRODUCTS_FLAT.filter(p=>(stockMap[p.id]??'ready')==='ready').length,  color: '#2E7D32'  },
                { label:'Ordered', count: ALL_PRODUCTS_FLAT.filter(p=>(stockMap[p.id]??'ready')==='ordered').length,color: C.gold     },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl py-3 px-4 text-center shadow-sm" style={{ border:`1px solid ${C.border}` }}>
                  <p className="font-cormorant text-3xl font-bold" style={{ color: s.color }}>{s.count}</p>
                  <p className="font-cinzel text-[10px] tracking-[0.2em] mt-0.5" style={{ color: C.textLight }}>{s.label.toUpperCase()}</p>
                </div>
              ))}
            </div>

            {/* Filter + reset */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {(['all','ready','ordered'] as const).map(f => (
                <button key={f} onClick={() => setStockFilter(f)}
                        className="px-4 py-1.5 rounded-full font-raleway text-xs transition-all"
                        style={{
                          background: stockFilter === f ? C.gold : 'rgba(194,24,91,0.06)',
                          color:      stockFilter === f ? '#fff' : C.textLight,
                          border:     `1px solid ${stockFilter === f ? C.gold : C.border}`,
                        }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <button onClick={resetAllToReady}
                      className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full font-raleway text-xs transition-all hover:opacity-80"
                      style={{ background:'rgba(194,24,91,0.06)', color: C.textMid, border:`1px solid ${C.border}` }}>
                <RotateCcw size={11}/> Reset All to Ready
              </button>
            </div>

            {/* Product rows grouped by category */}
            {CATEGORIES.map(cat => {
              const catProducts = ALL_PRODUCTS_FLAT.filter(p => {
                if (p.category.toLowerCase() !== cat.key && p.category.toLowerCase() !== cat.label.toLowerCase()) return false;
                const status = stockMap[p.id] ?? 'ready';
                if (stockFilter === 'ready')   return status === 'ready';
                if (stockFilter === 'ordered') return status === 'ordered';
                return true;
              });
              if (catProducts.length === 0) return null;
              return (
                <div key={cat.key} className="mb-4">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span>{cat.icon}</span>
                    <span className="font-cinzel text-xs tracking-[0.2em]" style={{ color: C.textLight }}>{cat.label.toUpperCase()}</span>
                  </div>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border:`1px solid ${C.border}` }}>
                    {catProducts.map((product, idx) => {
                      const status = stockMap[product.id] ?? 'ready';
                      const isReady = status === 'ready';
                      return (
                        <div key={product.id}
                             className="flex items-center justify-between px-4 py-3"
                             style={{ borderBottom: idx < catProducts.length-1 ? `1px solid ${C.border}` : 'none' }}>
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Status dot */}
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                 style={{ background: isReady ? '#4CAF50' : C.gold }} />
                            <div className="min-w-0">
                              <p className="font-raleway text-sm font-medium truncate" style={{ color: C.text }}>{product.name}</p>
                              <p className="font-cinzel text-[9px] tracking-[0.15em]" style={{ color: C.textLight }}>{product.category.toUpperCase()}</p>
                            </div>
                          </div>

                          {/* Status badge + toggle button */}
                          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            <span className="font-cinzel text-[9px] tracking-[0.1em] px-2.5 py-1 rounded-full"
                                  style={{
                                    background: isReady ? 'rgba(76,175,80,0.1)' : 'rgba(194,24,91,0.1)',
                                    color:      isReady ? '#2E7D32' : C.gold,
                                  }}>
                              {isReady ? '● READY' : '◆ ORDERED'}
                            </span>
                            <button
                              onClick={() => updateStock(product.id, isReady ? 'ordered' : 'ready')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full font-raleway text-xs transition-all hover:opacity-80"
                              style={{
                                background: isReady ? 'rgba(194,24,91,0.08)' : 'rgba(76,175,80,0.1)',
                                color:      isReady ? C.gold : '#2E7D32',
                                border:     `1px solid ${isReady ? C.border : 'rgba(76,175,80,0.3)'}`,
                              }}
                            >
                              {isReady
                                ? <><ShoppingBag size={11}/> Mark Ordered</>
                                : <><CheckCircle2 size={11}/> Mark Ready</>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="p-4 rounded-2xl mt-4" style={{ background:'rgba(194,24,91,0.04)', border:`1px solid ${C.border}` }}>
              <h3 className="font-cinzel text-xs tracking-[0.15em] mb-2" style={{ color: C.gold }}>HOW STOCK WORKS</h3>
              <ol className="font-raleway text-sm space-y-1.5" style={{ color: C.textLight }}>
                <li>1. All products start as <strong style={{color:'#2E7D32'}}>Ready Stock</strong></li>
                <li>2. When a customer orders, tap <strong style={{color:C.gold}}>Mark Ordered</strong> — it moves automatically</li>
                <li>3. Customers see live stock status on the private catalogue</li>
                <li>4. Tap <strong style={{color:'#2E7D32'}}>Mark Ready</strong> when the piece is back in stock</li>
              </ol>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════
            LINK GENERATOR TAB
        ════════════════════════════════════ */}
        {activeTab === 'links' && (<>
        <div>

        {/* Generator card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg mb-6" style={{ border:`1px solid ${C.border}` }}>

          <label className="font-cinzel text-xs tracking-[0.2em] block mb-3" style={{ color: C.textLight }}>
            SELECT CATEGORY
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
            {CATEGOR