import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Award, Shield } from 'lucide-react';

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a0f05]/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#faf7f2] rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
        >
          {/* Gold Accent Top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6014] via-[#d4a843] to-[#8b6014]" />
          
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-72 md:h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2e1e]/30 to-transparent md:bg-gradient-to-r" />
              
              {/* Tag Badge */}
              {product.tag && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[#1a0f05]/90 backdrop-blur-sm text-[#d4a843] font-cinzel text-[10px] tracking-[0.15em] px-4 py-2 rounded-full">
                    {product.tag}
                  </span>
                </div>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-4 md:right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-full hover:bg-white hover:rotate-90 transition-all duration-300 shadow-lg"
              >
                <X size={20} className="text-[#3a2e1e]" />
              </button>
            </div>
            
            {/* Content Section */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col">
              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#b8862a]" />
                <span className="font-cinzel text-xs tracking-[0.25em] text-[#b8862a]">
                  {product.category.toUpperCase()}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="font-cormorant text-3xl sm:text-4xl font-bold text-[#3a2e1e]">
                {product.name}
              </h3>
              
              {/* Decorative Line */}
              <div className="h-px w-16 bg-gradient-to-r from-[#b8862a] to-transparent mt-4 mb-4" />
              
              {/* Description */}
              <p className="font-raleway text-[#9a8060] leading-relaxed flex-1">
                {product.description}
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-4 my-6 py-4 border-y border-[rgba(184,134,42,0.15)]">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-[#b8862a]" />
                  <span className="font-raleway text-xs text-[#9a8060]">BIS Hallmark</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-[#b8862a]" />
                  <span className="font-raleway text-xs text-[#9a8060]">Certified Purity</span>
                </div>
              </div>
              
              {/* Price if available */}
              {product.price && (
                <div className="mb-4">
                  <span className="font-raleway text-sm text-[#9a8060]">Starting from</span>
                  <p className="font-cormorant text-3xl text-[#b8862a] font-bold">
                    {product.price}
                  </p>
                </div>
              )}
              
              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/918377911745?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#20bd5a] text-white px-6 py-4 rounded-xl font-raleway font-medium shadow-lg hover:shadow-xl hover:shadow-[#25D366]/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle size={20} />
                <span>Enquire on WhatsApp</span>
              </a>
              
              {/* Helper Text */}
              <p className="text-center font-raleway text-xs text-[#9a8060] mt-4">
                Get personalized assistance & best prices
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
