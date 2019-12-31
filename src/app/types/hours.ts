export interface Hours {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  date: Date;
  loggedHours: bigint;
  tags: string;
  userEmail: string;
  userName: string;
  userId: string;
}
