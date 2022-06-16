import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TokenStorageService } from "../../services/token-storage/token-storage.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class LeaveRequestService {
  http: HttpClient;
  tokenStorageService: TokenStorageService;
  constructor(@Inject(HttpClient) http: HttpClient, @Inject(TokenStorageService) tokenStorageService: TokenStorageService) {
    this.http = http;
    this.tokenStorageService = tokenStorageService;
  }

  getDataByIdFromService(id: any): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/leave-requests/${id}`, httpOptions)
      .pipe(map((data) => data));
  }

  getDataFromService(): Observable<any> {
    return this.http
      .get("http://localhost:3000/api/leave-requests/", httpOptions)
      .pipe(map((data) => data));
  }

  postDataFromService(data): Observable<any> {
    return this.http
      .post("http://localhost:3000/api/leave-requests/", data, httpOptions)
      .pipe(map((data) => data));
  }

  editDataFromService(data): Observable<any> {
    return this.http
      .put("http://localhost:3000/api/leave-requests/", data, httpOptions)
      .pipe(map((data) => data));
  }

  getSeniorApproversData(): Observable<any[]> {
    return this.http
      .get<any[]>(`http://localhost:3000/api/leave-requests/approvers?requested_by=${this.tokenStorageService.getUser()["id"]}`, httpOptions)
      .pipe(map((data) => {
        const approvers = [];
        data.forEach(element => {
          approvers.push({id: element.id, value: element.full_name});
        });
        return approvers;
      }));
  }
}
