import {User} from './user';

export interface Hours {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  date: Date;
  loggedHours: number;
  tags: string;
  user: User;
}
