import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from "@angular/forms";
import { MedicoService } from "../../../../services/medico.service";
import { MatDialogRef } from "@angular/material/dialog";
import { RolService } from "../../../../services/rol.service";
import { Rol } from "../../../../models/rol.mode";

@Component({
  selector: 'app-medico-add',
  templateUrl: './medico-add.component.html',
  styleUrls: ['./medico-add.component.css']
})
export class MedicoAddComponent implements OnInit {

  crearMedicoForm: FormGroup;
  modalTitle: string = 'Crear Médico';
  roles: Rol[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private medicoService: MedicoService,
    private dialogRef: MatDialogRef<MedicoAddComponent>,
    private roleService: RolService
  ) {
    this.crearMedicoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]],
      roleIds: ['', Validators.required],
    });
    this.cargarRoles();
  }

  ngOnInit(): void {
  }

  cargarRoles() {
    this.roleService.obtenerRoles().subscribe(
      roles => {
        this.roles = roles;
      });
  }

  onGuardarMedico() {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onGuardar() {

  }
}
