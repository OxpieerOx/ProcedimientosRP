import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private urlService = environment.apiEndPoint + 'api/v1/sight';

  constructor(private http: HttpClient) { }

  buscarPacientePorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/buscarPaciente/${id}`;
    return this.http.get<{ result: boolean, data: any }>(url, httpOptions)
      .pipe(map(response => response.data));
  }
}
