import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { selectAuthState, AuthState } from './auth.reducer';
import { AuthConfig, AUTH_CONFIG } from './auth.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(AUTH_CONFIG)
    private config: AuthConfig,
    private store: Store<AuthState>
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method === 'POST' && request.url !== this.config.endpoint) {
      return this.store.select(selectAuthState).pipe(
        take(1),
        map(authInfo => {
          return request.clone({
            setHeaders: {
              username: authInfo.username,
            },
          });
        }),
        switchMap(req => next.handle(req))
      );
    } else {
      return next.handle(request);
    }
  }
}
