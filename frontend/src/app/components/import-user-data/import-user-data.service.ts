import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  })
};

@Injectable({
  providedIn: "root",
})
export class ImportUserDataService {
    http: HttpClient;
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }
    
    postDataFromService(data): Observable<any> {
      return this.http
        .post(`http://localhost:3000/api/import-user-data`, data)
        .pipe(map((data) => data));
    }
}
