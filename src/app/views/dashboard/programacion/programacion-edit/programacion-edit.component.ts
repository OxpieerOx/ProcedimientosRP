import { DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-programacion-edit',
  templateUrl: './programacion-edit.component.html',
  styleUrls: ['./programacion-edit.component.css'],
  providers: [DatePipe]
})
export class ProgramacionEditComponent implements OnInit {
  programacionId: number;
  procedimientoId: number;
  programacion: Programacion = new Programacion();
  modalTitle: string; 
  medicos: Medico[] = [];  
  programacionForm: FormGroup;
  usuarioCreador:String = "Admisionista"
  private _duration: number = 10;
  constructor(
    public dialogRef: MatDialogRef<ProgramacionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private programacionService: ProgramacionService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private medicoService: MedicoService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.procedimientoId = data.procedimientoId;
    this.programacionId = data.programacionId;
    this.modalTitle = this.programacionId ? 'Editar Programación' : 'Crear Programación';
    this.programacionForm = this.fb.group({
      fecha: ['', [Validators.required]],
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]], // HH:mm
      horaFin: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]], // HH:mm
      tiempoPromedio: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      medicoid: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    console.log(this.data.procedimientoId)
    if(this.programacionId){
      this.loadProgramacion()
    }
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.medicoService.listAllMedicos().subscribe(
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
        const fechaFormateada = this.programacion.fecha + 'T00:00:00';
        const horaInicioFormatted = this.formatToHHmm(this.programacion.horaInicio);
        const horaFinFormatted = this.formatToHHmm(this.programacion.horaFin);
        this.programacionForm.patchValue({
          fecha: fechaFormateada,
          horaInicio: horaInicioFormatted,
          horaFin: horaFinFormatted,
          tiempoPromedio: this.programacion.tiempoPromedio,
          medicoid: this.programacion.medico.id
        });
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

  onSubmit(): void {
    if (this.programacionForm.valid) {
      const formData = this.programacionForm.value;
      const programacionRequest = new ProgramacionRequest({
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        tiempoPromedio: formData.tiempoPromedio,
        fechaRegistro: this.programacion.fechaRegistro,  // Set appropriately if needed
        usuarioCreador: this.usuarioCreador, // Set appropriately if needed
        idMedico: formData.medicoid,
        idProcedimiento: this.procedimientoId || 0
      });

      if (this.programacionId) {
        // Editar la programación existente
        this.spinner.show();
        this.programacionService.actualizarProgramacion(this.programacion.id,programacionRequest).subscribe(
          response => {
            this.spinner.hide();
            // Manejar respuesta exitosa
            this.dialogRef.close({ success: true, message: 'Programación editada exitosamente.' }); // Cerrar diálogo con éxito
          },
          error => {
            this.spinner.hide();
            console.log(error.error.errorresponse.message)
            // Manejar error
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: { message: 'Error al editar la programación. Por favor, intente nuevamente.' },
              duration: this._duration * 1000,
              panelClass: ['snack-bar-warning']
            });
          }
        );
      } else {
        // Crear nueva programación
        this.spinner.show();
        this.programacionService.crearProgramacion(programacionRequest).subscribe(
          response => {
            this.spinner.hide();
            // Manejar respuesta exitosa
            this.dialogRef.close({ success: true, message: 'Programación creada exitosamente.' });
          },
          error => {
            this.spinner.hide();
            // Manejar error
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: { message: 'Error al crear la programación. Por favor, intente nuevamente.' },
              duration: this._duration * 1000,
              panelClass: ['snack-bar-warning']
            });
          }
        );
      }
    } else {
      // Formulario inválido
      console.log("Formulario inválido");
    }
  }
}