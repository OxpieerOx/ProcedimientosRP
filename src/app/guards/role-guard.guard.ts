import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { RolService } from '../services/rol.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {
  constructor(
    private rolService: RolService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Obtener el nombre de usuario del almacenamiento local
    const username = localStorage.getItem('user');

    if (username) {
      // Obtener roles del servicio RolService
      return this.rolService.findRolesByUsername(username).pipe(
        map(roles => {
          // Verificar si el usuario tiene el rol adecuado para acceder a la ruta
          return true;
        /*  if (roles.some((role: any) => role.id === 5)) { // Asegurarse de que roles sea de tipo 'any' o del tipo correcto
            return true; // Usuario tiene permiso
          } else {
            // Redireccionar al login si no tiene permiso
            this.router.navigate(['/login']);
            return false;
          }*/
        }),
        catchError(() => {
          // Redireccionar al login en caso de error
          this.router.navigate(['/login']);
          return of(false); // Usar 'of' de RxJS para devolver un Observable con el valor 'false'
        })
      );
    } else {
      // Redireccionar al login si no hay nombre de usuario
      this.router.navigate(['/login']);
      return of(false); // Usar 'of' de RxJS para devolver un Observable con el valor 'false'
    }
  }
}
