import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import content from '../../data/content.json';

/** Build-time image descriptor produced by getImage() in work/index.astro. */
interface CardImage {
  src: string;
  srcSet: string;
  sizes: string;
  width?: number;
  height?: number;
}

interface CaseStudy {
  title: string;
  description: string;
  slug: string;
  tags: string[];
  image?: CardImage;
}

interface Props {
  caseStudies: CaseStudy[];
}

const categories = content.workPage.filterCategories;

export default function WorkGridFilters({ caseStudies }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  /* Opt-in: animating on first paint holds the grid at opacity 0 for 300ms,
     and a transparent element doesn't count as painted — that would push LCP
     out by the length of the animation. */
  const [hasFiltered, setHasFiltered] = useState(false);

  const selectCategory = (category: string) => {
    setHasFiltered(true);
    setActiveCategory(category);
  };

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
            onClick={() => selectCategory(category)}
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStudies.map((study, i) => (
          /* Keyed on the category so cards re-mount, re-running the animation. */
          <div
            key={`${activeCategory}-${study.slug}`}
            className={`h-full ${hasFiltered ? 'work-card-enter' : ''}`}
          >
            <a
              href={`/work/${study.slug}`}
              className="group flex h-full flex-col justify-between border border-ink-800 transition-colors hover:border-ink-500"
            >
              {study.image && (
                <div className="aspect-16/10 overflow-hidden border-b border-ink-800 bg-ink-900">
                  <img
                    src={study.image.src}
                    srcSet={study.image.srcSet}
                    sizes={study.image.sizes}
                    width={study.image.width}
                    height={study.image.height}
                    alt=""
                    /* The grid is 3-up on desktop, so the first row is above the
                       fold and one of these IS the LCP element. Lazy-loading it
                       cost ~1s of load delay: the fetch cannot start until layout
                       proves the image is visible. */
                    loading={i < 3 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-all duration-300"
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
                        className="border border-ink-700 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-ink-300 uppercase"
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
          </div>
        ))}
      </div>
    </div>
  );
}
