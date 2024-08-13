import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CitaFinanciamientoDTO } from 'src/app/models/citafinanciamiento.model';
import { CitaMesDTO } from 'src/app/models/citames.model';
import { TooltipItem } from 'chart.js';

import { ProcedimientoCitas } from 'src/app/models/procedimientocitas.model';

import { CitaService } from 'src/app/services/cita.service';
import { ProcedimientoService } from 'src/app/services/procedimiento.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  citasProcedimientos: { [key: string]: number } = {};
  procedimientos: string[] = [];
  citas: number[] = [];

  citasMes: { [key: string]: number } = {};
  meses: string[] = [];
  cantidadMes: number[] = [];

  citasFinanciamiento: { [key: string]: number } = {};
  tiposFinanciamiento: string[] = [];
  cantidadFinanciamiento: number[] = [];

  chartProcedimientos: any;
  chartMes: any;
  chartFinanciamiento: any;

  constructor(private citaService: CitaService, private procedimientoService: ProcedimientoService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.getCitasByProcedimiento();
    this.getCitasByMes();
    this.getCitasByFinanciamiento();
  }

  getCitasByProcedimiento(): void {
    this.procedimientoService.getCitasCountByProcedimiento().subscribe((data: ProcedimientoCitas[]) => {
      this.citasProcedimientos = {};
      data.forEach(item => {
        this.citasProcedimientos[item.nombreProcedimiento] = item.totalCitas;
      });
      this.procedimientos = Object.keys(this.citasProcedimientos);
      this.citas = Object.values(this.citasProcedimientos);
      this.createChartProcedimientos();
    });
  }

  getCitasByMes(): void {
    this.citaService.getCitasCountByMes().subscribe((data: CitaMesDTO[]) => {
      this.citasMes = {};
      data.forEach(item => {
        this.citasMes[item.mes] = item.cantidad;
      });
      this.meses = Object.keys(this.citasMes);
      this.cantidadMes = Object.values(this.citasMes);
      console.log('Meses:', this.meses);
      console.log('Cantidad Mes:', this.cantidadMes);
      this.createChartMes();
    });
  }
  
  getCitasByFinanciamiento(): void {
    this.citaService.getCitasPorFinanciamiento().subscribe((data: CitaFinanciamientoDTO[]) => {
      this.citasFinanciamiento = {};
      data.forEach(item => {
        this.citasFinanciamiento[item.tipoFinanciamiento] = item.cantidad;
      });
      this.tiposFinanciamiento = Object.keys(this.citasFinanciamiento);
      this.cantidadFinanciamiento = Object.values(this.citasFinanciamiento);
      this.createChartFinanciamiento();
    });
  }

  createChartProcedimientos() {
    if (this.chartProcedimientos) {
      this.chartProcedimientos.destroy();
    }
    this.chartProcedimientos = new Chart('chartProcedimientos', {
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

  createChartMes() {
    if (this.chartMes) {
      this.chartMes.destroy();
    }
    this.chartMes = new Chart('chartMes', {
      type: 'bar', // Cambia el tipo a 'bar' para gráfico de barras
      data: {
        labels: this.meses,
        datasets: [{
          label: 'Número de Citas por Mes',
          data: this.cantidadMes,
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
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
              label: (tooltipItem: TooltipItem<'bar'>) => { // Cambia el tipo a 'bar'
                let label = tooltipItem.label || '';
                if (label) {
                  label += ': ';
                }
                if (typeof tooltipItem.parsed.y === 'number') {
                  label += tooltipItem.parsed.y.toFixed(0);
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
  
  
  createChartFinanciamiento() {
    if (this.chartFinanciamiento) {
      this.chartFinanciamiento.destroy();
    }
    this.chartFinanciamiento = new Chart('chartFinanciamiento', {
      type: 'pie',
      data: {
        labels: this.tiposFinanciamiento,
        datasets: [{
          label: 'Número de Citas por Tipo de Financiamiento',
          data: this.cantidadFinanciamiento,
          backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB'],
          borderColor: '#fff',
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
              label: (tooltipItem: TooltipItem<'pie'>) => {
                // tooltipItem.raw will contain the value
                let label = tooltipItem.label || '';
                if (label) {
                  label += ': ';
                }
                // Ensure tooltipItem.raw is treated as a number
                if (typeof tooltipItem.raw === 'number') {
                  label += tooltipItem.raw.toFixed(0);
                }
                return label;
              }
            }
          }
        }
      }
    });
  }
  
}
