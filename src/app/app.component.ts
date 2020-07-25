import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private previousAuthState = false;
  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {
    this.subscription = this.authService.userIsAuthenticated.subscribe(
      (isAuth) => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.route.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
