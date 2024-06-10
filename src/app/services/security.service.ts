import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  
  private urlService = environment.apiEndPoint + 'auth/login';

  constructor(private http: HttpClient) { }

  public getToken(user: User): Observable<any> {
    console.log(JSON.stringify(user));
    return this.http.post<any>(this.urlService, JSON.stringify(user), httpOptions).pipe(
      map((res: HttpResponse<any>) => {
        console.log("Show body: ", res.body.data);
        console.log("Show token: ", res.body.data.token);
        // if (res.headers.has("Authorization")) {
        //   user.token = res.headers.get("Authorization")!;
        //   localStorage.setItem('token', 'Bearer ' + res.headers.get("Authorization"));
        // }
        if (res.body.data.token) {
          user.token = res.body.data.token;
          localStorage.setItem('token', 'Bearer ' + res.body.data.token);
        }
        return user;
      }),
      catchError(this.handleError))
  }

  private handleError(error: any) {
    console.log("securityService error", error);
    return throwError("lanzando error: " + error);
  }
}
