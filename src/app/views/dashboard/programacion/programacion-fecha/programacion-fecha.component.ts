import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackBarComponent } from 'src/app/components/snack-bar/snack-bar.component';
import { Medico } from 'src/app/models/medico.model';
import { Programacion } from 'src/app/models/programacion.model';
import { ProgramacionRequest } from 'src/app/models/request/programacionrequest.model';
import { MedicoService } from 'src/app/services/medico.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { DateRemoveEvent } from 'ngx-multiple-dates';
import { ProgramacionFechasRequest } from 'src/app/models/request/fecharangerequest.model';

@Component({
  selector: 'app-programacion-fecha',
  templateUrl: './programacion-fecha.component.html',
  styleUrls: ['./programacion-fecha.component.css']
})
export class ProgramacionFechaComponent implements OnInit {
  programacionId: number;
  servicioId: number;
  procedimientoId: number;
  programacion: Programacion = new Programacion();
  modalTitle: string;
  medicos: Medico[] = [];
  programacionForm: FormGroup;
  usuarioCreador: String = "Admisionista";
  private _duration: number = 10;
  public fechasSeleccionadas: Date[] = [];  // Para almacenar las fechas seleccionadas

  constructor(
    public dialogRef: MatDialogRef<ProgramacionFechaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private programacionService: ProgramacionService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private medicoService: MedicoService,
    private fb: FormBuilder
  ) {
    this.servicioId = data.servicioId;
    this.procedimientoId = data.procedimientoId;
    this.programacionId = data.programacionId;
    this.modalTitle = this.programacionId ? 'Editar Programación' : 'Crear Programación';
    this.programacionForm = this.fb.group({
      fecha: [[], [Validators.required]],  // Cambiado a un array para fechas múltiples
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      horaFin: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      tiempoPromedio: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      medicoid: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.medicoService.buscarMedicoPorServicio(this.servicioId).subscribe(
      medicos => {
        this.medicos = medicos;
      },
      error => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          data: { message: 'Error en cargar la lista de médicos.' },
          duration: this._duration * 1000,
          panelClass: ['snack-bar-warning']
        });
      }
    );
  }

  loadProgramacion(): void {
    this.spinner.show();
    this.programacionService.buscarPorId(this.programacionId).subscribe(
      programacion => {
        this.programacion = programacion;
        // Convertir fecha para ngx-multiple-dates
        const fechas = [new Date(this.programacion.fecha)];
        this.programacionForm.patchValue({
          fecha: fechas,
          horaInicio: this.formatToHHmm(this.programacion.horaInicio),
          horaFin: this.formatToHHmm(this.programacion.horaFin),
          tiempoPromedio: this.programacion.tiempoPromedio,
          medicoid: this.programacion.medico.id
        });
        this.fechasSeleccionadas = fechas;
        this.spinner.hide();
      },
      error => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          data: { message: 'Error en cargar. Por favor, intente logear nuevamente.' },
          duration: this._duration * 1000,
          panelClass: ['snack-bar-warning']
        });
        this.spinner.hide();
      }
    );
  }

  formatToHHmm(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  parseTimeStringToDate(timeString: string): Date {
    if (!timeString) {
      return new Date();
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return new Date();
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  onSubmit(): void {
    if (this.programacionForm.valid) {
      const formData = this.programacionForm.value;
      const horaInicio = this.parseTimeStringToDate(formData.horaInicio);
      const horaFin = this.parseTimeStringToDate(formData.horaFin);

      if (!horaInicio || !horaFin) {
        this.snackBar.open('Formato de hora inválido. Por favor, ingrese horas válidas.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-bar-warning']
        });
        return;
      }

      const diffMinutes = (horaFin.getTime() - horaInicio.getTime()) / (1000 * 60);

      if (formData.tiempoPromedio > diffMinutes) {
        this.snackBar.open('El tiempo promedio no puede exceder la diferencia entre hora de inicio y hora de fin.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-bar-warning']
        });
        return;
      }

      const programacionRequest = new ProgramacionFechasRequest({
        fechas: formData.fecha, // Usar la lista de fechas desde el formulario
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        tiempoPromedio: formData.tiempoPromedio,
        usuarioCreador: this.usuarioCreador,
        idMedico: formData.medicoid,
        idProcedimiento: this.procedimientoId || 0
      });

      this.spinner.show();
      this.programacionService.crearProgramacionesEnFechas(programacionRequest).subscribe(
        response => {
          this.spinner.hide();
          this.dialogRef.close({ success: true, message: 'Programación creada exitosamente.' });
        },
        error => {
          this.spinner.hide();
          this.snackBar.open('Error al crear la programación. Por favor, intente nuevamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-bar-warning']
          });
        }
      );
    }
  }
  dateRemoved(event: DateRemoveEvent<Date>): void {
    console.log('Fecha eliminada:', event);
    this.fechasSeleccionadas = this.fechasSeleccionadas.filter(date => date !== event.date);
  }
}
