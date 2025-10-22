import { useCallback } from 'react';
import { languages } from '../constants/languages';
import { TranslatorContext } from '../contexts/TranslatorContext';
import translatorService from '../services/translatorService';
import type { TranslatorContextValue } from '../contexts/TranslatorContext';
import type { ReactNode } from 'react';

interface TranslationStatusProviderProps {
  readonly children: ReactNode;
  readonly onError?: (error: Error, languageCode: string) => void;
}

export function TranslationProvider({
  children,
  onError
}: TranslationStatusProviderProps) {

  const initializeTranslator = useCallback(async (sourceLanguageCode: string, targetLanguageCode: string) => {
    if (translatorService.languageMap[`${sourceLanguageCode}-${targetLanguageCode}`]) {
      return;
    }

    const language = languages.find(l => l.code === targetLanguageCode);
    if (!language) return;
    
    try {
      const availability = await translatorService.isTranslationBetweenLanguagesSupported({ sourceLanguage: sourceLanguageCode, targetLanguage: targetLanguageCode });

      if (availability === 'unavailable') {
        const errorMsg = 'Translation not supported for this language';
        console.warn(`Translation from ${sourceLanguageCode} to ${targetLanguageCode} is not supported ${availability}.`);
        onError?.(new Error(errorMsg), targetLanguageCode);
        return;
      }

      await translatorService.loadTranslator({ sourceLanguage: sourceLanguageCode, targetLanguage: targetLanguageCode });

    } catch (err) {
      console.error(`Failed to initialize translator for ${sourceLanguageCode} to ${targetLanguageCode}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      onError?.(err instanceof Error ? err : new Error(errorMessage), targetLanguageCode);
    }
  }, [onError]);

  const retryTranslator = useCallback((sourceLanguageCode: string, targetLanguageCode: string) => initializeTranslator(sourceLanguageCode, targetLanguageCode), [initializeTranslator]);

  const isTranslatorReady = useCallback((sourceLanguageCode: string, targetLanguageCode: string) => {
    return !!translatorService.languageMap[`${sourceLanguageCode}-${targetLanguageCode}`];
  }, []);

  const translate = useCallback(async (text: string, {
    sourceLanguageCode,
    targetLanguageCode
  }: {sourceLanguageCode: string, targetLanguageCode: string}): Promise<string> => {
    return (await translatorService.languageMap[`${sourceLanguageCode}-${targetLanguageCode}`]?.translate(text)) ?? ''
  }, [])

  const value: TranslatorContextValue = {
    initializeTranslator,
    retryTranslator,
    isTranslatorReady,
    translate
  };

  return (
    <TranslatorContext.Provider value={value}>
      {children}
    </TranslatorContext.Provider>
  );
}