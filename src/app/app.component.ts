import { Component, OnInit } from '@angular/core';
import { SplashScreenService } from './components/splash-screen/services/splash-screen.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
		private router: Router
	) { }

  ngOnInit() {
		const routerSubscription = this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.splashScreenService.hide();

				// scroll to top on every route change
				window.scrollTo(0, 0);
			}
		});

		this.unsubscribe.push(routerSubscription);
	}
}
