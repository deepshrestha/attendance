import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { TokenStorageService } from "../../services/token-storage/token-storage.service";
import { Router } from "@angular/router";
import { MyProfileService } from "./../my-profile/my-profile.service";

@Component({
  selector: "app-sidebar",
  template: require("./sidebar.component.html"),
  providers: [MyProfileService],
})
export class SidebarComponent implements OnInit, OnDestroy {
  slug: String;
  activatedRoute: ActivatedRoute;
  tokenStorageService: TokenStorageService;
  router: Router;
  userFullName: String;
  hasApproverRole: boolean;
  currentRole: any;
  subscribeData: Subscription;
  myProfileService: MyProfileService;

  @Input("image") image: any;

  constructor(
    @Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
    @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
    @Inject(MyProfileService) myProfileService: MyProfileService,
    @Inject(Router) router: Router
  ) {
    this.activatedRoute = activatedRoute;
    this.tokenStorageService = tokenStorageService;
    this.myProfileService = myProfileService;
    this.router = router;
  }

  profile: any = {};
  title = "CIBT Attendance";

  ngOnInit(): void {
    //console.log(this.activatedRoute.snapshot);
    this.getProfileById();
    this.displayMenu();
    this.slug = this.activatedRoute.snapshot.routeConfig?.path;
    this.userFullName = this.tokenStorageService.getUser()["full_name"];
    this.hasApproverRole =
      this.tokenStorageService.getUser()["has_approver_role"];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.image){
      this.profile = changes.image?.currentValue;
    }
  }

  displayMenu() {
    if (this.tokenStorageService.getUser() !== "") {
      this.currentRole = this.tokenStorageService.getUser().roles[0];
      console.log(this.currentRole);
    }
  }

  getProfileById(): void {
    this.subscribeData = this.myProfileService
      .getDataByIdFromService(this.tokenStorageService.getUser().id)
      .subscribe((data) => {
        this.profile = data[0];
      });
  }

  logout() {
    this.tokenStorageService.signOut();
    this.router.navigateByUrl("/login");
  }

  ngOnDestroy(): void {
    this.subscribeData.unsubscribe();
  }
}
