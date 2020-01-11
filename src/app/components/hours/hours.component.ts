import {Component, OnInit, ViewChild} from '@angular/core';
import {HoursService} from '../../services/hours.service';
import {Hours} from '../../types/hours';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.css']
})
export class HoursComponent implements OnInit {

  hours: Hours[] = [];
  dataSource: MatTableDataSource<Hours>;
  displayedColumns: string[] = ['userName', 'loggedHours', 'date', 'tags', 'notes'];
  currentlyLoggedInUser: UserFromJwt;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild('appToastNotifications', {static: false})
  toastComponent: ToastComponentComponent;

  constructor(private hoursService: HoursService, private authenticationService: AuthenticationService) {
    this.currentlyLoggedInUser = authenticationService.currentUserInfoValue;
  }

  ngOnInit() {
    this.fetchData();
  }

  removeDuplicates(tags: string, join: boolean = true) {
    const splitTags = tags.split(',');
    const removedDuplicates = splitTags.map(item => item.trim()).filter((elem, index, self) => {
      return index === self.indexOf(elem);
    });
    if (join) {
      return removedDuplicates.join(',');
    } else {
      return removedDuplicates;
    }
  }


  fetchData() {
    if (this.currentlyLoggedInUser.isAdmin || this.currentlyLoggedInUser.isManager) {
      this.hoursService.fetchHoursForAllUsers().subscribe(response => {
        this.initializeHoursData(response);
      });
    } else {
      this.hoursService.fetchHoursForSingleUser(this.currentlyLoggedInUser.id).subscribe(response => {
        this.initializeHoursData(response);
      });
    }

  }

  onFileComplete(data: any) {
    if (!data) {
      this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error trying to upload the data. Please try again later');
    } else {
      this.toastComponent.showToast(ToastType.success, 'Success', 'Timely data successfully imported ');
    }
  }

  private initializeHoursData(response: HttpResponse<Hours[]>) {
    if (response.status > 199 && response.status < 300) {

      for (const data of response.body) {
        this.hours.push(data);
      }
      this.dataSource = new MatTableDataSource(this.hours);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error trying to fetch hours data. Please try again later');
    }
  }

}

