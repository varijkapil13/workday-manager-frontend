import {Component} from '@angular/core';
import {SidebarLinks} from './helpers/AppConfiguration';
import {AuthenticationService} from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Workday Manager';
  sidebarLinks = SidebarLinks;
  currentUser: any;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
  }
}
