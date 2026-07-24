// ════════════════════════════════════════════════════════════════════════════
// src/components/AddProductModal.tsx
//
// Lets a user add a new product to the catalogue and choose whether it goes
// into Ready Stock or Ordered Stock. Fully in-memory — nothing is persisted
// to a backend, so added products reset on page refresh. Swap the
// `onAdd` handler out later for a Firebase/API write when you're ready.
// ════════════════════════════════════════════════════════════════════════════
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Clock, Upload, ImageOff } from 'lucide-react';

// Matches the palette already used in PrivateCatalogue.tsx
const C = {
  bg:        '#FFF5F7',
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
};

export type NewProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  tag: string;
};

export type StockChoice = 'ready' | 'ordered';

export type CategoryOption = { key: string; label: string };

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  // categoryKey is the ALL_PRODUCTS key (e.g. "bangles"), product is the new
  // entry to push into that array, stock is which bucket it should land in.
  onAdd: (categoryKey: string, product: NewProduct, stock: StockChoice) => void;
}

export default function AddProductModal({ isOpen, onClose, categories, onAdd }: AddProductModalProps) {
  const [categoryKey, setCategoryKey] = useState(categories[0]?.key ?? '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(''); // holds a data: URL once a file is picked
  const [imageError, setImageError] = useState('');
  const [tag, setTag] = useState('');
  const [stock, setStock] = useState<StockChoice>('ready');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setName('');
    setDescription('');
    setImage('');
    setImageError('');
    setTag('');
    setStock('ready');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }
    // 5MB guard — large data URLs bloat in-memory state fast
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image is too large — please pick one under 5MB.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.onerror = () => setImageError('Could not read that image — try another file.');
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryKey) {
      setError('Name and category are required.');
      return;
    }
    if (!image) {
      setError('Please add a photo of the product.');
      return;
    }
    const categoryLabel = categories.find(c => c.key === categoryKey)?.label ?? categoryKey;
    const product: NewProduct = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category: categoryLabel,
      description: description.trim() || 'New addition to the collection.',
      image,
      tag: tag.trim() || 'New Arrival',
    };
    onAdd(categoryKey, product, stock);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,0,16,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}
        >
          <motion.form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            style={{
              background: C.bgCard, borderRadius: 20, width: '100%', maxWidth: 440,
              maxHeight: '90vh', overflowY: 'auto', padding: 28,
              border: `1px solid ${C.border}`, boxShadow: '0 24px 64px rgba(136,14,79,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: C.text, fontWeight: 700 }}>Add Product</h2>
              <button type="button" onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textLight }}>
                <X size={20} />
              </button>
            </div>

            <Field label="Category">
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                style={inputStyle}
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Product Name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kundan Bridal Set" style={inputStyle} />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description shown on the product card"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </Field>

            <Field label="Product Photo">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                style={{ display: 'none' }}
              />
              {image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'relative', borderRadius: 12, overflow: 'hidden',
                    border: `1.5px solid ${C.border}`, cursor: 'pointer', aspectRatio: '4/3',
                  }}
                >
                  <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div
                    style={{
                      position: 'absolute', inset: 0, background: 'rgba(26,0,16,0.4)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12.5, fontWeight: 600, opacity: 0, transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    Tap to change photo
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImage(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    style={{
                      position: 'absolute', top: 8, right: 8, background: 'rgba(26,0,16,0.55)',
                      border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%', aspectRatio: '4/3', borderRadius: 12, cursor: 'pointer',
                    border: `1.5px dashed ${C.border}`, background: C.bg,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                    color: C.textLight,
                  }}
                >
                  <Upload size={20} style={{ color: C.gold }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textMid }}>Tap to upload a photo</span>
                  <span style={{ fontSize: 11 }}>JPG or PNG, up to 5MB</span>
                </button>
              )}
              {imageError && <p style={{ color: '#C62828', fontSize: 12.5, margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}><ImageOff size={13} /> {imageError}</p>}
            </Field>

            <Field label="Tag (badge shown on card)">
              <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. New Arrival, Bridal Pick" style={inputStyle} />
            </Field>

            <Field label="Add to">
              <div style={{ display: 'flex', gap: 10 }}>
                <StockToggle
                  active={stock === 'ready'}
                  onClick={() => setStock('ready')}
                  icon={<Package size={16} />}
                  label="Ready Stock"
                />
                <StockToggle
                  active={stock === 'ordered'}
                  onClick={() => setStock('ordered')}
                  icon={<Clock size={16} />}
                  label="Ordered Stock"
                />
              </div>
            </Field>

            {error && <p style={{ color: '#C62828', fontSize: 13, margin: '4px 0 12px' }}>{error}</p>}

            <button
              type="submit"
              style={{
                width: '100%', marginTop: 8, padding: '13px 0', borderRadius: 12,
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15,
                color: '#fff', background: `linear-gradient(135deg, ${C.gold}, ${C.goldDk})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Plus size={18} /> Add Product
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function StockToggle({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
        border: `1.5px solid ${active ? C.gold : C.border}`,
        background: active ? C.goldPale : '#fff',
        color: active ? C.goldDk : C.textLight,
        transition: 'all 0.15s',
      }}
    >
      {icon} {label}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  border: `1.5px solid ${C.border}`, fontSize: 14, color: C.text,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

/*
  Already wired into src/pages/PrivateCatalogue.tsx:
  - "Add Product" button in the search/filter row opens this modal
  - categories is passed as a single-item array: the category the private
    catalogue link is currently showing (each link is scoped to one category)
  - onAdd pushes the new product into in-memory state and, if "Ordered Stock"
    was chosen, calls moveToOrdered() from ../lib/stockStore
  - Added products are in-memory only and reset on page refresh
*/
