import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { FESTIVAL_CONTACT_EMAIL, VENDOR_POLICIES_FAQ } from '../data/festivalData';

export const FaqAndGuidelines: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-[#FDFBF7] text-[#3D3A30] border-b border-[#E8E2D6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#5A5A40] bg-[#F0EBE0] border border-[#E8E2D6]">
            <HelpCircle className="w-3.5 h-3.5 text-[#5A5A40]" />
            Vendor Policies & Event Guide
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-bold text-[#3D3A30]">
            Frequently Asked Questions & Policies
          </h2>
          
          <p className="text-[#6B6658] text-base sm:text-lg">
            Essential operational rules, canopy safety standards, waste guidelines, equipment provisions, and food safety protocols.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5 mb-14">
          {VENDOR_POLICIES_FAQ.map((faq, index) => {
            const isOpen = openIndex === index;
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
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif italic font-bold text-base sm:text-lg text-[#3D3A30]">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-[#5A5A40] text-white rotate-180' : 'bg-[#F0EBE0] text-[#5A5A40]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#6B6658] leading-relaxed border-t border-[#E8E2D6]">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
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
              className="px-6 py-3 rounded-full bg-white hover:bg-[#F0EBE0] text-[#5A5A40] font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-colors shadow-sm"
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
