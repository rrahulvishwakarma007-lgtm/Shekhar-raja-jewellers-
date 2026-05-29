import { motion } from 'framer-motion';
import { Download, MessageCircle, Smartphone, Tag, Bell, Headphones, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Tag, title: 'Complete Catalogue', desc: 'Browse our entire collection of gold and diamond jewellery' },
  { icon: Bell, title: 'Live Gold Rates', desc: 'Get real-time gold rate updates right on your phone' },
  { icon: Headphones, title: 'WhatsApp Support', desc: 'Instant support through WhatsApp integration' },
  { icon: Tag, title: 'Exclusive Offers', desc: 'Get app-only discounts and early access to new collections' }
];

const installSteps = [
  { step: 1, title: 'Download APK', desc: 'Click the download button to get the APK file' },
  { step: 2, title: 'Enable Unknown Sources', desc: 'Go to Settings, then Security, then enable Unknown Sources' },
  { step: 3, title: 'Install the App', desc: 'Open the downloaded APK and tap Install' },
  { step: 4, title: 'Start Shopping', desc: 'Open the app and explore our collection!' }
];

const APK_URL = 'https://github.com/rrahulvishwakarma007-lgtm/srj-app/releases/download/SRJ/theshekharrajajewellersapp.apk';

export default function AppDownload() {
  return (
    <div className="pt-28 pb-16 bg-[#e8e0d0] min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1a0f05] to-[#3a2e1e] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-[#b8862a]/20 px-4 py-2 rounded-full mb-6">
                <Smartphone size={18} className="text-[#d4a843]" />
                <span className="font-raleway text-sm text-[#d4a843]">Now Available on Android</span>
              </div>
              <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                Shekhar Raja Jewellers App
              </h1>
              <p className="font-raleway text-lg text-white/70 mt-6">
                Your favourite jewellery store now in your pocket. Browse collections, check gold rates, and shop from anywhere.
              </p>
              <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start">
                <a
                  href={APK_URL}
                  download
                  className="flex items-center gap-2 bg-[#b8862a] text-white px-8 py-4 rounded-full font-raleway font-medium hover:bg-[#8b6014] transition-colors"
                >
                  <Download size={20} />
                  Download APK
                </a>
                <a
                  href={`https://wa.me/918377911745?text=${encodeURIComponent('Hello! Please share the app download link.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-raleway font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageCircle size={20} />
                  Get Link on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-72 h-[580px] bg-gradient-to-b from-[#2a1a0a] to-[#1a0f05] rounded-[3rem] border-4 border-[#3a2e1e] p-3 shadow-2xl">
                  <div className="w-full h-full bg-[#faf7f2] rounded-[2.5rem] overflow-hidden">
                    <div className="bg-[#b8862a] py-6 px-6 text-center">
                      <span className="font-cinzel text-sm tracking-[0.2em] text-white">SHEKHAR RAJA</span>
                      <p className="font-cormorant text-lg text-white/80 mt-1">Jewellers</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#b8862a]/10 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-[#b8862a] rounded mb-2" />
                            <div className="h-2 w-16 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#b8862a]/10 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 w-20 bg-[#b8862a] rounded mb-2" />
                            <div className="h-2 w-full bg-gray-200 rounded" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#b8862a]/10 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 w-28 bg-[#b8862a] rounded mb-2" />
                            <div className="h-2 w-20 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#b8862a] rounded-xl p-4">
                        <div className="h-3 w-20 bg-white/80 rounded mb-2" />
                        <div className="h-2 w-full bg-white/40 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#3a2e1e] rounded-full" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] text-center mb-12">
            App Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#e8e0d0] rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto bg-[#b8862a]/10 rounded-full flex items-center justify-center">
                  <feature.icon size={24} className="text-[#b8862a]" />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e] mt-4">
                  {feature.title}
                </h3>
                <p className="font-raleway text-sm text-[#9a8060] mt-2">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Install Guide */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] text-center mb-12">
            How to Install
          </h2>
          <div className="space-y-4">
            {installSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 bg-[#faf7f2] rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-[#b8862a] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-cinzel text-lg font-bold text-white">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e]">
                    {item.title}
                  </h3>
                  <p className="font-raleway text-sm text-[#9a8060] mt-1">
                    {item.desc}
                  </p>
                </div>
                <Check size={24} className="text-[#b8862a] ml-auto hidden sm:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1a0f05]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-white">
            Download Now
          </h2>
          <p className="font-raleway text-lg text-white/70 mt-4">
            Get the app and start exploring our beautiful collection
          </p>
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <a
              href={APK_URL}
              download
              className="flex items-center gap-2 bg-[#b8862a] text-white px-8 py-4 rounded-full font-raleway font-medium hover:bg-[#8b6014] transition-colors"
            >
              <Download size={20} />
              Download APK
            </a>
            <a
              href="https://wa.me/918377911745"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-raleway font-medium hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[#d4a843] font-raleway text-sm mt-8 hover:gap-2 transition-all"
          >
            Back to Home <ChevronRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
