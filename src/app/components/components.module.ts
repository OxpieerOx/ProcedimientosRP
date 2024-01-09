import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { SplashScreenService } from './splash-screen/services/splash-screen.service';



@NgModule({
  declarations: [
    SplashScreenComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SplashScreenComponent
  ],
  providers: [
    SplashScreenService,
  ],
})
export class ComponentsModule { }
