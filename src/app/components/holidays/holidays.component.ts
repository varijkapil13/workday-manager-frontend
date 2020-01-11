import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {CreateHolidayBody, HolidaysService} from '../../services/holidays/holidays.service';
import {Holiday} from '../../types/holiday';
import {HolidaysLeavesDialogComponent} from '../holidays-leaves-dialog/holidays-leaves-dialog.component';
import * as DateHoliday from 'date-holidays';
import {DialogType} from '../../types/dialog-types.enum';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  holidays: Holiday[] = [];
  publicHolidays: any[] = [];
  dataSource: MatTableDataSource<Holiday>;
  publicHolidaysDataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['date', 'notes', 'updatedAt'];
  displayedColumnsForAdmins: string[] = ['date', 'notes', 'updatedAt', 'delete'];
  publicHolidaysDisplayedColumns: string[] = ['date', 'name'];
  publicHolidaysDisplayedColumnsForAdmins: string[] = ['addToCompany', 'date', 'name'];
  currentlyLoggedInUser: UserFromJwt;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild('appToastNotifications', {static: false})
  toastComponent: ToastComponentComponent;

  constructor(private holidaysService: HolidaysService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.currentlyLoggedInUser = this.authenticationService.currentUserInfoValue;
  }

  ngOnInit() {
    this.fetchData();
    this.setupPublicHolidays();
  }

  fetchData() {
    this.holidaysService.fetchAllHolidaysInCurrentYear().subscribe(response => {
      this.holidays = [];
      for (const data of response.body) {
        this.holidays.push(data);
      }
      this.dataSource = new MatTableDataSource(this.holidays);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  setupPublicHolidays() {
    if (this.authenticationService.isCurrentUserPrivileged) {
      this.publicHolidaysDisplayedColumns = this.publicHolidaysDisplayedColumnsForAdmins;
      this.displayedColumns = this.displayedColumnsForAdmins;
    }
    const dateHolidays = new DateHoliday({country: 'DE', state: 'BY'});
    this.publicHolidays = dateHolidays.getHolidays(new Date().getFullYear());
    this.publicHolidaysDataSource = new MatTableDataSource<any>(this.publicHolidays);
  }

  onAddHolidaysClick() {
    this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: DialogType.holidays,
        name: 'Add Holidays',
      }, role: 'dialog'
    });
  }

  deleteHoliday(element: Holiday) {
    this.holidaysService.deleteHoliday(element.id).subscribe(response => {
      if (response.status > 199 && response.status < 300) {
        this.toastComponent.showToast(ToastType.success, 'Success', 'Holiday deleted successfully');
        this.fetchData();
      } else {
        if (response.status === 404) {
          this.toastComponent.showToast(ToastType.error, 'Leaves not found',
            'The specified holiday could not be found. Please try again later');
        } else {
          this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while deleting this holiday. Please try again later');
        }
      }
    });
  }

  addPublicHolidayToCompany(publicHoliday: any) {
    const holiday: CreateHolidayBody = {
      title: publicHoliday.name,
      date: new Date(Date.UTC(publicHoliday.start.getFullYear(), publicHoliday.start.getMonth(), publicHoliday.start.getDate())).toISOString()
    };

    this.holidaysService.createAHoliday(holiday).subscribe(response => {
      if (response.status > 199 && response.status < 300) {
        this.toastComponent.showToast(ToastType.success, 'Success', 'Holiday added successfully');
        this.fetchData();
      } else {
        this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while adding this holiday. Please try again later');
      }
    });
  }
}
