import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Mail, 
  Search, 
  Tag, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FESTIVAL_CONTACT_EMAIL, VENDOR_POLICIES_FAQ } from '../data/festivalData';

export const FaqAndGuidelines: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0, 1]));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = ['All'];
    VENDOR_POLICIES_FAQ.forEach(item => {
      if (item.category && !cats.includes(item.category)) {
        cats.push(item.category);
      }
    });
    return cats;
  }, []);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return VENDOR_POLICIES_FAQ.filter((faq) => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const inQuestion = faq.q.toLowerCase().includes(q);
      const inAnswer = faq.a.toLowerCase().includes(q);
      const inKeywords = faq.keywords.some(k => k.toLowerCase().includes(q));
      const inCategory = faq.category.toLowerCase().includes(q);

      return inQuestion || inAnswer || inKeywords || inCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleAccordion = (index: number) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIndices(new Set(filteredFaqs.map((_, i) => i)));
  };

  const handleCollapseAll = () => {
    setOpenIndices(new Set());
  };

  return (
    <section id="faq" className="py-20 bg-[#FDFBF7] text-[#3D3A30] border-b border-[#E8E2D6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <HelpCircle className="w-3.5 h-3.5 text-[#5A5A40]" />
            Vendor Policies & Event Guide
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Frequently Asked Questions & Guidelines
          </h2>
          
          <p className="text-[#6B6658] text-base sm:text-lg">
            Find instant answers on booth regulations, canopy anchor requirements, health inspections, electrical hookups, 50-state sales tax compliance, and payment checkout methods.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E2D6] shadow-sm mb-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7566]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, state tax, food permit, canopy weight, electricity, refund..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#E8E2D6] bg-[#FAF8F5] text-sm text-[#3D3A30] placeholder-[#7A7566] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs bg-[#E8E2D6] hover:bg-[#D4CDBE] px-2.5 py-1 rounded-lg text-[#3D3A30] font-semibold transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-[#F0EBE0] text-[#5A5A40] hover:bg-[#E2DC CE]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#7A7566] pt-1">
            <span>
              Showing <strong className="text-[#3D3A30]">{filteredFaqs.length}</strong> of {VENDOR_POLICIES_FAQ.length} policies
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExpandAll}
                className="hover:text-[#5A5A40] hover:underline font-semibold cursor-pointer"
              >
                Expand All
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="hover:text-[#5A5A40] hover:underline font-semibold cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5 mb-14">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#E8E2D6] text-center space-y-3">
              <FileText className="w-10 h-10 text-[#7A7566] mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[#3D3A30]">No matching questions found</h3>
              <p className="text-xs text-[#7A7566] max-w-md mx-auto">
                We couldn't find an answer matching "{searchQuery}". Try searching for terms like "permit", "canopy", "electricity", or contact our vendor coordinator directly below.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 rounded-xl bg-[#5A5A40] text-white text-xs font-bold hover:bg-[#464632] transition-colors inline-block"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndices.has(index);
              return (
                <div
                  key={index}
                  className={`rounded-[24px] border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#5A5A40] shadow-sm'
                      : 'bg-white border-[#E8E2D6] hover:border-[#5A5A40]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E2D6] text-[#7A7566]">
                          {faq.category}
                        </span>
                      </div>
                      <span className="font-serif italic font-bold text-base sm:text-lg text-[#3D3A30] block">
                        {faq.q}
                      </span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform mt-1 ${
                        isOpen ? 'bg-[#5A5A40] text-white rotate-180' : 'bg-[#F0EBE0] text-[#5A5A40]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-sm text-[#6B6658] leading-relaxed border-t border-[#E8E2D6]/70 space-y-3">
                      <p>{faq.a}</p>

                      {/* Keyword tags for scannability & SEO clarity */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <Tag className="w-3 h-3 text-[#7A7566]" />
                        <span className="text-[10px] text-[#7A7566] font-semibold uppercase tracking-wider mr-1">
                          Relevant Keywords:
                        </span>
                        {faq.keywords.map((kw, ki) => (
                          <span
                            key={ki}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#5A5A40] border border-[#E8E2D6]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Direct Inquiries & Contact Banner */}
        <div className="bg-[#5A5A40] rounded-[36px] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-white">
              Have Further Questions or Inquiries?
            </h3>
            <p className="text-xs sm:text-sm text-[#F0EBE0]">
              "If you will have further inquiries, please reach out to us via email or phone."
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${FESTIVAL_CONTACT_EMAIL}`}
              className="px-6 py-3 rounded-full bg-white hover:bg-[#F0EBE0] text-[#5A5A40] font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#5A5A40]" />
              <span>Email: {FESTIVAL_CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

