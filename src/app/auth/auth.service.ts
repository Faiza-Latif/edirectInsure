import { User } from './user.model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient,
    ) {
  }

  get userIsAuthenticated() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return !!user.token;
          } else {
            return false;
          }
        })
      );
  }

  get userId() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return user.id;
          } else {
            return null;
          }
        })
      );
  }

  get token() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return user.token;
          } else {
            return null;
          }
        })
      );
  }

  createUser(email: string, password: string) {
    // create a new email and password user with signupNewUser
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      });
  }

  login(email: string, password: string) {
    // sign in a user with an email and password
    // Auth response is the data i'm expecting to receive
    return this.http
      .post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true
        })
      .pipe(
        tap(this.setUserData.bind(this))
      );
  }

  private setUserData(userData: AuthResponse) {
    const expirationToken = new Date(new Date().getTime() + +userData.expiresIn * 1000);
    const newUser = new User(userData.localId, userData.email, userData.idToken, expirationToken);
    this._user.next(newUser);
    this.autoLogout(newUser.tokenDuration);
  }


  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }


  logout() {
    this._user.next(null);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
