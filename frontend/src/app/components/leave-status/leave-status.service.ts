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
export class LeaveStatusService {
  http: HttpClient;
  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }

  getDataByIdFromService(id: any): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/leave-status/${id}`, httpOptions)
      .pipe(map((data) => data));
  }

  getDataFromService(): Observable<any> {
    return this.http
      .get("http://localhost:3000/api/leave-status/", httpOptions)
      .pipe(map((data) => data));
  }

  getLeaveStatusData(): Observable<any[]> {
    return this.http
      .get<any[]>(`http://localhost:3000/api/leave-status`, httpOptions)
      .pipe(map((data) => {
        const leaveStatuses = [{id: 0, value: "Pending", selected: true}];
        data.forEach(element => {
          leaveStatuses.push({id: element.id, value: element.name, selected: false});
        });
        return leaveStatuses;
      }));
  }

  postDataFromService(data): Observable<any> {
    return this.http
      .post("http://localhost:3000/api/leave-status/", data, httpOptions)
      .pipe(map((data) => data));
  }

  editDataFromService(data): Observable<any> {
    return this.http
      .put("http://localhost:3000/api/leave-status/", data, httpOptions)
      .pipe(map((data) => data));
  }
}
