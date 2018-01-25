import { Injectable, Inject, APP_INITIALIZER } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import CryptoJS from 'crypto-js';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AuthActionType, AuthState } from './auth.reducer';
import { AUTH_CONFIG, AuthConfig } from './auth.config';
import { AuthResponse } from './auth-response.interface';

@Injectable()
export class AuthService {

  constructor(
    @Inject(AUTH_CONFIG)
    private config: AuthConfig,
    private http: HttpClient,
    private store: Store<AuthState>
  ) { }

  login(domain: string, username: string, password: string): Observable<AuthResponse> {

    const body = {
      'domain': domain,
      'username': username,
      'password': password
    };

    const key = CryptoJS.SHA256('secret1');
    // base64 is 6 bits per digit, need 16 bytes for php
    const iv = CryptoJS.enc.Base64.parse(this.makeID(22));
    const encryptedBody = CryptoJS.AES.encrypt(JSON.stringify(body), key, {iv: iv});

    const payload = encryptedBody.ciphertext.toString(CryptoJS.enc.Base64) + ':' + encryptedBody.iv.toString(CryptoJS.enc.Base64);

    return this.http.post<AuthResponse>(`${this.config.endpoint}`, payload)
      .pipe(
        map((response) => {
          this.store.dispatch({type: AuthActionType.LOGIN, payload: response});
          return response;
        })
      );
  }

  logout() {
    this.store.dispatch({type: AuthActionType.LOGOUT});
  }

  private makeID(length: number) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const text = Array.from({length}, () => Math.floor(Math.random() * possible.length))
      .map(rand => possible.charAt(rand))
      .join('');

    return text;
  }
}
