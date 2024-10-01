import { Injectable } from '@angular/core';
import { RolService } from './rol.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _menu = new BehaviorSubject<any[]>([]);
  menu$ = this._menu.asObservable();

  private initialMenu: any[] = [
    {
      titulo: 'Home',
      icono: 'mdi mdi-home',
      url: 'home'
    },
    {
      titulo: 'Programacion',
      icono: 'mdi mdi-calendar-check',
      url: 'programacion'
    },
    {
      titulo: 'Citas',
      icono: 'mdi mdi-stethoscope',
      url: 'citas'
    },
    {
      titulo: 'Médicos',
      icono: 'mdi mdi-account',
      url: 'medicos'
    },
    {
      titulo: 'Atencion',
      icono: 'mdi mdi-hospital',
      url: 'atencion'
    },
  ];

  private rolePermissions: { [key: number]: string[] } = {
    5: ['Home', 'Programacion', 'Citas', 'Médicos'],
    4: ['Atencion'],
  };

  constructor(private rolService: RolService) {
    this._menu.next(this.initialMenu); // Emitir el menú inicial
  }

  loadMenu(username: string) {
    this.rolService.findRolesByUsername(username).subscribe(
      roles => {
        const roleIds = roles.map(role => role.id); // Obtener todos los IDs de roles del usuario
        const filteredMenu = this.filterMenuByRoles(this.initialMenu, roleIds);
        this._menu.next(filteredMenu); // Emitir el menú filtrado
        localStorage.setItem('roleIds', JSON.stringify(roleIds));
      },
      error => {
        console.error('Error al cargar roles:', error);
      }
    );
  }

  filterMenuByRoles(menu: any[], roleIds: number[]): any[] {
    // Obtener los títulos permitidos en función de los IDs de roles
    const allowedTitles = new Set<string>();
    roleIds.forEach(roleId => {
      const permissions = this.rolePermissions[roleId];
      if (permissions) {
        permissions.forEach(title => allowedTitles.add(title));
      }
    });

    return menu.filter(item => allowedTitles.has(item.titulo));
  }

}
