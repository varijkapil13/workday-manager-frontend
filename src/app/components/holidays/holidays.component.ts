import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {HolidaysService} from '../../services/holidays/holidays.service';
import {Holiday} from '../../types/holiday';
import {HolidaysLeavesDialogComponent} from '../holidays-leaves-dialog/holidays-leaves-dialog.component';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  hours: Holiday[] = [];
  dataSource: MatTableDataSource<Holiday>;
  displayedColumns: string[] = ['date', 'notes', 'updatedAt'];
  currentlyLoggedInUser: UserFromJwt;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private holidaysService: HolidaysService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.currentlyLoggedInUser = this.authenticationService.currentUserInfoValue;
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.holidaysService.fetchAllHolidaysInCurrentYear().subscribe(response => {
      for (const data of response.body) {
        this.hours.push(data);
      }
      this.dataSource = new MatTableDataSource(this.hours);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

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
