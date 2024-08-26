import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CitaFinanciamientoDTO } from 'src/app/models/citafinanciamiento.model';
import { CitaMesDTO } from 'src/app/models/citames.model';
import { TooltipItem } from 'chart.js'; 
import { ProcedimientoCitas } from 'src/app/models/procedimientocitas.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CitaService } from 'src/app/services/cita.service';
import { ProcedimientoService } from 'src/app/services/procedimiento.service';
import { CitaMedicoProcedimientoResponse } from 'src/app/models/citaprocedimientomedico.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  citasMedico: { [key: string]: number } = {};
  medicos: string[] = [];
  cantidadMedico: number[] = [];
  citasProcedimientos: { [key: string]: number } = {};
  procedimientos: string[] = [];
  citas: number[] = [];

  citasMes: { [key: string]: number } = {};
  meses: string[] = [];
  cantidadMes: number[] = [];

  citasFinanciamiento: { [key: string]: number } = {};
  tiposFinanciamiento: string[] = [];
  cantidadFinanciamiento: number[] = [];
  citasMedicoProcedimiento: {
    [medico: string]: {
      [procedimiento: string]: {
        [año: number]: {
          [mes: number]: number;
        }
      }
    }
  } = {};
  cantidadMedicoProcedimiento: number[] = [];
  chartProcedimientos: any;
  chartMes: any;
  chartFinanciamiento: any;

  constructor(private citaService: CitaService, private procedimientoService: ProcedimientoService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.getCitasByProcedimiento();
    this.getCitasByMes();
    this.getCitasByFinanciamiento();
    this.getCitasByMedicoProcedimiento();
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

  getCitasByMedicoProcedimiento(): void {
    this.citaService.getCitasCountByMedicoAndProcedimiento().subscribe((data: CitaMedicoProcedimientoResponse[]) => {
      this.citasMedicoProcedimiento = {}; // Limpiar el objeto
  
      // Procesar los datos recibidos
      data.forEach(item => {
        const año = Number(item.año); // Convertir a número
        const mes = Number(item.mes); // Convertir a número
  
        if (!this.citasMedicoProcedimiento[item.medicoNombre]) {
          this.citasMedicoProcedimiento[item.medicoNombre] = {};
        }
        if (!this.citasMedicoProcedimiento[item.medicoNombre][item.procedimientoNombre]) {
          this.citasMedicoProcedimiento[item.medicoNombre][item.procedimientoNombre] = {};
        }
        if (!this.citasMedicoProcedimiento[item.medicoNombre][item.procedimientoNombre][año]) {
          this.citasMedicoProcedimiento[item.medicoNombre][item.procedimientoNombre][año] = {};
        }
        this.citasMedicoProcedimiento[item.medicoNombre][item.procedimientoNombre][año][mes] = item.cantidad;
      });
  
      // Obtener listas de médicos y procedimientos
      this.medicos = Object.keys(this.citasMedicoProcedimiento);
      this.procedimientos = Array.from(new Set(data.map(item => item.procedimientoNombre)));
  
      // Calcular las cantidades
      this.cantidadMedicoProcedimiento = this.medicos.flatMap(medico => 
        this.procedimientos.flatMap(procedimiento =>
          Object.keys(this.citasMedicoProcedimiento[medico][procedimiento] || {}).flatMap(añoStr =>
            Object.keys(this.citasMedicoProcedimiento[medico][procedimiento][Number(añoStr)] || {}).map(mesStr =>
              this.citasMedicoProcedimiento[medico][procedimiento][Number(añoStr)][Number(mesStr)] || 0
            )
          )
        )
      );
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


  exportToExcel(): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    
    // Crear las hojas para cada reporte con nombres más cortos
    const worksheetProcedimientos = XLSX.utils.json_to_sheet(this.convertToJSON(this.procedimientos, this.citas, 'Procedimiento', 'Citas'));
    const worksheetMes = XLSX.utils.json_to_sheet(this.convertToJSON(this.meses, this.cantidadMes, 'Mes', 'Citas'));
    const worksheetFinanciamiento = XLSX.utils.json_to_sheet(this.convertToJSON(this.tiposFinanciamiento, this.cantidadFinanciamiento, 'Tipo Finan', 'Citas')); // Nombre más corto
    const worksheetMedicoProcedimiento = XLSX.utils.json_to_sheet(this.convertMedicoProcedimientoToJSON());
    
    // Crear el libro de trabajo con las hojas
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheetProcedimientos, 'Proc'); // Nombre más corto
    XLSX.utils.book_append_sheet(workbook, worksheetMes, 'Mes'); // Nombre más corto
    XLSX.utils.book_append_sheet(workbook, worksheetFinanciamiento, 'Financiamiento'); // Nombre más corto
    XLSX.utils.book_append_sheet(workbook, worksheetMedicoProcedimiento, 'MedicoProc'); // Nombre más corto
    
    // Exportar el archivo
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, `reportes_${new Date().getTime()}.xlsx`);
  }
  
  convertToJSON(keys: string[], values: number[], keyLabel: string, valueLabel: string): any[] {
    return keys.map((key, index) => ({
      [keyLabel]: key,
      [valueLabel]: values[index]
    }));
  }
  convertMedicoProcedimientoToJSON(): any[] {
    const result: any[] = [];
    for (const medico of this.medicos) {
      for (const procedimiento of this.procedimientos) {
        const años = this.citasMedicoProcedimiento[medico][procedimiento] || {};
        for (const añoStr in años) {
          const año = Number(añoStr); // Convertir a número
          const meses = años[año] || {};
          for (const mesStr in meses) {
            const mes = Number(mesStr); // Convertir a número
            result.push({
              'Médico': medico,
              'Procedimiento': procedimiento,
              'Año': año,
              'Mes': mes,
              'Cantidad': meses[mes] || 0
            });
          }
        }
      }
    }
    return result;
  }
  
}
  
