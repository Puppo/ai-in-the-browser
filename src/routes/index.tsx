import { createFileRoute } from '@tanstack/react-router'
import { Brain, Layers, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Main Hero Section */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Badge */}
          <div className="mb-8 inline-block">
            <span className="px-4 py-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm font-semibold text-blue-300">
              🚀 The Future is Here
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-7xl md:text-8xl font-black text-white mb-6 [letter-spacing:-0.02em] leading-tight">
            AI in the Browser
          </h1>
          
          {/* Subtitle with Question */}
          <p className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Am I Still Waiting for It?
          </p>
          
          {/* Descriptive Text */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 font-light leading-relaxed">
            Explore the revolutionary world of AI running directly in your browser—no server required, unlimited possibilities.
          </p>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Discover how WebAssembly, modern JavaScript, and cutting-edge ML models are transforming the web platform into a powerful AI runtime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-600/50 hover:shadow-blue-600/75 text-lg"
            >
              Begin the Journey
            </button>
            <button
              className="px-8 py-4 border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 font-bold rounded-lg transition-all text-lg"
            >
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="mb-4 inline-block p-3 bg-blue-500/20 rounded-lg">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">True Intelligence</h3>
              <p className="text-gray-400">
                Run sophisticated ML models directly in the browser with WebAssembly and modern APIs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="mb-4 inline-block p-3 bg-purple-500/20 rounded-lg">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">
                Zero latency, instant responses—AI that runs at the speed of JavaScript.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-pink-500/20 hover:border-pink-500/50 transition-all hover:shadow-lg hover:shadow-pink-500/20">
              <div className="mb-4 inline-block p-3 bg-pink-500/20 rounded-lg">
                <Layers className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Full Control</h3>
              <p className="text-gray-400">
                Own your data, control your models—privacy-first AI on the edge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent"></div>

      {/* Highlight Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            The Wait is <span className="bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Over</span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            From text generation to image processing, from real-time data analysis to interactive AI experiences—
            everything you've been waiting for is now possible right in your web browser.
          </p>
        </div>
      </section>
    </div>
  )
}
