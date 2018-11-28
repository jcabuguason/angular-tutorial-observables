import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './language.service';

@NgModule({
  exports: [
    TranslateModule
  ],
  providers: [
    LanguageService,
  ]
})
export class LanguageModule { }
