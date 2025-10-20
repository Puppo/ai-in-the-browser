import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChatWindow } from '../components/ChatWindow'
import { LoadingState } from '../components/LoadingState'
import { ModelSelector } from '../components/ModelSelector'
import { AVAILABLE_MODELS, useWebLLM } from '../hooks/useWebLLM'

export const Route = createFileRoute('/web-llm')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0])
  const {
    isLoading,
    isInitialized,
    error,
    loadingMessage,
    messages,
    isGenerating,
    sendMessage,
    clearMessages,
    getAvailableModels,
  } = useWebLLM({
    model: selectedModel,
    temperature: 0.7,
    maxTokens: 512,
  })

  const handleModelChange = (newModel: string) => {
    if (!isGenerating) {
      setSelectedModel(newModel)
      clearMessages()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            WebLLM Chat
          </h1>
          <p className="text-lg text-slate-300">
            Run a large language model directly in your browser using WebAssembly
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar - Model Selector & Info */}
            <div className="md:col-span-1 space-y-4">
              <ModelSelector
                availableModels={getAvailableModels()}
                currentModel={selectedModel}
                onModelChange={handleModelChange}
                disabled={isLoading || isGenerating}
              />

              {/* Info Card */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">How It Works</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">1.</span>
                    <span>Model is downloaded to your browser</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span>Runs entirely on your device using WebAssembly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">3.</span>
                    <span>No data sent to any server - complete privacy</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 font-bold">4.</span>
                    <span>Instant responses at the speed of your device</span>
                  </li>
                </ul>
              </div>

              {/* Stats Card */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Status</h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={
                        isInitialized
                          ? 'text-green-400 font-semibold'
                          : 'text-yellow-400 font-semibold'
                      }
                    >
                      {isLoading ? 'Loading...' : isInitialized ? 'Ready' : 'Error'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="text-blue-400 font-semibold text-right">
                      {selectedModel
                        .replace(/-/g, ' ')
                        .replace(/_q\d+.*$/, '')
                        .replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Messages:</span>
                    <span className="text-purple-400 font-semibold">{messages.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="h-96 md:h-full min-h-96">
                  <LoadingState loadingMessage={loadingMessage} error={error} />
                </div>
              ) : (
                <ChatWindow
                  messages={messages}
                  isGenerating={isGenerating}
                  error={error}
                  onSendMessage={sendMessage}
                  onClearMessages={clearMessages}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">About WebLLM</h3>
              <p className="text-sm text-slate-300">
                WebLLM is a framework for running large language models efficiently in the
                browser using WebAssembly and WebGPU. It's built by the MLC AI team and
                enables truly private, on-device AI inference.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Performance Tips</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Smaller models (TinyLlama) are faster but less capable</li>
                <li>• Larger models provide better quality but use more memory</li>
                <li>• GPU acceleration (WebGPU) is used when available</li>
                <li>• Keep this tab active for best performance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
