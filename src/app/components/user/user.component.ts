import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {UsersService} from '../../services/users/users.service';
import {User} from '../../types/user';
import {MatDialog} from '@angular/material/dialog';
import {CreateUserDialogComponent} from '../create-user-dialog/create-user-dialog.component';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';
import {MonthlyHoursDialogComponent} from '../monthly-hours-dialog/monthly-hours-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userList: User[] = [];

  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;

  constructor(private authenticationService: AuthenticationService, private usersService: UsersService, public dialog: MatDialog) {

  }


  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.usersService.fetchAllUsers().subscribe(response => {
      if (response.status < 300) {
        for (const user of response.body) {
          this.userList.push(user);
        }
      } else {
        this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error completing your request, please try again later!');
      }
    });
  }


  createNewUser() {
    this.dialog.open(CreateUserDialogComponent, {
      data: {type: 'createUser'},
      role: 'dialog'
    });
  }

  editExistingUser(user: User) {
    this.dialog.open(CreateUserDialogComponent, {
      data: {type: 'editUser', editingUser: user},
      role: 'dialog'
    });
  }

  editUserHours(user: User) {
    this.dialog.open(MonthlyHoursDialogComponent, {
      data: {type: 'editUser', editingUser: user},
      role: 'dialog'
    });

  }
}
