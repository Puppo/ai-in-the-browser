import { createContext } from 'react';

export interface TranslatorContextValue {
  initializeTranslator: (sourceLanguageCode: string, targetLanguageCode: string) => Promise<void>;
  retryTranslator: (sourceLanguageCode: string, targetLanguageCode: string) => Promise<void>;
  isTranslatorReady: (sourceLanguageCode: string, targetLanguageCode: string) => boolean;
  translate: (text: string, keys: {sourceLanguageCode: string, targetLanguageCode: string}) => Promise<string>
}

export const TranslatorContext = createContext<TranslatorContextValue | null>(null);