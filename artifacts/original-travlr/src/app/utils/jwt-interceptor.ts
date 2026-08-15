import { Injectable, Provider } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    let isAuthAPI: boolean;

    if (
      request.url.startsWith('login') ||
      request.url.startsWith('register')
    ) {
      isAuthAPI = true;
    } else {
      isAuthAPI = false;
    }

    if (this.authenticationService.isLoggedIn() && !isAuthAPI) {

      let token = this.authenticationService.getToken();

      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(authReq);
    }

    return next.handle(request);
  }
}
