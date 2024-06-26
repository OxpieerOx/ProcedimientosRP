import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { HomeComponent } from './home/home.component';
import { ProgramacionIndexComponent } from './programacion/programacion-index/programacion-index.component';





@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProgramacionIndexComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
    RouterModule,
  ]
})
export class DashboardModule { }
