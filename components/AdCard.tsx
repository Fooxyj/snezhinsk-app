
import React from 'react';
import { Ad } from '../types';

interface AdCardProps {
  ad: Ad;
  variant?: 'standard' | 'premium' | 'rental';
  onShow?: (ad: Ad) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, variant = 'standard', onShow, isFavorite, onToggleFavorite }) => {
  const isPremium = variant === 'premium' || ad.isPremium;

  // Calculate rating
  const rating = ad.reviews && ad.reviews.length > 0 
    ? (ad.reviews.reduce((acc, r) => acc + r.rating, 0) / ad.reviews.length).toFixed(1) 
    : null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleFavorite) {
          onToggleFavorite(ad.id);
      }
  };

  return (
    <div 
        onClick={() => onShow && onShow(ad)}
        className={`group relative bg-surface rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 cursor-pointer
        ${isPremium 
            ? 'border-2 border-yellow-400 shadow-[0_4px_20px_-5px_rgba(250,204,21,0.4)] hover:shadow-[0_8px_30px_-5px_rgba(250,204,21,0.6)] hover:-translate-y-1 z-10 ring-1 ring-yellow-400/50' 
            : 'border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20'
        }`}
    >
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">
        <img 
          src={ad.image} 
          alt={ad.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges on Image - Hidden on Mobile to save space */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start hidden md:flex">
          {isPremium && (
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md flex items-center gap-1 border border-yellow-300 animate-pulse-slow">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              VIP
            </span>
          )}
        </div>

        {/* Action Buttons (Favorite) */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
            <button 
                onClick={handleFavoriteClick}
                className={`p-1.5 md:p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:shadow-md transition-all duration-300
                    ${isFavorite 
                        ? 'text-red-500 opacity-100' 
                        : 'text-gray-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-red-500'
                    }
                `}
                title="В избранное"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>

        {/* Mobile VIP Indicator */}
        {isPremium && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 md:hidden"></div>
        )}
      </div>

      {/* Content */}
      <div className={`p-2 md:p-3 flex flex-col flex-grow relative ${isPremium ? 'bg-gradient-to-b from-yellow-50/50 via-white to-white' : ''}`}>
        
        {/* Badges - Hidden on Mobile to be more compact */}
        <div className="hidden md:flex flex-wrap gap-2 mb-2">
            {ad.bookingAvailable && (
              <span className="bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1">
                Бронь
              </span>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border
              ${ad.category === 'sale' ? 'bg-green-50 text-green-700 border-green-100' : 
                ad.category === 'rent' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                ad.category === 'services' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              {ad.category === 'rent' ? 'Аренда' : ad.category === 'sale' ? 'Продажа' : ad.category === 'services' ? 'Услуги' : 'Работа'}
            </span>
        </div>

        {/* Title */}
        <div className="mb-1">
          <h3 className="font-bold text-xs md:text-base text-dark leading-tight group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-1" title={ad.title}>
            {ad.title}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-1 md:mb-2 flex items-center justify-between">
          <span className="text-sm md:text-lg font-extrabold text-primary">
            {ad.price > 0 ? `${ad.price.toLocaleString('ru-RU')} ₽` : 'Договорная'}
          </span>
          {rating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100 hidden md:flex">
               <span className="text-yellow-500 text-[10px]">★</span>
               <span className="text-xs font-bold text-dark">{rating}</span>
            </div>
          )}
        </div>

        {/* Description - Desktop Only - Auto Truncated */}
        <p className="hidden md:block text-secondary text-xs leading-snug line-clamp-2 mb-2 break-words">
          {ad.description}
        </p>
        
        {/* Specs - Desktop Only */}
        {ad.specs && (
           <div className="hidden md:flex flex-wrap gap-1 mb-2 text-[10px] text-gray-500 font-medium opacity-80">
             {ad.specs.year && <span>{ad.specs.year}г,</span>}
             {ad.specs.mileage && <span>{(ad.specs.mileage / 1000).toFixed(0)}т.км</span>}
             {ad.specs.rooms && <span>{ad.specs.rooms}к,</span>}
             {ad.specs.area && <span>{ad.specs.area}м²</span>}
           </div>
        )}

        {/* Footer: Location */}
        <div className="pt-1 md:pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div className="flex items-center text-[10px] text-secondary font-medium w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate max-w-[100px] md:max-w-full">{ad.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
