# 🤖 AI in the Browser

A comprehensive showcase of modern browser-based AI capabilities, demonstrating how powerful AI models can run directly in your web browser without any server-side processing.

## 🚀 Overview

This project demonstrates four different AI capabilities that run entirely in your browser:

1. **WebLLM Chat** - Run large language models using WebAssembly and WebGPU
2. **Prompt API** - Interact with browser-native AI language models
3. **Translator** - Real-time language translation using browser APIs
4. **Language Detector** - Automatically detect the language of input text

All features leverage cutting-edge web technologies to provide private, fast, and offline-capable AI experiences.

## ✨ Features

### 🔮 WebLLM Chat

- Run open-source LLMs directly in your browser
- Powered by [MLC AI's WebLLM](https://github.com/mlc-ai/web-llm)
- Multiple model options (TinyLlama, Llama 2, Mistral, etc.)
- WebGPU acceleration for optimal performance
- Complete privacy - no data leaves your device

### 💬 Prompt API

- Use browser's built-in Prompt API
- Streaming responses for real-time interaction
- Markdown rendering with syntax highlighting
- Copy message functionality
- Customizable prompts and parameters

### 🌍 Translator

- Browser-native translation API
- Support for multiple languages
- Instant translation without server requests
- Clean, intuitive UI

### 🔍 Language Detector

- Automatic language detection
- Confidence scoring
- Supports text analysis in multiple languages
- Built on browser's native language detection API

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) with [TanStack Router](https://tanstack.com/router)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Libraries**:
  - [@mlc-ai/web-llm](https://www.npmjs.com/package/@mlc-ai/web-llm) - WebLLM for running LLMs
  - Browser native AI APIs (Prompt API, Translator API, Language Detector API)
- **Type Safety**: TypeScript
- **Code Quality**: ESLint & Prettier

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- A modern browser that supports:
  - WebGPU (for WebLLM) - Chrome/Edge 113+, Firefox 123+
  - Prompt API (experimental in Chrome Canary)
  - Translation API (Chrome/Edge)
  - Language Detector API (Chrome/Edge)

### Browser Compatibility Notes

- **WebLLM**: Requires WebGPU support (Chrome 113+, Edge 113+, Firefox 123+)
- **Prompt API**: Currently experimental - requires Chrome Canary with flags enabled
- **Translator API**: Available in Chrome 99+ and Edge 99+
- **Language Detector API**: Available in Chrome 99+ and Edge 99+

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Puppo/ai-in-the-browser.git
cd ai-in-the-browser
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### 5. Preview Production Build

```bash
npm run serve
# or
yarn serve
# or
pnpm serve
```

## 📁 Project Structure

```
ai-in-the-browser/
├── src/
│   ├── routes/              # Application routes
│   │   ├── index.tsx        # Home page
│   │   ├── web-llm.tsx      # WebLLM chat interface
│   │   ├── prompt-api.tsx   # Prompt API interface
│   │   ├── translator.tsx   # Translation interface
│   │   └── language-detector.tsx  # Language detection interface
│   ├── components/          # Reusable UI components
│   │   ├── ChatWindow.tsx   # Chat interface component
│   │   ├── Header.tsx       # App header
│   │   ├── LoadingState.tsx # Loading indicators
│   │   └── ModelSelector.tsx # LLM model selector
│   ├── hooks/               # Custom React hooks
│   │   ├── useWebLLM.ts     # WebLLM integration
│   │   ├── usePromptApi.ts  # Prompt API integration
│   │   ├── useTranslator.ts # Translator API integration
│   │   └── useLanguageDetection.ts # Language detector integration
│   ├── services/            # Business logic and API services
│   ├── providers/           # React context providers
│   ├── contexts/            # React contexts
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── docs/                    # Documentation
└── package.json
```

## 🎯 Usage

### WebLLM Chat

1. Navigate to `/web-llm`
2. Select a model from the sidebar (first time will download the model)
3. Wait for the model to load (this may take a few minutes on first run)
4. Start chatting with the AI!

**Note**: First-time model downloads can be large (500MB - 4GB depending on the model). The model is cached in your browser for subsequent uses.

### Prompt API

1. Navigate to `/prompt-api`
2. Check if the API is available in your browser
3. Type your prompt in the input field
4. Press Enter or click Send to get AI responses
5. Responses support Markdown formatting with syntax highlighting

### Translator

1. Navigate to `/translator`
2. Select source and target languages
3. Enter text to translate
4. Click the "Translate" button
5. View the translated result instantly

### Language Detector

1. Navigate to `/language-detector`
2. Enter text in any language
3. Click "Detect Language"
4. View the detected language with confidence score

## 🔧 Configuration

### Enabling Experimental Features

For features like Prompt API that are experimental, you may need to enable them in your browser:

#### Chrome/Edge Flags

1. Navigate to `chrome://flags` (or `edge://flags`)
2. Search for "Prompt API for Gemini Nano"
3. Enable the flag
4. Restart your browser

## 📜 Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier
- `npm run check` - Format and fix linting issues
- `npm test` - Run tests with Vitest

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [MLC AI](https://mlc.ai/) for WebLLM
- [TanStack](https://tanstack.com/) for amazing React libraries
- [Tailwind CSS](https://tailwindcss.com/) for styling
- The Chrome team for experimental AI APIs

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on [GitHub](https://github.com/Puppo/ai-in-the-browser/issues)
- Check the [documentation](https://github.com/Puppo/ai-in-the-browser/docs)

## 🌟 Show Your Support

If you find this project useful, please consider giving it a ⭐️ on GitHub!

---

**Note**: This is a demonstration project showcasing emerging browser AI capabilities. Some features are experimental and may not work in all browsers. Always check browser compatibility before deploying to production.
