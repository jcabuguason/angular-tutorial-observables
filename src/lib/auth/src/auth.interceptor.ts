import { Injectable, Injector, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { selectAuthState, AuthState } from './auth.reducer';
import { AuthConfig, AUTH_CONFIG } from './auth.config';

@Injectable()
export class AuthInterceptor implements  HttpInterceptor {

  constructor(
    @Inject(AUTH_CONFIG)
    private config: AuthConfig,
    private store: Store<AuthState>
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method === 'POST' && request.url !== this.config.endpoint) {
      return this.store.select(selectAuthState)
      .pipe(
        map((authInfo) => {
          return request.clone({
            setHeaders: {
              'username': authInfo.username,
              'DMS-Local-Auth': authInfo.localHostKey['DMS-Local-Auth']
            }
          });
        }),
        switchMap((req) => next.handle(req))
      );
    } else {
      return next.handle(request);
    }
  }
}
