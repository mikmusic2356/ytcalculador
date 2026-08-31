import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQItem } from '../../types';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  faqs,
  title = 'Preguntas Frecuentes (FAQ)',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-[#2F2F2F]">
      <div className="flex items-center gap-2 text-base font-bold text-[#212121] dark:text-white">
        <HelpCircle className="w-4 h-4 text-[#FF0000]" />
        <h3>{title}</h3>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-gray-200 dark:border-[#2F2F2F] rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 bg-gray-50 dark:bg-[#141414] hover:bg-gray-100 dark:hover:bg-[#252525] text-[#212121] dark:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 bg-white dark:bg-[#1F1F1F] text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-[#2F2F2F]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
