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
  }

  onAddLeavesClick() {
    this.dialog.open(HolidaysLeavesDialogComponent, {
      data: {
        type: 'leaves',
        name: 'Add Leaves',
        userId: '46576879tufjchgvhobv8c458ity76986ir7666r75669r767rt7ituf'
      }, role: 'dialog'
    });
  }

  ngOnInit() {
    // this.schedulerObject.firstDayOfWeek = 1;
    this.fetchData();
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
        const leavesData: any[] = [];
        const usersData: any[] = [];
        for (const leave of response.body.leaves) {
          leavesData.push({
            id: leave.id,
            Subject: leave.title,
            StartTime: new Date(leave.startTime),
            EndTime: new Date(leave.endTime),
            IsAllDay: true,
            userId: leave.userId
          });
        }
        for (const user of response.body.users) {
          usersData.push(user);
        }

        this.categoryDataSource = usersData;
        this.eventSettings = {dataSource: extend([], leavesData, null, true) as object[]};
      }
    });
  }

  cellClicked(event: EventClickArgs) {
    console.log('in event click method: ', event);
  }

}
