import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const AUTH_API = "http://localhost:3000/api/auth";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    let formData = {
      email,
      password
    };
    return this.http.post(`${AUTH_API}/signin`, formData, httpOptions);
  }
}
