import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  routerHidden = true;
  isLoading = false;
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000); // Small delay for smooth transition
      }
    });
  }
}
