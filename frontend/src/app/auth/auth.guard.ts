import { Injectable, Inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./../services/auth/auth.service";
import { TokenStorageService } from "./../services/token-storage/token-storage.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  tokenService: TokenStorageService;
  router: Router;

  constructor(
    @Inject(TokenStorageService) tokenService: TokenStorageService,
    @Inject(Router) router: Router
  ) {
    this.tokenService = tokenService;
    this.router = router;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.tokenService.getToken()) {
      this.tokenService.signOut();
      this.router.navigateByUrl("/login");
      return false;
    }
    if (JSON.stringify(route.data) !== "{}") {
      let userRoles = this.tokenService.getUser().roles;
      if (!userRoles.includes(route.data["role"])) {
        this.router.navigateByUrl("/login");
        return false;
      }
    }

    return true;
  }
}
