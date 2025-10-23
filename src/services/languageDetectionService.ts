export class LanguageDetectionService {
  private detector: LanguageDetector | null = null;
  private initPromise: Promise<void> | null = null;

  async checkLanguageDetectionSupport(): Promise<Availability> {
    if (!('LanguageDetector' in self)) {
      return 'unavailable';
    }

    try {
      return await LanguageDetector.availability();
    } catch {
      return 'unavailable';
    }
  }

  async initializeDetector(): Promise<boolean> {
    // Already initialized
    if (this.detector) return true;

    // Already initializing
    if (this.initPromise) {
      await this.initPromise;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      return this.detector !== null;
    }

    // Start initialization
    this.initPromise = this.doInitialize();
    await this.initPromise;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return this.detector !== null;
  }

  private async doInitialize(): Promise<void> {
    const support = await this.checkLanguageDetectionSupport();
    
    if (support === 'unavailable') {
      throw new Error('Language detection is not available in this browser');
    }

    this.detector = await LanguageDetector.create({
      monitor: (monitor) => {
        monitor.addEventListener('downloadprogress', (event) => {
          console.log(`LanguageDetector download progress: ${event.loaded} / ${event.total}`);
        });
      }
    });
  }

  private normalizeLanguageCode(langCode: string): string {
    // Normalize Chinese variants to 'zh'
    if (langCode.startsWith('zh')) return 'zh';
    
    // Extract base language code (e.g., 'en-US' -> 'en')
    return langCode.split('-')[0].toLowerCase();
  }

  async detectLanguage(text: string): Promise<Array<LanguageDetectionResult>> {
    try {
      await this.initializeDetector();

      return (await this.detector?.detect(text))?.filter(result => (result.confidence ?? 0) > 0.4) ?? [];
    } catch (error) {
      console.error('Recipe language detection failed:', error);
      return []
    }
  }

  detectBrowserLanguage(): string {
    const browserLang = navigator.language || navigator.languages[0];
    
    if (browserLang) {
      const normalized = this.normalizeLanguageCode(browserLang);
      console.log(`Browser language detected: ${browserLang} -> ${normalized}`);
      return normalized;
    }

    return 'en';
  }
}

const languageDetectionService = new LanguageDetectionService();
export default languageDetectionService;