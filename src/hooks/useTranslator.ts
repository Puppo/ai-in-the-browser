import { useContext } from 'react';
import { TranslatorStatusContext } from '../contexts/TranslationStatusContext';

export function useTranslator() {
  const context = useContext(TranslatorStatusContext);

  if (!context) {
    throw new Error('useTranslator must be used within a TranslatorStatusProvider');
  }

  return context;
}