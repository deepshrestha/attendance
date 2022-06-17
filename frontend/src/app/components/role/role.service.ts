import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class RoleService {
  http: HttpClient;
  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }

  getDataByIdFromService(id: any): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/roles/${id}`, httpOptions)
      .pipe(map((data) => data));
  }

  getRoleData(): Observable<any[]> {
    return this.http
      .get<any[]>("http://localhost:3000/api/roles/", httpOptions)
      .pipe(
        map((data) => {
          const roles = [];
          data.forEach((element) => {
            roles.push({ id: element.id, value: element.role_name });
          });
          return roles;
        })
      );
  }

  getDataFromService(): Observable<any> {
    return this.http
      .get("http://localhost:3000/api/roles/", httpOptions)
      .pipe(map((data) => data));
  }

  postDataFromService(data): Observable<any> {
    return this.http
      .post("http://localhost:3000/api/roles/", data, httpOptions)
      .pipe(map((data) => data));
  }

  editDataFromService(data): Observable<any> {
    return this.http
      .put("http://localhost:3000/api/roles/", data, httpOptions)
      .pipe(map((data) => data));
  }
  
}
