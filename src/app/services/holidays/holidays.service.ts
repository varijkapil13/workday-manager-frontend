import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {ApiUrls} from '../../helpers/AppConfiguration';
import {Observable} from 'rxjs';
import {Holiday} from '../../types/holiday';

export interface CreateHolidayBody {
  date: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {

  constructor(private http: HttpClient) {
  }

  public fetchAllHolidaysInCurrentYear(): Observable<HttpResponse<Holiday[]>> {
    return this.http.get<Holiday[]>(`${ApiUrls.holidays}/currentYear`, {observe: 'response'});
  }

  public createAHoliday(holiday: CreateHolidayBody): Observable<HttpResponse<Holiday>> {
    return this.http.post<Holiday>(ApiUrls.holidays, holiday, {observe: 'response'});
  }

  public deleteHoliday(holidayId: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${ApiUrls.holidays}/${holidayId}`, {observe: 'response'});
  }

}
