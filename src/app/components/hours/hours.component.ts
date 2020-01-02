import {Component, OnInit, ViewChild} from '@angular/core';
import {HoursService} from '../../services/hours.service';
import {Hours} from '../../types/hours';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';

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
        for (const data of response.body) {
          this.hours.push(data);
        }
        this.dataSource = new MatTableDataSource(this.hours);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    } else {
      this.hoursService.fetchHoursForSingleUser(this.currentlyLoggedInUser.id).subscribe(response => {
        for (const data of response.body) {
          this.hours.push(data);
        }
        this.dataSource = new MatTableDataSource(this.hours);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }

  }

  onFileComplete(data: any) {
    console.log(data); // We just print out data bubbled up from event emitter.
  }

}

