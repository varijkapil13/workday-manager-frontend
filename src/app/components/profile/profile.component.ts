import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidatePassword} from '../../helpers/validate.password.matcher';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  changePasswordForm: FormGroup;
  userInfo: UserFromJwt;
  showPasswordForm = false;

  constructor(private authenticationService: AuthenticationService, private formBuilder: FormBuilder,) {
    this.userInfo = this.authenticationService.currentUserInfoValue;
  }

  // convenience getter for easy access to form fields
  get formControls() {
    return this.changePasswordForm.controls;
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repeatNewPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, {
      validator: ValidatePassword.MatchPassword
    });
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }
  }

}
