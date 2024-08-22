import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { CitaListado } from 'src/app/models/citalistado.model';
import { Paciente } from 'src/app/models/paciente.model';
import { CitaRequestDTO, EstadoCita } from 'src/app/models/request/citarequest.model';
import { CitaService } from 'src/app/services/cita.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ProcedimientoService } from 'src/app/services/procedimiento.service';

@Component({
  selector: 'app-citas-add',
  templateUrl: './citas-add.component.html',
  styleUrls: ['./citas-add.component.css']
})
export class CitasAddComponent implements OnInit {

  assignPatientForm: FormGroup;
  patientInfo: Paciente;
  isLoading: boolean = false;
  searchFailed: boolean = false;
  patientFound: boolean = false;
  citaData: CitaListado;
  procedimientos: any[] = [];  // Lista de procedimientos
  selectedProcedimiento: any;  // Procedimiento seleccionado
  showProcedimientosDropdown: boolean = false;  // Mostrar u ocultar el dropdown

  constructor(
    public dialogRef: MatDialogRef<CitasAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private procedimientoService:ProcedimientoService,
    private patientService: PacienteService,
    private citaService: CitaService
  ) {
    this.patientInfo = new Paciente();
    this.assignPatientForm = this.fb.group({
      patientSearch: ['', Validators.required],
      selectedProcedimiento: ['', Validators.required] 
    });
    
    this.citaData = data.cita;
  }

  ngOnInit(): void {
    this.checkIfProcedimientoIsGeneral();
    this.loadProcedimientos();
    console.log("data",this.data  )
  }

  checkIfProcedimientoIsGeneral(): void {
    console.log("this.data.procedimiento",this.data.cita.procedimiento)
    // Aquí se verifica si el procedimiento es "General"
    if (this.data.cita.procedimiento === 'General') {
      this.showProcedimientosDropdown = true;
    }
  }

  loadProcedimientos(): void {
    this.procedimientoService.obtenerProcedimientosPorServicio(this.data.servicioId).subscribe(
      (procedimientos) => {
        // Filtrar los procedimientos para excluir el que se llama "General"
        this.procedimientos = procedimientos.filter(procedimiento => procedimiento.nombre !== 'General');
      },
      (error) => {
        this.snackBar.open('Error al cargar los procedimientos', 'Cerrar', {
          duration: 5000,
          panelClass: ['snack-bar-warning']
        });
      }
    );
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSearch(): void {
    const patientSearchControl = this.assignPatientForm.get('patientSearch');
    if (patientSearchControl?.valid)  {
      this.isLoading = true;
      this.searchFailed = false;
      this.patientFound = false;
      const searchTerm = this.assignPatientForm.value.patientSearch;
      this.patientService.buscarPacientePorId(searchTerm).subscribe(
        (data) => {
          this.isLoading = false;
          if (data) {
            this.patientInfo = data;
            this.patientFound = true;
          } else {
            this.searchFailed = true;
            this.patientInfo = new Paciente();
            this.patientFound = false;
          }
        },
        (error) => {
          this.isLoading = false;
          this.searchFailed = true;
          this.snackBar.open('Error al buscar el paciente', 'Cerrar', {
            duration: 5000,
            panelClass: ['snack-bar-warning']
          });
          this.patientInfo = new Paciente();
          this.patientFound = false;
        }
      );
    }
  }

  onAssign(): void {
    if (this.patientFound) {
      const fechaFormatted = this.formatDate(this.citaData.fecha);
      const horaInicioFormatted = this.formatTime(this.citaData.horaInicio);
      const horaFinFormatted = this.formatTime(this.citaData.horaFin);
      const selectedProcedimiento = this.showProcedimientosDropdown
        ? this.assignPatientForm.get('selectedProcedimiento')?.value // Usar el procedimiento seleccionado del dropdown
        : this.data.procedimiento;   // Usar el procedimiento de los datos
      console.log("información del paciente", this.assignPatientForm.value);
      const citaRequest = new CitaRequestDTO({
        idPaciente: this.patientInfo.IdPaciente,
        nroCuenta: this.assignPatientForm.value.patientSearch,
        fecha: fechaFormatted,
        horaInicio: horaInicioFormatted,
        horaFin: horaFinFormatted,
        idProgramacion: this.citaData.idProgramacion,
        idMedico: this.citaData.idMedico,
        usuarioCreador: this.citaData.usuarioCreador,
        esAdicional: this.citaData.esAdicional,
        estado: EstadoCita.PAGADO,
        financiamiento: this.patientInfo.Financiamiento,
        idProcedimiento:selectedProcedimiento
      });
  
      this.citaService.insertarCita(citaRequest).subscribe(
        response => {
          this.snackBar.open('Cita guardada con éxito', 'Cerrar', {
            duration: 5000,
            panelClass: ['snack-bar-success']
          });
          this.dialogRef.close({ success: true, message: 'Cita Creada exitosamente.' });
        },
        error => {
          this.snackBar.open('Error al guardar la cita', 'Cerrar', {
            duration: 5000,
            panelClass: ['snack-bar-warning']
          });
        }
      );
    }
  }
  

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1);
    const day = this.padNumber(date.getDate());
    return `${year}-${month}-${day}`;
  }

  formatTime(time: Date): string {
    const hours = this.padNumber(time.getHours());
    const minutes = this.padNumber(time.getMinutes());
    return `${hours}:${minutes}`;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
