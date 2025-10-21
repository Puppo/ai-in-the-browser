import { createContext } from 'react';

type LanguageDetectionSupport = 'detecting' | 'detected' | 'unavailable';

export interface LanguageDetectionContextValue {
  detectedLanguage: string | null;
  isDetecting: boolean;
  detectionError: string | null;
  supportsLanguageDetection: LanguageDetectionSupport;
  detectLanguage: (text: string) => Promise<string>;
  initializeDetector: () => Promise<boolean>;
}

export const LanguageDetectionContext = createContext<LanguageDetectionContextValue | null>(null);