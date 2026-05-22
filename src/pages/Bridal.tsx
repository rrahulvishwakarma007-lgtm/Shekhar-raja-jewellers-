import { motion } from 'framer-motion';
import { MessageCircle, Star, Award, Users, MapPin, Clock } from 'lucide-react';

const bridalSets = [
  {
    id: 1,
    name: 'Maharani Bridal Set',
    description: 'A grand bridal set featuring intricate kundan work with meenakari detailing, perfect for the royal bride.',
    image: 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 2,
    name: 'Temple Bridal Collection',
    description: 'Traditional temple jewellery with goddess motifs and Lakshmi coins, crafted in pure 22KT gold.',
    image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 3,
    name: 'Diamond Bridal Ensemble',
    description: 'Contemporary diamond bridal set with brilliant cut diamonds in platinum finish.',
    image: 'https://images.pexels.com/photos/2697598/pexels-photo-2697598.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 4,
    name: 'Antique Gold Bridal Set',
    description: 'Heirloom-quality antique gold bridal set with traditional nakshi work.',
    image: '/bangle5.png'
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
    <div className="pt-28 pb-16 bg-[#e8e0d0]">
      {/* Hero Banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a2e1e]/80 to-transparent z-10" />
        <img
          src="https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Bridal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <h1 className="font-cormorant text-5xl sm:text-6xl font-bold text-white">
                Your Dream Bridal Jewellery
              </h1>
              <p className="font-raleway text-lg text-white/80 mt-4">
                Make your special day unforgettable with our exquisite bridal collections
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bridal Sets */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] text-center mb-12">
            Bridal Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {bridalSets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(58,46,30,0.15)' }}
                className="bg-[#faf7f2] rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={set.image}
                    alt={set.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-cormorant text-2xl font-semibold text-[#3a2e1e]">
                    {set.name}
                  </h3>
                  <p className="font-raleway text-[#9a8060] mt-2">
                    {set.description}
                  </p>
                  <a
                    href={`https://wa.me/918377911745?text=${encodeURIComponent(`Hello! I'm interested in ${set.name}. Please share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#b8862a] text-white px-6 py-3 rounded-full font-raleway text-sm font-medium mt-4 hover:bg-[#8b6014] transition-colors"
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
      <section className="py-16 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto bg-[#b8862a]/10 rounded-full flex items-center justify-center">
                  <item.icon size={28} className="text-[#b8862a]" />
                </div>
                <h3 className="font-cormorant text-xl font-semibold text-[#3a2e1e] mt-4">
                  {item.title}
                </h3>
                <p className="font-raleway text-sm text-[#9a8060] mt-2">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#3a2e1e] text-center mb-12">
            What Our Brides Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#faf7f2] p-6 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#b8862a" className="text-[#b8862a]" />
                  ))}
                </div>
                <p className="font-raleway text-[#3a2e1e] italic">
                  "{testimonial.text}"
                </p>
                <p className="font-cormorant text-lg font-semibold text-[#b8862a] mt-4">
                  — {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#b8862a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-white">
            Book Your Bridal Consultation
          </h2>
          <p className="font-raleway text-lg text-white/80 mt-4">
            Let our experts help you find the perfect bridal jewellery for your special day
          </p>
          <a
            href="https://wa.me/918377911745?text=${encodeURIComponent('Hello! I would like to book a bridal consultation.')}'"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#b8862a] px-8 py-4 rounded-full font-raleway font-medium mt-8 hover:bg-[#faf7f2] transition-colors"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
