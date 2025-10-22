import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { languages } from '../constants/languages'
import { TranslationProvider } from '../providers/TranslatorProvider'
import { useTranslator } from '@/hooks/useTranslator'

export const Route = createFileRoute('/translator')({
  component: RouteComponent,
})

function TranslatorContent() {
  const { initializeTranslator, isTranslatorReady, translate } = useTranslator()
  const [translatedText, setTranslatedText] = useState<string>('')
  const [isTranslating, setIsTranslating] = useState<boolean>(false)
  const [translationError, setTranslationError] = useState<string>('')

  const form = useForm({
    defaultValues: {
      text: '',
      sourceLanguage: 'en',
      targetLanguage: 'es',
    },
    onSubmit: async ({ value }) => {
      setIsTranslating(true)
      setTranslationError('')
      
      try {
        // Initialize translator if not ready
        if (!isTranslatorReady(value.sourceLanguage, value.targetLanguage)) {
          await initializeTranslator(value.sourceLanguage, value.targetLanguage)
        }

        // Perform translation
        const result = await translate(value.text, { sourceLanguageCode: value.sourceLanguage, targetLanguageCode: value.targetLanguage })
        setTranslatedText(result)
      } catch (error) {
        console.error('Translation failed:', error)
        const errorMsg = error instanceof Error ? error.message : 'Translation failed. Please try again.'
        setTranslationError(errorMsg)
        setTranslatedText('')
      } finally {
        setIsTranslating(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              AI Translator
            </h1>
            <p className="text-slate-600">
              Translate text between different languages
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
            {/* Language Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Language */}
              <form.Field
                name="sourceLanguage"
                children={(field) => (
                  <div>
                    <label
                      htmlFor="sourceLanguage"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Source Language
                    </label>
                    <select
                      id="sourceLanguage"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      disabled={isTranslating}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />

              {/* Target Language */}
              <form.Field
                name="targetLanguage"
                children={(field) => (
                  <div>
                    <label
                      htmlFor="targetLanguage"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Target Language
                    </label>
                    <select
                      id="targetLanguage"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      disabled={isTranslating}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />
            </div>

            {/* Text Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source Text Input */}
              <form.Field
                name="text"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Text is required'
                    if (value.length < 1) return 'Text must be at least 1 character'
                    return undefined
                  },
                }}
                children={(field) => (
                  <div>
                    <label
                      htmlFor="text"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Text to Translate
                    </label>
                    <textarea
                      id="text"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Enter text to translate..."
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-300 focus:border-blue-500'
                      }`}
                      rows={8}
                      disabled={isTranslating}
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

              {/* Translated Text Output */}
              <div>
                <label
                  htmlFor="translatedText"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Translation
                </label>
                <textarea
                  id="translatedText"
                  value={translatedText}
                  readOnly
                  placeholder="Translation will appear here..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 bg-slate-50 focus:outline-none transition-colors"
                  rows={8}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isTranslating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isTranslating ? (
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
                    Translating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    Translate
                  </>
                )}
              </button>
              {translationError && (
                <p className="mt-2 text-sm text-red-600">
                  Error: {translationError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <TranslationProvider>
      <TranslatorContent />
    </TranslationProvider>
  )
}