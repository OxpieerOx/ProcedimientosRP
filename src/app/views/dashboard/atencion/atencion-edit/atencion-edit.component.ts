import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CitaService } from 'src/app/services/cita.service';
import { Cita } from 'src/app/models/cita.model';
import { CitaRequestDTO, EstadoCita } from 'src/app/models/request/citarequest.model';

@Component({
  selector: 'app-atencion-edit',
  templateUrl: './atencion-edit.component.html',
  styleUrls: ['./atencion-edit.component.css']
})
export class AtencionEditComponent implements OnInit {
  editAtencionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AtencionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cita: Cita },  // Recibimos la cita a editar
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private citaService: CitaService
  ) {
    // Inicializamos el formulario reactivo con los campos necesarios
    this.editAtencionForm = this.fb.group({
      fecha: [this.data.cita.fecha, Validators.required],
      hora: [this.data.cita.horaInicio, Validators.required],  // Ejemplo, puedes ajustar los campos
      informe: [this.data.cita.informeDiagnostico,Validators.required]  // Campo adicional opcional
    });
  }

  ngOnInit(): void {
  
  }

  onSave(): void {
    if (this.editAtencionForm.valid) {
      // Mostramos un spinner mientras se procesa la solicitud
      this.spinner.show();
      
      const formValues = this.editAtencionForm.value;
      const [horaInicio, horaFin] = formValues.hora.split(' - ');

      const citaRequest = new CitaRequestDTO({
        idPaciente: Number(this.data.cita.idPaciente), 
        nroCuenta: this.data.cita.nroCuenta,
        fecha: String(this.data.cita.fecha),
        horaInicio,
        horaFin: String(this.data.cita.horaFin),
        idProgramacion: this.data.cita.programacion.id,
        idMedico: this.data.cita.medico.id,
        usuarioCreador: this.data.cita.usuarioCreador,
        esAdicional: this.data.cita.esAdicional,
        estado: EstadoCita.ATENDIDO,
        informeDiagnostico: formValues.informe 
      });

      this.citaService.updateCita(this.data.cita.id, citaRequest).subscribe(
        response => {
          // Cerramos el diálogo y retornamos un éxito
          this.dialogRef.close({ success: true, message: 'Atención actualizada correctamente' });
          this.spinner.hide();
        },
        error => {
          // Manejo de error
          this.snackBar.open('Error al actualizar la atención', 'Cerrar', { duration: 5000 });
          this.spinner.hide();
        }
      );
    }
  }

  // Método que se invoca al cancelar la operación
  onCancel(): void {
    this.dialogRef.close();
  }
}
