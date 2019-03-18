// Basically this, but for Angular 5
// https://github.com/denniske/ngx-translate-multi-http-loader

import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable ,  forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import merge from 'deepmerge';

export interface ITranslationResource {
  prefix: string;
  suffix: string;
}

export class CombinedHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private resources: ITranslationResource[]) {}

  public getTranslation(lang: string): Observable<any> {
    const requests = this.resources.map(resource => {
      return this.http.get(resource.prefix + lang + resource.suffix);
    });
    return forkJoin(requests).pipe(map(response => merge.all(response)));
  }
}
