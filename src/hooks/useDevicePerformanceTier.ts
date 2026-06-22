import { useState } from 'react';

export type PerformanceTier = 'full' | 'lite' | 'static';

export function useDevicePerformanceTier(): PerformanceTier {
  const [tier] = useState<PerformanceTier>(() => {
    let isWebGLAvailable = false;
    try {
      const canvas = document.createElement('canvas');
      isWebGLAvailable = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      // Ignore
    }

    if (!isWebGLAvailable) {
      return 'static';
    }

    // Force full tier for all devices as requested
    return 'full';
  });

  return tier;
}
