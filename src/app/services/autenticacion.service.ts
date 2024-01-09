import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  user: User;

  constructor(private router: Router) {
    this.user = new User();
  }

  canActivate() {
    const token = sessionStorage.getItem('token');
    if (token) {
      console.log("Token encontrado:", token);
      return true;
    } else {
      console.log("No hay token, redirigiendo al login");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
