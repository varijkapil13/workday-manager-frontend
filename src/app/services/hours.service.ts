import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Hours} from '../types/hours';
import {ApiUrls} from '../helpers/AppConfiguration';

@Injectable({
  providedIn: 'root'
})
export class HoursService {


  constructor(private http: HttpClient) {
  }

  public fetchHoursForAllUsers(): Observable<HttpResponse<Hours[]>> {
    return this.http.get<Hours[]>(ApiUrls.workdays, {observe: 'response'});
  }

  public fetchHoursForSingleUser(userId: string): Observable<HttpResponse<Hours[]>> {
    return this.http.get<Hours[]>(`${ApiUrls.workdays}/${userId}/`, {observe: 'response'});
  }
}
