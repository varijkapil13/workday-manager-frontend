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

  allHolidays: any[] = [];

  constructor(private leavesService: LeavesService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.currentlyLoggedUser = this.authenticationService.currentUserInfoValue;
    this.isCurrentUserPrivileged = authenticationService.isCurrentUserPrivileged;
  }

  get getPendingApprovalsBadge(): string {
    return `${this.pendingApprovals ? this.pendingApprovals : ''}`;
  }

  @ViewChild('scheduleObj', {static: false})
  schedulerObject: ScheduleComponent;

  firstDayOfWeek = 2;
  currentlyLoggedUser: UserFromJwt;
  isCurrentUserPrivileged = false;
  pendingApprovals = 0;

  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel;
  public monthInterval = 12;
  public allowMultiple = false;
  public instance: Internationalization = new Internationalization();

  public group: GroupModel = {
    resources: ['Users']
  };
  public categoryDataSource: object[] = [];
  ganttDataSource: object[] = [
    {
      TaskID: 1,
      TaskName: 'Product concept',
      StartDate: new Date('02/02/2020'),
      EndDate: new Date('02/21/2020'),
    },
    {
      TaskID: 1,
      TaskName: 'Product concept',
      StartDate: new Date('03/02/2020'),
      EndDate: new Date('03/21/2020'),
    }
  ];

  ganttTaskFields: object = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    child: 'subtasks'
  };

  ganttLabelSettings: object = {
    leftLabel: 'TaskName',
  };
  ganttStartDate: Date = new Date(new Date().getFullYear() - 1, 11, 31);
  ganttEndDate: Date = new Date(new Date().getFullYear() + 1, 0, 1);

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

  getMonthDetails(value: CellTemplateArgs): string {
    return this.instance.formatDate((value as CellTemplateArgs).date, {skeleton: 'yMMMM'});
  }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
      args.element.setAttribute('style', 'width: 280px');
      const target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
      target.innerHTML = '<div class="name">Name</div><div class="type">Leaves</div>' +
        '<div class="capacity">Remaining</div><div class="capacity">Last Year</div>';
    }

    if ((args.elementType === 'monthCells' || args.elementType === 'dateHeader') && args.date &&
      (args.date.getDay() === 0 || args.date.getDay() === 6 || this.checkForHolidayInclude(args.date))) {
      const element = args.element;
      element.setAttribute('style', 'background-color: ' + leavesColorCombination.holidays);
    }
  }

  checkForHolidayInclude(date: Date) {

    const filteredDates = this.allHolidays.filter(item => {
      return dayjs(item).isSame(dayjs(date), 'day');
    });
    return filteredDates.length > 0;


  }

  onEventRendered(args: EventRenderedArgs): void {

    const eventColor = LeavesComponent.determineLeaveEventColor(args.data);

    if (!args.element) {
      return;
    }
    args.element.style.backgroundColor = eventColor;
  }

  onAddLeavesClick() {
    const dialogRef = this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: DialogType.leaves,
        name: 'Add Leaves',
        userId: '46576879tufjchgvhobv8c458ity76986ir7666r75669r767rt7ituf'
      }, role: 'dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchData();
    });
  }

  ngOnInit() {
    // this.schedulerObject.firstDayOfWeek = 1;
    this.fetchData();
  }

  cellClicked(event: EventClickArgs) {
    console.log('in event click method: ', event.event);

    this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: DialogType.leaves,
        name: 'Edit Leave',
        userId: '46576879tufjchgvhobv8c458ity76986ir7666r75669r767rt7ituf',
        existingLeave: event.event
      }, role: 'dialog'
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

  getCellContent(date: Date): string {
    if (date.getMonth() === 2) {
      return 'red';
    } else {
      return '';
    }

  }
}
