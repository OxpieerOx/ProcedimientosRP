import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalCitas: number = 42; // Ejemplo de datos dinámicos
  citasPendientes: number = 15;
  citasAtendidas: number = 27;

  // Datos para el gráfico
  citasPorEstado = [this.citasPendientes, this.citasAtendidas];

  constructor() { }

  ngOnInit(): void {
  }

}
