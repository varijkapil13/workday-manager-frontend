import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ApiUrls} from '../../helpers/AppConfiguration';
import {OvertimeAPIData} from '../../types/overtime';

@Injectable({
  providedIn: 'root'
})
export class OvertimeService {

  constructor(private http: HttpClient) {
  }

  public fetchOvertimeForAllUsers(): Observable<HttpResponse<OvertimeAPIData>> {
    return this.http.get<OvertimeAPIData>(ApiUrls.overtimes, {observe: 'response'});
  }

  public fetchOvertimeForSingleUser(userId: string): Observable<HttpResponse<OvertimeAPIData>> {
    return this.http.get<OvertimeAPIData>(`${ApiUrls.overtimes}/${userId}/`, {observe: 'response'});
  }

  public recalculateOvertimesForEveryone(): Observable<HttpResponse<OvertimeAPIData>> {
    return this.http.post<OvertimeAPIData>(ApiUrls.overtimes, null, {observe: 'response'});
  }

  public recalculateOvertimesForUser(userId: string): Observable<HttpResponse<OvertimeAPIData>> {
    return this.http.post<OvertimeAPIData>(`${ApiUrls.overtimes}/${userId}`, null, {observe: 'response'});
  }
}
