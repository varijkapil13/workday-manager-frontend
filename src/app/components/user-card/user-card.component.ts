import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserFromJwt} from '../../services/authentication.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() user: UserFromJwt;
  @Input() showActions = false;
  @Output() onEditClick = new EventEmitter();
  @Output() onDeleteClick = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onEdit() {
    this.onEditClick.emit(this.user);
  }

  onDelete() {
    this.onDeleteClick.emit(this.user);
  }

}
