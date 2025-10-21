import { createContext } from 'react';
import type { ChatMessage } from '@/providers/PromptApiProvider';

export interface PromptApiContextValue {
  messages: Array<ChatMessage>;
  availability: Availability;
  isInitializing: boolean;
  isResponding: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  sendMessageStreaming: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
  initializeSession: (options?: LanguageModelCreateOptions) => Promise<boolean>;
  destroySession: () => void;
}

export const PromptApiContext = createContext<PromptApiContextValue | null>(null);