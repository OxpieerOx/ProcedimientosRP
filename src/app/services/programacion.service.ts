import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Programacion } from '../models/programacion.model';
import { ProgramacionRequest } from '../models/request/programacionrequest.model';
import { ProgramacionFechasRequest } from '../models/request/fecharangerequest.model';


@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

  private urlService = environment.apiEndPoint + 'api/v1/programacion';

  constructor(private http: HttpClient) { }

  crearProgramacion(request: any): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<{ result: boolean, data: any }>(this.urlService, request, httpOptions)
      .pipe(map(response => response.data));
  }

  buscarPorFechaYProcedimiento(fecha: string, idProcedimiento: number): Observable<Programacion> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${fecha}/${idProcedimiento}`;
    return this.http.get<{ result: boolean, data: Programacion }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  buscarPorProcedimiento(idProcedimiento: number): Observable<Programacion[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/procedimiento/${idProcedimiento}`;
    return this.http.get<{ result: boolean, data: Programacion[] }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  buscarPorId(id: number): Observable<Programacion> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${id}`;
    return this.http.get<{ result: boolean, data: Programacion }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  actualizarProgramacion(id: number, request: ProgramacionRequest): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${id}`;
    return this.http.put<{ result: boolean, data: any }>(url, request, httpOptions)
      .pipe(map(response => response.data));
  }



  crearProgramacionesEnFechas(request: ProgramacionFechasRequest): Observable<Programacion[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/fechas`;
    return this.http.post<{ result: boolean, data: Programacion[] }>(url, request, httpOptions)
      .pipe(map(response => response.data));
  }
}