import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService, JWT_KEY_LOCAL_STORAGE} from '../services/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const item = localStorage.getItem(JWT_KEY_LOCAL_STORAGE);
    if (item) {
      const currentUser = JSON.parse(item);
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
      }
    }
    // const currentUser = this.authenticationService.currentUserValue;


    return next.handle(request);
  }
}
