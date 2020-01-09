import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../types/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {
  @Input() user: User;
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

  getInitials(fullName: string): string {
    const splitName = fullName.split(' ');
    const initialsArray = splitName.map(item => item.charAt(0));
    return initialsArray.join('').toUpperCase();
  }
}
