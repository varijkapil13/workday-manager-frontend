import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../services/authentication.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
    .handle(request)
    .pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 0) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
      }
      const error = err && err.error && err.error.reason ? err.error.reason : err.statusText;
      return of(new HttpResponse({status: err.status, statusText: error}));
    }));
  }
}
