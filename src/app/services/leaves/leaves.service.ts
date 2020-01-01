import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUrls} from '../../helpers/AppConfiguration';


export interface LeavesCalendar {
  leaves: any[];
  users: any[];
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

}
