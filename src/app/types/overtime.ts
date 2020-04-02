export interface Overtime {
  id: string;
  userEmail: string;
  userName: string;
  userId: string;
  hours: bigint;
  year: number;
  updatedAt: Date;
}

export class YearlyOvertime implements Overtime {
  hours: bigint;
  id: string;
  updatedAt: Date;
  userEmail: string;
  userId: string;
  userName: string;
  year: number;
}

export class MonthlyOvertime implements Overtime {
  hours: bigint;
  updatedAt: Date;
  userEmail: string;
  userId: string;
  userName: string;
  month: number;
  year: number;
  yearMonth: Date;

  private _id: number;

  get id(): string {
    return `${this._id}`;
  }

  set id(value: string) {
    this._id = parseInt(value, 10);
  }
}

export interface OvertimeAPIData {
  yearlyOvertimes: object;
  monthlyOvertimes: object;
}
