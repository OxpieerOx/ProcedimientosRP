import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private urlService = environment.apiEndPoint + 'api/v1/servicio';

  constructor(private http: HttpClient) { }

  getAllServices(): Observable<Servicio[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<{result: boolean, data: any[]}>(this.urlService, httpOptions)
      .pipe(map(response => response.data));
  }

  getServicesForUser(userId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/byUser/${userId}`;
    return this.http.get<{result: boolean, data: any[]}>(url, httpOptions)
      .pipe(map(response => response.data));
  }
}
