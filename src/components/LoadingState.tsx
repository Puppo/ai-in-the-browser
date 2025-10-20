import { AlertCircle, Download } from 'lucide-react'

interface LoadingStateProps {
  loadingMessage: string
  error: string | null
}

export function LoadingState({ loadingMessage, error }: LoadingStateProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Model</h3>
          <p className="text-slate-300 mb-4">{error}</p>
          <p className="text-sm text-slate-400">
            Please check your browser console for more details and try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full animate-spin opacity-75"></div>
          <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
            <Download className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Loading WebLLM</h3>
        <p className="text-slate-300">{loadingMessage}</p>
        <div className="mt-4">
          <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          This may take a few minutes on first load as the model is downloaded to your browser.
        </p>
      </div>
    </div>
  )
}
