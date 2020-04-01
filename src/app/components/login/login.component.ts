import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../services/authentication.service';
import {SidebarLinkValues} from '../../helpers/AppConfiguration';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;
  hide = true;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) {
    // redirect to hours if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate([SidebarLinkValues.hours.link]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    // get return url from route parameters or default to '/hours'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/hours';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
    .pipe(first())
    .subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        console.log(error);
        this.toastComponent.showToast(ToastType.error, 'Not authenticated', 'Could not authenticate user.' +
          ' Please make sure the username and password are correct and try again.');
        // this.snackBar.open(error, null, {verticalPosition: 'bottom', duration: 3, politeness: 'assertive'});
        this.loading = false;
      });
  }

}
