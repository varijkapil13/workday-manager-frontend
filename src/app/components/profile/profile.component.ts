import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidatePassword} from '../../helpers/validate.password.matcher';
import {ProfileService} from '../../services/profile/profile.service';
import {User} from '../../types/user';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;

  changePasswordForm: FormGroup;
  userInfo: UserFromJwt;
  userProfile: User;
  showPasswordForm = false;
  loading = false;

  constructor(private authenticationService: AuthenticationService, private formBuilder: FormBuilder, private profileService: ProfileService) {
    this.userInfo = this.authenticationService.currentUserInfoValue;
  }

  // convenience getter for easy access to form fields
  get formControls() {
    return this.changePasswordForm.controls;
  }

  ngOnInit() {
    this.fetchUserProfile();
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: new FormControl({value: '', disabled: this.loading}, [Validators.required]),
      newPassword: new FormControl({value: '', disabled: this.loading}, [Validators.required, Validators.minLength(6)]),
      repeatNewPassword: new FormControl({value: '', disabled: this.loading}, [Validators.required, Validators.minLength(6)]),
    }, {
      validator: ValidatePassword.MatchPassword
    });
  }

  fetchUserProfile() {
    this.profileService.fetchUserProfile().subscribe(response => {
      if (response.body) {
        this.userProfile = response.body;
      }
    });
  }


  changePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.loading = true;
    const changePasswordData = {
      oldPassword: this.formControls.oldPassword.value,
      newPassword: this.formControls.newPassword.value,
      repeatNewPassword: this.formControls.repeatNewPassword.value,
    };
    this.profileService.changePassword(changePasswordData).subscribe(response => {
      this.loading = false;
      if (response.status > 300) {
        if (response.status === 400) {
          this.toastComponent.showToast(ToastType.error, 'Wrong current password', 'The password you entered is wrong');
        } else {
          this.toastComponent.showToast(ToastType.error, 'Passwords do not match', 'New Password entries do not match! ');
        }

      } else {
        this.showPasswordForm = false;
        this.toastComponent.showToast(ToastType.success, 'Success', 'Password changed succesfully!');
        this.authenticationService.logout();
      }
    });

  }

}
