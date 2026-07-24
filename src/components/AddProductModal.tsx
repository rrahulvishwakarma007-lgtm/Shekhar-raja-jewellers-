// ════════════════════════════════════════════════════════════════════════════
// src/components/AddProductModal.tsx
//
// Lets a user add a new product to the catalogue and choose whether it goes
// into Ready Stock or Ordered Stock. Fully in-memory — nothing is persisted
// to a backend, so added products reset on page refresh. Swap the
// `onAdd` handler out later for a Firebase/API write when you're ready.
// ════════════════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Clock } from 'lucide-react';

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
  const [image, setImage] = useState('');
  const [tag, setTag] = useState('');
  const [stock, setStock] = useState<StockChoice>('ready');
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
    setImage('');
    setTag('');
    setStock('ready');
    setError('');
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
    const categoryLabel = categories.find(c => c.key === categoryKey)?.label ?? categoryKey;
    const product: NewProduct = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category: categoryLabel,
      description: description.trim() || 'New addition to the collection.',
      image: image.trim() || '/placeholder.png',
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

            <Field label="Image path or URL">
              <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/necklace-new.jpg" style={inputStyle} />
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
  ── Integration into PrivateCatalogue.tsx ──────────────────────────────────

  1. Import it:
     import AddProductModal, { CategoryOption, NewProduct, StockChoice } from '../components/AddProductModal';

  2. Turn ALL_PRODUCTS into state instead of reading the constant directly:
     const [products, setProducts] = useState(ALL_PRODUCTS);
     const [addModalOpen, setAddModalOpen] = useState(false);

     Then replace any place currently reading `ALL_PRODUCTS` in render/logic
     with `products`.

  3. Build the category list once from the same keys already used:
     const categoryOptions: CategoryOption[] = [
       { key: 'bangles',     label: 'Bangles' },
       { key: 'rings',       label: 'Rings' },
       { key: 'womens_ring', label: "Women's Ring" },
       { key: 'mens_ring',   label: "Men's Ring" },
       { key: 'necklaces',   label: 'Necklaces' },
     ];

  4. Handle the add, updating both the product list and stock status:
     const handleAddProduct = (categoryKey: string, product: NewProduct, stock: StockChoice) => {
       setProducts(prev => ({
         ...prev,
         [categoryKey]: [...(prev[categoryKey] ?? []), product],
       }));
       if (stock === 'ordered') {
         moveToOrdered(product.id); // from your existing stockStore import
       }
       // If your stockStore needs an explicit "mark as ready" call for new
       // ids (rather than defaulting untouched ids to ready), add that call
       // in the else branch here — check stockStore.ts for the right function name.
     };

  5. Add a trigger button (e.g. near the page header) and render the modal:
     <button onClick={() => setAddModalOpen(true)}>+ Add Product</button>

     <AddProductModal
       isOpen={addModalOpen}
       onClose={() => setAddModalOpen(false)}
       categories={categoryOptions}
       onAdd={handleAddProduct}
     />

  Note: step 4's "ready stock" path assumes loadStockMap() treats any id not
  yet marked "ordered" as ready by default. If your stockStore.ts works
  differently, share that file and I'll adjust the wiring to match exactly.
*/
