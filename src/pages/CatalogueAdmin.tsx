// ════════════════════════════════════════════════════════════════════════════
// src/pages/CatalogueAdmin.tsx
// Private catalogue link + QR code generator — password protected
// Access at: yoursite.com/srj-admin-catalogue
// Install: npm install qrcode.react
// ════════════════════════════════════════════════════════════════════════════
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Copy, Check, Lock, Link as LinkIcon,
  Clock, Diamond, Eye, EyeOff, Download,
  QrCode, Share2, Printer
} from 'lucide-react';

const ADMIN_PASSWORD = 'srj@2025'; // ← change this

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
  { key:'bangles',   label:'Bangles',   icon:'📿' },
  { key:'rings',     label:'Rings',     icon:'💍' },
  { key:'necklaces', label:'Necklaces', icon:'✨' },
  { key:'earrings',  label:'Earrings',  icon:'🌸' },
  { key:'bridal',    label:'Bridal',    icon:'👑' },
  { key:'chains',    label:'Chains',    icon:'⛓️' },
  { key:'antique',   label:'Antique',   icon:'🏛️' },
];

const DURATIONS = [
  { label:'10 minutes', value: 10 * 60 * 1000       },
  { label:'20 minutes', value: 20 * 60 * 1000       },
  { label:'30 minutes', value: 30 * 60 * 1000       },
  { label:'1 hour',     value: 60 * 60 * 1000       },
  { label:'2 hours',    value: 2  * 60 * 60 * 1000  },
  { label:'6 hours',    value: 6  * 60 * 60 * 1000  },
  { label:'24 hours',   value: 24 * 60 * 60 * 1000  },
];

function generateToken(category: string, durationMs: number) {
  const expiry  = Date.now() + durationMs;
  return btoa(`${category}|${expiry}`);
}

function buildLink(token: string) {
  return `${window.location.origin}/catalogue?token=${token}`;
}

// ── QR download as PNG ────────────────────────────────────────────────────────
function downloadQR(svgEl: SVGSVGElement | null, filename: string) {
  if (!svgEl) return;
  const svgData   = new XMLSerializer().serializeToString(svgEl);
  const svgBlob   = new Blob([svgData], { type:'image/svg+xml;charset=utf-8' });
  const url       = URL.createObjectURL(svgBlob);
  const img       = new Image();
  img.onload      = () => {
    const canvas  = document.createElement('canvas');
    canvas.width  = 400; canvas.height = 400;
    const ctx     = canvas.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 400, 400);
    ctx.drawImage(img, 0, 0, 400, 400);
    const a       = document.createElement('a');
    a.download    = filename;
    a.href        = canvas.toDataURL('image/png');
    a.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

export default function CatalogueAdmin() {
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [authed,        setAuthed]        = useState(false);
  const [wrongPass,     setWrongPass]     = useState(false);
  const [category,      setCategory]      = useState('bangles');
  const [duration,      setDuration]      = useState(DURATIONS[2].value);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink,    setCopiedLink]    = useState(false);
  const [showQR,        setShowQR]        = useState(false);
  const [history,       setHistory]       = useState<
    { link:string; cat:string; exp:string; label:string }[]
  >([]);

  const qrRef = useRef<SVGSVGElement>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setWrongPass(false); }
    else { setWrongPass(true); }
  };

  const handleGenerate = () => {
    const token    = generateToken(category, duration);
    const link     = buildLink(token);
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? category;
    const durLabel = DURATIONS.find(d => d.value === duration)?.label ?? '';
    const expTime  = new Date(Date.now() + duration).toLocaleTimeString();
    setGeneratedLink(link);
    setShowQR(false);
    setHistory(prev => [
      { link, cat: catLabel, exp: expTime, label: durLabel },
      ...prev.slice(0, 9),
    ]);
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
    downloadQR(qrRef.current, `SRJ-${catLabel}-catalogue-QR.png`);
  };

  const handlePrint = () => {
    const catLabel = CATEGORIES.find(c => c.key === category)?.label ?? category;
    const durLabel = DURATIONS.find(d => d.value === duration)?.label ?? '';
    const win = window.open('', '_blank')!;
    const svgData = qrRef.current ? new XMLSerializer().serializeToString(qrRef.current) : '';
    win.document.write(`
      <html><head><title>SRJ Catalogue QR</title>
      <style>
        body { font-family: Georgia, serif; text-align: center; padding: 40px; background: #fff; }
        .logo { font-size: 28px; font-weight: bold; color: #880E4F; letter-spacing: 4px; }
        .sub  { font-size: 12px; letter-spacing: 8px; color: #AD6888; margin-top: 4px; }
        .qr   { margin: 30px auto; display: block; }
        svg   { width: 280px; height: 280px; }
        .cat  { font-size: 22px; font-weight: bold; color: #1A0010; margin: 16px 0 6px; }
        .info { font-size: 13px; color: #6D1B4E; }
        .scan { font-size: 14px; color: #AD6888; margin-top: 20px; }
        .border-box { border: 2px solid #F8BBD9; border-radius: 20px; padding: 30px; max-width: 360px; margin: 0 auto; }
      </style></head>
      <body>
        <div class="border-box">
          <div class="logo">SHEKHAR RAJA</div>
          <div class="sub">JEWELLERS</div>
          <div class="qr">${svgData}</div>
          <div class="cat">${catLabel} Collection</div>
          <div class="info">Private Catalogue · Expires in ${durLabel}</div>
          <div class="scan">📱 Scan QR code to view the collection</div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `);
    win.document.close();
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                    className="w-full max-w-sm">
          <div className="bg-white rounded-3xl p-8 shadow-xl" style={{ border:`1px solid ${C.border}` }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                   style={{ background:`linear-gradient(135deg, ${C.goldPale}, #fff)`, border:`1.5px solid ${C.border}` }}>
                <Lock size={28} style={{ color: C.gold }} />
              </div>
              <h1 className="font-cormorant text-3xl font-bold" style={{ color: C.text }}>Admin Panel</h1>
              <p className="font-raleway text-sm mt-1" style={{ color: C.textLight }}>
                Catalogue Link & QR Generator
              </p>
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
                <button onClick={() => setShowPass(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: C.textLight }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {wrongPass && (
                <p className="font-raleway text-xs text-red-500 text-center">Incorrect password.</p>
              )}
              <button onClick={handleLogin}
                      className="w-full py-3 rounded-xl text-white font-raleway font-medium transition-all hover:-translate-y-0.5"
                      style={{ background:`linear-gradient(to right, ${C.gold}, ${C.goldDk})` }}>
                Enter Admin Panel
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Diamond size={13} style={{ color: C.gold }} />
            <span className="font-cinzel text-xs tracking-[0.25em]" style={{ color: C.gold }}>ADMIN PANEL</span>
            <Diamond size={13} style={{ color: C.gold }} />
          </div>
          <h1 className="font-cormorant text-4xl font-bold" style={{ color: C.text }}>
            Catalogue Generator
          </h1>
          <p className="font-raleway text-sm mt-1" style={{ color: C.textLight }}>
            Generate private links + QR codes for customers
          </p>
        </div>

        {/* ── Generator card ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg mb-6" style={{ border:`1px solid ${C.border}` }}>

          {/* Category */}
          <label className="font-cinzel text-xs tracking-[0.2em] block mb-3" style={{ color: C.textLight }}>
            SELECT CATEGORY
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setCategory(cat.key)}
                      className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl transition-all"
                      style={{
                        border:`1.5px solid ${category === cat.key ? C.gold : C.border}`,
                        background: category === cat.key ? `rgba(194,24,91,0.07)` : '#FFF5F7',
                      }}>
                <span className="text-lg">{cat.icon}</span>
                <span className="font-cinzel text-[9px] tracking-wide leading-tight text-center"
                      style={{ color: category === cat.key ? C.gold : C.textLight }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          {/* Duration */}
          <label className="font-cinzel text-xs tracking-[0.2em] block mb-3" style={{ color: C.textLight }}>
            LINK EXPIRY
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
            {DURATIONS.map(d => (
              <button key={d.value} onClick={() => setDuration(d.value)}
                      className="py-2 px-3 rounded-xl text-sm font-raleway transition-all"
                      style={{
                        border:`1.5px solid ${duration === d.value ? C.gold : C.border}`,
                        background: duration === d.value ? C.gold : '#FFF5F7',
                        color: duration === d.value ? '#fff' : C.textMid,
                      }}>
                {d.label}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <button onClick={handleGenerate}
                  className="w-full py-4 rounded-2xl text-white font-cormorant text-xl font-semibold flex items-center justify-center gap-3 shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
                  style={{ background:`linear-gradient(135deg, ${C.gold}, ${C.goldDk})` }}>
            <LinkIcon size={20} />
            Generate Link &amp; QR Code
          </button>
        </div>

        {/* ── Generated result ── */}
        <AnimatePresence>
          {generatedLink && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-lg mb-6"
                        style={{ border:`1.5px solid ${C.gold}` }}>

              {/* Top bar */}
              <div className="px-6 py-3 flex items-center gap-2"
                   style={{ background:`rgba(194,24,91,0.06)`, borderBottom:`1px solid ${C.border}` }}>
                <Clock size={14} style={{ color: C.gold }} />
                <span className="font-cinzel text-xs tracking-[0.12em]" style={{ color: C.gold }}>
                  {CATEGORIES.find(c=>c.key===category)?.label?.toUpperCase()} ·{' '}
                  {DURATIONS.find(d=>d.value===duration)?.label?.toUpperCase()}
                </span>
              </div>

              <div className="p-6">
                {/* Tabs — Link vs QR */}
                <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background:'#FFF5F7' }}>
                  <button
                    onClick={() => setShowQR(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-raleway text-sm transition-all"
                    style={{
                      background: !showQR ? '#fff' : 'transparent',
                      color: !showQR ? C.gold : C.textLight,
                      boxShadow: !showQR ? '0 1px 8px rgba(194,24,91,0.12)' : 'none',
                      fontWeight: !showQR ? 600 : 400,
                    }}>
                    <LinkIcon size={15} /> Link
                  </button>
                  <button
                    onClick={() => setShowQR(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-raleway text-sm transition-all"
                    style={{
                      background: showQR ? '#fff' : 'transparent',
                      color: showQR ? C.gold : C.textLight,
                      boxShadow: showQR ? '0 1px 8px rgba(194,24,91,0.12)' : 'none',
                      fontWeight: showQR ? 600 : 400,
                    }}>
                    <QrCode size={15} /> QR Code
                  </button>
                </div>

                {/* ── LINK TAB ── */}
                {!showQR && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                    <div className="rounded-xl p-3 mb-4 font-mono text-xs break-all"
                         style={{ background:'#FFF5F7', border:`1px solid ${C.border}`, color: C.textMid }}>
                      {generatedLink}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleCopyLink}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-sm transition-all"
                              style={{ border:`1.5px solid ${C.border}`, color: C.gold, background: copiedLink ? `rgba(194,24,91,0.06)` : '#FFF5F7' }}>
                        {copiedLink ? <><Check size={15} />Copied!</> : <><Copy size={15} />Copy Link</>}
                      </button>
                      <button onClick={handleWhatsApp}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-raleway text-sm text-white"
                              style={{ background:'#25D366' }}>
                        <Share2 size={15} /> Send on WhatsApp
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── QR TAB ── */}
                {showQR && (
                  <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                              className="flex flex-col items-center">

                    {/* QR code with branded border */}
                    <div className="relative p-5 rounded-3xl mb-5"
                         style={{ background:'#fff', border:`2px solid ${C.goldPale}`, boxShadow:`0 4px 30px rgba(194,24,91,0.1)` }}>
                      {/* Corner decorations */}
                      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl-md" style={{ borderColor: C.gold }} />
                      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr-md" style={{ borderColor: C.gold }} />
                      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl-md" style={{ borderColor: C.gold }} />
                      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br-md" style={{ borderColor: C.gold }} />

                      <QRCodeSVG
                        ref={qrRef}
                        value={generatedLink}
                        size={220}
                        bgColor="#ffffff"
                        fgColor="#1A0010"
                        level="H"
                        imageSettings={{
                          src: '/logo.png',
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                      />
                    </div>

                    {/* Label under QR */}
                    <div className="text-center mb-5">
                      <p className="font-cormorant text-lg font-semibold" style={{ color: C.text }}>
                        {CATEGORIES.find(c=>c.key===category)?.label} Collection
                      </p>
                      <p className="font-raleway text-xs mt-1" style={{ color: C.textLight }}>
                        Scan to view · Expires in {DURATIONS.find(d=>d.value===duration)?.label}
                      </p>
                    </div>

                    {/* QR action buttons */}
                    <div className="w-full grid grid-cols-3 gap-3">
                      <button onClick={handleDownloadQR}
                              className="flex flex-col items-center gap-1.5 py-3 rounded-xl font-raleway text-xs transition-all hover:-translate-y-0.5"
                              style={{ border:`1.5px solid ${C.border}`, color: C.gold, background:'#FFF5F7' }}>
                        <Download size={18} />
                        Download
                      </button>
                      <button onClick={handleWhatsApp}
                              className="flex flex-col items-center gap-1.5 py-3 rounded-xl font-raleway text-xs text-white transition-all hover:-translate-y-0.5"
                              style={{ background:'#25D366' }}>
                        <Share2 size={18} />
                        WhatsApp
                      </button>
                      <button onClick={handlePrint}
                              className="flex flex-col items-center gap-1.5 py-3 rounded-xl font-raleway text-xs transition-all hover:-translate-y-0.5"
                              style={{ border:`1.5px solid ${C.border}`, color: C.textMid, background:'#FFF5F7' }}>
                        <Printer size={18} />
                        Print
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── History ── */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-6" style={{ border:`1px solid ${C.border}` }}>
            <h3 className="font-cinzel text-xs tracking-[0.2em] mb-4" style={{ color: C.textLight }}>
              RECENT LINKS (THIS SESSION)
            </h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                     style={{ background:'#FFF5F7', border:`1px solid ${C.border}` }}>
                  <div className="min-w-0 flex-1">
                    <span className="font-cinzel text-xs font-bold" style={{ color: C.text }}>{h.cat}</span>
                    <span className="font-raleway text-xs ml-2" style={{ color: C.textLight }}>
                      · {h.label} · exp {h.exp}
                    </span>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(h.link)}
                          className="ml-2 p-1.5 rounded-lg hover:bg-pink-50 flex-shrink-0">
                    <Copy size={13} style={{ color: C.textLight }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── How to use ── */}
        <div className="p-6 rounded-2xl" style={{ background:'rgba(194,24,91,0.04)', border:`1px solid ${C.border}` }}>
          <h3 className="font-cinzel text-xs tracking-[0.15em] mb-3" style={{ color: C.gold }}>HOW TO USE</h3>
          <ol className="font-raleway text-sm space-y-2" style={{ color: C.textLight }}>
            <li>1. Pick category + expiry time → click Generate</li>
            <li>2. <strong style={{ color: C.textMid }}>Link tab</strong> → copy link or send directly via WhatsApp</li>
            <li>3. <strong style={{ color: C.textMid }}>QR tab</strong> → download QR image, send on WhatsApp, or print it</li>
            <li>4. Customer scans QR or opens link → sees only that collection</li>
            <li>5. After expiry → link &amp; QR both stop working automatically</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
