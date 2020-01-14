import {Component, OnInit, ViewChild} from '@angular/core';
import {
  CellTemplateArgs,
  EventRenderedArgs,
  EventSettingsModel,
  GroupModel,
  RenderCellEventArgs,
  ScheduleComponent,
  TimelineMonthService
} from '@syncfusion/ej2-angular-schedule';
import {extend, Internationalization} from '@syncfusion/ej2-base';
import {LeavesService} from '../../services/leaves/leaves.service';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {MatDialog} from '@angular/material';
import {HolidaysLeavesDialogComponent} from '../holidays-leaves-dialog/holidays-leaves-dialog.component';
import {leavesColorCombination} from '../../helpers/utils';
import {EventClickArgs} from '@syncfusion/ej2-schedule/src/schedule/base/interface';
import {Leave} from '../../types/leave';
import {User} from '../../types/user';
import {DialogType} from '../../types/dialog-types.enum';
import {ApprovalsDialogComponent} from '../approvals-dialog/approvals-dialog.component';
import dayjs from 'dayjs';


@Component({
  selector: 'app-leaves',
  providers: [TimelineMonthService],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  @ViewChild('scheduleObj', {static: false})
  schedulerObject: ScheduleComponent;

  firstDayOfWeek = 2;
  currentlyLoggedUser: UserFromJwt;
  isCurrentUserPrivileged = false;
  pendingApprovals = 0;
  allHolidays: any[] = [];

  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel;
  public monthInterval = 12;
  public allowMultiple = false;
  public instance: Internationalization = new Internationalization();

  public group: GroupModel = {
    resources: ['Users']
  };
  public categoryDataSource: object[] = [];

  private static determineLeaveEventColor(leave: any) {
    if (!leave.approved) {
      return leavesColorCombination.pendingApproval;
    }
    if (leave.overtime) {
      return leavesColorCombination.overtime;
    }
    if (leave.sick) {
      return leavesColorCombination.sick;
    }

    return leavesColorCombination.approvedLeaves;
  }

  constructor(private leavesService: LeavesService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.currentlyLoggedUser = this.authenticationService.currentUserInfoValue;
    this.isCurrentUserPrivileged = authenticationService.isCurrentUserPrivileged;
  }

  ngOnInit() {
    this.fetchData();
  }

  get getPendingApprovalsBadge(): string {
    return `${this.pendingApprovals ? this.pendingApprovals : ''}`;
  }

  // **************************
  // Dialog Button Actions
  // **************************
  onAddLeavesClick() {
    const dialogRef = this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: DialogType.leaves,
        name: 'Add Leaves',
      }, role: 'dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }


  openApprovalsDialog() {
    const dialogRef = this.dialog.open(ApprovalsDialogComponent, {
      data: {
        type: 'no data to send currently'
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  // **************************
  // Dialog Button Actions
  // **************************

  // **************************
  // API Call
  // **************************

  fetchData() {

    this.leavesService.fetchLeavesForAllUsers().subscribe(response => {
      if (response.body) {
        const leavesData: Leave[] = [];
        const usersData: User[] = [];
        this.allHolidays = [];
        for (const leave of response.body.leaves) {
          leavesData.push({
            EndTime: new Date(leave.endTime),
            IsAllDay: true,
            StartTime: new Date(leave.startTime),
            Subject: leave.title,
            approved: leave.approved,
            connection: leave.connection,
            endTime: leave.endTime,
            id: leave.id,
            overtime: leave.overtime,
            sick: leave.sick,
            startTime: leave.startTime,
            title: leave.title,
            userEmail: leave.userEmail,
            userId: leave.userId,
            userName: leave.userName,
          });
        }
        for (const user of response.body.users) {
          usersData.push(user);
        }

        for (const holiday of response.body.holidays) {
          this.allHolidays.push(dayjs(holiday.date));
        }

        this.pendingApprovals = response.body.approvals;
        this.categoryDataSource = usersData;
        this.eventSettings = {
          dataSource: extend([], leavesData, null, true) as object[], allowAdding: false,
          allowDeleting: false,
          allowEditing: false,
        };
      }
    });
  }

  // **************************
  // API Call
  // **************************

  //  ***********************************************************************
  //  Scheduler event handlers and callbacks
  //  ***********************************************************************
  onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
      args.element.setAttribute('style', 'width: 310px');
      const target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
      target.innerHTML = '<div class="name">Name</div>' +
        '<div class="content" matTooltip="Total Leaves Allowed this year">Leaves</div>' +
        '<div class="content" matTooltip="Leaves Remaining in this year">Remain</div>' +
        '<div class="content" matTooltip="Leaves left over from last year">Prv. Year</div>';
    }

    if ((args.elementType === 'monthCells' || args.elementType === 'dateHeader') && args.date &&
      (args.date.getDay() === 0 || args.date.getDay() === 6 || this.checkForHolidayInclude(args.date))) {
      const element = args.element;
      element.setAttribute('style', 'background-color: ' + leavesColorCombination.holidays);
    }
  }

  onEventRendered(args: EventRenderedArgs): void {

    const eventColor = LeavesComponent.determineLeaveEventColor(args.data);

    if (!args.element) {
      return;
    }
    args.element.style.backgroundColor = eventColor;
  }

  cellClicked(event: EventClickArgs) {

    this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: DialogType.leaves,
        name: 'Edit Leave',
        existingLeave: event.event
      }, role: 'dialog'
    });
  }


  getMonthDetails(value: CellTemplateArgs): string {
    return this.instance.formatDate((value as CellTemplateArgs).date, {skeleton: 'yMMMM'});
  }

  // **************************
  // Helpers for Scheduler component
  // **************************
  determineLeaveEventDescription(leave: any) {
    if (!leave.approved) {
      return 'Approval Pending';
    }
    if (leave.overtime) {
      return 'Overtime';
    }
    if (leave.sick) {
      return 'Sick Leave';
    }

    return 'Leave';
  }


  checkForHolidayInclude(date: Date) {
    const filteredDates = this.allHolidays.filter(item => {
      return dayjs(item).isSame(dayjs(date), 'day');
    });
    return filteredDates.length > 0;
  }

  // **************************
  // Helpers for Scheduler component
  // **************************

  //  ***********************************************************************
  //  Scheduler event handlers and callbacks
  //  ***********************************************************************

}
