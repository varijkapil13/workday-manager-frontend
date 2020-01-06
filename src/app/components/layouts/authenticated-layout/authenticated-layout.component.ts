import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserFromJwt} from '../../../services/authentication.service';
import {SidebarLinks} from '../../../helpers/AppConfiguration';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.css']
})
export class AuthenticatedLayoutComponent implements OnInit {

  title = 'Workday Manager';
  sidebarLinks = SidebarLinks;
  currentUser: any;
  loggedInUserInfo: UserFromJwt;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.authenticationService.currentUserInfo.subscribe(x => this.loggedInUserInfo = x);
  }

  logout() {
    this.authenticationService.logout();
  }

  public get sidebarLinkForLoggedInUser() {
    return this.sidebarLinks.filter(item => item.roles.filter(role => this.loggedInUserInfo.roles.includes(role)).length > 0);
  }

  ngOnInit() {
  }

}
