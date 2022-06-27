import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./../../services/auth/auth.service";
import { TokenStorageService } from "./../../services/token-storage/token-storage.service";
import { formValidator } from "./../../helpers/form-validator";

@Component({
  selector: "app-login",
  template: require("./login.component.html"),
})
export class LoginComponent implements OnInit {

  router: Router;
  authService: AuthService;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];
  tokenStorageService: TokenStorageService;
  constructor(@Inject(Router) router: Router, @Inject(AuthService) authService: AuthService, 
    @Inject(TokenStorageService) tokenStorageService: TokenStorageService) {
    this.router = router;
    this.authService = authService;
    this.tokenStorageService = tokenStorageService;
  }

  @ViewChild('password') password: any;

  errorMsg: string;
  fields: any;
  errors: any;
  onHandleSubmit: any;
  onHandleChange: any;
  onHandleBlur: any;

  initialState = {
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
    }
  };

  ngOnInit(): void {
    const { onHandleChange, onHandleSubmit, onHandleBlur, fields } = formValidator(this.initialState);
    this.onHandleSubmit = onHandleSubmit;
    this.onHandleBlur = onHandleBlur;
    this.onHandleChange = onHandleChange;
    this.fields = fields;
    this.errors = fields.errors;
  }

  onSubmit(event, obj) {
    event.preventDefault();
    if (this.onHandleSubmit(event)) {
      this.authService.login(obj)
        .subscribe(
          {
            next: data => {
              this.tokenStorageService.saveToken(data.accessToken);
              this.isLoginFailed = false;
              this.isLoggedIn = true;
              this.roles = this.tokenStorageService.getUser().roles;
              this.router.navigateByUrl("/home");
            },
            error: err => {
              this.tokenStorageService.signOut();
              // alert(err.error.message)
              this.errorMsg = err.error.message;

            }
          }
        );
      /* if (obj.email === 'admin@admin.com' && obj.password === 'deep@123') {
        console.log(obj);
        this.router.navigate(["home"]);
      }
      else {
        this.errorMsg = "Username or password is incorrect";
        this.password.nativeElement.focus();
      } */
    }
  }
}
/* export class LoginComponent implements OnInit {
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  roles: string[] = [];
  isLoginComponent = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    const { email, password } = this.form;
    this.authService.login(email, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigateByUrl("/");
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
} */
