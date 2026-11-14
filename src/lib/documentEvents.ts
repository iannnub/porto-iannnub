export type DocumentTab = 'cv' | 'portfolio';

/**
 * Dispatches a custom event to open the global Document Viewer modal
 * on the requested tab ('cv' or 'portfolio').
 */
export function openDocumentViewer(tab: DocumentTab = 'cv') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<DocumentTab>('open-document-viewer', { detail: tab }));
  }
}
