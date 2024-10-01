import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProgramacionIndexComponent } from './programacion/programacion-index/programacion-index.component';
import { RoleGuardGuard } from 'src/app/guards/role-guard.guard';
import { CitasIndexComponent } from './citas/citas-index/citas-index.component';
import { AtencionIndexComponent } from './atencion/atencion-index/atencion-index.component';




const routes: Routes = [
  {
  path: '',
  component:DashboardComponent,
  children: [
    {
      path: 'home', component: HomeComponent, data: { titulo: 'Dashboard' } 
    },
    {
      path: 'programacion', component: ProgramacionIndexComponent, data: { titulo: 'Programacion' } ,
      canActivate: [RoleGuardGuard]
    },
    {
      path: 'citas', component: CitasIndexComponent, data: { titulo: 'Citas' } ,
      canActivate: [RoleGuardGuard]
    },
    {
      path: 'atencion', component: AtencionIndexComponent, data: { titulo: 'Atencion' } ,
      
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
