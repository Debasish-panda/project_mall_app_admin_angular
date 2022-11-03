import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private  _authservice:AuthService, private router:Router){
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this._authservice.isLoggedIn$.pipe( //here isLoggedIn we are using like a property not a function.
        map((_isLoggedIn:boolean)=>{
          if(!_isLoggedIn){
            this.router.navigate(['auth/login'])
            return false;
          }
          else{
            return true;
          }
        })
      )
  }
  
}
