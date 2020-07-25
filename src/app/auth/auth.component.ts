import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponse } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLogin = true;
  email: string;
  password: string;
  message: string;
  constructor(
    private authService: AuthService,
    private route: Router  ) {}

  ngOnInit() {}

  authenticate(email, password) {
    if (!email || !password) {
      return null;
    }
    let observable: Observable<AuthResponse>;
    if (this.isLogin) {
      observable = this.authService.login(email, password);
    } else {
      observable = this.authService.createUser(email, password);
    }

    observable.subscribe(
      (responseData) => {
        console.log(responseData);
        this.route.navigateByUrl('/projects');
      },
      (error: HttpErrorResponse) => {
        let processedMessage = 'There was an error. Please try again later';
        const errorMessage = error.error.error.message;
        if (errorMessage === 'EMAIL_EXISTS') {
          processedMessage = 'This email address already exists!';
        } else if (errorMessage === 'EMAIL_NOT_FOUND') {
          processedMessage = 'This email address could not be found';
        } else if (errorMessage === 'INVALID_PASSWORD') {
          processedMessage = 'This password is not correct';
        }
        this.message = processedMessage;
      }
    );
  }

  onSubmit(f: NgForm) {
    if (!f.valid) {
      return;
    }
    const email = f.value.email;
    const password = f.value.password;
    this.authenticate(email, password);
    f.reset();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
