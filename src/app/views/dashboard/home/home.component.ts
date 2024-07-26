import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  // Ejemplo de datos dinámicos para cada procedimiento
  citasProcedimientos: { [key: string]: number } = {
    'Procedimiento 1': 15,
    'Procedimiento 2': 8,
    'Procedimiento 3': 20,
    'Procedimiento 4': 5,
    'Procedimiento 5': 12
  };

  // Datos para el gráfico
  procedimientos = Object.keys(this.citasProcedimientos);
  citas = Object.values(this.citasProcedimientos);
  chart: any;

  constructor() { }

  ngOnInit(): void {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('myChart', {
      type: 'bar', // Tipo de gráfico
      data: {
        labels: this.procedimientos,
        datasets: [{
          label: 'Número de Citas por Procedimiento',
          data: this.citas,
          backgroundColor: '#36A2EB',
          borderColor: '#36A2EB',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                // Asegúrate de que `context.parsed.y` sea un número
                if (typeof context.parsed.y === 'number') {
                  label += context.parsed.y.toFixed(0);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
