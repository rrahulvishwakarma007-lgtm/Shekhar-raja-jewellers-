// ════════════════════════════════════════════════════════════════════════════
// src/components/AddProductModal.tsx
// Full-screen "Add Product to Catalogue" modal
// Owner/Client can: pick image from gallery, fill product details,
// set weight, material, karate, then choose Ready or Ordered stock.
// ════════════════════════════════════════════════════════════════════════════
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Camera, ImagePlus, Package, ShoppingBag,
  CheckCircle, ChevronDown, Scale, Gem, Star,
  MessageCircle, Upload,
} from 'lucide-react';

// ── Types (exported so PrivateCatalogue can import them) ─────────────────────
export interface NewProduct {
  id:          string;
  name:        string;
  category:    string;
  description: string;
  image:       string;       // base64 dataURL from gallery
  tag:         string;
  // extra jewellery fields
  weight:      string;       // e.g. "12.5g"
  material:    string;       // e.g. "Yellow Gold"
  karate:      string;       // e.g. "22KT"
  addedAt:     number;
}

export type StockChoice = 'ready' | 'ordered';

interface Props {
  isOpen:        boolean;
  onClose:       () => void;
  categoryLabel: string;
  categoryKey:   string;
  onAdd:         (categoryKey: string, product: NewProduct, stock: StockChoice) => void;
}

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
  bgCard:    '#FFFFFF',
  pink:      '#C2185B',
  pinkDk:    '#880E4F',
  pinkLt:    '#E91E8C',
  pinkPale:  '#F8BBD9',
  text:      '#1A0010',
  textMid:   '#6D1B4E',
  textLight: '#AD6888',
  border:    'rgba(194,24,91,0.15)',
  borderMd:  'rgba(194,24,91,0.30)',
  green:     '#2E7D32',
};

// ── Options ───────────────────────────────────────────────────────────────────
const MATERIAL_OPTIONS = [
  'Yellow Gold',
  'Rose Gold',
  'White Gold',
  'Silver',
  'Platinum',
  'Gold + Rhodium',
  'Antique Gold',
  'Jadau (Kundan)',
];

const KARATE_OPTIONS = [
  '24KT (99.9%)',
  '22KT (91.6%)',
  '18KT (75%)',
  '14KT (58.5%)',
  '10KT (41.7%)',
  '925 Silver',
  '999 Silver',
];

const TAG_OPTIONS = [
  'Bestseller', 'Premium', 'Heritage', 'Bridal Pick',
  'Exclusive', 'Trending', 'New Arrival', 'Classic',
  'Traditional', 'Festive', 'Luxury', 'Limited',
];

// ── Styled input component ────────────────────────────────────────────────────
function Field({
  label, required = false, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-cinzel text-[10px] tracking-[0.22em] mb-1.5"
             style={{ color: C.textLight }}>
        {label.toUpperCase()}{required && <span style={{ color: C.pink }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-3 rounded-xl font-raleway text-sm outline-none transition-all';
const inputStyle = {
  background: '#fff',
  border: `1.5px solid rgba(194,24,91,0.2)`,
  color: '#1A0010',
};
const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.border = `1.5px solid #C2185B`;
  e.target.style.boxShadow = '0 0 0 3px rgba(194,24,91,0.1)';
};
const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.target.style.border = `1.5px solid rgba(194,24,91,0.2)`;
  e.target.style.boxShadow = 'none';
};

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function AddProductModal({ isOpen, onClose, categoryLabel, categoryKey, onAdd }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [image,       setImage]       = useState<string>('');
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [weight,      setWeight]      = useState('');
  const [material,    setMaterial]    = useState('Yellow Gold');
  const [karate,      setKarate]      = useState('22KT (91.6%)');
  const [tag,         setTag]         = useState('New Arrival');
  const [stockChoice, setStockChoice] = useState<StockChoice>('ready');
  const [dragging,    setDragging]    = useState(false);
  const [step,        setStep]        = useState<1 | 2>(1);  // 1=details, 2=confirm
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  // Reset on close
  const handleClose = () => {
    setImage(''); setName(''); setDescription('');
    setWeight(''); setMaterial('Yellow Gold'); setKarate('22KT (91.6%)');
    setTag('New Arrival'); setStockChoice('ready');
    setDragging(false); setStep(1); setErrors({});
    onClose();
  };

  // Image from gallery
  const readFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be under 10MB' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setImage(e.target?.result as string);
      setErrors(prev => { const n = { ...prev }; delete n.image; return n; });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  // Validate step 1
  const validate = () => {
    const e: Record<string, string> = {};
    if (!image)        e.image  = 'Please choose a photo from your gallery';
    if (!name.trim())  e.name   = 'Product name is required';
    if (!weight.trim())e.weight = 'Weight is required (e.g. 12.5g)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep(2);
  };

  // Final submit
  const handleSubmit = () => {
    const product: NewProduct = {
      id:          `custom_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name:        name.trim(),
      category:    categoryLabel,
      description: description.trim() || `${material} ${karate} jewellery - ${weight}`,
      image,
      tag,
      weight:      weight.trim(),
      material,
      karate,
      addedAt:     Date.now(),
    };
    onAdd(categoryKey, product, stockChoice);
    handleClose();
  };

  // WhatsApp share
  const handleWhatsApp = () => {
    const msg = `Hi Shekhar Raja Jewellers! I want to add this to the catalogue:\n\n*${name || 'Product'}*\nMaterial: ${material} | ${karate}\nWeight: ${weight}\n${description ? `\n${description}` : ''}\n\nPlease confirm!`;
    window.open(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: 'rgba(26,0,16,0.85)', backdropFilter: 'blur(6px)' }}
        onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: C.bg,
            maxHeight: '92vh',
            boxShadow: '0 -20px 60px rgba(194,24,91,0.2), 0 0 0 1px rgba(194,24,91,0.1)',
          }}
        >
          {/* ── Top gradient bar ── */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${C.pinkDk}, ${C.pink}, ${C.pinkLt}, ${C.pink}, ${C.pinkDk})` }} />

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
               style={{ borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.3em]" style={{ color: C.textLight }}>
                {categoryLabel.toUpperCase()} COLLECTION
              </p>
              <h2 className="font-cormorant text-2xl font-semibold leading-tight" style={{ color: C.text }}>
                {step === 1 ? 'Add New Product' : 'Confirm & Add'}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: `rgba(194,24,91,0.08)`, border: `1px solid ${C.border}` }}>
              <X size={16} style={{ color: C.pink }} />
            </motion.button>
          </div>

          {/* ── Step indicator ── */}
          <div className="flex gap-2 px-5 pt-3 flex-shrink-0">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: step === s ? 1.1 : 1 }}
                  className="w-6 h-6 rounded-full flex items-center justify-center font-cinzel text-[10px] font-bold"
                  style={{
                    background: step >= s ? C.pink : 'rgba(194,24,91,0.1)',
                    color: step >= s ? '#fff' : C.textLight,
                  }}>
                  {step > s ? <CheckCircle size={12} /> : s}
                </motion.div>
                <span className="font-raleway text-xs" style={{ color: step === s ? C.pink : C.textLight }}>
                  {s === 1 ? 'Product Details' : 'Review & Stock'}
                </span>
                {s < 2 && <div className="w-8 h-px mx-1" style={{ background: step > 1 ? C.pink : C.border }} />}
              </div>
            ))}
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-5 py-4" style={{ scrollbarWidth: 'none' }}>

            {/* ════ STEP 1: Product Details ════ */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}
                  className="flex flex-col gap-5">

                  {/* Image picker */}
                  <Field label="Product Photo" required>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {!image ? (
                      <motion.div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl cursor-pointer border-2 border-dashed transition-all"
                        style={{
                          borderColor: errors.image ? '#EF4444' : dragging ? C.pink : 'rgba(194,24,91,0.25)',
                          background: dragging ? 'rgba(194,24,91,0.04)' : '#fff',
                        }}>
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: 'rgba(194,24,91,0.08)' }}>
                          <ImagePlus size={28} style={{ color: C.pink }} />
                        </motion.div>
                        <div className="text-center">
                          <p className="font-cinzel text-xs font-bold tracking-[0.15em]" style={{ color: C.pink }}>
                            CHOOSE FROM GALLERY
                          </p>
                          <p className="font-raleway text-xs mt-1" style={{ color: C.textLight }}>
                            Tap to open your phone gallery
                          </p>
                          <p className="font-raleway text-[11px] mt-0.5" style={{ color: C.textLight }}>
                            JPG, PNG, WEBP supported (max 10MB)
                          </p>
                        </div>
                        {/* Camera icon row */}
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                               style={{ background: 'rgba(194,24,91,0.08)', border: `1px solid ${C.border}` }}>
                            <Camera size={12} style={{ color: C.pink }} />
                            <span className="font-raleway text-[11px]" style={{ color: C.textMid }}>Camera</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                               style={{ background: 'rgba(194,24,91,0.08)', border: `1px solid ${C.border}` }}>
                            <Upload size={12} style={{ color: C.pink }} />
                            <span className="font-raleway text-[11px]" style={{ color: C.textMid }}>Gallery</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-2xl overflow-hidden"
                        style={{ aspectRatio: '4/3', border: `2px solid ${C.pink}` }}>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className="font-cinzel text-[9px] tracking-[0.2em] text-white/70">
                            PHOTO SELECTED
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white font-raleway text-xs"
                            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                            <Camera size={11} /> Change
                          </motion.button>
                        </div>
                        {/* Top success badge */}
                        <div className="absolute top-3 right-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center"
                               style={{ background: '#2E7D32' }}>
                            <CheckCircle size={14} className="text-white" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {errors.image && (
                      <p className="font-raleway text-xs mt-1.5" style={{ color: '#EF4444' }}>{errors.image}</p>
                    )}
                  </Field>

                  {/* Product Name */}
                  <Field label="Product Name" required>
                    <input
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(p => { const n = {...p}; delete n.name; return n; }); }}
                      placeholder="e.g. Royal Kundan Necklace Set"
                      className={inputCls}
                      style={{ ...inputStyle, border: errors.name ? '1.5px solid #EF4444' : inputStyle.border }}
                      onFocus={inputFocus} onBlur={inputBlur}
                    />
                    {errors.name && (
                      <p className="font-raleway text-xs mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>
                    )}
                  </Field>

                  {/* Weight + Karate row */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Weight" required>
                      <div className="relative">
                        <Scale size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textLight }} />
                        <input
                          value={weight}
                          onChange={e => { setWeight(e.target.value); setErrors(p => { const n = {...p}; delete n.weight; return n; }); }}
                          placeholder="e.g. 12.5g"
                          className={inputCls}
                          style={{ ...inputStyle, paddingLeft: '2rem', border: errors.weight ? '1.5px solid #EF4444' : inputStyle.border }}
                          onFocus={inputFocus} onBlur={inputBlur}
                        />
                      </div>
                      {errors.weight && (
                        <p className="font-raleway text-xs mt-1" style={{ color: '#EF4444' }}>{errors.weight}</p>
                      )}
                    </Field>

                    <Field label="Karate / Purity">
                      <div className="relative">
                        <select
                          value={karate}
                          onChange={e => setKarate(e.target.value)}
                          className={inputCls + ' appearance-none pr-8'}
                          style={inputStyle}
                          onFocus={inputFocus} onBlur={inputBlur}>
                          {KARATE_OPTIONS.map(k => <option key={k}>{k}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textLight }} />
                      </div>
                    </Field>
                  </div>

                  {/* Material */}
                  <Field label="Material Type">
                    <div className="relative">
                      <Gem size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textLight }} />
                      <select
                        value={material}
                        onChange={e => setMaterial(e.target.value)}
                        className={inputCls + ' appearance-none pr-8'}
                        style={{ ...inputStyle, paddingLeft: '2rem' }}
                        onFocus={inputFocus} onBlur={inputBlur}>
                        {MATERIAL_OPTIONS.map(m => <option key={m}>{m}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textLight }} />
                    </div>
                  </Field>

                  {/* Tag */}
                  <Field label="Product Tag">
                    <div className="flex flex-wrap gap-2">
                      {TAG_OPTIONS.map(t => (
                        <motion.button
                          key={t}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTag(t)}
                          className="px-3 py-1.5 rounded-full font-raleway text-xs transition-all"
                          style={{
                            background: tag === t ? C.pink : 'rgba(194,24,91,0.07)',
                            color:      tag === t ? '#fff'  : C.textMid,
                            border:     `1px solid ${tag === t ? C.pink : C.border}`,
                          }}>
                          {t}
                        </motion.button>
                      ))}
                    </div>
                  </Field>

                  {/* Description (optional) */}
                  <Field label="Description (Optional)">
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Short description of the piece..."
                      rows={3}
                      className={inputCls + ' resize-none'}
                      style={inputStyle}
                      onFocus={inputFocus as any} onBlur={inputBlur as any}
                    />
                  </Field>
                </motion.div>
              )}

              {/* ════ STEP 2: Confirm & Stock Choice ════ */}
              {step === 2 && (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}
                  className="flex flex-col gap-5">

                  {/* Preview card */}
                  <div className="rounded-2xl overflow-hidden"
                       style={{ border: `1.5px solid ${C.border}`, background: '#fff' }}>
                    {/* Image */}
                    <div style={{ aspectRatio: '3/2', background: '#f9f0f5' }}>
                      <img src={image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    {/* Details */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-cinzel text-[9px] tracking-[0.2em] mb-0.5" style={{ color: C.pink }}>
                            {categoryLabel.toUpperCase()}
                          </p>
                          <h3 className="font-cormorant text-xl font-semibold" style={{ color: C.text }}>{name}</h3>
                        </div>
                        <span className="font-raleway text-xs px-2.5 py-1 rounded-full flex-shrink-0"
                              style={{ background: 'rgba(194,24,91,0.1)', color: C.pink }}>{tag}</span>
                      </div>

                      {/* Specs grid */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                          { icon: <Scale size={12} />, label: 'Weight', value: weight || 'N/A' },
                          { icon: <Gem   size={12} />, label: 'Material', value: material },
                          { icon: <Star  size={12} />, label: 'Purity', value: karate.split(' ')[0] },
                        ].map(spec => (
                          <div key={spec.label} className="flex flex-col items-center gap-1 p-2 rounded-xl text-center"
                               style={{ background: 'rgba(194,24,91,0.05)', border: `1px solid ${C.border}` }}>
                            <span style={{ color: C.pink }}>{spec.icon}</span>
                            <span className="font-cinzel text-[8px] tracking-[0.1em]" style={{ color: C.textLight }}>{spec.label.toUpperCase()}</span>
                            <span className="font-raleway text-xs font-semibold" style={{ color: C.text }}>{spec.value}</span>
                          </div>
                        ))}
                      </div>

                      {description && (
                        <p className="font-raleway text-xs leading-relaxed" style={{ color: C.textLight }}>{description}</p>
                      )}
                    </div>
                  </div>

                  {/* Stock choice */}
                  <div>
                    <p className="font-cinzel text-[10px] tracking-[0.25em] mb-3" style={{ color: C.textLight }}>
                      ADD TO STOCK
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Ready Stock */}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setStockChoice('ready')}
                        className="flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all"
                        style={{
                          background: stockChoice === 'ready' ? '#2E7D32' : 'rgba(46,125,50,0.05)',
                          border:     `2px solid ${stockChoice === 'ready' ? '#2E7D32' : 'rgba(46,125,50,0.2)'}`,
                        }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: stockChoice === 'ready' ? 'rgba(255,255,255,0.2)' : 'rgba(46,125,50,0.1)' }}>
                          <Package size={20} style={{ color: stockChoice === 'ready' ? '#fff' : '#2E7D32' }} />
                        </div>
                        <div>
                          <p className="font-cinzel text-[10px] tracking-[0.15em] font-bold"
                             style={{ color: stockChoice === 'ready' ? '#fff' : '#2E7D32' }}>READY STOCK</p>
                          <p className="font-raleway text-[11px] mt-0.5"
                             style={{ color: stockChoice === 'ready' ? 'rgba(255,255,255,0.75)' : '#4a7c59' }}>
                            Available for order
                          </p>
                        </div>
                        {stockChoice === 'ready' && (
                          <CheckCircle size={16} className="absolute" style={{ color: '#fff', top: 10, right: 10, position: 'absolute' }} />
                        )}
                      </motion.button>

                      {/* Ordered Stock */}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setStockChoice('ordered')}
                        className="flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all relative"
                        style={{
                          background: stockChoice === 'ordered' ? C.pink : 'rgba(194,24,91,0.05)',
                          border:     `2px solid ${stockChoice === 'ordered' ? C.pink : C.border}`,
                        }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: stockChoice === 'ordered' ? 'rgba(255,255,255,0.2)' : 'rgba(194,24,91,0.1)' }}>
                          <ShoppingBag size={20} style={{ color: stockChoice === 'ordered' ? '#fff' : C.pink }} />
                        </div>
                        <div>
                          <p className="font-cinzel text-[10px] tracking-[0.15em] font-bold"
                             style={{ color: stockChoice === 'ordered' ? '#fff' : C.pink }}>ORDERED STOCK</p>
                          <p className="font-raleway text-[11px] mt-0.5"
                             style={{ color: stockChoice === 'ordered' ? 'rgba(255,255,255,0.75)' : C.textLight }}>
                            Already ordered/reserved
                          </p>
                        </div>
                        {stockChoice === 'ordered' && (
                          <CheckCircle size={16} style={{ color: '#fff', position: 'absolute', top: 10, right: 10 }} />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Also share on WA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-raleway text-sm font-medium text-white"
                    style={{ background: '#25D366' }}>
                    <MessageCircle size={15} />
                    Also Share on WhatsApp
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer buttons ── */}
          <div className="flex gap-3 px-5 py-4 flex-shrink-0"
               style={{ borderTop: `1px solid ${C.border}`, background: '#fff' }}>
            {step === 2 && (
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl font-raleway text-sm font-medium transition-all"
                style={{ border: `1.5px solid ${C.border}`, color: C.textMid, background: 'transparent' }}>
                Back
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(194,24,91,0.35)' }}
              whileTap={{ scale: 0.97 }}
              onClick={step === 1 ? handleNext : handleSubmit}
              className="flex-1 py-3.5 rounded-xl font-cinzel text-sm tracking-[0.15em] font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDk})`, boxShadow: '0 4px 16px rgba(194,24,91,0.25)' }}>
              {step === 1 ? (
                <>Review Product</>
              ) : (
                <>
                  <CheckCircle size={15} />
                  Add to {stockChoice === 'ready' ? 'Ready' : 'Ordered'} Stock
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
