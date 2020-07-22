import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../types/user';
import {ApiUrls} from '../../helpers/AppConfiguration';

export interface ResetPassword {
  password: string;
}

export interface CreateNewUserEntity {
  firstName: string;
  lastName: string;
  email: string;
  roles: string;
  password: string;
  totalLeaves: number;
  leavesFromLastYear: number;
}

export interface AddMonthHour {
  hours: number;
  year: number;
  month: number;
}

interface IUserMonthlyHours {
  user: User;
  hours: number;
  yearMonth: Date;

  readonly getMonth: number;
  readonly getYear: number;

}

export class UserMonthlyHours implements IUserMonthlyHours {
  hours: number;
  user: User;
  yearMonth: Date;

  constructor(hours: number, user: User, yearMonth: Date) {
    this.hours = hours;
    this.user = user;
    this.yearMonth = yearMonth;
  }

  get getMonth() {
    return this.yearMonth.getMonth();
  }

  get getYear() {
    return this.yearMonth.getFullYear();
  }
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
  }

  public fetchAllUsers(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(ApiUrls.users, {observe: 'response'});
  }

  public editUser(userId: string, data: User): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${ApiUrls.users}/${userId}/edit`, data, {observe: 'response'});
  }

  public deleteUser(userId: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${ApiUrls.users}/${userId}/`, {observe: 'response'});
  }

  public resetUserPassword(userId: string): Observable<HttpResponse<ResetPassword>> {
    return this.http.put<ResetPassword>(`${ApiUrls.users}/${userId}/reset-password/`, null, {observe: 'response'});
  }

  public createNewUser(data: CreateNewUserEntity): Observable<HttpResponse<ResetPassword>> {
    return this.http.post<ResetPassword>(`${ApiUrls.users}/create/`, data, {observe: 'response'});
  }

  public fetchMonthlyUserData(userId: string): Observable<HttpResponse<UserMonthlyHours[]>> {
    return this.http.get<UserMonthlyHours[]>(`${ApiUrls.monthlyHours}/${userId}`, {observe: 'response'});
  }

  public updateMonthHourForUser(data: AddMonthHour, userId: string): Observable<HttpResponse<UserMonthlyHours>> {
    return this.http.post<UserMonthlyHours>(`${ApiUrls.monthlyHours}/${userId}/`, data, {observe: 'response'});
  }
}
