import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null); //in object bedefault need to pass null //this is advance Observable //this is for token
  private isloggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); //default false

  get currentUser$(){ //converting behaviour into observable (not change the original data)
    return this.currentUser.asObservable();
  }

  get isLoggedIn$(){
    return this.isloggedIn.asObservable();
  }

  constructor(private router: Router) { }
  authLogin(res: any) {
    localStorage.setItem("userDetails", JSON.stringify(res));
    this.router.navigate(['dashboard/default']);
    this.currentUser.next(res);
    this.isloggedIn.next(true);
  }

  logout() {
    this.currentUser.next(null);
    this.isloggedIn.next(false);
  }
}

