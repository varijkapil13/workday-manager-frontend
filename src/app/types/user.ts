export interface User {
  id: string;
  email: string;
  roles: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: Date;
  image: string;
  leavesAllowed: number;
  leavesTaken: number;
  leavesCarriedOverFromLastYear: number;
  overtimeDaysTaken: number;
}
