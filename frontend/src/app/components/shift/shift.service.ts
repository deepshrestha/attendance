import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class ShiftService {
  shiftOptions: any[] = [];
  http: HttpClient;
  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }

  getShiftData(): Observable<any[]> {
    return this.http
      .get<any[]>("http://localhost:3000/api/shifts/", httpOptions)
      .pipe(
        map((data) => {
          const shifts = [];
          data.forEach((element) => {
            shifts.push({ id: element.id, value: element.shift_name });
          });
          return shifts;
        })
      );
  }

  getDataFromService(): Observable<any[]> {
    return this.http
      .get<any[]>("http://localhost:3000/api/shifts/", httpOptions)
      .pipe(map((data) => data));
  }

  postDataFromService(data): Observable<any> {
    return this.http
      .post("http://localhost:3000/api/shifts/", data, httpOptions)
      .pipe(map((data) => data));
  }
}
