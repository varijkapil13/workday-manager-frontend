import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ApiUrls} from '../../helpers/AppConfiguration';
import {Overtime} from '../../types/overtime';

@Injectable({
  providedIn: 'root'
})
export class OvertimeService {

  constructor(private http: HttpClient) {
  }

  public fetchOvertimeForAllUsers(): Observable<HttpResponse<Overtime[]>> {
    return this.http.get<Overtime[]>(ApiUrls.overtimes, {observe: 'response'});
  }

  public fetchOvertimeForSingleUser(userId: string): Observable<HttpResponse<Overtime>> {
    return this.http.get<Overtime>(`${ApiUrls.overtimes}/${userId}/`, {observe: 'response'});
  }

  public recalculateOvertimesForEveryone(): Observable<HttpResponse<Overtime[]>> {
    return this.http.post<Overtime[]>(ApiUrls.overtimes, null, {observe: 'response'});
  }

  public recalculateOvertimesForUser(userId: string): Observable<HttpResponse<Overtime>> {
    return this.http.post<Overtime>(`${ApiUrls.overtimes}/${userId}`, null, {observe: 'response'});
  }
}
