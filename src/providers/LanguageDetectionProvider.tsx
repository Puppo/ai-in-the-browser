import { useCallback, useEffect, useRef, useState } from 'react';
import { LanguageDetectionContext } from '../contexts/LanguageDetectionContext';
import languageDetectionService from '../services/languageDetectionService';
import type { LanguageDetectionContextValue } from '../contexts/LanguageDetectionContext';
import type { ReactNode } from 'react';

type LanguageDetectionSupport = 'detecting' | 'detected' | 'unavailable';

interface LanguageDetectionProviderProps {
  readonly children: ReactNode;
  readonly autoInitialize?: boolean;
  readonly onError?: (error: Error) => void;
}

export function LanguageDetectionProvider({
  children,
  autoInitialize = true,
  onError
}: LanguageDetectionProviderProps) {
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [supportsLanguageDetection, setSupportsLanguageDetection] = useState<LanguageDetectionSupport>('detecting');
  
  const hasAutoInitialized = useRef(false);

  // Check availability on mount
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const support = await languageDetectionService.checkLanguageDetectionSupport();
        setSupportsLanguageDetection(support !== 'unavailable' ? 'detected' : 'unavailable');
      } catch (err) {
        console.error('Failed to check language detection support:', err);
        setSupportsLanguageDetection('unavailable');
        onError?.(err instanceof Error ? err : new Error('Failed to check language detection support'));
      }
    };
    
    checkSupport();
  }, [onError]);

  const initializeDetector = useCallback(async (): Promise<boolean> => {
    if (supportsLanguageDetection === 'unavailable') {
      return false;
    }
    
    if (supportsLanguageDetection === 'detecting') {
      console.log('Waiting for language detection support check to complete...');
      return false;
    }

    try {
      setDetectionError(null);
      return await languageDetectionService.initializeDetector();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize language detector';
      setDetectionError(errorMessage);
      console.error('Language detector initialization failed:', err);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return false;
    }
  }, [supportsLanguageDetection, onError]);

  // Auto-initialize if requested
  useEffect(() => {
    if (autoInitialize && supportsLanguageDetection === 'detected' && !hasAutoInitialized.current) {
      hasAutoInitialized.current = true;
      initializeDetector();
    }
  }, [autoInitialize, supportsLanguageDetection, initializeDetector]);

  const detectLanguage = useCallback(async (text: string): Promise<string> => {
    if (supportsLanguageDetection !== 'detected') {
      return 'en';
    }

    try {
      setIsDetecting(true);
      setDetectionError(null);

      const detectedLang = await languageDetectionService.detectLanguage(text);
      setDetectedLanguage(detectedLang);

      return detectedLang;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Language detection failed';
      setDetectionError(errorMessage);
      console.error('Recipe language detection failed:', err);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return 'en';
    } finally {
      setIsDetecting(false);
    }
  }, [supportsLanguageDetection, onError]);

  const value: LanguageDetectionContextValue = {
    detectedLanguage,
    isDetecting,
    detectionError,
    supportsLanguageDetection,
    detectLanguage,
    initializeDetector
  };

  return (
    <LanguageDetectionContext.Provider value={value}>
      {children}
    </LanguageDetectionContext.Provider>
  );
}