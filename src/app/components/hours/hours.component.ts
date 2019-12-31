import {Component, OnInit, ViewChild} from '@angular/core';
import {HoursService} from '../../services/hours.service';
import {Hours} from '../../types/hours';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.css']
})
export class HoursComponent implements OnInit {

  hours: Hours[] = [];
  dataSource: MatTableDataSource<Hours> = new MatTableDataSource(this.hours);
  displayedColumns: string[] = ['name', 'hours', 'date', 'tags', 'notes'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private hoursService: HoursService) {
  }

  ngOnInit() {
    this.fetchData();
  }


  fetchData() {
    this.hoursService.fetchCurrentUsersHours().subscribe(response => {
      for (const data of response.body) {
        this.hours.push(data);
      }
      this.dataSource = new MatTableDataSource(this.hours);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

}

