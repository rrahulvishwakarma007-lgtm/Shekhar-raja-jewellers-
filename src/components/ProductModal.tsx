import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Award, Shield, Sparkles } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  price?: string;
  tag?: string;
}

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  if (!product) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in ${product.name} (${product.category}). Please share more details.`
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a0f05]/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: -15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, rotateX: 15, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#faf7f2] rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative perspective-1500"
        >
          {/* Gold Accent Top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6014] via-[#d4a843] to-[#8b6014]" />
          
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#b8862a]/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#b8862a]/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#b8862a]/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#b8862a]/30 rounded-br-lg" />
          
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-1/2 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 md:h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2e1e]/40 via-transparent to-transparent md:bg-gradient-to-r" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none" style={{ animationDuration: '3s' }} />
              
              {/* Tag Badge */}
              {product.tag && (
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1a0f05]/90 to-[#2a1a0a]/90 backdrop-blur-sm text-[#d4a843] font-cinzel text-xs tracking-wider px-4 py-2 rounded-full shadow-lg">
                    <Sparkles size={12} />
                    {product.tag}
                  </span>
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 md:top-6 md:right-6 bg-white/95 backdrop-blur-sm p-3 rounded-full hover:bg-white hover:rotate-90 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <X size={20} className="text-[#3a2e1e] group-hover:text-[#b8862a] transition-colors" />
              </button>
              
              {/* Floating decorative element */}
              <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-[#d4a843]/20 to-[#b8862a]/20 rounded-full blur-xl animate-float" />
            </div>
            
            {/* Content Section */}
            <div className="md:w-1/2 p-8 sm:p-10 flex flex-col bg-gradient-to-br from-[#faf7f2] to-white">
              {/* Category */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#d4a843] to-[#b8862a] animate-scale-pulse" />
                <span className="font-cinzel text-xs tracking-[0.25em] text-[#b8862a]">
                  {product.category.toUpperCase()}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="font-cormorant text-4xl sm:text-5xl font-bold text-[#3a2e1e] leading-tight">
                {product.name}
              </h3>
              
              {/* Decorative Line */}
              <div className="h-px w-24 bg-gradient-to-r from-[#b8862a] to-transparent mt-6 mb-6" />
              
              {/* Description */}
              <p className="font-raleway text-[#9a8060] leading-relaxed flex-1 text-lg">
                {product.description}
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-6 my-8 py-6 border-y border-[rgba(184,134,42,0.15)]">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-[#b8862a]/10 flex items-center justify-center group-hover:bg-[#b8862a]/20 transition-colors">
                    <Shield size={18} className="text-[#b8862a]" />
                  </div>
                  <div>
                    <span className="font-raleway text-xs text-[#9a8060] block">Certified</span>
                    <span className="font-cormorant text-sm text-[#3a2e1e] font-semibold">BIS Hallmark</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-[#b8862a]/10 flex items-center justify-center group-hover:bg-[#b8862a]/20 transition-colors">
                    <Award size={18} className="text-[#b8862a]" />
                  </div>
                  <div>
                    <span className="font-raleway text-xs text-[#9a8060] block">Guaranteed</span>
                    <span className="font-cormorant text-sm text-[#3a2e1e] font-semibold">Pure Gold</span>
                  </div>
                </div>
              </div>
              
              {/* Price if available */}
              {product.price && (
                <div className="mb-6">
                  <span className="font-raleway text-sm text-[#9a8060]">Starting from</span>
                  <p className="font-cormorant text-4xl text-gradient-gold font-bold">
                    {product.price}
                  </p>
                </div>
              )}
              
              {/* WhatsApp Button */}
              <motion.a
                href={`https://wa.me/918377911745?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#20bd5a] text-white px-8 py-5 rounded-2xl font-raleway font-medium shadow-lg hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <MessageCircle size={22} className="relative z-10" />
                <span className="relative z-10 text-lg">Enquire on WhatsApp</span>
              </motion.a>
              
              {/* Helper Text */}
              <p className="text-center font-raleway text-xs text-[#9a8060] mt-4 flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-[#b8862a]" />
                Get personalized assistance & best prices
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
