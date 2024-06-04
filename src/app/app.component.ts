import { Component, OnInit } from '@angular/core';
import { SplashScreenService } from './components/splash-screen/services/splash-screen.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'PlantillaLogin';
  private unsubscribe: Subscription[] = [];

  constructor(
		private splashScreenService: SplashScreenService,
		private router: Router,
		private spinner: NgxSpinnerService
	) { }

	ngOnInit() {
		this.spinner.show();
	
		setTimeout(() => {
		  this.spinner.hide();
		}, 1000);
	  }
}
