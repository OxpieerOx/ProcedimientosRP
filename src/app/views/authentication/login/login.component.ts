import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { SecurityService } from 'src/app/services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SplashScreenService } from 'src/app/components/splash-screen/services/splash-screen.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  errorMessage: string = "";


  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: SecurityService,
    private snackBar: MatSnackBar,
    private _splash: SplashScreenService,) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public login() {
    this._splash.show('Autenticando...');
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
  
    this.user.userName = username;
    this.user.password = password;
  
    this.service.getToken(this.user).subscribe(
      response => {
        sessionStorage.setItem("token", response.token);
        this.redirectLogin();
      },
      error => {
        this.errorMessage = <any>error;
        console.log("error login", this.errorMessage);
        this.router.navigate(['/login']);
        this._splash.hide(); // Ocultar el splash en caso de error también
      }
    );
  }
  
  

  public redirectLogin() {
    this.router.navigate(['/dashboard']);
  }

}
