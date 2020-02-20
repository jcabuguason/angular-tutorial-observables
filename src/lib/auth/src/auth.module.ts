import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { authReducer, authReducerKey } from './auth.reducer';

@NgModule({
  imports: [CommonModule, HttpClientModule, StoreModule.forFeature(authReducerKey, authReducer)],
  providers: [AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
})
export class AuthModule {}
