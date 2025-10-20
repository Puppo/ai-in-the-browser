import { Info } from 'lucide-react'

interface ModelSelectorProps {
  availableModels: Array<string>
  currentModel: string
  onModelChange: (model: string) => void
  disabled?: boolean
}

export function ModelSelector({
  availableModels,
  currentModel,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  // Format model names for display
  const formatModelName = (model: string): string => {
    return model
      .replace(/-/g, ' ')
      .replace(/_q\d+.*$/, '')
      .replace(/_/g, ' ')
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <label className="block text-sm font-semibold text-white mb-3">
        Language Model
      </label>
      
      <div className="relative mb-3">
        <select
          value={currentModel}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {formatModelName(model)}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-600/50 rounded text-blue-200 text-xs">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Selected model runs entirely in your browser. First load will download the model weights
          (50-1000MB depending on the model).
        </p>
      </div>
    </div>
  )
}
