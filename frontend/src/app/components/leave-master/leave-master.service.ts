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
export class LeaveMasterService {
  http: HttpClient;
  tokenStorageService: TokenStorageService;
  constructor(@Inject(HttpClient) http: HttpClient, @Inject(TokenStorageService) tokenStorageService: TokenStorageService) {
    this.http = http;
    this.tokenStorageService = tokenStorageService;
  }

  getDataByIdFromService(id: any): Observable<any> {
    return this.http
      .get(`http://localhost:3000/api/leaves/${id}`, httpOptions)
      .pipe(map((data) => data));
  }

  getDataFromService(): Observable<any> {
    return this.http
      .get("http://localhost:3000/api/leaves/", httpOptions)
      .pipe(map((data) => data));
  }

  getLeavesDataWithRemainingLeavesFromService(): Observable<any> {
    return this.http
      .get<any[]>(`http://localhost:3000/api/leavesOfRequestor?requested_by=${this.tokenStorageService.getUser()["id"]}`, httpOptions)
      .pipe(
        map((data) => {
          const leaves = [];
          data.forEach((element) => {
            leaves.push({ id: element.id, remainingLeaveDays: element.remaining_leave_days, value: `${element.name}` });
          });
          return leaves;
        })
      );
  }  

  getLeavesData(): Observable<any[]> {
    return this.http
      .get<any[]>("http://localhost:3000/api/leaves/", httpOptions)
      .pipe(
        map((data) => {
          const leaves = [];
          data.forEach((element) => {
            leaves.push({ id: element.id, value: element.name });
          });
          return leaves;
        })
      );
  }

  postDataFromService(data): Observable<any> {
    return this.http
      .post("http://localhost:3000/api/leaves/", data, httpOptions)
      .pipe(map((data) => data));
  }

  editDataFromService(data): Observable<any> {
    return this.http
      .put("http://localhost:3000/api/leaves/", data, httpOptions)
      .pipe(map((data) => data));
  }
}
