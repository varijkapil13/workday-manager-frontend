import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiUrls} from '../helpers/AppConfiguration';


export const JWT_KEY_LOCAL_STORAGE = 'WORKDAY_MANAGER_USER_JWT';

export interface JwtToken {
  token: string;
}

export interface UserFromJwt {
  email: string;
  isAdmin: boolean;
  isManager: boolean;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<JwtToken>;
  private userInfoSubject: BehaviorSubject<UserFromJwt>;
  public currentUser: Observable<JwtToken>;
  public currentUserInfo: Observable<UserFromJwt>;

  constructor(private http: HttpClient) {
    const tokenFromStorage = JSON.parse(localStorage.getItem(JWT_KEY_LOCAL_STORAGE));
    this.currentUserSubject = new BehaviorSubject<JwtToken>(tokenFromStorage);
    this.currentUser = this.currentUserSubject.asObservable();
    this.userInfoSubject = new BehaviorSubject<UserFromJwt>(AuthenticationService.convertJwtToEntity(tokenFromStorage.token));
    this.currentUserInfo = this.userInfoSubject.asObservable();
  }

  private static convertJwtToEntity(token: string): UserFromJwt {
    const tokenInBase64Url = token.split('.')[1];
    const tokenInBase64 = tokenInBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const tokenAsJsonPayload = decodeURIComponent(atob(tokenInBase64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(tokenAsJsonPayload);
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public get currentUserInfoValue() {
    return this.userInfoSubject.value;
  }

  public login(username, password) {
    return this.http.post<JwtToken>(ApiUrls.login, {username, password})
    .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem(JWT_KEY_LOCAL_STORAGE, JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.userInfoSubject.next(AuthenticationService.convertJwtToEntity(user.token));
      return user;
    }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem(JWT_KEY_LOCAL_STORAGE);
    this.currentUserSubject.next(null);
    location.reload();
  }
}
