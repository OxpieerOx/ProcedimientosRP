import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CitaListado } from 'src/app/models/citalistado.model';
import { Programacion } from 'src/app/models/programacion.model';
import { CitaRequestDTO } from 'src/app/models/request/citarequest.model';
import { CitaService } from 'src/app/services/cita.service';
import { ProgramacionService } from 'src/app/services/programacion.service';

@Component({
  selector: 'app-cita-edit',
  templateUrl: './cita-edit.component.html',
  styleUrls: ['./cita-edit.component.css']
})
export class CitaEditComponent implements OnInit {
  programacionSelecionada: Programacion;
  editCitaForm: FormGroup;
  programaciones: Programacion[] = [];
  horas: string[] = [];
  horasDisponibles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<CitaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private programacionService: ProgramacionService,
    private citaService: CitaService
  ) {
    this.programacionSelecionada = new Programacion();
    this.editCitaForm = this.fb.group({
      programacion: ['', Validators.required],
      hora: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchProgramaciones();
    this.editCitaForm.get('programacion')?.valueChanges.subscribe(programacionId => {
      if (programacionId) {
        this.fetchHoras(programacionId);
      } else {
        this.resetHoraField();
      }
    });
  }

  fetchProgramaciones(): void {
    this.programacionService.buscarPorProcedimiento(this.data.idProcedimiento).subscribe(data => {
      this.programaciones = data;
    });
  }

  fetchHoras(programacionId: number): void {
    this.resetHoraField();

    this.programacionService.buscarPorId(programacionId).subscribe(programacion => {
      const { horaInicio, horaFin, tiempoPromedio } = programacion;
      this.horas = this.generateHoras(horaInicio, horaFin, tiempoPromedio);
      this.filterHorasDisponibles(programacionId);
    });
  }

  generateHoras(horaInicio: string, horaFin: string, tiempoPromedio: number): string[] {
    const start = this.convertToMinutes(horaInicio);
    const end = this.convertToMinutes(horaFin);
    const horas = [];
    for (let i = start; i < end; i += tiempoPromedio) {
      const startTime = this.convertToTime(i);
      const endTime = this.convertToTime(i + tiempoPromedio);
      horas.push(`${startTime} - ${endTime}`);
    }
    return horas;
  }

  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  convertToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${this.padZero(hours)}:${this.padZero(mins)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  filterHorasDisponibles(programacionId: number): void {
    this.citaService.buscarporId(programacionId).subscribe(citas => {
      const horasOcupadas = citas
        .filter(cita => cita.estado === 'PAGADO')
        .map(cita => this.convertirHora(cita.horaInicio).getTime());
  
      this.horasDisponibles = this.horas.filter(hora => {
        const [start, end] = hora.split(' - ');
        const startTime = this.convertirHora(start).getTime();
        const endTime = this.convertirHora(end).getTime();
        return !horasOcupadas.some(o => o >= startTime && o < endTime);
      });

      if (this.horasDisponibles.length > 0) {
        this.editCitaForm.get('hora')?.enable();
      } else {
        this.snackBar.open('No hay cupos disponibles para esa programación', 'Cerrar', {
          duration: 5000,
          panelClass: ['snack-bar-warning']
        });
        this.editCitaForm.get('hora')?.disable();
      }
    });
  }

  private convertirHora(hora: string): Date {
    const [hours, minutes] = hora.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  }

  resetHoraField(): void {
    this.editCitaForm.get('hora')?.setValue('');
    this.editCitaForm.get('hora')?.markAsUntouched();
    this.editCitaForm.get('hora')?.updateValueAndValidity();
    this.editCitaForm.get('hora')?.disable();
    this.horasDisponibles = [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formatToHHmm(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  onSave(): void {
    if (this.editCitaForm.valid) {
      const formValues = this.editCitaForm.value;
      this.programacionSelecionada = this.programaciones.find(p => p.id === formValues.programacion)!;

      const [horaInicio, horaFin] = formValues.hora.split(' - ');

      const citaRequest = new CitaRequestDTO({
        idPaciente: this.data.cita.idPaciente,
        nroCuenta: this.data.cita.nroCuenta, 
        fecha: `${this.programacionSelecionada.fecha}T00:00:00`,
        horaInicio,
        horaFin,
        idProgramacion: formValues.programacion,
        idMedico: this.data.cita.idMedico,
        usuarioCreador: this.data.cita.usuarioCreador,
        esAdicional: this.data.cita.esAdicional,
        estado: this.data.cita.estado
      });

      this.citaService.updateCita(this.data.cita.id, citaRequest).subscribe(
        response => {
          this.snackBar.open('Cita actualizada con éxito', 'Cerrar', {
            duration: 5000,
            panelClass: ['snack-bar-success']
          });
          this.dialogRef.close({ success: true, message: 'Cita actualizada exitosamente.' });
        },
        error => {
          this.snackBar.open('Error al actualizar la cita', 'Cerrar', {
            duration: 5000,
            panelClass: ['snack-bar-warning']
          });
        }
      );
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }
}
