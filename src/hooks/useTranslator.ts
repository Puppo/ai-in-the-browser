import { useContext } from 'react';
import { TranslatorContext } from '../contexts/TranslatorContext';

export function useTranslator() {
  const context = useContext(TranslatorContext);

  if (!context) {
    throw new Error('useTranslator must be used within a TranslatorProvider');
  }

  return context;
}