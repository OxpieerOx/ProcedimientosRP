import { Injectable } from '@angular/core';
import { Rol } from '../models/rol.mode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { CodigoRolEnum } from "../models/enums/codigo-rol.enum";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})

export class RolService {

  private urlService = environment.apiEndPoint + 'api/v1/role';
  role: Rol;

  constructor(private http: HttpClient) {
    this.role = new Rol()
   }

   obtenerRolesPorCodigo(codigoRol: CodigoRolEnum): Observable<Rol[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<{ result: boolean, data: Rol[] }>(`${this.urlService}/codigo/${codigoRol}`, httpOptions)
      .pipe(map(response => response.data));
   }

   findRolesByUsername(username: string): Observable<Rol[]> {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.urlService}/${username}`;
    return this.http.get<{result: boolean, data: Rol[]}>(url, httpOptions)
      .pipe(map(response => response.data));
  }
}
