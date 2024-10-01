import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cita } from 'src/app/models/cita.model';
import { CitaService } from 'src/app/services/cita.service';
import { AtencionEditComponent } from '../atencion-edit/atencion-edit.component';

@Component({
  selector: 'app-atencion-index',
  templateUrl: './atencion-index.component.html',
  styleUrls: ['./atencion-index.component.css']
})
export class AtencionIndexComponent implements OnInit {

  citas: Cita[] = [];
  filterFecha: string = ""; 
  filterIdPaciente: number | null = null;;
  filterNCuenta: string = '';
  isLoadingCitas: boolean = false;
  medicoUsername: string = "";

  constructor(private citaService: CitaService,  private snackBar: MatSnackBar,public dialog: MatDialog,) { }

  ngOnInit(): void {
    // Obtener el username del médico desde localStorage
    this.medicoUsername = localStorage.getItem('user') || "";
    const today = new Date();
    this.filterFecha = today.toISOString().split('T')[0];
    console.log("filterfecha",this.filterFecha)
    // Cargar las citas del médico al inicializar el componente
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.isLoadingCitas = true;

    // Llamar al servicio para obtener las citas del médico usando el username y filtros
    this.citaService.filtrarCitas(this.medicoUsername, this.filterFecha, this.filterIdPaciente || 0, this.filterNCuenta)
      .subscribe(
        (data: Cita[]) => {
          this.citas = data;
          this.isLoadingCitas = false;
        },
        error => {
          console.error('Error al cargar citas:', error);
          this.isLoadingCitas = false;
        }
      );
  }

  aplicarFiltros(): void {
    this.cargarCitas();
  }

  
  openDialog(cita: Cita): void {
 

    const dialogRef = this.dialog.open(AtencionEditComponent, {
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
      this.cargarCitas();
    });
  }
}
