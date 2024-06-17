import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { Prueba1Component } from './prueba1/prueba1.component';



const routes: Routes = [
  {
  path: '',
  component:DashboardComponent,
  children: [
    {
      path: 'prueba1', component: Prueba1Component,
    },
    { path: '**', redirectTo: '' }
   
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
