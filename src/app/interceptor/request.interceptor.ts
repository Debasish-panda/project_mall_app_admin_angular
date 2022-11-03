import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private _authservice:AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let request:any;
    let currentUser:any;
    let isLoggedIn:boolean;
   this._authservice.isLoggedIn$.subscribe(res=>{
    isLoggedIn = res;
    if(isLoggedIn){
      this._authservice.currentUser$.subscribe(res=>{
        currentUser = res;
        request = req.clone({ //here we created a clone and we will forward the request
          setHeaders:{
            'Authorization' : `Bearer ${currentUser.token}`
          }
        }) 
      })
    }
    });
    return next.handle(request != undefined ? request : req); //to handle the request and it will forward //if not equal to undefined then request else req will return
  }
}
