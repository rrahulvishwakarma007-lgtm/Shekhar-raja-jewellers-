import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, MapPin, Clock, Send } from 'lucide-react';

const interests = [
  'Bridal Jewellery',
  'Gold Jewellery',
  'Diamond Jewellery',
  'Custom Order',
  'General Enquiry'
];

const showrooms = [
  {
    name: 'Main Showroom',
    address: 'Dixitpura Rd, Sarafa, Uprainganj, Jabalpur, Madhya Pradesh 482002',
    phone: '+91 83779 11745',
    hours: '12:00 PM - 09:00 PM',
    map: 'https://maps.app.goo.gl/fHfnK9jgUnYkmSKB7?g_st=a'
  },
  {
    name: 'Heritage Showroom',
    address: '1, Napier Town, Jabalpur, Madhya Pradesh 482001',
    phone: '+91 83779 11745',
    hours: '12:00 PM - 09:00 PM',
    map: 'https://maps.app.goo.gl/cYjTfiHyzXzPitd5A?g_st=a'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello! I'm ${formData.name}.

Interest: ${formData.interest}
Phone: ${formData.phone}

Message: ${formData.message}`;
    
    window.open(
      `https://wa.me/918377911745?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="pt-28 pb-16 bg-[#e8e0d0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-cormorant text-4xl sm:text-5xl font-bold text-[#3a2e1e]">
            Contact Us
          </h1>
          <p className="font-raleway text-[#9a8060] mt-4">
            We'd love to hear from you. Reach out to us anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#faf7f2] rounded-2xl p-6 sm:p-8"
          >
            <h2 className="font-cormorant text-2xl font-semibold text-[#3a2e1e] mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="font-raleway text-sm text-[#3a2e1e] block mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(184,134,42,0.3)] rounded-lg font-raleway bg-white focus:outline-none focus:border-[#b8862a]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="font-raleway text-sm text-[#3a2e1e] block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(184,134,42,0.3)] rounded-lg font-raleway bg-white focus:outline-none focus:border-[#b8862a]"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="font-raleway text-sm text-[#3a2e1e] block mb-2">
                  Interest
                </label>
                <select
                  required
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(184,134,42,0.3)] rounded-lg font-raleway bg-white focus:outline-none focus:border-[#b8862a]"
                >
                  <option value="">Select your interest</option>
                  {interests.map((interest) => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-raleway text-sm text-[#3a2e1e] block mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-[rgba(184,134,42,0.3)] rounded-lg font-raleway bg-white focus:outline-none focus:border-[#b8862a] resize-none"
                  placeholder="Tell us what you're looking for..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-full font-raleway font-medium hover:bg-[#20bd5a] transition-colors"
              >
                <Send size={18} />
                Send via WhatsApp
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* WhatsApp CTA */}
            <div className="bg-[#25D366] rounded-2xl p-6 text-center">
              <MessageCircle size={48} className="text-white mx-auto" />
              <h3 className="font-cormorant text-2xl font-semibold text-white mt-4">
                Chat with us on WhatsApp
              </h3>
              <p className="font-raleway text-white/80 mt-2">
                Get instant replies to your queries
              </p>
              <a
                href="https://wa.me/918377911745"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#25D366] px-6 py-3 rounded-full font-raleway font-medium mt-4 hover:bg-[#faf7f2] transition-colors"
              >
                <MessageCircle size={18} />
                Start Chat
              </a>
            </div>

            {/* Showrooms */}
            {showrooms.map((showroom, index) => (
              <div
                key={index}
                className="bg-[#faf7f2] rounded-2xl p-6"
              >
                <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e]">
                  {showroom.name}
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#b8862a] flex-shrink-0 mt-1" />
                    <p className="font-raleway text-sm text-[#9a8060]">
                      {showroom.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#b8862a]" />
                    <a
                      href={`tel:${showroom.phone.replace(/\s/g, '')}`}
                      className="font-raleway text-sm text-[#9a8060] hover:text-[#b8862a]"
                    >
                      {showroom.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-[#b8862a]" />
                    <p className="font-raleway text-sm text-[#9a8060]">
                      {showroom.hours}
                    </p>
                  </div>
                </div>
                <a
                  href={showroom.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#b8862a] font-raleway text-sm mt-4 hover:underline"
                >
                  <MapPin size={16} />
                  Get Directions
                </a>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
