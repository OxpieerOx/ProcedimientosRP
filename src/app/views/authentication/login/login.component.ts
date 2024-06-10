import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { SecurityService } from 'src/app/services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SplashScreenService } from 'src/app/components/splash-screen/services/splash-screen.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackBarComponent } from 'src/app/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _duration = 5;
  user: User = new User();
  errorMessage: string = "";


  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: SecurityService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private _splash: SplashScreenService,) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public login() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
  
    this.user.username = username;
    this.user.password = password;
    this.spinner.show();
    this.service.getToken(this.user).subscribe(
      response => {
        sessionStorage.setItem("token", response.token);
        this.redirectLogin();
        this.spinner.hide();
      },
      error => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          data: { message: 'Tu usuario y/o contraseña son incorrectas' },
          duration: this._duration * 1000,
          panelClass: ['snack-bar-warning'],
        });
        this.spinner.hide(); 
      }
    );
  }
  
  

  public redirectLogin() {
    this.router.navigate(['/dashboard']);
  }

}
