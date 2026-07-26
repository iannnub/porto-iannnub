import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Reset to first image when opened with new images
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      document.body.style.overflow = ''; // Unlock scroll
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, images]);

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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-md transition-all"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          {/* Title (Optional, floating at top) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/90 text-sm font-medium shadow-lg pointer-events-none">
            {title}
          </div>

          <div
            className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`${title} screenshot ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                loading="lazy"
                decoding="async"
                drag={hasMultipleImages ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    goToNext();
                  } else if (swipe > swipeConfidenceThreshold) {
                    goToPrev();
                  }
                }}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-2 md:left-4 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/60 rounded-full backdrop-blur-md transition-all -translate-y-1/2 top-1/2 group"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-2 md:right-4 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/60 rounded-full backdrop-blur-md transition-all -translate-y-1/2 top-1/2 group"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}

            {/* Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'bg-accent-blue w-6 shadow-[0_0_8px_rgba(45,108,223,0.8)]'
                        : 'bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render in portal so it sits above all other DOM elements
  return createPortal(modalContent, document.body);
}

// Swipe utility functions for framer-motion drag
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
