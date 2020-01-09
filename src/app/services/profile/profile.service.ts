import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {User} from '../../types/user';
import {ApiUrls} from '../../helpers/AppConfiguration';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {
  }

  fetchUserProfile(): Observable<HttpResponse<User>> {
    return this.http.get<User>(ApiUrls.profile, {observe: 'response'});
  }

  changePassword(changePasswordData: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(ApiUrls.profile, changePasswordData, {observe: 'response'});
  }
}
