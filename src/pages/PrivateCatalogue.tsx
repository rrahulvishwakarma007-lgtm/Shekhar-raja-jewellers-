import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock types - replace with your actual Auth context
type UserRole = 'OWNER' | 'CLIENT';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onUploadSuccess: (newProduct: any) => void;
}

export default function UploadModal({ isOpen, onClose, userRole, onUploadSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Necklaces'); // Default category
  const [isUploading, setIsUploading] = useState(false);

  // The stock status is strictly bound to the user's role.
  const targetStockStatus = userRole === 'OWNER' ? 'ready' : 'ordered';

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;

    setIsUploading(true);

    try {
      // 1. Upload file to your cloud storage (e.g., Cloudinary, S3)
      // const formData = new FormData();
      // formData.append('file', file);
      // const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      // const { imageUrl } = await uploadRes.json();

      // Mocking the image URL for demonstration
      const imageUrl = URL.createObjectURL(file);

      // 2. Save the product to your database with the enforced stock status
      const newProduct = {
        name,
        category,
        image: imageUrl,
        status: targetStockStatus, // 'ready' for owners, 'ordered' for clients
        uploadedBy: userRole,
        createdAt: new Date().toISOString(),
      };

      // await fetch('/api/products', { method: 'POST', body: JSON.stringify(newProduct) });

      onUploadSuccess(newProduct);
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-5 border-b border-rose-100 flex justify-between items-center bg-rose-50/50">
            <div>
              <h3 className="font-cormorant text-2xl font-bold text-rose-900">
                {userRole === 'OWNER' ? 'Add to Ready Stock' : 'Upload Ordered Jewellery'}
              </h3>
              <p className="font-raleway text-xs text-rose-700 mt-1">
                This item will automatically be marked as <strong className="uppercase">{targetStockStatus}</strong>.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-rose-100 rounded-full transition-colors">
              <X size={20} className="text-rose-900" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleUpload} className="p-6 space-y-5">
            <div>
              <label className="block font-cinzel text-xs font-bold text-gray-700 mb-2 tracking-wider">
                Jewellery Photo
              </label>
              <div className="border-2 border-dashed border-rose-200 rounded-xl p-6 flex flex-col items-center justify-center bg-rose-50/30 hover:bg-rose-50/80 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                {file ? (
                  <p className="text-sm font-raleway text-green-700 font-medium">✓ {file.name}</p>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-rose-300 mb-2" />
                    <p className="text-sm font-raleway text-gray-500">Click or drag image to upload</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-gray-700 mb-2 tracking-wider">
                Item Name
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kundan Bridal Choker"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-raleway"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isUploading}
              className="w-full py-3.5 bg-[#C2185B] text-white rounded-xl font-raleway font-bold shadow-lg shadow-rose-900/20 hover:bg-[#880E4F] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {isUploading ? 'Uploading...' : 'Upload Jewellery'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}