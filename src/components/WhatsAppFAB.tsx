import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFAB() {
  return (
    <motion.a
      href="https://wa.me/918377911745"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl pulse-glow hover:bg-[#20bd5a] transition-colors"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
