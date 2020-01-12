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
}
