import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(req).pipe(
      retry(3),
      map(res => {
        if (res instanceof HttpResponse) {
          return res;
        }
        return null;
      }),
      catchError((err: HttpErrorResponse) => {
        let errMsg = "";
        if (err.error instanceof ErrorEvent) { //Client-side error
          errMsg = `Error: ${err.message}`
        } else {
          errMsg = `Error Message:${err.message} Error Status: ${err.message} `
        }

        return throwError(() => Error(errMsg))
      })
    )
  }
}
