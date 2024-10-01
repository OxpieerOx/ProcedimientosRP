import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.model';
import { CrearMedicoRequest } from "../models/crear-medico.request";

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private urlService = environment.apiEndPoint + 'api/v1/medico';

  constructor(private http: HttpClient) {
  }

  buscarSericiosporUsuario(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/findByUserId/${id}`;
    return this.http.get<{ result: boolean, data: any }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  listAllMedicos(): Observable<Medico[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<{ result: boolean, data: Medico[] }>(this.urlService, httpOptions)
      .pipe(map(response => response.data));
  }

  listByIdMedicos(id: number): Observable<Medico> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${id}`;
    return this.http.get<{ result: boolean, data: Medico }>(url, httpOptions)
      .pipe(map(response => response.data));
  }


  buscarMedicoPorServicio(id: number): Observable<Medico[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/servicio/${id}`;
    return this.http.get<{ result: boolean, data: Medico[] }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  crearMedico(requestBody: CrearMedicoRequest, listaIdRoles: string[]) {
    const token = localStorage.getItem('token');
    const params = new HttpParams().set('roleIds', listaIdRoles.join(','));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      params: params
    };
    const url = `${this.urlService}`;
    return this.http.post<void>(url, requestBody, httpOptions);
  }
}
