import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, FileText, FolderOpen } from 'lucide-react';
import { profileData } from '@/data/profile';
import type { DocumentTab } from '@/lib/documentEvents';
import { cn } from '@/lib/utils';

interface DocItem {
  id: DocumentTab;
  label: string;
  shortLabel: string;
  title: string;
  url: string;
  filename: string;
}

/**
 * Interactive Liquid Glass PDF Document Viewer modal allowing visitors
 * to preview, switch between, open in a new tab, or download both the
 * Curriculum Vitae and the Portfolio Academy PDF. Strictly gradient-free.
 */
export function DocumentViewerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DocumentTab>('cv');

  const documents = useMemo<DocItem[]>(() => {
    const items: DocItem[] = [];
    if (profileData.socials.resume) {
      items.push({
        id: 'cv',
        label: 'Curriculum Vitae',
        shortLabel: 'CV (PDF)',
        title: 'Septian Putra Rachman Hakim - Curriculum Vitae',
        url: profileData.socials.resume,
        filename: 'SeptianPutraRachmanHakim_CV_Academy.pdf',
      });
    }
    if (profileData.socials.portfolioPdf) {
      items.push({
        id: 'portfolio',
        label: 'Portfolio Deck',
        shortLabel: 'Portfolio (PDF)',
        title: 'Septian Putra Rachman Hakim - Portfolio Academy',
        url: profileData.socials.portfolioPdf,
        filename: 'SeptianPutraRachmanHakim_Portfolio_Academy.pdf',
      });
    }
    return items;
  }, []);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<DocumentTab>;
      const requestedTab = customEvent.detail === 'portfolio' ? 'portfolio' : 'cv';
      setActiveTab(requestedTab);
      setIsOpen(true);
    };

    window.addEventListener('open-document-viewer', handleOpen);
    return () => window.removeEventListener('open-document-viewer', handleOpen);
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (documents.length === 0) return null;

  const activeDoc = documents.find((doc) => doc.id === activeTab) || documents[0];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={activeDoc.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="relative w-full max-w-6xl h-[92vh] md:h-[90vh] flex flex-col rounded-2xl md:rounded-3xl bg-[#0A0A0F]/95 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 border-b border-white/10 bg-[#12121A]">
              {/* iOS Segmented Switcher */}
              <div
                role="tablist"
                aria-label="Select document to view"
                className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10"
              >
                {documents.map((doc) => {
                  const isActive = activeDoc.id === doc.id;
                  const Icon = doc.id === 'cv' ? FileText : FolderOpen;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(doc.id)}
                      className={cn(
                        'relative px-3 sm:px-4 py-1.5 min-h-[40px] rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                        isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-doc-tab"
                          className="absolute inset-0 rounded-full bg-accent-red border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] -z-0"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon size={15} className="relative z-10 shrink-0" />
                      <span className="relative z-10 hidden sm:inline">{doc.label}</span>
                      <span className="relative z-10 sm:hidden">{doc.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={activeDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <ExternalLink size={15} />
                  <span className="hidden md:inline">Open New Tab</span>
                  <span className="md:hidden">Open</span>
                </a>
                <a
                  href={activeDoc.url}
                  download={activeDoc.filename}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-medium bg-accent-blue hover:bg-blue-600 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <Download size={15} />
                  <span className="hidden md:inline">Download PDF</span>
                  <span className="md:hidden">Save</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close document viewer"
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* PDF Content Body */}
            <div className="flex-1 bg-[#14141C] relative overflow-hidden">
              <object
                key={activeDoc.url}
                data={`${activeDoc.url}#view=FitH`}
                type="application/pdf"
                aria-label={activeDoc.title}
                className="w-full h-full block"
              >
                {/* Fallback for browsers without inline PDF viewer (e.g. mobile browsers) */}
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-blue">
                    {activeDoc.id === 'cv' ? <FileText size={32} /> : <FolderOpen size={32} />}
                  </div>
                  <div className="max-w-md space-y-2">
                    <h3 className="font-display text-2xl text-white tracking-wide">
                      {activeDoc.label}
                    </h3>
                    <p className="font-sans text-sm text-secondary leading-relaxed">
                      Your browser does not support inline PDF rendering. Open or download the PDF
                      file directly to view {activeDoc.label}.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    <a
                      href={activeDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full font-sans text-sm font-medium bg-accent-red hover:bg-red-600 text-white transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>Open in New Tab</span>
                    </a>
                    <a
                      href={activeDoc.url}
                      download={activeDoc.filename}
                      className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full font-sans text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors"
                    >
                      <Download size={16} />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </object>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
