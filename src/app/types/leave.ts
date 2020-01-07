export interface ILeave {
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
}

export class Leave implements ILeave {
  endTime: Date;
  id: number;
  overtime: boolean;
  sick: boolean;
  startTime: Date;
  title: string;
  userEmail: string;
  userId: string;
  userName: string;
  approved: boolean;

  get Subject() {
    return this.title;
  }

  get StartTime() {
    return new Date(this.startTime);
  }

  get EndTime() {
    return new Date(this.endTime);
  }

  get IsAllDay() {
    return true;
  }

}
