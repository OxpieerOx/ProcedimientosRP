import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CitaListado } from 'src/app/models/citalistado.model';
import { Procedimiento } from 'src/app/models/procedimiento.model';
import { Programacion } from 'src/app/models/programacion.model';
import { Servicio } from 'src/app/models/servicio.model';
import { ProcedimientoService } from 'src/app/services/procedimiento.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { CitasAddComponent } from '../citas-add/citas-add.component';

@Component({
  selector: 'app-citas-index',
  templateUrl: './citas-index.component.html',
  styleUrls: ['./citas-index.component.css'],
  providers: [DatePipe]
})
export class CitasIndexComponent implements OnInit {

  servicios: Servicio[] = [];
  procedimientos: Procedimiento[] = [];
  selectServicio: any;
  selectProcedimiento: any;
  inlineDatePicker: Date = new Date();
  citas: CitaListado[] = [];
  isLoadingCitas: boolean = false;

  constructor(
    private servicioService: ServicioService, 
    private procedimientoService: ProcedimientoService,
    private snackBar: MatSnackBar,
    private programacionService: ProgramacionService,
    private datePipe: DatePipe,public dialog: MatDialog// Inyectar servicio de programación
  ) { }

  ngOnInit(): void {
    this.getServicios();
  }

  getServicios(): void {
    this.servicioService.getAllServices().subscribe(data => {
      this.servicios = data;
      if (this.servicios.length > 0) {
        this.selectServicio = this.servicios[0].serviceId;
        this.obtenerProcedimientos(this.selectServicio);
      }
    });
  }

  onServicioChange(): void {
    this.selectProcedimiento = null;
    this.procedimientos = [];
    this.obtenerProcedimientos(this.selectServicio);
  }

  obtenerProcedimientos(servicioId: number): void {
    this.procedimientoService.obtenerProcedimientosPorServicio(servicioId).subscribe(data => {
      this.procedimientos = data;
      if (this.procedimientos.length > 0) {
        this.selectProcedimiento = this.procedimientos[0].id;
        this.obtenerProgramacion(this.selectProcedimiento);
      }
    });
  }

  onProcedimientoChange(): void {
    this.obtenerProgramacion(this.selectProcedimiento);
  }
  obtenerProgramacion(procedimientoId: number): void {
    this.isLoadingCitas = true;
    const formattedDate = this.datePipe.transform(this.inlineDatePicker, 'yyyy-MM-dd');
    if (formattedDate) {
      this.programacionService.buscarPorFechaYProcedimiento(formattedDate, procedimientoId).subscribe(data => {
        this.isLoadingCitas = false; // Finalizar carga de citas
        if (data != null) {
          this.calcularCitas(data.horaInicio, data.horaFin, data.tiempoPromedio, data);
        }
        else{
          this.citas = [];
        }
      }, error => {
        this.isLoadingCitas = false; // Manejo de errores: finalizar carga en caso de error
        this.citas = [];
      });
    } else {
      this.citas = [];
      this.isLoadingCitas = false; // Manejo de errores: finalizar carga si la fecha no está formateada
    }
  }


  calcularCitas(fechaInicioStr: string, fechaFinStr: string, tiempoDuracion: number, programacion:any): void {
    const citas: CitaListado[] = [];
    const inicio = this.convertToDate(fechaInicioStr);
    const fin = this.convertToDate(fechaFinStr);
    while (inicio < fin) {
      console.log("si entra en el while");
      const cita = new CitaListado({
        idPaciente: 'Sin Asignar', // Sin asignar
        nroCuenta: 'Sin Asignar', // Sin asignar
        fecha: this.inlineDatePicker,
        horaInicio: new Date(inicio),
        horaFin: new Date(inicio.getTime() + programacion.tiempoPromedio * 60000),
        tiempoPromedio: programacion.tiempoPromedio,
        fechaRegistro: new Date(),
        usuarioCreador: programacion.usuarioCreador,
        esAdicional: false,
        estado: 'ABIERTO', // Estado inicial
        medico: `${programacion.medico.nombre} ${programacion.medico.apellido}`,
        procedimiento: programacion.procedimiento.nombre,
        idMedico: programacion.medico.id, // Asignar el ID del médico
        idProgramacion: programacion.id // Asignar el ID de la programación
      });
  
      citas.push(cita);
      console.log("citas", citas);
      inicio.setTime(inicio.getTime() + tiempoDuracion * 60000);
    }
  
    this.citas = citas;
    console.log("this.cotas", this.citas);
  }
  
  convertToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
 
  openDialog(cita: CitaListado): void {
    if (!this.selectProcedimiento) {
      this.snackBar.open('Selecciona un procedimiento primero', 'Cerrar', {
        duration: 5000,
        panelClass: ['snack-bar-warning']
      });
      return; // Salir de la función si no hay procedimiento seleccionado
    }

    const dialogRef = this.dialog.open(CitasAddComponent, {
      width: '500px',
      data: { cita: cita } // Pasar el objeto cita como dato
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
    });
  }

}
