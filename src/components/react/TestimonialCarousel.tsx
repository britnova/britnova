import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ali Khan',
    role: 'CEO, Tech Solutions',
    feedback:
      'Britnova transformed our infrastructure and improved our system performance significantly. Their commitment to building scalable solutions was clear from day one.',
  },
  {
    name: 'Sarah Ahmed',
    role: 'Product Manager, Aura Retail',
    feedback:
      'Their AI solutions helped us automate complex document ingestion workflows, saving our ops team countless hours of manual work with zero errors.',
  },
  {
    name: 'Usman Tariq',
    role: 'Founder, Apex MedTech',
    feedback:
      'A highly professional, reliable, and technically outstanding team. They delivered our cloud infrastructure setup ahead of schedule and with zero downtime.',
  },
];

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section
      id="testimony"
      className="py-28 border-b border-border-subtle bg-bg-card/40 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Quote Icon */}
        <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-8">
          <Quote className="w-5 h-5 text-brand-accent fill-brand-accent/20" />
        </div>

        {/* Carousel Container */}
        <div className="min-h-[220px] md:min-h-[180px] w-full flex items-center justify-center relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full"
            >
              <p className="font-display text-lg md:text-2xl font-light text-text-light italic leading-relaxed mb-8 max-w-3xl mx-auto">
                "{testimonials[activeIndex].feedback}"
              </p>

              <h4 className="font-display text-base font-bold text-text-light tracking-wide uppercase">
                {testimonials[activeIndex].name}
              </h4>
              <p className="font-mono text-xs text-text-muted mt-1 uppercase tracking-widest">
                {testimonials[activeIndex].role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-6 mt-12">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full border border-border-subtle hover:border-brand-accent flex items-center justify-center text-text-muted hover:text-brand-accent transition-all duration-300"
            aria-label="Previous Testimonial"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-brand-accent w-6'
                    : 'bg-border-subtle hover:bg-text-muted'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-border-subtle hover:border-brand-accent flex items-center justify-center text-text-muted hover:text-brand-accent transition-all duration-300"
            aria-label="Next Testimonial"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
