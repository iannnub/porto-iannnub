import { useState } from 'react';

export type PerformanceTier = 'full' | 'lite' | 'static';

export function useDevicePerformanceTier(): PerformanceTier {
  const [tier] = useState<PerformanceTier>(() => {
    if (typeof window === 'undefined') {
      return 'static';
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return 'static';
    }

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) {
      return 'static';
    }

    if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2) {
      return 'lite';
    }

    return 'full';
  });

  return tier;
}
