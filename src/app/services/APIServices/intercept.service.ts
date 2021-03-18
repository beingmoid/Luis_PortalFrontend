import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import store from 'store';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../alert.service';
import { Router } from '@angular/router';
import { AuthService } from '../jwt/auth.service';
import { LoaderService } from '../loader.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptService implements HttpInterceptor {
  constructor(
    private alert: AlertService,
    private router: Router,
    private auth: AuthService,
    private _loaderService: LoaderService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const user = this.auth.userValue;
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken != null && typeof accessToken != "undefined" && refreshToken != null) {

      if (request.url.includes('Roles/CheckRole') || request.url.includes('auth/CheckEmail') || request.url.includes('auth/CheckIsUserEligibleForNewPswd') || request.url.includes('Audit'))
        this._loaderService.loaderSubject.next(false);
      else
        this._loaderService.loaderSubject.next(true);

      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${accessToken}`,
          'RefreshToken': `${refreshToken}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Accept-Encoding, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name',
          'Access-Control-Allow-Methods': 'POST,GET,PUT,PATCH,DELETE,OPTIONS',
        },
      });
    }
    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.newAccessToken !== null) {
            let token = event.body.newAccessToken
            if (token && token !== null)
              localStorage.setItem("accessToken", token);
          }
        }

        return event;
      }),
      finalize(() => {
        this._loaderService.loaderSubject.next(false);
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
          this.alert.error(errorMsg)
        }
        else {
          console.log('this is server side error');
          console.log(error.error);
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          if (error.status === 401) {
            this.auth.logoutUnAuthorizedUser();
            return;
          }
          // this.alert.error(errorMsg)

        }
        return throwError(errorMsg);
      })

    )
  }
}
