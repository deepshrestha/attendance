/* import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DepartmentComponent } from "../department/department.component";

@Component({
    selector: 'app-settings',
    template: require('./settings.component.html')
})
export class SettingsComponent implements OnInit {

    path: string;
    type: string;
    component: any;
    activatedRoute: ActivatedRoute;
    router: Router;
    constructor(
        @Inject(ActivatedRoute) activtedRoute: ActivatedRoute,
        @Inject(Router) router: Router
    ) {
        this.activatedRoute = activtedRoute;
        this.router = router;
    }
    ngOnInit(): void {
        console.log(this.activatedRoute.snapshot);
        this.path = this.activatedRoute.snapshot.routeConfig.children[0].path;
        this.type = this.activatedRoute.snapshot.queryParams?.type;
        console.log(this.path)
        switch(this.path){
            case 'departments':
                this.component = DepartmentComponent;
                this.router.navigate(['/settings/departments'])
                break;
            default:
                break;
        }
    }
} */