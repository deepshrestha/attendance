import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-breadcrumb",
  template: require("./breadcrumb.component.html"),
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb: any;

  activatedRoute: ActivatedRoute;
  constructor( @Inject(ActivatedRoute) activatedRoute: ActivatedRoute ) {
    this.activatedRoute = activatedRoute;
  }

  ngOnInit(): void {
    //console.log(this.activatedRoute.snapshot);
    const activatedRouteSnapshot = this.activatedRoute.snapshot;
    this.breadcrumb = activatedRouteSnapshot.data["breadcrumb"];
  }
}