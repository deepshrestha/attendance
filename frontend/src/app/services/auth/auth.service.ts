import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const AUTH_API = "http://localhost:3000/api/auth";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  http: HttpClient;
  constructor(@Inject(HttpClient) http: HttpClient) {
    this.http = http;
  }

  login(data): Observable<any> {
    return this.http.post(`${AUTH_API}/signin`, data, httpOptions).pipe(map((data) => data));
  }
}
