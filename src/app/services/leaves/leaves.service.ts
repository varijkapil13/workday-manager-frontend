import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUrls} from '../../helpers/AppConfiguration';
import {LeavesCalendar} from '../../types/leaves-calendar';
import {Leave} from '../../types/leave';

export interface NewLeaveBody {
  connection: string;
  title: string;
  startDate: string;
  endDate: string;
  isOvertime: boolean;
  isSickLeave: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class LeavesService {

  constructor(private http: HttpClient) {
  }

  public fetchLeavesForAllUsers(): Observable<HttpResponse<LeavesCalendar>> {
    return this.http.get<LeavesCalendar>(ApiUrls.leaves, {observe: 'response'});
  }

  public createALeave(userId: string, data: NewLeaveBody): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${ApiUrls.leaves}/${userId}`, data, {observe: 'response'});
  }

  public editALeave(data: NewLeaveBody): Observable<HttpResponse<any>> {
    return this.http.post<any>(ApiUrls.leaves, data, {observe: 'response'});
  }

  public approveLeavesWithConnection(userId: string, connection: string): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${ApiUrls.leaves}/approvals/${userId}/${connection}`, null, {observe: 'response'});
  }

  public getLeavesToApprove(): Observable<HttpResponse<Leave[]>> {
    return this.http.get<Leave[]>(`${ApiUrls.leaves}/approvals/`, {observe: 'response'});
  }

  public deleteLeaves(userId: string, connection: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${ApiUrls.leaves}/${userId}/${connection}`, {observe: 'response'});
  }

}
