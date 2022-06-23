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
export class MyHolidayService {
  http: HttpClient;
  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }

//   getDataByIdFromService(id: any): Observable<any> {
//     return this.http
//       .get(`http://localhost:3000/api/holidays/${id}`, httpOptions)
//       .pipe(map((data) => data));
//   }

  getDataFromService(): Observable<any> {
    return this.http
      .get("http://localhost:3000/api/holidays/", httpOptions)
      .pipe(map((data) => data));
  }

//   postDataFromService(data): Observable<any> {
//     return this.http
//       .post("http://localhost:3000/api/holidays/", data, httpOptions)
//       .pipe(map((data) => data));
//   }

//   editDataFromService(data): Observable<any> {
//     return this.http
//       .put("http://localhost:3000/api/holidays/", data, httpOptions)
//       .pipe(map((data) => data));
//   }
}
