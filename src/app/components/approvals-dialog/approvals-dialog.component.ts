import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {LeavesService} from '../../services/leaves/leaves.service';
import {Leave} from '../../types/leave';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';

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

  @ViewChild('appToastNotifications', {static: false})
  toastComponent: ToastComponentComponent;

  loading = true;

  constructor(private authenticationService: AuthenticationService, @Inject(MAT_DIALOG_DATA) public data: any,
              private leavesService: LeavesService) {
    this.currentlyLoggedInUser = authenticationService.currentUserInfoValue;

  }

  ngOnInit() {
    this.fetchApprovals();
  }

  fetchApprovals() {
    this.leavesService.getLeavesToApprove().subscribe(response => {
      this.loading = false;
      if (response.status > 199 && response.status < 300) {
        for (const leaves of response.body) {
          this.approvals.push(leaves);
        }
        this.dataSource = new MatTableDataSource<Leave>(this.approvals);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
        this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error fetching approvals. Please try again later');
      }
    });

  }

  approveLeave(leave: Leave) {
    this.leavesService.approveLeavesWithConnection(leave.userId, leave.connection).subscribe(response => {
      if (response.status > 199 && response.status < 300) {
        // leaves approved, refresh the data on the view
        this.loading = true;
        this.fetchApprovals();
        this.toastComponent.showToast(ToastType.success, 'Success', 'Leaves Approved');
      } else {
        if (response.status === 404) {
          this.toastComponent.showToast(ToastType.error, 'Not found', 'The specified leave could not be found. Please try again later');
        } else if (response.status === 403) {
          this.toastComponent.showToast(ToastType.error, 'Forbidden', 'You do not have permission to approve leaves. Please contact the administrator');
        } else {
          this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error approving this leave. Please try again later');
        }
      }
    });

  }

  getLeaveType(element: Leave): string {
    if (element.overtime) {
      return 'Overtime';
    }
    if (element.sick) {
      return 'Sick Leave';
    }
    return 'Leave';
  }
}
