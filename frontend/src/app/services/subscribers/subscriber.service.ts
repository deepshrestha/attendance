import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const API_URL = "http://localhost:3000/api/users/subscribers";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class SubscriberService {
  constructor(private http: HttpClient) {}

  getByApprovalStatus(type: string): Observable<any> {
    return this.http.get(`${API_URL}/approvalStatus/${type}`);
  }

  register(subscriber: any): Observable<any> {
    return this.http.post(API_URL, subscriber, httpOptions);
  }

  save(email: string): Observable<any> {
    return this.http.post(`${API_URL}/create`, { email }, httpOptions);
  }

  update(subscriber: any): Observable<any> {
    return this.http.put(API_URL, subscriber, httpOptions);
  }
}
