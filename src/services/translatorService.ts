class TranslatorService {
  private readonly languageTranslators = new Map<string, Translator>();
  private readonly translationCache = new Map<string, string>();

  get languageMap(): Record<string, Translator> {
    return Object.fromEntries(this.languageTranslators);
  }

  async isTranslationBetweenLanguagesSupported(
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    if (!('Translator' in self)) return 'unavailable';
    
    try {
      return await Translator.availability({ sourceLanguage, targetLanguage });
    } catch {
      return 'unavailable';
    }
  }

  setTranslator(languageCode: string, translator: Translator): void {
    this.languageTranslators.set(languageCode, translator);
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') return text;

    const cacheKey = `${text}|${targetLanguage}`;
    const cached = this.translationCache.get(cacheKey);
    if (cached) return cached;

    const translator = this.languageTranslators.get(targetLanguage);
    if (!translator) {
      throw new Error(`Translator not available for language: ${targetLanguage}`);
    }

    const translatedText = await translator.translate(text);
    this.translationCache.set(cacheKey, translatedText);
    return translatedText;
  }

  async translateArray(texts: Array<string>, targetLanguage: string): Promise<Array<string>> {
    if (targetLanguage === 'en') return texts;
    return Promise.all(texts.map(text => this.translateText(text, targetLanguage)));
  }

  translate(text: string, targetLanguage: string): Promise<string> {
    return this.translateText(text, targetLanguage);
  }
  
}

const translatorService = new TranslatorService();
export default translatorService;