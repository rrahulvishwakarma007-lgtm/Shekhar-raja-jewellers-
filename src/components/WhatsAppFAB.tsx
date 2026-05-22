import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFAB() {
  return (
    <motion.a
      href="https://wa.me/918377911745"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300 animate-scale-pulse" />
      
      {/* Pulsing rings */}
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366]/30 animate-scale-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute inset-0 rounded-full border-2 border-[#25D366]/20 animate-scale-pulse" style={{ animationDelay: '0.5s' }} />
      
      {/* Main button */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#20bd5a] rounded-full flex items-center justify-center shadow-2xl pulse-glow group-hover:shadow-[#25D366]/50 transition-shadow duration-300">
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
        
        {/* Icon */}
        <MessageCircle size={28} className="text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#b8862a] rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
          <span className="text-[8px] text-white font-bold">1</span>
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-[#1a0f05] text-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap font-raleway text-sm">
          Chat with us
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-[#1a0f05] rotate-45" />
        </div>
      </div>
    </motion.a>
  );
}
