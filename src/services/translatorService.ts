interface TranslatorKey {
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
}

export class TranslatorService {
  private readonly languageTranslators = new Map<`${string}-${string}`, Translator>();

  get languageMap(): Partial<Record<`${string}-${string}`, Translator>> {
    return Object.fromEntries(this.languageTranslators);
  }

  async isTranslationBetweenLanguagesSupported(
    keys: TranslatorKey
  ): Promise<string> {
    if (!('Translator' in self)) return 'unavailable';
    
    try {
      return await Translator.availability(keys);
    } catch {
      return 'unavailable';
    }
  }

  setTranslator({ sourceLanguage, targetLanguage }: TranslatorKey, translator: Translator): void {
    this.languageTranslators.set(`${sourceLanguage}-${targetLanguage}`, translator);
  }

  async loadTranslator({ sourceLanguage, targetLanguage }: TranslatorKey): Promise<Translator | null> {
    const translator = this.languageTranslators.get(`${sourceLanguage}-${targetLanguage}`) || null;
    if (translator) return translator;
    const newTranslator = await Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor: (monitor) => {
        monitor.addEventListener('downloadprogress', (event) => {
          console.log(`Translator download progress: ${event.loaded} / ${event.total}`);
        });
      },
    });
    this.setTranslator({ sourceLanguage, targetLanguage }, newTranslator);
    return newTranslator;
  }

  async translateText(text: string, { sourceLanguage, targetLanguage }: TranslatorKey): Promise<string> {
    const translator = this.languageTranslators.get(`${sourceLanguage}-${targetLanguage}`);
    if (!translator) {
      throw new Error(`Translator not available for language: ${targetLanguage}`);
    }

    const translatedText = await translator.translate(text);
    return translatedText;
  }

  translate(text: string, keys: TranslatorKey): Promise<string> {
    console.log('Translating text with keys:', keys);
    return this.translateText(text, keys);
  }
  
}

const translatorService = new TranslatorService();
export default translatorService;