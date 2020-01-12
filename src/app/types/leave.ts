interface ILeave {
  id: number;
  startTime: Date;
  endTime: Date;
  title: string;
  userId: string;
  userName: string;
  userEmail: string;
  overtime: boolean;
  sick: boolean;
  approved: boolean;
  connection: string;
}

export class Leave implements ILeave {
  id: number;
  connection: string;
  overtime: boolean;
  sick: boolean;
  startTime: Date;
  endTime: Date;
  title: string;
  userEmail: string;
  userId: string;
  userName: string;
  approved: boolean;

  // members for the calendar, they can be null
  Subject?: string;
  StartTime?: Date;
  EndTime?: Date;
  IsAllDay = true;

}
