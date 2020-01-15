import {Leave} from './leave';
import {DialogType} from './dialog-types.enum';
import {User} from './user';

export interface LeavesDialogData {
  type: DialogType;
  existingLeave: Leave;
  name: string;
  userId?: string;
  existingUsers?: User[];
}
