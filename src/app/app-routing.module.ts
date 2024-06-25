import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacionService } from './services/autenticacion.service';
import { LoginComponent } from './views/authentication/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./views/authentication/authentication.module').then(m => m.AuthenticationModule) },
  {
    path: 'dashboard', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AutenticacionService]
  },
  { path: '**', redirectTo: 'dashboard' }
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
