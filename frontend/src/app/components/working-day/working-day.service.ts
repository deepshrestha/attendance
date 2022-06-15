import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

const httpOptions = {
    headers: new HttpHeaders(
        {
            "Content-Type": "application/json"
        }
    )
}

@Injectable({
    providedIn: "root"
})
export class WorkingDayService {
    http: HttpClient;
    constructor(@Inject(HttpClient) http: HttpClient) {
        this.http = http;
    }

    getDataFromService(): Observable<any> {
        return this.http.get("http://localhost:3000/api/workingDays/", httpOptions).pipe(map(data => data));
    }

    getDataByIdFromService(id: any): Observable<any> {
        return this.http
            .get(`http://localhost:3000/api/workingDays/${id}`, httpOptions)
            .pipe(map((data) => data));
    }

    postDataFromService(data): Observable<any> {
        return this.http.post("http://localhost:3000/api/workingDays/", data, httpOptions).pipe(map(data => data));
    }

    editDataFromService(data): Observable<any> {
        return this.http
            .put("http://localhost:3000/api/workingDays/", data, httpOptions)
            .pipe(map((data) => data));
    }
}