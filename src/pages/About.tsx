import { motion } from 'framer-motion';
import { Award, Users, Heart, Shield, MapPin, Clock, Star } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Trust & Transparency', desc: 'BIS Hallmark certified with complete transparency in pricing' },
  { icon: Heart, title: 'Craftsmanship', desc: 'Each piece is handcrafted by skilled artisans with decades of experience' },
  { icon: Users, title: 'Customer First', desc: 'Your satisfaction is our priority, with personalized service' },
  { icon: Award, title: 'Quality Assurance', desc: 'Every piece undergoes rigorous quality checks' }
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

export default function About() {
  return (
    <div className="pt-28 pb-16 bg-[#e8e0d0]">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a2e1e]/80 to-transparent z-10" />
        <img
          src="https://nxtgenailabs.work/dixitpura.webp"
          alt="Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <span className="font-cinzel text-sm tracking-[0.3em] text-[#d4a843]">EST. 1987</span>
              <h1 className="font-cormorant text-5xl sm:text-6xl font-bold text-white mt-4">
                Our Heritage
              </h1>
              <p className="font-raleway text-lg text-white/80 mt-4">
                37 years of crafting elegance and ensuring excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e]">
                A Legacy of Trust
              </h2>
              <p className="font-cormorant italic text-2xl text-[#b8862a] mt-6">
                "Crafting Elegance, Ensuring Excellence"
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="h-48 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Craftsmanship"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-32 overflow-hidden rounded-xl">
                  <img
                    src="https://images.pexels.com/photos/2697598/pexels-photo-2697598.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Gold"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 overflow-hidden rounded-xl">
                  <img
                    src="/earring6.jpg"
                    alt="Earrings"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="h-48 overflow-hidden rounded-2xl">
                  <img
                    src="/bangle1.png"
                    alt="Bangles"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Showrooms */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] text-center mb-12">
            Visit Our Showrooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {showrooms.map((showroom, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#faf7f2] rounded-2xl overflow-hidden"
              >
                <div className="h-48 bg-[#3a2e1e] flex items-center justify-center">
                  <MapPin size={48} className="text-[#b8862a]" />
                </div>
                <div className="p-6">
                  <h3 className="font-cormorant text-2xl font-semibold text-[#3a2e1e]">
                    {showroom.name}
                  </h3>
                  <p className="font-raleway text-sm text-[#9a8060] mt-2">
                    {showroom.address}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-[#9a8060]">
                    <Clock size={16} />
                    <span className="font-raleway text-sm">{showroom.hours}</span>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto bg-[#b8862a]/10 rounded-full flex items-center justify-center">
                  <value.icon size={28} className="text-[#b8862a]" />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e] mt-4">
                  {value.title}
                </h3>
                <p className="font-raleway text-sm text-[#9a8060] mt-2">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BIS Badge */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#faf7f2] rounded-2xl p-8 sm:p-12 border border-[rgba(184,134,42,0.2)]"
          >
            <div className="w-24 h-24 mx-auto bg-[#b8862a]/10 rounded-full flex items-center justify-center mb-6">
              <Shield size={48} className="text-[#b8862a]" />
            </div>
            <h2 className="font-cormorant text-3xl font-semibold text-[#3a2e1e]">
              BIS Hallmark Certified
            </h2>
            <p className="font-raleway text-[#9a8060] mt-4 max-w-xl mx-auto">
              All our gold jewellery is BIS Hallmark certified, ensuring the highest standards of purity and quality. Your trust is our most valuable asset.
            </p>
            <div className="flex items-center justify-center gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="#b8862a" className="text-[#b8862a]" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
