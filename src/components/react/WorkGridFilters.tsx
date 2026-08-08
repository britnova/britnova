import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import content from '../../data/content.json';

interface CaseStudy {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  heroImage?: string;
}

interface Props {
  caseStudies: CaseStudy[];
}

const categories = content.workPage.filterCategories;

export default function WorkGridFilters({ caseStudies }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredStudies =
    activeCategory === 'All'
      ? caseStudies
      : caseStudies.filter((study) =>
          study.tags.some((tag) =>
            tag.toLowerCase().includes(activeCategory.toLowerCase().substring(0, 8))
          )
        );

  return (
    <div className="flex flex-col gap-12">
      {/* Category selector */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-sm px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
              activeCategory === category
                ? 'bg-paper text-ink-950'
                : 'border border-ink-700 text-ink-300 hover:text-paper hover:border-ink-400'
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
                className="group flex h-full flex-col justify-between border border-ink-800 transition-colors hover:border-ink-500"
              >
                {study.heroImage && (
                  <div className="aspect-[16/10] overflow-hidden border-b border-ink-800 bg-ink-900">
                    <img
                      src={study.heroImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover object-top grayscale transition-all duration-300 group-hover:grayscale-0"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
                  <div>
                    <h3 className="font-brand text-[22px] font-medium leading-tight tracking-[-0.02em] text-paper mb-3 mt-6">
                      {study.title}
                    </h3>

                    <p className="text-[15px] leading-relaxed text-ink-300 mb-6">
                      {study.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-ink-700 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.1em] text-ink-300 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-100 group-hover:text-paper transition-colors duration-300">
                      View Case Study
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
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
