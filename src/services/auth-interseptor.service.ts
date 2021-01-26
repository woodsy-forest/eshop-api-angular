import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterseptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getToken() != null) {
      if (environment.debug_mode) {
        console.log("intercept with token=" + this.authService.getToken());
      }

      let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.authService.getToken());

      const clone = req.clone({headers});

      return next.handle(clone);
    }


    // otherwise return the normal request with no token
    if (environment.debug_mode) {
      console.log('intersept with no token');
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const cloneNoToken = req.clone({headers});
    return next.handle(cloneNoToken);

  }


}
