// ════════════════════════════════════════════════════════════════════════════
// src/pages/PrivateCatalogue.tsx
// ════════════════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Clock, Lock, ArrowRight, MessageCircle, Diamond,
  AlertCircle, Package, ShoppingBag, Search, X, Sparkles, Crown,
  Camera, Upload, ImagePlus, CheckCircle2, Trash2, Eye, Plus
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

// ── Products ──────────────────────────────────────────────────────────────────
export const ALL_PRODUCTS: Record<string, any[]> = {
  bangles: [
    { id:'b1', name:'Classic Gold Bangles',   category:'Bangles',   description:'Set of 4 intricately designed 22K gold bangles.',  image:'/bangle1.png', tag:'Classic'    },
    { id:'b2', name:'Designer Bangles',        category:'Bangles',   description:'Designer gold bangles with enamel work.',           image:'/bangle2.png', tag:'Designer'   },
    { id:'b3', name:'Antique Finish Bangles',  category:'Bangles',   description:'Antique finish 22K bangles with stone work.',       image:'/bangle3.png', tag:'Heritage'   },
  ],
  rings: [
    { id:'r1', name:'Solitaire Ring',          category:'Rings',     description:'Brilliant solitaire diamond in 18K gold.',         image:'/ring1.png',      tag:'Premium'   },
    { id:'r2', name:'Polki Diamond Ring',       category:'Rings',     description:'Uncut polki diamonds set in 22K gold.',            image:'/ring2.png',      tag:'Exclusive' },
  ],
  necklaces: [
    { id:'n1', name:'Maharani Bridal Necklace',category:'Necklaces', description:'Grand bridal necklace in 22K gold.',              image:'/necklace88.png', tag:'Bridal'    },
    { id:'n2', name:'Temple Gold Haar',         category:'Necklaces', description:'Traditional temple necklace with Lakshmi coins.', image:'/temple.png',     tag:'Heritage'  },
  ]
};

export default function PrivateCatalogue() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  
  // States
  const [stockMap, setStockMap] = useState<Record<string, StockStatus>>({});
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Custom Order Form State
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    material: 'Gold',
    karat: '22K',
    weight: '',
    description: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStockMap(loadStockMap());
  }, []);

  // Sync Categories
  const categories = useMemo(() => {
    return ['all', ...Object.keys(ALL_PRODUCTS)];
  }, []);

  const flattenedProducts = useMemo(() => {
    return Object.values(ALL_PRODUCTS).flat();
  }, []);

  const filteredProducts = useMemo(() => {
    return flattenedProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [flattenedProducts, searchQuery, activeCategory]);

  // Handle Photo Upload Conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setCustomForm(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit custom/repair item entry directly to Ordered Stock
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.name || !customForm.weight) return;

    const customItemId = `custom-${Date.now()}`;
    
    // Construct new item details mapped to stock expectations
    const payload = {
      id: customItemId,
      name: customForm.name,
      category: `Custom (${customForm.material})`,
      description: `${customForm.karat} | ${customForm.weight}g — ${customForm.description || 'No additional notes'}`,
      image: customForm.image || '/placeholder-jewelry.png',
      tag: 'Custom Order'
    };

    // Commit to persistent Ordered Stock directly
    moveToOrdered(customItemId, payload);
    
    // Refresh local stock state context
    setStockMap(loadStockMap());
    setFormSuccess(true);
    
    // Reset Form
    setTimeout(() => {
      setCustomForm({ name: '', material: 'Gold', karat: '22K', weight: '', description: '', image: '' });
      setImagePreview(null);
      setFormSuccess(false);
      setShowCustomForm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: C.bg, color: C.text }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase" style={{ backgroundColor: C.goldPale, color: C.goldDk }}>
              Exclusive Access Portfolio
            </span>
          </motion.div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: C.goldDk }}>
            Private Digital Showroom
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base" style={{ color: C.textMid }}>
            Review real-time ready showroom inventory or instantly place custom design entries directly into manufacturing queues.
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: C.gold, color: C.white }}
            >
              <Plus size={18} />
              Submit Custom Order / Repair
            </button>
            <Link
              to={`/order-timeline?token=${token}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border transition-colors"
              style={{ borderColor: C.gold, color: C.gold }}
            >
              <Clock size={18} />
              View Tracked Ordered Stock
            </Link>
          </div>
        </div>

        {/* Custom Order / Repair Dynamic Submission Section */}
        <AnimatePresence>
          {showCustomForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: C.bgCard, borderColor: C.border }}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} style={{ color: C.gold }} />
                    <h3 className="text-xl font-bold" style={{ color: C.goldDk }}>New Custom Entry Log</h3>
                  </div>
                  <button onClick={() => setShowCustomForm(false)} className="p-1 rounded-full hover:bg-gray-100">
                    <X size={20} />
                  </button>
                </div>

                {formSuccess ? (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8">
                    <CheckCircle2 size={48} className="mx-auto mb-3" style={{ color: C.green }} />
                    <h4 className="text-lg font-bold" style={{ color: C.green }}>Added Successfully!</h4>
                    <p className="text-sm text-gray-600">This custom design instance has been pushed into your Ordered Stock portfolio.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Media Slot */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-colors relative" style={{ borderColor: C.border, backgroundColor: C.bg }}>
                      {imagePreview ? (
                        <div className="w-full h-48 relative rounded-lg overflow-hidden group">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setImagePreview(null)}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center cursor-pointer py-8" onClick={() => fileInputRef.current?.click()}>
                          <ImagePlus size={36} className="mx-auto mb-2" style={{ color: C.goldLt }} />
                          <span className="text-sm font-medium" style={{ color: C.textMid }}>Upload Benchmark Photo</span>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, or Camera Snap</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange} 
                      />
                    </div>

                    {/* Metadata Inputs */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{ color: C.textMid }}>Jewellery Variant Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Antique Bridal Choker / Family Ring Repair"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: C.border, focusRing: C.gold }}
                          value={customForm.name}
                          onChange={e => setCustomForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{ color: C.textMid }}>Target Base Weight (Grams) *</label>
                        <input
                          type="number"
                          step="0.001"
                          required
                          placeholder="e.g., 14.250"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: C.border }}
                          value={customForm.weight}
                          onChange={e => setCustomForm(prev => ({ ...prev, weight: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{ color: C.textMid }}>Material Class</label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                          style={{ borderColor: C.border }}
                          value={customForm.material}
                          onChange={e => setCustomForm(prev => ({ ...prev, material: e.target.value }))}
                        >
                          <option value="Gold">Fine Yellow Gold</option>
                          <option value="Rose Gold">Rose Gold Alloys</option>
                          <option value="Platinum">Platinum 950</option>
                          <option value="Silver">Sterling Silver</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase mb-1" style={{ color: C.textMid }}>Purity Tier (Karat)</label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                          style={{ borderColor: C.border }}
                          value={customForm.karat}
                          onChange={e => setCustomForm(prev => ({ ...prev, karat: e.target.value }))}
                        >
                          <option value="24K">24K (Pure bullion)</option>
                          <option value="22K">22K (Standard Indian Ornament)</option>
                          <option value="18K">18K (Diamond / Hard setting)</option>
                          <option value="14K">14K (High Durability)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase mb-1" style={{ color: C.textMid }}>Refinement Specification / Repair Notes</label>
                        <textarea
                          rows={2}
                          placeholder="Provide descriptive details regarding gemstone settings, dimensions, or resizing needs..."
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1"
                          style={{ borderColor: C.border }}
                          value={customForm.description}
                          onChange={e => setCustomForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-lg text-sm font-bold shadow transition-transform active:scale-95"
                          style={{ backgroundColor: C.gold, color: C.white }}
                        >
                          Push to Ordered Pipeline
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filtering Bars */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-6 mb-8" style={{ borderColor: C.border }}>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ready collection..."
              className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm bg-white focus:outline-none"
              style={{ borderColor: C.border }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{
                  backgroundColor: activeCategory === cat ? C.gold : 'transparent',
                  color: activeCategory === cat ? C.white : C.textMid,
                  border: activeCategory === cat ? `1px solid ${C.gold}` : `1px solid ${C.border}`
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ready Stock Vault Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => {
            const status = stockMap[product.id] || 'Available';
            return (
              <motion.div
                key={product.id}
                layoutId={`card-${product.id}`}
                className="rounded-2xl border overflow-hidden flex flex-col transition-shadow hover:shadow-md"
                style={{ backgroundColor: C.bgCard, borderColor: C.border }}
              >
                <div className="relative h-64 bg-gray-50 flex items-center justify-center p-4">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  {product.tag && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: C.goldLt }}>
                      {product.tag}
                    </span>
                  )}
                  {status === 'Ordered' && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                      <div className="bg-white/95 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border" style={{ borderColor: C.gold }}>
                        <Package size={16} style={{ color: C.gold }} />
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: C.text }}>Allocation Dispatched</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: C.text }}>{product.name}</h3>
                    <p className="text-xs mt-1 uppercase font-semibold" style={{ color: C.textLight }}>{product.category}</p>
                    <p className="text-sm mt-2 line-clamp-2 text-gray-600">{product.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(194,24,91,0.08)' }}>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:opacity-80"
                      style={{ color: C.gold }}
                    >
                      <Eye size={14} /> Spec Sheet
                    </button>

                    {status !== 'Ordered' && (
                      <button
                        onClick={() => {
                          moveToOrdered(product.id, product);
                          setStockMap(loadStockMap());
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-transform active:scale-95"
                        style={{ backgroundColor: C.gold }}
                      >
                        <ShoppingBag size={12} /> Claim Stock
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Inspection Modals */}
        <AnimatePresence>
          {selectedProduct && (
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              status={stockMap[selectedProduct.id] || 'Available'}
              onClaim={() => {
                moveToOrdered(selectedProduct.id, selectedProduct);
                setStockMap(loadStockMap());
                setSelectedProduct(null);
              }}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}