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
import {getWeekNumber} from '../../helpers/utils';
import {EventClickArgs} from '@syncfusion/ej2-schedule/src/schedule/base/interface';
import {Leave} from '../../types/leave';
import {User} from '../../types/user';
import {DialogType} from '../../types/dialog-types.enum';
import {ApprovalsDialogComponent} from '../approvals-dialog/approvals-dialog.component';


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

  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel;
  public monthInterval = 12;
  public allowMultiple = false;
  public instance: Internationalization = new Internationalization();

  public group: GroupModel = {
    resources: ['Users']
  };
  public categoryDataSource: object[] = [];

  getMonthDetails(value: CellTemplateArgs): string {
    return this.instance.formatDate((value as CellTemplateArgs).date, {skeleton: 'yMMMM'});
  }

  getWeekDetails(value: CellTemplateArgs): string {
    return 'Week ' + getWeekNumber((value as CellTemplateArgs).date);
  }

  onRenderCell(args: RenderCellEventArgs): void {

    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
      args.element.setAttribute('style', 'width: 280px');
      const target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
      target.innerHTML = '<div class="name">Name</div><div class="type">Leaves</div>' +
        '<div class="capacity">Remaining</div><div class="capacity">Last Year</div>';
    }
  }

  onEventRendered(args: EventRenderedArgs): void {
    const categoryColor: string = args.data.CategoryColor as string;
    if (!args.element || !categoryColor) {
      return;
    }
    args.element.style.backgroundColor = categoryColor;
  }


  constructor(private leavesService: LeavesService, private authenticationService: AuthenticationService, public dialog: MatDialog) {
    this.currentlyLoggedUser = this.authenticationService.currentUserInfoValue;
    this.isCurrentUserPrivileged = authenticationService.isCurrentUserPrivileged;
  }

  onAddLeavesClick() {
    this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: DialogType.leaves,
        name: 'Add Leaves',
        userId: '46576879tufjchgvhobv8c458ity76986ir7666r75669r767rt7ituf'
      }, role: 'dialog'
    });
  }

  ngOnInit() {
    // this.schedulerObject.firstDayOfWeek = 1;
    this.fetchData();
  }

  get getPendingApprovalsBadge(): string {
    return `${this.pendingApprovals ? this.pendingApprovals : ''}`;
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
    this.dialog.open(ApprovalsDialogComponent, {
      data: {
        type: 'no data to send currently'
      }
    });
  }

  fetchData() {
    this.categoryDataSource = [{
      fullName: 'Varij Kapil',
      leavesAllowed: 2,
      leavesTaken: 23,
      leavesCarriedOverFromLastYear: 2,
      id: 'leave.userId'
    }];
    this.eventSettings = {
      dataSource: extend([], [
        {
          title: 'leave.title',
          overtime: true,
          sick: false,
          id: 'leave.id',
          Subject: 'leave.title',
          StartTime: new Date(),
          EndTime: new Date(2020, 2, 23),
          IsAllDay: true,
          userId: 'leave.userId'
        }
      ], null, true) as object[],
      allowAdding: false,
      allowDeleting: false,
      allowEditing: false,
    };

    this.leavesService.fetchLeavesForAllUsers().subscribe(response => {
      if (response.body) {
        const leavesData: Leave[] = [];
        const usersData: User[] = [];
        for (const leave of response.body.leaves) {
          leavesData.push(leave);
        }
        for (const user of response.body.users) {
          usersData.push(user);
        }


        this.pendingApprovals = response.body.approvals;
        this.categoryDataSource = usersData;
        this.eventSettings = {dataSource: extend([], leavesData, null, true) as object[]};
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
