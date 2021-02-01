import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreModule, Store } from '@ngrx/store';
import { AuthConfig, AUTH_CONFIG } from './auth.config';
import { AuthState, AuthActionType, authReducer } from './auth.reducer';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let injector: TestBed;
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: Store<AuthState>;

  const config: AuthConfig = {
    endpoint: 'http://www.test.com/auth',
    getUserInfoEndpoint: 'http://www.test.com/userInfo',
    logoutEndpoint: 'http://www.test.com/logout',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({ auth: authReducer })],
      providers: [AuthService, { provide: AUTH_CONFIG, useValue: config }],
    });

    injector = getTestBed();
    service = injector.inject(AuthService);
    httpMock = injector.inject(HttpTestingController);
    store = injector.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send login request', () => {
    const dummyResponse = {
      errorMesages: [],
      isUserAuthenticated: true,
      user_fullname: 'user',
      user_role: 'role',
      username: 'user',
    };

    spyOn(store, 'dispatch');

    service.login('domain', 'user', 'pass').subscribe({
      next: (response) => expect(response).toEqual(dummyResponse),
    });

    const req = httpMock.expectOne(`${config.endpoint}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    const action = { type: AuthActionType.Login, payload: dummyResponse };
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should send logout request', () => {
    const dummyResponse = {
      logout: true,
    };

    spyOn(store, 'dispatch');

    service.logout().subscribe({
      next: (response) => expect(response).toEqual(dummyResponse),
    });

    const req = httpMock.expectOne(`${config.logoutEndpoint}`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    expect(store.dispatch).toHaveBeenCalledWith({ type: AuthActionType.Logout });
  });

  it('send get user info', () => {
    const dummyResponse = {
      errorMesages: [],
      isUserAuthenticated: true,
      user_fullname: 'user',
      user_role: 'role',
      username: 'user',
    };

    service.getUserInfo().subscribe({
      next: (response) => expect(response).toEqual(dummyResponse),
    });

    const req = httpMock.expectOne(`${config.getUserInfoEndpoint}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
