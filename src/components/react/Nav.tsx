import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import content from '../../data/content.json';

const { links: navLinks, ctaLabel, mobileClosingLine } = content.layout.innerNav;

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-bg-dark/80 backdrop-blur-md py-4 border-b border-border-subtle'
            : 'bg-transparent py-6 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <a
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-text-light flex items-center gap-2 group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent group-hover:scale-125 transition-transform duration-300"></span>
            BRITNOVA
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-muted hover:text-text-light transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-bg-dark bg-brand-accent px-4 py-2 rounded-full hover:bg-brand-accent/90 transition-all duration-200"
            >
              {ctaLabel}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-text-light hover:text-brand-accent transition-colors duration-200 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 w-full h-screen bg-bg-dark z-40 flex flex-col justify-center px-6 md:px-12"
          >
            <div className="flex flex-col gap-6 text-left">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  key={link.label}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-text-light hover:text-brand-accent transition-colors duration-300 flex items-baseline gap-2"
                  >
                    <span className="text-sm text-brand-accent font-mono font-normal">
                      0{idx + 1}.
                    </span>
                    {link.label}
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 border-t border-border-subtle pt-8"
              >
                <a
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-between w-full text-lg font-bold text-text-light hover:text-brand-accent transition-all duration-300"
                >
                  {mobileClosingLine}
                  <ArrowUpRight className="w-6 h-6 text-brand-accent" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
