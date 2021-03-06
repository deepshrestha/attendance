import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SidebarComponent } from "./components/sidebar/sidebar.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { FooterComponent } from "./components/footer/footer.component"
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { TableComponent } from "./components/content/Table/table.component";
import { PaginationComponent } from "./components/content/Pagination/pagination.component";
import { AttendanceComponent } from "./components/attendance/attendance.component";
import { PcRegistrationComponent } from "./components/pc-registration/pc-registration.component";
import { SubscriberAddComponent } from "./components/subscribers/subscriber-add/subscriber-add.component";
import { SubscriberListComponent } from "./components/subscribers/subscriber-list/subscriber-list.component";
import { ModalComponent } from "./components/content/Modal/modal.component";
import { SearchComponent } from "./components/content/Search/search.component";
import { AuthGuard } from "./auth/auth.guard";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { BreadcrumbComponent } from "./components/content/Breadcrumb/breadcrumb.component";

import { EmployeesComponent } from "./components/employees/employees.component";
import { DepartmentComponent } from "./components/department/department.component";
import { WorkingDayComponent } from "./components/working-day/working-day.component";
import { ShiftComponent } from "./components/shift/shift.component";
//import { SettingsComponent } from "./components/settings/settings.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "home", redirectTo: "attendance", pathMatch: "full" },
  {
    path: "attendance",
    component: AttendanceComponent,
    data: { breadcrumb: 'Attendance' },
  },
  {
    path: "employees",
    component: EmployeesComponent,
    data: { breadcrumb: 'Employees' },
  },
  {
    path: "departments",
    component: DepartmentComponent,
    data: { breadcrumb: 'Departments' },
  },
  {
    path: "working-days",
    component: WorkingDayComponent,
    data: { breadcrumb: 'Working Days' },
  },
  {
    path: "shifts",
    component: ShiftComponent,
    data: { breadcrumb: 'Shifts' },
  },
  {
    path: "subscribers",
    component: SubscriberListComponent,
    canActivate: [AuthGuard],
    data: { role: "ROLE_ADMIN",  breadcrumb: 'Subscribers' }
  },
  {
    path: "subscribers/add",
    component: SubscriberAddComponent,
    canActivate: [AuthGuard],
    data: { role: "ROLE_ADMIN", breadcrumb: 'Add Subscribers' }
  },
  { path: "pcRegistrationForm", component: PcRegistrationComponent, data: { breadcrumb: 'PC Registration' }, },
  { path: "**", pathMatch: 'full', component: NotFoundComponent } //Wild Card Route for 404 request
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const appRoutingComponents = [
  SidebarComponent,
  NavbarComponent,
  FooterComponent,
  LoginComponent,
  PcRegistrationComponent,
  SubscriberAddComponent,
  SubscriberListComponent,
  AttendanceComponent,
  HomeComponent,
  TableComponent,
  PaginationComponent,
  ModalComponent,
  SearchComponent,
  NotFoundComponent,
  BreadcrumbComponent,
  EmployeesComponent,
  DepartmentComponent,
  WorkingDayComponent,
  ShiftComponent,
]