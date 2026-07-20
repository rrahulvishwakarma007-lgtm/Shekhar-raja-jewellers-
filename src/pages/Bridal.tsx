import { motion } from 'framer-motion';
import { MessageCircle, Star, Award, Users, MapPin } from 'lucide-react';

// ── Palette (Matching your App Theme) ─────────────────────────────────────────
const C = {
  bg:        '#FFF5F7',
  bgCard:    '#FFFFFF',
  bgDeep:    '#FFE4EC',
  gold:      '#C2185B',
  goldDk:    '#880E4F',
  goldLt:    '#E91E8C',
  goldPale:  '#F8BBD9',
  text:      '#1A0010',
  textMid:   '#6D1B4E',
  textLight: '#AD6888',
  border:    'rgba(194,24,91,0.15)',
  borderMd:  'rgba(194,24,91,0.30)',
};

const bridalSets = [
  {
    id: 1,
    name: 'Maharani Bridal Set',
    description: 'A grand bridal set featuring intricate kundan work with meenakari detailing, perfect for the royal bride.',
    image: '/bridal.png'
  },
  {
    id: 2,
    name: 'Temple Bridal Collection',
    description: 'Traditional temple jewellery with goddess motifs and Lakshmi coins, crafted in pure 22KT gold.',
    image: '/temple.png'
  },
  {
    id: 3,
    name: 'Diamond Bridal Ensemble',
    description: 'Contemporary diamond bridal set with brilliant cut diamonds in platinum finish.',
    image: '/band.png'
  },
  {
    id: 4,
    name: 'Antique Gold Bridal Set',
    description: 'Heirloom-quality antique gold bridal set with traditional nakshi work.',
    image: '/antique.png'
  }
];

const testimonials = [
  {
    name: 'Priya Sharma',
    text: 'The bridal set I got from Shekhar Raja Jewellers was absolutely stunning. The craftsmanship is unmatched!',
    rating: 5
  },
  {
    name: 'Anjali Patel',
    text: 'Best jewellery shop in Jabalpur! They made my wedding so special with their beautiful designs.',
    rating: 5
  },
  {
    name: 'Neha Gupta',
    text: 'Excellent quality and fair prices. The staff was very helpful in choosing the perfect bridal set.',
    rating: 5
  }
];

const whyChooseUs = [
  { icon: Award, title: '35+ Years Heritage', desc: 'Trusted by generations since 1987' },
  { icon: Star, title: 'BIS Hallmark Certified', desc: 'Guaranteed purity on all gold' },
  { icon: Users, title: 'Custom Orders', desc: 'Design your dream bridal set' },
  { icon: MapPin, title: 'Two Showrooms', desc: 'Convenient locations in Jabalpur' }
];

export default function Bridal() {
  return (
    <div className="pt-28 pb-16 min-h-screen" style={{ background: C.bg }}>
      {/* Hero Banner */}
      <section className="relative h-[50vh] overflow-hidden shadow-xl">
        {/* Luxury gradient overlay fading from deep dark magenta to transparent */}
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(to right, rgba(26,0,16,0.9) 0%, rgba(136,14,79,0.4) 50%, transparent 100%)` }} />
        <img
          src="https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Bridal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
              <h1 className="font-cormorant text-5xl sm:text-6xl font-bold text-white leading-tight">
                Your Dream <br/>Bridal Jewellery
              </h1>
              <p className="font-raleway text-lg text-white/90 mt-4">
                Make your special day unforgettable with our exquisite bridal collections
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bridal Sets */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold" style={{ color: C.text }}>
              Bridal Collections
            </h2>
            <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLt})` }} />
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {bridalSets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(194,24,91,0.15)` }}
                className="rounded-3xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 group"
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, boxShadow: `0 4px 15px rgba(194,24,91,0.05)` }}
              >
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(136,14,79,0.4)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img
                    src={set.image}
                    alt={set.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-cormorant text-3xl font-semibold transition-colors group-hover:text-[#C2185B]" style={{ color: C.text }}>
                    {set.name}
                  </h3>
                  <p className="font-raleway mt-3 leading-relaxed" style={{ color: C.textLight }}>
                    {set.description}
                  </p>
                  <a
                    href={`https://wa.me/918377911745?text=${encodeURIComponent(`Hello! I'm interested in ${set.name}. Please share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 text-white px-6 py-3.5 rounded-full font-raleway text-sm font-medium mt-auto transition-transform hover:-translate-y-0.5 self-start"
                    style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldDk})`, boxShadow: `0 4px 15px rgba(194,24,91,0.3)` }}
                  >
                    <MessageCircle size={16} />
                    Enquire Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold" style={{ color: C.text }}>
              Why Choose Us
            </h2>
            <div className="h-1 w-20 mx-auto mt-4 rounded-full" style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLt})` }} />
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 sm:p-8 rounded-3xl transition-transform hover:-translate-y-2 bg-white/50 backdrop-blur-sm shadow-sm"
                style={{ border: `1px solid ${C.border}` }}
              >
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-transform hover:rotate-12"
                     style={{ background: `rgba(194,24,91,0.08)` }}>
                  <item.icon size={28} style={{ color: C.gold }} />
                </div>
                <h3 className="font-cormorant text-2xl font-semibold mt-5" style={{ color: C.text }}>
                  {item.title}
                </h3>
                <p className="font-raleway text-sm mt-3" style={{ color: C.textLight }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-cormorant text-4xl sm:text-5xl font-semibold" style={{ color: C.text }}>
              What Our Brides Say
            </h2>
            <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLt})` }} />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl relative"
                style={{ background: C.bgCard, border: `1px solid ${C.border}`, boxShadow: `0 4px 20px rgba(194,24,91,0.05)` }}
              >
                {/* Decorative quote mark */}
                <div className="absolute top-4 right-6 font-cormorant text-6xl opacity-10" style={{ color: C.gold }}>"</div>
                
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} style={{ color: C.gold, fill: C.gold }} />
                  ))}
                </div>
                <p className="font-raleway italic text-lg leading-relaxed relative z-10" style={{ color: C.textMid }}>
                  "{testimonial.text}"
                </p>
                <div className="mt-8 pt-6 relative z-10" style={{ borderTop: `1px solid ${C.border}` }}>
                  <p className="font-cormorant text-xl font-bold tracking-wide" style={{ color: C.gold }}>
                    {testimonial.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        {/* Luxury gradient background */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${C.goldDk} 0%, ${C.gold} 100%)` }} />
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-cormorant text-4xl sm:text-5xl font-bold text-white">
            Book Your Bridal Consultation
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }} className="font-raleway text-lg text-white/90 mt-4 max-w-2xl mx-auto">
            Let our experts help you find the perfect bridal jewellery for your special day
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            <a
              href={"https://wa.me/918377911745?text=" + encodeURIComponent('Hello! I would like to book a bridal consultation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white px-10 py-4 rounded-full font-raleway font-bold text-lg mt-10 hover:-translate-y-1 transition-transform shadow-2xl"
              style={{ color: C.gold }}
            >
              <MessageCircle size={22} />
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
