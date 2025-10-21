import { createContext } from 'react';

type LanguageDetectionSupport = 'detecting' | 'detected' | 'unavailable';

export interface LanguageDetectionContextValue {
  detectedLanguage: Array<LanguageDetectionResult> | null;
  isDetecting: boolean;
  detectionError: string | null;
  supportsLanguageDetection: LanguageDetectionSupport;
  detectLanguage: (text: string) => Promise<Array<LanguageDetectionResult>>;
  initializeDetector: () => Promise<boolean>;
}

export const LanguageDetectionContext = createContext<LanguageDetectionContextValue | null>(null);