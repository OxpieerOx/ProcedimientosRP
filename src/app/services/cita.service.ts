import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cita } from '../models/cita.model';
import { CitaRequestDTO } from '../models/request/citarequest.model';


@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private urlService = environment.apiEndPoint + 'api/v1/cita';

  constructor(private http: HttpClient) { }

  insertarCita(citaRequest: CitaRequestDTO): Observable<Cita> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<{ result: boolean, data: Cita }>(this.urlService, citaRequest, httpOptions)
      .pipe(map(response => response.data));
  }

  buscarporId(id: number): Observable<Cita> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${id}`;
    return this.http.get<{ result: boolean, data: Cita }>(url, httpOptions)
      .pipe(map(response => response.data));
  }
}
