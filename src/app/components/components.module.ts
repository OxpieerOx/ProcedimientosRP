import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { SplashScreenService } from './splash-screen/services/splash-screen.service';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';



@NgModule({
  declarations: [
    SplashScreenComponent,
    SnackBarComponent,
    SvgIconComponent
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
