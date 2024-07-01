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

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProgramacionIndexComponent,
    ProgramacionEditComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
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
