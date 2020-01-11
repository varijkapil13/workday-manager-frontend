import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {OvertimeService} from '../../services/overtime/overtime.service';
import {Overtime} from '../../types/overtime';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css']
})
export class OvertimeComponent implements OnInit {

  dataSource: MatTableDataSource<Overtime>;
  displayedColumns: string[] = ['userName', 'userEmail', 'hours', 'updatedAt'];
  currentlyLoggedInUser: UserFromJwt;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  @ViewChild('appToastNotifications', {static: false})
  toastComponent: ToastComponentComponent;

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
        this.receivedOvertimesForEveryone(response);
      });
    } else {
      this.overtimeService.fetchOvertimeForSingleUser(this.currentlyLoggedInUser.id).subscribe(response => {
        this.receivedOvertimeForSingleUser(response);
      });
    }

  }

  recalculateOvertimes() {
    if (this.isUserPrivileged) {
      this.overtimeService.recalculateOvertimesForEveryone().subscribe(response => {
        this.receivedOvertimesForEveryone(response);
      });
    } else {
      this.overtimeService.recalculateOvertimesForUser(this.currentlyLoggedInUser.id).subscribe(response => {
        this.receivedOvertimeForSingleUser(response);
      });
    }
  }


  private receivedOvertimesForEveryone(response: HttpResponse<Overtime[]>) {
    if (response.status > 199 && response.status < 300) {
      const allOvertimes: Overtime[] = [];
      for (const data of response.body) {
        allOvertimes.push(data);
      }

      console.log(allOvertimes);
      this.dataSource = new MatTableDataSource(allOvertimes);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while performing this operation. Please try again later');
    }
  }

  private receivedOvertimeForSingleUser(response: HttpResponse<Overtime>) {
    if (response.status > 199 && response.status < 300) {
      const allOvertimes: Overtime[] = [];
      allOvertimes.push(response.body);
      this.dataSource = new MatTableDataSource(allOvertimes);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while performing this operation. Please try again later');

    }
  }
}
