import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface CaseStudy {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  client: string;
  year: string;
}

interface Props {
  caseStudies: CaseStudy[];
}

const categories = ['All', 'AI & Machine Learning', 'DevOps & MLOps', 'Web & Software Development', 'Cloud Services'];

export default function WorkGridFilters({ caseStudies }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredStudies = activeCategory === 'All'
    ? caseStudies
    : caseStudies.filter(study => 
        study.tags.some(tag => tag.toLowerCase().includes(activeCategory.toLowerCase().substring(0, 8)))
      );

  return (
    <div className="flex flex-col gap-12">
      {/* Category selector */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
              activeCategory === category
                ? 'bg-brand-accent text-bg-dark font-bold'
                : 'bg-bg-card border border-border-subtle text-text-muted hover:text-text-light hover:border-text-muted'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Case studies list */}
      <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={study.slug}
              className="h-full"
            >
              <a
                href={`/work/${study.slug}`}
                className="group flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-bg-card border border-border-subtle hover:border-brand-accent/50 hover:bg-bg-card-hover transition-all duration-500 h-full relative overflow-hidden"
              >
                <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-brand-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div>
                  <div className="flex justify-between items-center mb-6 font-mono text-xs text-text-muted">
                    <span>{study.client}</span>
                    <span>{study.year}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold tracking-tight text-text-light mb-3 group-hover:text-brand-accent transition-colors duration-300">
                    {study.title}
                  </h3>

                  <p className="text-sm text-text-muted leading-relaxed mb-6 font-light">
                    {study.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-bg-dark border border-border-subtle text-text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-light group-hover:text-brand-accent transition-colors duration-300">
                    View Case Study
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
