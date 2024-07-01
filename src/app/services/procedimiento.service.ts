import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Procedimiento } from '../models/procedimiento.model';

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
}