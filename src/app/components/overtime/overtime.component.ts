import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {OvertimeService} from '../../services/overtime/overtime.service';
import {Overtime} from '../../types/overtime';

@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css']
})
export class OvertimeComponent implements OnInit {

  hours: Overtime[] = [];
  dataSource: MatTableDataSource<Overtime>;
  displayedColumns: string[] = ['name', 'userEmail', 'hours', 'updatedAt'];
  currentlyLoggedInUser: UserFromJwt;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private overtimeService: OvertimeService, private authenticationService: AuthenticationService) {
    this.currentlyLoggedInUser = authenticationService.currentUserInfoValue;
  }

  ngOnInit() {
    this.fetchData();
  }


  fetchData() {
    if (this.currentlyLoggedInUser.isAdmin || this.currentlyLoggedInUser.isManager) {
      this.overtimeService.fetchOvertimeForAllUsers().subscribe(response => {
        for (const data of response.body) {
          this.hours.push(data);
        }
        this.dataSource = new MatTableDataSource(this.hours);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    } else {
      this.overtimeService.fetchOvertimeForSingleUser(this.currentlyLoggedInUser.id).subscribe(response => {
        this.hours.push(response.body);
        this.dataSource = new MatTableDataSource(this.hours);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    }

  }

}
