import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Hours} from '../types/hours';

@Injectable({
  providedIn: 'root'
})
export class HoursService {


  constructor(private http: HttpClient) {
  }

  public fetchCurrentUsersHours(): Observable<HttpResponse<Hours[]>> {
    return this.http.get<Hours[]>('http://localhost:8080/api/workdays', {observe: 'response'});
  }
}
