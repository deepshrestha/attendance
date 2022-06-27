import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

const TOKEN_KEY = "auth-token";

@Injectable({
  providedIn: "root"
})
export class TokenStorageService {
  router: Router;
  constructor(@Inject(Router) router: Router) {
    this.router = router;
  }

  signOut() {
    window.localStorage.clear();
  }

  saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  getUser(): any {
    if(this.getToken()){
      const userDetailsPayload = this.getToken().split('.')[1];
      if(userDetailsPayload){
        const user = window.atob(userDetailsPayload);
        if (user) {
          return JSON.parse(user);
        }
      }else {
        this.signOut();
        this.router.navigateByUrl("/login");
      }
      return {};
    } else {
      this.signOut();
      this.router.navigateByUrl("/login");
    }
    
  }
}
