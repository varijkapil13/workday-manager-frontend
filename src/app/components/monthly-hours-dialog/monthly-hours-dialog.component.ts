import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AddMonthHour, UserMonthlyHours, UsersService} from '../../services/users/users.service';
import {User} from '../../types/user';
import dayjs from 'dayjs';

@Component({
  selector: 'app-monthly-hours-dialog',
  templateUrl: './monthly-hours-dialog.component.html',
  styleUrls: ['./monthly-hours-dialog.component.css']
})
export class MonthlyHoursDialogComponent implements OnInit {

  displayedColumns = ['yearMonth', 'hours'];
  dataSource: MatTableDataSource<any>;

  currentlyLoggedInUser: UserFromJwt;
  editingUser: User;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;

  loading = true;
  userMonthlyHoursData: UserMonthlyHours[] = [];

  constructor(private authenticationService: AuthenticationService, @Inject(MAT_DIALOG_DATA) public data: any,
              private usersService: UsersService) {
    this.currentlyLoggedInUser = authenticationService.currentUserInfoValue;
    this.editingUser = data.editingUser;
  }

  ngOnInit(): void {
    this.fetchMonthlyHours();
  }

  fetchMonthlyHours() {
    this.usersService.fetchMonthlyUserData(this.editingUser.id).subscribe(response => {
      this.loading = false;
      if (response.status > 199 && response.status < 300) {
        let monthlyHours: UserMonthlyHours[] = [];
        for (const leaves of response.body) {
          monthlyHours.push(leaves);
        }
        monthlyHours = this.fillMissingMonths(monthlyHours);
        this.dataSource = new MatTableDataSource<UserMonthlyHours>(monthlyHours);
        this.userMonthlyHoursData = monthlyHours;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
        this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error fetching Monthly Data. Please try again later');
      }
    });
  }

  fillMissingMonths(monthlyHours: UserMonthlyHours[]): UserMonthlyHours[] {


    let startDate = dayjs().month(0);
    const endDate = startDate.add(12, 'month');
    const finalMonthlyData: UserMonthlyHours[] = [];
    do {
      const userMonthlyHour = monthlyHours.filter(item => dayjs(item.yearMonth)
        .month() === startDate.month() && dayjs(item.yearMonth).year() === startDate.year())[0];
      if (userMonthlyHour) {
        finalMonthlyData.push(userMonthlyHour);
      } else {
        finalMonthlyData.push(new UserMonthlyHours(null, this.editingUser, startDate.toDate()));
      }
      startDate = startDate.add(1, 'month');
    } while (endDate.isAfter(startDate, 'month'));

    return finalMonthlyData;
  }

  onDataChange(element: UserMonthlyHours) {
    const addData: AddMonthHour = {hours: element.hours, year: element.getYear, month: element.getMonth + 1};
    this.usersService.updateMonthHourForUser(addData, this.editingUser.id).subscribe(response => {
      if (response.status < 199 || response.status > 300) {
        this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error updating HOurs for this user. Please try again later');
      }
      this.fetchMonthlyHours();
    });
  }
}
