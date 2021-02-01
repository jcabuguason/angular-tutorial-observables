import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable()
export class LanguageService {
  static translator: TranslateService = null;
  private isEnglish = true;

  constructor(public translate: TranslateService, private config: PrimeNGConfig) {
    LanguageService.translator = translate;
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(this.findBrowserLang());
  }

  toggleLanguage() {
    this.isEnglish = !this.isEnglish;
    this.translate.use(this.langCode());
    this.translate.get('PRIMENG').subscribe({
      next: (translation) => this.config.setTranslation(translation),
    });
  }

  langBool() {
    return this.isEnglish;
  }

  langCode() {
    return this.isEnglish ? 'en' : 'fr';
  }

  findBrowserLang() {
    const browserLang = this.translate.getBrowserLang();
    if (browserLang === 'fr') {
      this.isEnglish = false;
    }

    return this.langCode();
  }
}
