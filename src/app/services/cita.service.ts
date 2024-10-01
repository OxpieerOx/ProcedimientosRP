import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cita } from '../models/cita.model';
import { CitaRequestDTO } from '../models/request/citarequest.model';
import { CitaMesDTO } from '../models/citames.model';
import { CitaFinanciamientoDTO } from '../models/citafinanciamiento.model';
import { CitaMedicoProcedimientoResponse } from '../models/citaprocedimientomedico.model';


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

  buscarporId(id: number): Observable<Cita[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${id}`;
    return this.http.get<{ result: boolean, data: Cita[] }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  updateCita(id: number, citaRequest: CitaRequestDTO): Observable<Cita> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${id}`;
    return this.http.put<{ result: boolean, data: Cita }>(url, citaRequest, httpOptions)
      .pipe(map(response => response.data));
  }

  getCitasCountByMes(): Observable<CitaMesDTO[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<{ result: boolean, data: CitaMesDTO[] }>(`${this.urlService}/citasPorMes`, httpOptions)
      .pipe(map(response => response.data));
  }

  getCitasPorFinanciamiento(): Observable<CitaFinanciamientoDTO[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/citasPorFinanciamiento`;
    return this.http.get<{ result: boolean, data: CitaFinanciamientoDTO[] }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  getCitasCountByMedicoAndProcedimiento(): Observable<CitaMedicoProcedimientoResponse[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/medico-procedimiento`;
    return this.http.get<{ result: boolean, data: CitaMedicoProcedimientoResponse[] }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  filtrarCitas(username?: string, fecha?: string, idPaciente?: number, nroCuenta?: string): Observable<Cita[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    const params: any = {};
    if (username) params.idMedico = username;
    if (fecha) params.fecha = fecha;
    if (idPaciente) params.idPaciente = idPaciente;
    if (nroCuenta) params.nroCuenta = nroCuenta;

    const url = `${this.urlService}/filtrar`;
    return this.http.get<{ result: boolean, data: Cita[] }>(url, { headers: httpOptions.headers, params })
      .pipe(map(response => response.data));
  }
}
