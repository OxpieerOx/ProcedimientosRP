import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  usuario: string = "";

  constructor(private  authservice: AutenticacionService) { }

  ngOnInit(): void {

    const userFromLocalStorage = localStorage.getItem('user');
    this.usuario = userFromLocalStorage !== null ? userFromLocalStorage : '';
  }

  logout(): void {
    this.authservice.logout();
  }

}
