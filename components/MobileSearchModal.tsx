
import React, { useEffect, useRef } from 'react';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (val: string) => void;
}

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({ isOpen, onClose, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-[100] animate-fade-in-up flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-grow relative">
           <input 
              ref={inputRef}
              type="text" 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Поиск объявлений..." 
              className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-dark focus:ring-2 focus:ring-primary/20 outline-none"
           />
           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           {value && (
               <button 
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-gray-200 rounded-full p-0.5 hover:text-dark"
               >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
           )}
        </div>
      </div>

      {/* Results / Suggestions Placeholder */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
          {value ? (
              <div className="text-center mt-10 text-secondary">
                  <p>Результаты поиска появятся в основном списке.</p>
                  <button onClick={onClose} className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20">
                      Показать результаты
                  </button>
              </div>
          ) : (
              <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase">Популярное</p>
                  <div className="flex flex-wrap gap-2">
                      {['Квартира', 'iPhone', 'Работа', 'Гараж', 'Авто'].map(tag => (
                          <button 
                            key={tag}
                            onClick={() => onChange(tag)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm text-dark hover:border-primary hover:text-primary transition-colors"
                          >
                              {tag}
                          </button>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
