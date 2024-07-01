import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import { Procedimiento } from 'src/app/models/procedimiento.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Servicio } from 'src/app/models/servicio.model';
import { ProcedimientoService } from 'src/app/services/procedimiento.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgramacionEditComponent } from '../programacion-edit/programacion-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-programacion-index',
  templateUrl: './programacion-index.component.html',
  styleUrls: ['./programacion-index.component.css']
})
export class ProgramacionIndexComponent implements OnInit {
  servicios: Servicio[] = [];
  procedimientos: Procedimiento[] = [];
  programaciones: Programacion[] = [];
  selectServicio: any;
  isLoadingProgramaciones: boolean = false;
  selectProcedimiento: any;

  constructor(private servicioService: ServicioService, private procedimientoService:ProcedimientoService,
    private programacionService : ProgramacionService,public dialog: MatDialog,  private snackBar: MatSnackBar,
  ) { }

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
    this.procedimientoService.obtenerProcedimientosPorServicio(servicioId).subscribe(data => {
      this.procedimientos = data;
      
      if (this.procedimientos.length > 0) {
        this.selectProcedimiento = this.procedimientos[0].id; // Seleccionar el primer procedimiento
        this.obtenerProgramaciones(this.selectProcedimiento); // Obtener programaciones para el primer procedimiento
      }
    });
  }

  onProcedimientoChange(): void {
    this.obtenerProgramaciones(this.selectProcedimiento);
  }

  obtenerProgramaciones(procedimientoId: number): void {
    this.isLoadingProgramaciones = true; // Iniciar carga de programaciones
    this.programacionService.buscarPorProcedimiento(procedimientoId).subscribe(data => {
      this.programaciones = data;
      this.isLoadingProgramaciones = false; // Finalizar carga de programaciones
    }, error => {
      this.isLoadingProgramaciones = false; // Manejo de errores: finalizar carga en caso de error
    });
  }

  openDialog(programacionId: any,procedimientoId: any): void {
    if (!this.selectProcedimiento) {
      this.snackBar.open('Selecciona un procedimiento primero', 'Cerrar', {
        duration: 5000,
        panelClass: ['snack-bar-warning']
      });
      return; // Salir de la función si no hay procedimiento seleccionado
    }
    const dialogRef = this.dialog.open(ProgramacionEditComponent, {
      width: '500px',
      data: { programacionId: programacionId , procedimientoId:procedimientoId}
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
