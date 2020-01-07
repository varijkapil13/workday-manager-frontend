import {Leave} from './leave';
import {DialogType} from './dialog-types.enum';


export interface LeavesDialogData {
  type: DialogType;
  existingLeave: Leave;
  name: string;
  userId?: string;
}
