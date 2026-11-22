import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ProjectGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
}

export function ProjectGalleryModal({ isOpen, onClose, images, title }: ProjectGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const touchStartXRef = useRef<number | null>(null);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setCurrentIndex(0);
    }
  }

  // Manage body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) goToNext();
      if (e.key === 'ArrowLeft' && images.length > 1) goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrev, images.length]);

  if (!isOpen) return null;

  const hasMultipleImages = images.length > 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultipleImages || touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (deltaX < -50) goToNext();
    else if (deltaX > 50) goToPrev();
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-8 animate-[modal-fade_150ms_ease-out]"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white bg-[#12121A] hover:bg-[#1E1E2B] border border-white/15 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        aria-label="Close gallery"
      >
        <X size={24} />
      </button>

      {/* Title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#12121A] rounded-full border border-white/15 text-white/90 text-sm font-medium shadow-lg pointer-events-none max-w-[70vw] truncate">
        {title}
      </div>

      <div
        className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-[85vh] flex items-center justify-center animate-[modal-pop_150ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} screenshot ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg select-none"
          decoding="async"
        />

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2 md:left-4 p-3 min-w-[48px] min-h-[48px] flex items-center justify-center text-white/80 hover:text-white bg-[#12121A]/90 hover:bg-[#1E1E2B] border border-white/15 rounded-full transition-colors -translate-y-1/2 top-1/2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              aria-label="Previous image"
            >
              <ChevronLeft
                size={32}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 md:right-4 p-3 min-w-[48px] min-h-[48px] flex items-center justify-center text-white/80 hover:text-white bg-[#12121A]/90 hover:bg-[#1E1E2B] border border-white/15 rounded-full transition-colors -translate-y-1/2 top-1/2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              aria-label="Next image"
            >
              <ChevronRight
                size={32}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </>
        )}

        {/* Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-[#12121A] rounded-full border border-white/15">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="min-w-[36px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-full"
                aria-label={`Go to image ${idx + 1}`}
              >
                <span
                  className={`h-2 rounded-full transition-[width,background-color] duration-200 block ${
                    idx === currentIndex
                      ? 'bg-accent-blue w-6 shadow-[0_0_8px_rgba(45,108,223,0.8)]'
                      : 'bg-white/30 hover:bg-white/60 w-2'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
