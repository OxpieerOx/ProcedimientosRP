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
import { CitaService } from 'src/app/services/cita.service';
import { CitaEditComponent } from '../cita-edit/cita-edit.component';
import { EstadoCita } from 'src/app/models/request/citarequest.model';

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
  programacion:Programacion;
  inlineDatePicker: Date = new Date();
  citas: CitaListado[] = [];
  isLoadingCitas: boolean = false;

  constructor(
    private servicioService: ServicioService, 
    private procedimientoService: ProcedimientoService,
    private snackBar: MatSnackBar,
    private programacionService: ProgramacionService,
    private datePipe: DatePipe,public dialog: MatDialog,
    private citService:CitaService// Inyectar servicio de programación
  ) { 
    this.programacion = new Programacion();
  }

  ngOnInit(): void {
    this.inlineDatePicker = new Date();
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


  allCitasPagado(): boolean {
    return this.citas.every(cita => cita.estado === 'PAGADO');
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
          this.programacion = data;
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


  calcularCitas(fechaInicioStr: string, fechaFinStr: string, tiempoDuracion: number, programacion: any): void {
    const programacionDateStr = this.datePipe.transform(this.inlineDatePicker, 'yyyy-MM-dd')!;
    this.citService.buscarporId(programacion.id).subscribe(
      citasExistente => {
        const citas: CitaListado[] = [];
        const inicio = this.convertToDate(programacionDateStr, fechaInicioStr);
        const fin = this.convertToDate(programacionDateStr, fechaFinStr);
  
        while (inicio < fin) {
          const horaInicio = new Date(inicio);
          const horaFin = new Date(inicio);
          horaFin.setMinutes(horaInicio.getMinutes() + tiempoDuracion);
  
          const citaExistente = citasExistente.find(cita => {
            const citaHoraInicio = new Date(`${programacionDateStr}T${cita.horaInicio}`);
            const citaHoraFin = new Date(`${programacionDateStr}T${cita.horaFin}`);
            return horaInicio.getTime() >= citaHoraInicio.getTime() && horaFin.getTime() <= citaHoraFin.getTime();
          });
  
          if (citaExistente) {
            citas.push(new CitaListado({
              id: citaExistente.id,
              idPaciente: citaExistente.idPaciente,
              nroCuenta: citaExistente.nroCuenta,
              fecha: citaExistente.fecha,
              horaInicio: new Date(`${programacionDateStr}T${citaExistente.horaInicio}`),
              horaFin: new Date(`${programacionDateStr}T${citaExistente.horaFin}`),
              tiempoPromedio: programacion.tiempoPromedio,
              fechaRegistro: new Date(citaExistente.fechaRegistro),
              usuarioCreador: citaExistente.usuarioCreador,
              esAdicional: citaExistente.esAdicional,
              estado: citaExistente.estado,
              medico: `${programacion.medico.nombre} ${programacion.medico.apellido}`,
              procedimiento: programacion.procedimiento.nombre,
              idMedico: programacion.medico.id,
              idProgramacion: programacion.id,
              financiamiento: citaExistente.financiamiento // Asigna el valor
            }));
          } else {
            citas.push(new CitaListado({
              idPaciente: 'Sin Asignar',
              nroCuenta: 'Sin Asignar',
              fecha: this.inlineDatePicker!,
              horaInicio: new Date(horaInicio),
              horaFin: new Date(horaFin),
              tiempoPromedio: programacion.tiempoPromedio,
              fechaRegistro: new Date(),
              usuarioCreador: programacion.usuarioCreador,
              esAdicional: false,
              estado: 'ABIERTO',
              medico: `${programacion.medico.nombre} ${programacion.medico.apellido}`,
              procedimiento: programacion.procedimiento.nombre,
              idMedico: programacion.medico.id,
              idProgramacion: programacion.id,
              financiamiento: 'Sin Asignar' // Asigna un valor predeterminado
            }));
          }
  
          inicio.setTime(inicio.getTime() + tiempoDuracion * 60000);
        }
  
        citasExistente.filter(cita => cita.esAdicional).forEach(citaExistente => {
          const citaHoraInicio = new Date(`${programacionDateStr}T${citaExistente.horaInicio}`);
          const citaHoraFin = new Date(`${programacionDateStr}T${citaExistente.horaFin}`);
          citas.push(new CitaListado({
            idPaciente: citaExistente.idPaciente,
            nroCuenta: citaExistente.nroCuenta,
            fecha: citaExistente.fecha,
            horaInicio: citaHoraInicio,
            horaFin: citaHoraFin,
            tiempoPromedio: programacion.tiempoPromedio,
            fechaRegistro: new Date(citaExistente.fechaRegistro),
            usuarioCreador: citaExistente.usuarioCreador,
            esAdicional: citaExistente.esAdicional,
            estado: EstadoCita.PAGADO,
            medico: `${programacion.medico.nombre} ${programacion.medico.apellido}`,
            procedimiento: programacion.procedimiento.nombre,
            idMedico: programacion.medico.id,
            idProgramacion: programacion.id,
            financiamiento: citaExistente.financiamiento // Asigna el valor
          }));
        });
  
        this.citas = citas.sort((a, b) => a.horaInicio.getTime() - b.horaInicio.getTime());
      },
      error => {
        console.error('Error al buscar citas por programación', error);
      }
    );
  }
  

  formatToHHmm(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  

  convertToDate(dateString: string, timeString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds, 0);
  }
  
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  openDialogedit(cita: CitaListado): void {
    console.log("cita",cita)
    const dialogRef = this.dialog.open(CitaEditComponent, {
      width: '500px',
      data: { cita: cita, idProcedimiento : this.selectProcedimiento } // Pasar el objeto cita como dato
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
      this.obtenerProgramacion(this.selectProcedimiento);
    });
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
      this.obtenerProgramacion(this.selectProcedimiento);
    });
  }

  openAdditionalDialog(): void {
    if (!this.programacion || !this.citas.length) {
      this.snackBar.open('No hay programación o citas disponibles', 'Cerrar', {
        duration: 5000,
        panelClass: ['snack-bar-warning']
      });
      return;
    }
  
    // Ordenar las citas por hora de inicio para asegurarnos de obtener la última
    const sortedCitas = this.citas.sort((a, b) => a.horaFin.getTime() - b.horaFin.getTime());
    const ultimaCita = sortedCitas[sortedCitas.length - 1];
  
    const nuevaHoraInicio = new Date(ultimaCita.horaFin);
    const nuevaHoraFin = new Date(nuevaHoraInicio);
    nuevaHoraFin.setMinutes(nuevaHoraInicio.getMinutes() + this.programacion.tiempoPromedio);
  
    const citaAdicional = new CitaListado({
      idPaciente: 'Sin Asignar', // Sin asignar
      nroCuenta: 'Sin Asignar', // Sin asignar
      fecha: this.inlineDatePicker!,
      horaInicio: nuevaHoraInicio,
      horaFin: nuevaHoraFin,
      tiempoPromedio: this.programacion.tiempoPromedio,
      fechaRegistro: new Date(),
      usuarioCreador: this.programacion.usuarioCreador,
      esAdicional: true,
      estado: 'ABIERTO', // Estado inicial
      medico: `${this.programacion.medico.nombre} ${this.programacion.medico.apellido}`,
      procedimiento: this.programacion.procedimiento.nombre,
      idMedico: this.programacion.medico.id,
      idProgramacion: this.programacion.id
    });
  
    console.log("citaAdicional", citaAdicional);
    this.openDialog(citaAdicional);
  }
  
}
