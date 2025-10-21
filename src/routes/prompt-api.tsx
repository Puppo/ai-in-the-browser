import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, Loader, Send, Sparkles, Trash2 } from 'lucide-react'
import { memo, useState } from 'react'
import { usePromptApi } from '@/hooks/usePromptApi'
import { PromptApiProvider } from '@/providers/PromptApiProvider'
import { convertMarkdownToHtml } from '@/utils/markdown'

const MarkdownMessage = memo(function({ content }: { content: string }) {
  const html = convertMarkdownToHtml(content)

  return (
    <div 
      className="prose prose-invert prose-sm max-w-none prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-600"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
})

export const Route = createFileRoute('/prompt-api')({
  component: () => (
    <PromptApiProvider>
      <RouteComponent />
    </PromptApiProvider>
  ),
})

function RouteComponent() {
  const {
    messages,
    availability,
    isInitializing,
    isResponding,
    error,
    sendMessageStreaming,
    clearMessages,
    clearError,
  } = usePromptApi()

  const [prompt, setPrompt] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleSendPrompt = async () => {
    if (prompt.trim() && !isResponding) {
      const message = prompt
      setPrompt('')
      await sendMessageStreaming(message)
    }
  }

  const handleClearMessages = () => {
    clearMessages()
    clearError()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isResponding) {
      e.preventDefault()
      handleSendPrompt()
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <section className="border-b border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Prompt API Chat
            </h1>
          </div>
          <p className="text-lg text-slate-300">
            Interact with a language model using customizable prompts
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar - Configuration */}
            <div className="md:col-span-1 space-y-4">
              {/* Info Card */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">How It Works</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">1.</span>
                    <span>Enter your prompt in the input field</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">2.</span>
                    <span>The AI model processes your request</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">3.</span>
                    <span>The LLM processes your request</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-400 font-bold">4.</span>
                    <span>Receive AI-generated responses</span>
                  </li>
                </ul>
              </div>

              {/* Stats Card */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Status</h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Availability:</span>
                    <span className={`font-semibold ${
                      availability === 'available' ? 'text-green-400' :
                      availability === 'downloading' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {availability === 'available' ? 'Ready' :
                       availability === 'downloading' ? 'Downloading...' :
                       'Unavailable'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-yellow-400 font-semibold">
                      {isInitializing ? 'Initializing...' : isResponding ? 'Responding...' : 'Ready'}
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
              <div className="flex flex-col h-[600px] bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                  <h2 className="text-lg font-semibold text-white">Conversation</h2>
                  {messages.length > 0 && (
                    <button
                      onClick={handleClearMessages}
                      disabled={isResponding}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Clear messages"
                    >
                      <Trash2 className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {error && (
                    <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  )}
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Sparkles className="w-12 h-12 mb-4 text-slate-600" />
                      <p className="text-center">
                        {availability === 'unavailable' 
                          ? 'Prompt API is not available in this browser'
                          : availability === 'downloading'
                          ? 'Downloading AI model... Please wait.'
                          : 'Enter a prompt below to start a conversation with the AI'
                        }
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-purple-600 text-white rounded-br-none'
                              : 'bg-slate-700 text-slate-100 rounded-bl-none'
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {message.role === 'user' ? (
                              <div className="whitespace-pre-wrap wrap-break-word">{message.content}</div>
                            ) : (
                              <MarkdownMessage content={message.content} />
                            )}
                          </div>
                          <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="mt-2 flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {isResponding && messages.length > 0 && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                          <span className="text-sm text-slate-300">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-700 bg-slate-800 p-4">
                  <div className="flex gap-2">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your prompt here... (Shift+Enter for new line)"
                      disabled={isResponding || availability !== 'available'}
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleSendPrompt}
                      disabled={!prompt.trim() || isResponding || availability !== 'available'}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
                    >
                      {isResponding ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">About Prompt API</h3>
              <p className="text-sm text-slate-300">
                This interface uses the browser's built-in Prompt API to interact with language models.
                The model runs entirely in your browser for privacy and speed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Tips for Better Prompts</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Be specific and clear about what you want</li>
                <li>• Provide context when necessary</li>
                <li>• Use examples to guide the model's responses</li>
                <li>• Iterate on prompts to refine results</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
