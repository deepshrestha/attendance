import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  template: require('./sidebar.component.html'),
})
export class SidebarComponent implements OnInit {
  
  slug: String;
  activatedRoute: ActivatedRoute;
  constructor(@Inject(ActivatedRoute) activatedRoute: ActivatedRoute) {
    this.activatedRoute = activatedRoute;
  }

  ngOnInit(): void {
    //console.log(this.activatedRoute.snapshot);
    this.slug = this.activatedRoute.snapshot.routeConfig?.path;
  }
  
  title = "CIBT Attendance"
}