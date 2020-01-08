import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';

@Component({
  selector: 'app-approvals-dialog',
  templateUrl: './approvals-dialog.component.html',
  styleUrls: ['./approvals-dialog.component.css']
})
export class ApprovalsDialogComponent implements OnInit {

  approvals: any[] = [];
  displayedColumns = ['userName', 'startDate', 'endDate', 'type', 'approve'];
  dataSource: MatTableDataSource<any>;

  currentlyLoggedInUser: UserFromJwt;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private authenticationService: AuthenticationService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentlyLoggedInUser = authenticationService.currentUserInfoValue;

  }

  ngOnInit() {
    this.fetchApprovals();
  }

  fetchApprovals() {
    this.approvals.push({
      userName: 'Varij Kapil',
      startDate: '08/01/2020',
      endDate: '08/02/2020',
      type: 'Overtime',
    });
    this.dataSource = new MatTableDataSource<any>(this.approvals);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  approveLeave(element: any) {

  }
}
