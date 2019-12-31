import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ApiUrls} from '../../helpers/AppConfiguration';
import {Observable} from 'rxjs';
import {Holiday} from '../../types/holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {

  constructor(private http: HttpClient) {
  }

  public fetchAllHolidaysInCurrentYear(): Observable<HttpResponse<Holiday[]>> {
    return this.http.get<Holiday[]>(`${ApiUrls.holidays}/currentYear`, {observe: 'response'});
  }
}
