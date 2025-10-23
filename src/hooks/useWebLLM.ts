import * as webllm from '@mlc-ai/web-llm'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '@/types/chat'

export interface UseWebLLMOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

export const AVAILABLE_MODELS = webllm.prebuiltAppConfig.model_list.map(({ model_id }) => model_id)

export function useWebLLM(options: UseWebLLMOptions = {}) {
  const { model = AVAILABLE_MODELS[0], temperature = 0.7, maxTokens = 512 } = options

  const engineRef = useRef<webllm.MLCEngine | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Initialize the engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        setIsLoading(true)
        setLoadingMessage('Initializing WebLLM...')

        // Create and initialize engine
        const engine = new webllm.MLCEngine()
        engineRef.current = engine

        // Set up progress callback
        engine.setInitProgressCallback((progress: webllm.InitProgressReport) => {
          setLoadingMessage(
            `Loading model: ${progress.text} (${progress.progress.toFixed(1)}%)`
          )
        })

        // Load the model
        await engine.reload(model)

        setIsInitialized(true)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        console.error('Failed to initialize WebLLM:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initEngine()

    return () => {
      // Cleanup is handled by the engine
    }
  }, [model])

  // Send a message and get response
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!engineRef.current || !isInitialized) {
        setError('Engine not initialized')
        return
      }

      if (!userMessage.trim()) {
        return
      }

      // Add user message to chat history
      const userId = Date.now().toString()
      const userMsg: ChatMessage = {
        id: userId,
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg])
      setIsGenerating(true)

      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      try {
        // Prepare the conversation history for context
        const conversationHistory = messages
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
          .concat([{ role: 'user' as const, content: userMessage }])

        // Call the chat completion API
        const response = await engineRef.current.chat.completions.create({
          messages: conversationHistory,
          model: model,
          temperature: temperature,
          max_tokens: maxTokens,
          stream: false,
        })

        // Extract the assistant's response
        const assistantMessage = response.choices[0]?.message?.content || 'No response'

        // Add assistant message to chat history
        const assistantId = Date.now().toString()
        const assistantMsg: ChatMessage = {
          id: assistantId,
          role: 'assistant',
          content: assistantMessage,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMsg])
        setError(null)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Request was cancelled')
          return
        }

        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        console.error('Error generating response:', err)

        // Remove the user message if generation failed
        setMessages((prev) => prev.filter((msg) => msg.id !== userId))
      } finally {
        setIsGenerating(false)
        abortControllerRef.current = null
      }
    },
    [engineRef.current, isInitialized, messages, model, temperature, maxTokens]
  )

  // Cancel ongoing generation
  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  // Get available models
  const getAvailableModels = useCallback(() => {
    return AVAILABLE_MODELS
  }, [])

  return {
    // State
    isLoading,
    isInitialized,
    error,
    loadingMessage,
    messages,
    isGenerating,

    // Methods
    sendMessage,
    cancelGeneration,
    clearMessages,
    getAvailableModels,

    // Current model
    currentModel: model,
  }
}
