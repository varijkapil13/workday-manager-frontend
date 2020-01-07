import {Leave} from './leave';
import {User} from './user';

export interface LeavesCalendar {
  leaves: Leave[];
  users: User[];
}
