import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {OvertimeService} from '../../services/overtime/overtime.service';
import {MonthlyOvertime, OvertimeAPIData, YearlyOvertime} from '../../types/overtime';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';
import {HttpResponse} from '@angular/common/http';
import dayjs from 'dayjs';

@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css']
})
export class OvertimeComponent implements OnInit {

  allYearlyOvertimes: object;
  allMonthlyOvertimes: object;
  yearlyDataSource: MatTableDataSource<YearlyOvertime>;
  monthlyDataSource: MatTableDataSource<MonthlyOvertime>;
  displayedColumns: string[] = ['userName', 'userEmail', 'hours', 'updatedAt'];
  currentlyLoggedInUser: UserFromJwt;

  activeCalendarValue = 'yearly';

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;
  monthValueSelected: Date;
  yearlyValueSelected: number = new Date().getFullYear();
  monthlyValues: Date[] = [];
  yearlyValues: number[] = [];

  constructor(private overtimeService: OvertimeService, private authenticationService: AuthenticationService) {
    this.currentlyLoggedInUser = authenticationService.currentUserInfoValue;
  }

  ngOnInit() {
    this.fetchData();
  }

  get isUserPrivileged(): boolean {
    return this.authenticationService.isCurrentUserPrivileged;
  }


  fetchData() {
    if (this.isUserPrivileged) {
      this.overtimeService.fetchOvertimeForAllUsers().subscribe(response => {
        this.receivedOvertimes(response);
      });
    } else {
      this.overtimeService.fetchOvertimeForSingleUser(this.currentlyLoggedInUser.id).subscribe(response => {
        this.receivedOvertimes(response);
      });
    }

  }

  recalculateOvertimes() {
    if (this.isUserPrivileged) {
      this.overtimeService.recalculateOvertimesForEveryone().subscribe(response => {
        this.receivedOvertimes(response);
      });
    } else {
      this.overtimeService.recalculateOvertimesForUser(this.currentlyLoggedInUser.id).subscribe(response => {
        this.receivedOvertimes(response);
      });
    }
  }

  isYearlyActive() {
    return this.activeCalendarValue === 'yearly';
  }

  setActiveCalendar(value: string) {
    this.activeCalendarValue = value;
  }

  formatMonth(data: Date) {
    return dayjs(data).format('MMMM, YYYY');
  }

  dropDownValueChanged() {
    this.yearlyDataSource = new MatTableDataSource(this.allYearlyOvertimes[this.yearlyValueSelected]);
    this.monthlyDataSource = new MatTableDataSource(this.allMonthlyOvertimes[dayjs(this.monthValueSelected).format('YYYY-MM-DD')]);
  }

  convertHoursToText(hours: number) {
    let negative = false;
    if (hours < 0) {
      negative = true;
    }

    const valueAsString = Math.abs(hours).toString().split('.');
    const hourValue = parseInt(valueAsString[0], 10);
    const minutesValue = parseInt(valueAsString[1] ?? '0', 10);

    let finalText = `${negative ? '-' : ''}`;
    if (hourValue > 0) {
      finalText = finalText + ` ${hourValue} hours`;
    }
    if (minutesValue > 0) {
      finalText = finalText + ` ${minutesValue} minutes`;
    }

    return finalText;
  }

  private receivedOvertimes(response: HttpResponse<OvertimeAPIData>) {
    if (response.status > 199 && response.status < 300) {
      const overtimeAPIData = response.body;
      this.allYearlyOvertimes = overtimeAPIData.yearlyOvertimes;
      this.allMonthlyOvertimes = overtimeAPIData.monthlyOvertimes;
      this.yearlyValues = Object.keys(this.allYearlyOvertimes).map(item => parseInt(item, 10)).sort((first, second) => second - first);
      this.yearlyValueSelected = this.yearlyValues[0];
      this.monthlyValues = Object.keys(this.allMonthlyOvertimes).map(item => new Date(item)).sort((first, second) => second.getTime() - first.getTime());
      this.monthValueSelected = this.monthlyValues[0];

      this.yearlyDataSource = new MatTableDataSource(this.allYearlyOvertimes[this.yearlyValueSelected]);
      this.yearlyDataSource.sort = this.sort;
      this.yearlyDataSource.paginator = this.paginator;

      this.monthlyDataSource = new MatTableDataSource(this.allMonthlyOvertimes[dayjs(this.monthValueSelected).format('YYYY-MM-DD')]);
      this.monthlyDataSource.sort = this.sort;
      this.monthlyDataSource.paginator = this.paginator;
    } else {
      this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while performing this operation. Please try again later');
    }
  }
}
