import { createContext } from 'react';

export interface TranslationStatus {
  language: string;
  languageCode: string;
  flag: string;
  status: 'idle' | 'checking' | 'downloading' | 'ready' | 'error';
  progress?: number;
  error?: string;
  downloadSize?: string;
  estimatedTime?: string;
  dismissed?: boolean;
}

export interface TranslatorContextValue {
  translations: Array<TranslationStatus>;
  initializeTranslator: (languageCode: string) => Promise<void>;
  retryTranslator: (languageCode: string) => Promise<void>;
  dismissNotification: (languageCode: string) => void;
  clearAllNotifications: () => void;
  isTranslatorReady: (languageCode: string) => boolean;
  getTranslationProgress: (languageCode: string) => number;
}

export const TranslatorContext = createContext<TranslatorContextValue | null>(null);