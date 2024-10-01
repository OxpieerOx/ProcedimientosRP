import { Component, OnInit } from '@angular/core';
import { Medico } from "../../../../models/medico.model";
import { MedicoService } from "../../../../services/medico.service";
import { ServicioService } from "../../../../services/servicio.service";
import { Servicio } from "../../../../models/servicio.model";
import { CitaEditComponent } from "../../citas/cita-edit/cita-edit.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MedicoAddComponent } from "../medico-add/medico-add.component";
import { MedicoEditComponent } from "../medico-edit/medico-edit.component";

@Component({
  selector: 'app-medico-index',
  templateUrl: './medico-index.component.html',
  styleUrls: ['./medico-index.component.css']
})
export class MedicoIndexComponent implements OnInit {

  medicos: Medico[] = [];
  servicios: Servicio[] = [];
  selectServicio: any;
  isLoadingMedicos: boolean = false;


  constructor(
    private medicoService: MedicoService,
    private servicioService: ServicioService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.cargarMedicos();
    this.getServicios();
  }

  private cargarMedicos() {
    this.isLoadingMedicos = true;
    this.medicoService.listAllMedicos().subscribe(
      {
        next: medicos => {
          this.medicos = medicos;
          this.isLoadingMedicos = false;
        },
        error: err => {
          console.error(err);
          this.isLoadingMedicos = false;
        }
      }
    )
  }

  getServicios(): void {
    this.servicioService.getAllServices().subscribe(data => {
      this.servicios = data;
      if (this.servicios.length > 0) {
        this.selectServicio = this.servicios[0].serviceId;
      }
    });
  }

  onServicioChange(): void {
  }

  ngOnInit(): void {
  }

  openDialogEditMedico(medico: Medico) {
    console.log("medico", medico)
    const dialogRef = this.dialog.open(MedicoEditComponent, {
      width: '500px',
      data: {medico: medico}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.snackBar.open(result.message, 'Cerrar', {
          duration: 10000,
          panelClass: ['snack-bar-success']
        });
      } else {
        console.log('Operación cancelada o sin éxito');
      }
    });

  }

  openDialogAddMedico() {
    const dialogRef = this.dialog.open(MedicoAddComponent, {
      width: '500px',
      data: {medico: new Medico()}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.snackBar.open(result.message, 'Cerrar', {
          duration: 10000,
          panelClass: ['snack-bar-success']
        });
        this.cargarMedicos();
      } else {
        console.log('Operación cancelada o sin éxito');
      }
    });
  }
}
