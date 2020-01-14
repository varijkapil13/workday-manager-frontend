import {Leave} from './leave';
import {User} from './user';
import {Holiday} from './holiday';

export interface LeavesCalendar {
  leaves: Leave[];
  users: User[];
  approvals: number;
  holidays: Holiday[];
}
