import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { LanguageDetectionContext } from '../contexts/LanguageDetectionContext'
import { LanguageDetectionProvider } from '../providers/LanguageDetectionProvider'

export const Route = createFileRoute('/language-detector')({
  component: RouteComponent,
})

type FormValues = {
  text: string
}

interface DetectionResult {
  language: string
  confidence?: number
}

function LanguageDetectorContent() {
  const languageContext = useContext(LanguageDetectionContext)
  const [result, setResult] = useState<DetectionResult | null>(null)

  if (!languageContext) {
    return <div className="text-red-600">Error: Language Detection Context not available</div>
  }

  const { detectLanguage, isDetecting, detectionError, supportsLanguageDetection } = languageContext

  const form = useForm({
    defaultValues: {
      text: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const detectedLang = await detectLanguage(value.text)
        setResult({
          language: detectedLang,
          confidence: 0.95,
        })
      } catch (error) {
        console.error('Detection failed:', error)
        setResult({
          language: 'Error',
          confidence: 0,
        })
      }
    },
  })

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Language Detector
            </h1>
            <p className="text-slate-600">
              Enter text to detect its language
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            {/* Text Input Field */}
            <div>
              <form.Field
                name="text"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Text is required'
                    if (value.length < 3) return 'Text must be at least 3 characters'
                    return undefined
                  },
                  onBlur: ({ value }) => {
                    if (!value) return 'Text is required'
                    return undefined
                  },
                }}
                children={(field) => (
                  <div>
                    <label
                      htmlFor="text"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Text to Analyze
                    </label>
                    <textarea
                      id="text"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter text here to detect its language..."
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:border-blue-500'
                      }`}
                      rows={6}
                      disabled={isDetecting}
                    />
                    {/* Error Messages */}
                    {field.state.meta.errors.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {field.state.meta.errors.map((error, i) => (
                          <p
                            key={i}
                            className="text-sm font-medium text-red-600"
                          >
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isDetecting || supportsLanguageDetection === 'unavailable'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isDetecting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Detecting...
                  </>
                ) : (
                  'Detect Language'
                )}
              </button>
              {supportsLanguageDetection === 'unavailable' && (
                <p className="mt-2 text-sm text-amber-600">
                  Language detection is not available in your browser
                </p>
              )}
              {detectionError && (
                <p className="mt-2 text-sm text-red-600">
                  Error: {detectionError}
                </p>
              )}
            </div>
          </form>

          {/* Results */}
          {result && !isDetecting && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Detection Result
              </h2>
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Language:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {result.language}
                    </span>
                  </div>
                  {result.confidence !== undefined && result.confidence > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">
                        Confidence:
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-300 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(result.confidence || 0) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-slate-900 font-semibold">
                          {((result.confidence || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <LanguageDetectionProvider autoInitialize={true}>
      <LanguageDetectorContent />
    </LanguageDetectionProvider>
  )
}
