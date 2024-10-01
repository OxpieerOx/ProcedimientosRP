import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ComponentsModule } from 'src/app/components/components.module';
import { HomeComponent } from './home/home.component';
import { ProgramacionIndexComponent } from './programacion/programacion-index/programacion-index.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { ProgramacionEditComponent } from './programacion/programacion-edit/programacion-edit.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { CitasIndexComponent } from './citas/citas-index/citas-index.component';
import { CitasAddComponent } from './citas/citas-add/citas-add.component';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates';
import { ProgramacionFechaComponent } from './programacion/programacion-fecha/programacion-fecha.component';
import { CitaEditComponent } from './citas/cita-edit/cita-edit.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AtencionIndexComponent } from './atencion/atencion-index/atencion-index.component';
import { AtencionEditComponent } from './atencion/atencion-edit/atencion-edit.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProgramacionIndexComponent,
    ProgramacionEditComponent,
    CitasIndexComponent,
    CitasAddComponent,
    ProgramacionFechaComponent,
    CitaEditComponent,
    AtencionIndexComponent,
    AtencionEditComponent,
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    DashboardRoutingModule,
    NgxMultipleDatesModule,
    ComponentsModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    FlatpickrModule.forRoot()
  ]
})
export class DashboardModule { }
