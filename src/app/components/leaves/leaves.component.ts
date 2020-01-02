import {Component, OnInit} from '@angular/core';
import {
  CellTemplateArgs,
  DayService,
  DragAndDropService,
  EventRenderedArgs,
  EventSettingsModel,
  getWeekNumber,
  GroupModel,
  RenderCellEventArgs,
  ResizeService,
  TimelineMonthService
} from '@syncfusion/ej2-angular-schedule';
import {extend, Internationalization} from '@syncfusion/ej2-base';
import {LeavesService} from '../../services/leaves/leaves.service';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {MatDialog} from '@angular/material';
import {HolidaysLeavesDialogComponent} from '../holidays-leaves-dialog/holidays-leaves-dialog.component';


@Component({
  selector: 'app-leaves',
  providers: [TimelineMonthService, DayService, ResizeService, DragAndDropService],
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {

  currentlyLoggedUser: UserFromJwt;
  public selectedDate: Date = new Date(2019, 0, 1);
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
    this.fetchData();
  }

  fetchData() {
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

}
