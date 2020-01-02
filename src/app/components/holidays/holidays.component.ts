import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {HolidaysService} from '../../services/holidays/holidays.service';
import {Holiday} from '../../types/holiday';
import {HolidaysLeavesDialogComponent} from '../holidays-leaves-dialog/holidays-leaves-dialog.component';
import * as DateHoliday from 'date-holidays';

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
  publicHolidaysDisplayedColumns: string[] = ['date', 'name'];
  publicHolidaysDisplayedColumnsForAdmins: string[] = ['addToCompany', 'date', 'name'];
  currentlyLoggedInUser: UserFromJwt;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private holidaysService: HolidaysService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.currentlyLoggedInUser = this.authenticationService.currentUserInfoValue;
  }

  ngOnInit() {
    this.fetchData();
    this.setupPublicHolidays();
  }

  fetchData() {
    this.holidaysService.fetchAllHolidaysInCurrentYear().subscribe(response => {
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
    }
    const dateHolidays = new DateHoliday({country: 'DE', state: 'BY'});
    this.publicHolidays = dateHolidays.getHolidays(new Date().getFullYear());
    this.publicHolidaysDataSource = new MatTableDataSource<any>(this.publicHolidays);
  }

  onAddHolidaysClick() {
    this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: 'holidays',
        name: 'Add Holidays',
        userId: '46576879tufjchgvhobv8c458ity76986ir7666r75669r767rt7ituf'
      }, role: 'dialog'
    });
  }

}
