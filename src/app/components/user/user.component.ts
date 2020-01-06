import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userList: UserFromJwt[] = [];

  constructor(private authenticationService: AuthenticationService) {

  }


  ngOnInit() {
    this.generateFakeUsers();
  }

  generateFakeUsers() {
    for (let i = 0; i < 10; i++) {
      this.userList.push({
        createdAt: new Date(),
        email: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        firstName: Math.random().toString(36).substring(2, 15),
        fullname: Math.random().toString(36).substring(2, 15),
        id: Math.random().toString(36).substring(2, 15),
        image: 'https://live.staticflickr.com/4112/5170590074_afe540141c_k.jpg',
        isAdmin: false,
        isManager: false,
        lastName: '',
        roles: this.getFakeRole(i),
      });
    }
  }

  getFakeRole(iteration: number) {
    if (iteration % 2 === 0) {
      return ['ADMINISTRATOR', 'MANAGER', 'USER'];
    } else {
      return ['ADMINISTRATOR', 'ADMINISTRATOR'];
    }
  }

}
