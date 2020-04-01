import {Component, OnInit, ViewChild} from '@angular/core';
import {
  CellTemplateArgs,
  EventRenderedArgs,
  EventSettingsModel,
  GroupModel,
  RenderCellEventArgs,
  ScheduleComponent,
  TimelineMonthService,
  ToolbarActionArgs
} from '@syncfusion/ej2-angular-schedule';
import {extend, Internationalization} from '@syncfusion/ej2-base';
import {LeavesService} from '../../services/leaves/leaves.service';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {MatDialog} from '@angular/material/dialog';
import {HolidaysLeavesDialogComponent} from '../holidays-leaves-dialog/holidays-leaves-dialog.component';
import {leavesColorCombination} from '../../helpers/utils';
import {EventClickArgs} from '@syncfusion/ej2-schedule/src/schedule/base/interface';
import {Leave} from '../../types/leave';
import {User} from '../../types/user';
import {DialogType} from '../../types/dialog-types.enum';
import {ApprovalsDialogComponent} from '../approvals-dialog/approvals-dialog.component';
import dayjs from 'dayjs';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';


@Component({
  selector: 'app-leaves',
  providers: [TimelineMonthService],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  public categoryDataSource: object[];
  //  ***********************************************************************
  public dataAvailable = false;

  @ViewChild('scheduleObj')
  schedulerObject: ScheduleComponent;

  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;

  firstDayOfWeek = 2;
  currentlyLoggedUser: UserFromJwt;
  isCurrentUserPrivileged = false;
  pendingApprovals = 0;
  allHolidays: any[] = [];
  allUsers: User[] = [];

  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel;
  public monthInterval = 12;
  public instance: Internationalization = new Internationalization();

  public group: GroupModel = {
    resources: ['Users']
  };

  constructor(private leavesService: LeavesService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.currentlyLoggedUser = this.authenticationService.currentUserInfoValue;
    this.isCurrentUserPrivileged = authenticationService.isCurrentUserPrivileged;
  }

  // **************************
  // Helpers for Scheduler component
  // **************************

  //  ***********************************************************************
  //  Scheduler event handlers and callbacks

  get getPendingApprovalsBadge(): string {
    return `${this.pendingApprovals ? this.pendingApprovals : ''}`;
  }

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

  ngOnInit() {
    this.fetchData();

  }

  // **************************
  // Dialog Button Actions
  // **************************
  onAddLeavesClick() {
    const dialogRef = this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: DialogType.leaves,
        name: 'Add Leaves',
        existingUsers: this.allUsers,
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
      if (response.status > 199 && response.status < 300) {
        if (response.body) {
          const leavesData: Leave[] = [];
          this.allUsers = [];
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
            this.allUsers.push(user);
          }

          for (const holiday of response.body.holidays) {
            this.allHolidays.push(dayjs(holiday.date));
          }

          this.pendingApprovals = response.body.approvals;
          this.categoryDataSource = this.allUsers;
          this.eventSettings = {
            dataSource: extend([], leavesData, null, true) as object[], allowAdding: false,
            allowDeleting: false,
            allowEditing: false,
          };
          this.dataAvailable = true;
        }
      } else {
        this.toastComponent.showToast(ToastType.error, 'Error',
          'There was an error while trying to fetch leaves data. Please try again later');
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
        '<div class="content" >Leaves</div>' +
        '<div class="content" >Taken</div>' +
        '<div class="content" >Prv. Year</div>';
    }

    if ((args.elementType === 'monthCells' || args.elementType === 'dateHeader')) {
      const element = args.element;
      if (args.date && (args.date.getDay() === 0 || args.date.getDay() === 6 || this.checkForHolidayInclude(args.date))) {
        element.setAttribute('style', `background-color:${leavesColorCombination.holidays}`);
      }

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

  onCreated() {
    const date: Date = this.schedulerObject.selectedDate;
    if (date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
      this.scrollTo();
    }
  }

  onTodayClick() {
    const date: Date = this.schedulerObject.selectedDate;
    if (date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
      this.scrollTo();
    }
  }

  scrollTo() {
    const today: number = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    const todayElement = this.schedulerObject.element.querySelector('[data-date="' + today + '"]') as HTMLElement;
    const contentWrap = this.schedulerObject.element.querySelector('.e-content-wrap') as HTMLElement;
    contentWrap.scrollLeft = todayElement.offsetLeft;
  }

  onActionBegin(args: ToolbarActionArgs) {
    if (args.requestType === 'toolbarItemRendering') {
      for (const item of args.items) {
        if (item.text === 'Today') {
          item.click = this.onTodayClick.bind(this);
        }
      }
    }
  }
}
