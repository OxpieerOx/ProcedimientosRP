import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ProcedimientoCitas } from 'src/app/models/procedimientocitas.model';
import { ProcedimientoService } from 'src/app/services/procedimiento.service';
import { ProgramacionService } from 'src/app/services/programacion.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  citasProcedimientos: { [key: string]: number } = {};
  procedimientos: string[] = [];
  citas: number[] = [];
  chart: any;

  constructor(private programacionService: ProcedimientoService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.getCitasByProcedimiento();
  }

  getCitasByProcedimiento(): void {
    this.programacionService.getCitasCountByProcedimiento().subscribe((data: ProcedimientoCitas[]) => {
      this.citasProcedimientos = {};
      data.forEach(item => {
        this.citasProcedimientos[item.nombreProcedimiento] = item.totalCitas;
      });
      this.procedimientos = Object.keys(this.citasProcedimientos);
      this.citas = Object.values(this.citasProcedimientos);
      this.createChart();
    });
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('myChart', {
      type: 'bar',
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
