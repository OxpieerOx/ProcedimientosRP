import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Procedimiento } from '../models/procedimiento.model';
import { ProcedimientoCitas } from '../models/procedimientocitas.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedimientoService {

  private urlService = environment.apiEndPoint + 'api/v1/procedimiento';

  constructor(private http: HttpClient) { }

  obtenerProcedimientosPorServicio(servicioId: number): Observable<Procedimiento[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/servicio/${servicioId}`;
    return this.http.get<{result: boolean, data: any[]}>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  getCitasCountByProcedimiento(): Observable<ProcedimientoCitas[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/citas-count`;
    return this.http.get<{ result: boolean, data: ProcedimientoCitas[] }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  obtenerProcedimientoPorNombre(nombre: string): Observable<Procedimiento> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/nombre/${nombre}`;
    return this.http.get<{ result: boolean, data: Procedimiento }>(url, httpOptions)
      .pipe(map(response => response.data));
  }

  obtenerProcedimientoPorNombreYServicio(nombre: string, idServicio: number): Observable<Procedimiento> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/buscar/${nombre}/${idServicio}`;
    return this.http.get<{ result: boolean, data: Procedimiento }>(url, httpOptions)
      .pipe(map(response => response.data));
  }
}