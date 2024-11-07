import { Component, OnInit } from '@angular/core';
import { Procedimiento } from 'src/app/models/procedimiento.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Servicio } from 'src/app/models/servicio.model';
import { ProcedimientoService } from 'src/app/services/procedimiento.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgramacionEditComponent } from '../programacion-edit/programacion-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProgramacionFechaComponent } from '../programacion-fecha/programacion-fecha.component';

@Component({
  selector: 'app-programacion-index',
  templateUrl: './programacion-index.component.html',
  styleUrls: ['./programacion-index.component.css']
})
export class ProgramacionIndexComponent implements OnInit {
  servicios: Servicio[] = [];
  procedimientos: Procedimiento[] = [];
  programaciones: Programacion[] = [];
  paginatedProgramaciones: Programacion[] = []; // Data to be shown in the current page
  selectServicio: any;
  isLoadingProgramaciones: boolean = false;
  selectProcedimiento: any;

  // Paginator variables
  pageSize = 10; // Number of items per page
  currentPage = 1; // Current page
  totalPages = 1; // Total pages

  constructor(private servicioService: ServicioService, private procedimientoService: ProcedimientoService,
              private programacionService: ProgramacionService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getServicios();
  }

  getServicios(): void {
    this.servicioService.getAllServices().subscribe(data => {
      this.servicios = data;
      if (this.servicios.length > 0) {
        this.selectServicio = this.servicios[0].serviceId; // Seleccionar el primer servicio
        this.obtenerProcedimientos(this.selectServicio); // Obtener procedimientos para el primer servicio
      }
    });
  }

  onServicioChange(): void {
    this.selectProcedimiento = null; // Resetear el procedimiento seleccionado
    this.procedimientos = []; // Limpiar los procedimientos
    this.obtenerProcedimientos(this.selectServicio);
  }

  obtenerProcedimientos(servicioId: number): void {
    console.log('Servicio ID:', servicioId); // Asegúrate de que servicioId no sea undefined
    console.log("servicios",this.servicios)
    const selectedServicio = this.servicios.find(s => s.serviceId == servicioId);
    console.log('Selected Servicio:', selectedServicio);
    if (selectedServicio && selectedServicio.serviceName !== 'Cardiologia') {
      this.procedimientoService.obtenerProcedimientoPorNombreYServicio('General',this.selectServicio).subscribe(data => {
        console.log('Procedimientos:', data); // Verifica si el procedimiento se recibe correctamente
        this.procedimientos = [data];
        if (this.procedimientos.length > 0) {
          this.selectProcedimiento = this.procedimientos[0].id;
          this.obtenerProgramaciones(this.selectProcedimiento);
        }
      });
    } else {
      this.procedimientoService.obtenerProcedimientosPorServicio(servicioId).subscribe(data => {
        console.log('Procedimientos:', data); // Verifica si los procedimientos se reciben correctamente
        this.procedimientos = data;
        if (this.procedimientos.length > 0) {
          this.selectProcedimiento = this.procedimientos[0].id;
          this.obtenerProgramaciones(this.selectProcedimiento);
        }
      });
    }
  }
  
  

  onProcedimientoChange(): void {
    this.obtenerProgramaciones(this.selectProcedimiento);
  }

  obtenerProgramaciones(procedimientoId: number): void {
    this.isLoadingProgramaciones = true; // Iniciar carga de programaciones
    this.programacionService.buscarPorProcedimiento(procedimientoId).subscribe(data => {
      this.programaciones = data;
      this.isLoadingProgramaciones = false; // Finalizar carga de programaciones
      this.updatePagination(); // Update pagination data
    }, error => {
      this.isLoadingProgramaciones = false; // Manejo de errores: finalizar carga en caso de error
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.programaciones.length / this.pageSize);
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProgramaciones = this.programaciones.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  openDialog(programacionId: any, procedimientoId: any, servicioId: any): void {
    if (!this.selectProcedimiento) {
      this.snackBar.open('Selecciona un procedimiento primero', 'Cerrar', {
        duration: 5000,
        panelClass: ['snack-bar-warning']
      });
      return; // Salir de la función si no hay procedimiento seleccionado
    }
    const dialogRef = this.dialog.open(ProgramacionEditComponent, {
      width: '500px',
      data: { programacionId: programacionId, procedimientoId: procedimientoId, servicioId: servicioId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Mostrar mensaje de éxito si result contiene éxito
        this.snackBar.open(result.message, 'Cerrar', {
          duration: 10000,  // Duración del snack bar en milisegundos
          panelClass: ['snack-bar-success']  // Estilo CSS para el snack bar de éxito
        });
      } else {
        console.log('Operación cancelada o sin éxito');
      }
      this.obtenerProgramaciones(this.selectProcedimiento);
    });
  }

  openDialogf(programacionId: any, procedimientoId: any, servicioId: any): void {
    if (!this.selectProcedimiento) {
      this.snackBar.open('Selecciona un procedimiento primero', 'Cerrar', {
        duration: 5000,
        panelClass: ['snack-bar-warning']
      });
      return; // Salir de la función si no hay procedimiento seleccionado
    }
    const dialogRef = this.dialog.open(ProgramacionFechaComponent, {
      width: '500px',
      data: { programacionId: programacionId, procedimientoId: procedimientoId, servicioId: servicioId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // Mostrar mensaje de éxito si result contiene éxito
        this.snackBar.open(result.message, 'Cerrar', {
          duration: 10000,  // Duración del snack bar en milisegundos
          panelClass: ['snack-bar-success']  // Estilo CSS para el snack bar de éxito
        });
      } else {
        console.log('Operación cancelada o sin éxito');
      }
      this.obtenerProgramaciones(this.selectProcedimiento);
    });
  }
}
