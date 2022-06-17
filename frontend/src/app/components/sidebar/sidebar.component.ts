import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { TokenStorageService } from '../../services/token-storage/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  template: require('./sidebar.component.html'),
})
export class SidebarComponent implements OnInit {

  slug: String;
  activatedRoute: ActivatedRoute;
  tokenStorageService: TokenStorageService;
  router: Router;
  userFullName: String;
  hasApproverRole: boolean;
  
  constructor(@Inject(ActivatedRoute) activatedRoute: ActivatedRoute,
    @Inject(TokenStorageService) tokenStorageService: TokenStorageService,
    @Inject(Router) router: Router) {
    this.activatedRoute = activatedRoute;
    this.tokenStorageService = tokenStorageService;
    this.router = router;
  }

  ngOnInit(): void {
    //console.log(this.activatedRoute.snapshot);
    this.slug = this.activatedRoute.snapshot.routeConfig?.path;
    this.userFullName = this.tokenStorageService.getUser()["full_name"];
    this.hasApproverRole = this.tokenStorageService.getUser()["has_approver_role"];
  }

  title = "CIBT Attendance"

  logout() {
    this.tokenStorageService.signOut();
    this.router.navigateByUrl("/login");
  }
}