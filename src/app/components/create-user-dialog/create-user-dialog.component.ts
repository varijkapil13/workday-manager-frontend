import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CreateNewUserEntity, ResetPassword, UsersService} from '../../services/users/users.service';
import {User} from '../../types/user';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})
export class CreateUserDialogComponent implements OnInit {

  dialogForm: FormGroup;
  loading = false;
  creatingNewUser = false;
  editingUser: User;
  passwordResetEntity: ResetPassword;
  userRoles = ['ADMINISTRATOR', 'MANAGER', 'USER'];

  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private usersService: UsersService) {
    if (data.type === 'createUser') {
      this.creatingNewUser = true;
    } else {
      this.creatingNewUser = false;
      this.editingUser = data.editingUser;
    }
  }

  get formControls() {
    return this.dialogForm.controls;
  }

  ngOnInit() {
    this.dialogForm = this.formBuilder.group({
      firstName: new FormControl({
        value: this.creatingNewUser ? '' : this.editingUser.firstName,
        disabled: this.loading
      }, [Validators.required]),
      lastName: new FormControl({
        value: this.creatingNewUser ? '' : this.editingUser.lastName,
        disabled: this.loading
      }, [Validators.required]),
      email: new FormControl({
        value: this.creatingNewUser ? '' : this.editingUser.email,
        disabled: this.loading || !this.creatingNewUser
      }, [Validators.required, Validators.email]),
      password: new FormControl({
        value: '',
        disabled: this.loading
      }, this.creatingNewUser ? [Validators.required, Validators.minLength(6)] : []),
      totalLeaves: new FormControl({
        value: this.creatingNewUser ? 30 : this.editingUser.leavesAllowed,
        disabled: this.loading
      }, [Validators.required]),
      leavesFromLastYear: new FormControl({
        value: this.creatingNewUser ? 0 : this.editingUser.leavesCarriedOverFromLastYear,
        disabled: this.loading
      }, [Validators.required]),
      roles: new FormControl({
        value: this.creatingNewUser ? 'USER' : this.editingUser.roles,
        disabled: this.loading
      }, [Validators.required]),
    });
  }

  toggleAllControlsDisabled(disable: boolean = true) {
    for (const key in this.dialogForm.controls) {
      if (disable) {
        this.dialogForm.controls[key].disable();
      } else {
        // enable email and password fields if we are creating a new user
        if (this.creatingNewUser) {
          this.dialogForm.controls[key].enable();
        } else {
          // otherwise, enable all other keys
          if (!(key === 'password' || key === 'email')) {
            this.dialogForm.controls[key].enable();
          }
        }

      }
    }
  }

  saveUser() {
    if (this.dialogForm.invalid) {
      return;
    }
    if (this.creatingNewUser) {
      // logic to create a new user
      this.toggleAllControlsDisabled(true);
      const user: CreateNewUserEntity = {
        email: this.formControls.email.value,
        firstName: this.formControls.firstName.value,
        lastName: this.formControls.lastName.value,
        leavesFromLastYear: this.formControls.leavesFromLastYear.value,
        password: this.formControls.password.value,
        roles: this.formControls.roles.value,
        totalLeaves: this.formControls.totalLeaves.value,
      };

      this.usersService.createNewUser(user).subscribe(response => {
        this.toggleAllControlsDisabled(false);
        if (response.status < 300) {
          this.toastComponent.showToast(ToastType.success, 'User created', 'User created successfully');
        } else {
          if (response.status === 412) {
            this.toastComponent.showToast(ToastType.warning, 'User already present',
              'User with the provided email address is already present');
          } else {
            this.toastComponent.showToast(ToastType.error, 'Error',
              'There was an error completing your request, please try again later!');
          }
        }
      });
    } else {
      // logic to edit a user
      this.toggleAllControlsDisabled(true);
      const user: User = {
        firstName: this.formControls.firstName.value,
        lastName: this.formControls.lastName.value,
        leavesAllowed: this.formControls.totalLeaves.value,
        leavesCarriedOverFromLastYear: this.formControls.leavesFromLastYear.value,
        roles: this.formControls.roles.value,
        email: this.editingUser.email,
        image: this.editingUser.image,
        id: this.editingUser.id,
        createdAt: this.editingUser.createdAt,
        fullName: this.editingUser.fullName,
        leavesTaken: this.editingUser.leavesTaken,
        overtimeDaysTaken: this.editingUser.overtimeDaysTaken,
      };

      this.usersService.editUser(this.editingUser.id, user).subscribe(response => {
        this.toggleAllControlsDisabled(false);
        if (response.status < 300) {
          this.toastComponent.showToast(ToastType.success, 'Saved', 'User edited successfully');
        } else {
          if (response.status === 404) {
            this.toastComponent.showToast(ToastType.error, 'User not found', 'User could not be found. Please try again later');
          } else {
            this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error completing your request, please try again later!');
          }
        }
      });
    }
  }

  resetPassword() {
    if (!this.creatingNewUser) {
      this.usersService.resetUserPassword(this.editingUser.id).subscribe(response => {
        if (response.status < 300) {
          this.toastComponent.showToast(ToastType.success, 'Done', 'Password reset successfully');
          this.passwordResetEntity = response.body;
        } else {
          this.toastComponent.showToast(ToastType.error, 'Error',
            'There was an error while resetting the user password. Please try again later!');
        }
      });
    }
  }
}
