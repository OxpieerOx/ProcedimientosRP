import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { Prueba1Component } from './prueba1/prueba1.component';




@NgModule({
  declarations: [
    DashboardComponent,
    Prueba1Component,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ComponentsModule,
    RouterModule,
  ]
})
export class DashboardModule { }
