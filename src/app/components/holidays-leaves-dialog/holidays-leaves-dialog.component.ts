import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Leave} from '../../types/leave';
import {AppDateAdapter, CUSTOM_DATE_FORMATS} from '../../helpers/date-format.material';
import {LeaveTypes} from '../../types/leave-types.enum';
import {LeavesDialogData} from '../../types/leaves-dialog-data';
import {DialogType} from '../../types/dialog-types.enum';
import {LeavesService, NewLeaveBody} from '../../services/leaves/leaves.service';
import {AuthenticationService, UserFromJwt} from '../../services/authentication.service';
import {ToastComponentComponent, ToastType} from '../toast-component/toast-component.component';
import {CreateHolidayBody, HolidaysService} from '../../services/holidays/holidays.service';
import {User} from '../../types/user';


@Component({
  selector: 'app-holidays-leaves-dialog',
  templateUrl: './holidays-leaves-dialog.component.html',
  styleUrls: ['./holidays-leaves-dialog.component.css'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: {color: 'accent'},
  },
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  ]
})

export class HolidaysLeavesDialogComponent implements OnInit {


  dialogForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;
  leaveTypes: any[] = [{
    key: LeaveTypes.leave,
    name: 'Leave  '
  },
    {
      key: LeaveTypes.overtime,
      name: 'Overtime  '
    },
    {
      key: LeaveTypes.sick,
      name: 'Sick Leave'
    }
  ];
  // date sent to the dialog
  isLeavesDialog = false;
  editExistingLeaves: Leave;
  dialogOpenedForUserWithId: string;
  existingUsers: User[];
  currentlyLoggedInUser: UserFromJwt;

  @ViewChild('appToastNotifications')
  toastComponent: ToastComponentComponent;

  constructor(@Inject(MAT_DIALOG_DATA) public data: LeavesDialogData, private dialogRef: MatDialogRef<HolidaysLeavesDialogComponent>,
              private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
              private leavesService: LeavesService, private holidaysService: HolidaysService) {


    this.currentlyLoggedInUser = this.authenticationService.currentUserInfoValue;
    this.isLeavesDialog = data.type === DialogType.leaves;
    this.editExistingLeaves = data.existingLeave;
    this.dialogOpenedForUserWithId = data.userId;
    if (this.isLeavesDialog && !this.editExistingLeaves) {
      this.existingUsers = data.existingUsers;
    }
  }

  ngOnInit() {
    this.dialogForm = this.formBuilder.group({
      title: new FormControl(this.editExistingLeaves ? this.editExistingLeaves.title : '', [Validators.required]),
      startDate: new FormControl({
        value: this.editExistingLeaves ? this.editExistingLeaves.StartTime : '',
        disabled: true
      }, [Validators.required]),
      endDate: new FormControl({value: this.editExistingLeaves ? this.editExistingLeaves.EndTime : '', disabled: true}),
      leaveType: new FormControl(this.determineLeaveType()),
      selectedUser: new FormControl(this.currentlyLoggedInUser.id)
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.dialogForm.invalid) {
      return;
    }
    this.loading = true;

    if (this.isLeavesDialog) {
      // save/edit the leaves
      if (this.editExistingLeaves) {
        this.editAnExistingLeave();
      } else {
        this.createNewLeave();
      }
    } else {
      // save the holiday
      this.createNewHoliday();
    }

  }

  // convenience getter for easy access to form fields
  get formControls() {
    return this.dialogForm.controls;
  }

  get maxForEndDate() {
    if (this.formControls.startDate.value) {
      return this.formControls.startDate.value;
    } else {
      const currentDate = new Date();
      return new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate());
    }
  }

  datepickerFilter(d: Date): boolean {
    const day = d.getDay();
    // prevent weekends from being selected
    return day !== 0 && day !== 6;
  }

  private determineLeaveType() {
    if (this.isLeavesDialog) {
      if (this.editExistingLeaves) {
        if (this.editExistingLeaves.overtime) {
          return LeaveTypes.overtime;
        } else if (this.editExistingLeaves.sick) {
          return LeaveTypes.sick;
        } else {
          return LeaveTypes.leave;
        }
      } else {
        return LeaveTypes.leave;
      }
    } else {
      return '';
    }
  }

  deleteLeave() {
    console.log('in delete leave method');
    this.leavesService.deleteLeaves(this.editExistingLeaves.userId, this.editExistingLeaves.connection).subscribe(response => {
      this.loading = false;
      if (response.status > 199 && response.status < 300) {
        this.toastComponent.showToast(ToastType.success, 'Success', 'Leave deleted successfully');
        this.dialogRef.close();
      } else {
        if (response.status === 404) {
          this.toastComponent.showToast(ToastType.error, 'Leave not found',
            'The specified leave could not be found. Please try again later');
        } else if (response.status === 403) {
          this.toastComponent.showToast(ToastType.error, 'Forbidden',
            'You do not have permission to edit leaves for others');
        } else {
          this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while deleting leaves. Please try again later');
        }
      }
    });
  }

  private createNewLeave() {
    // call the api with the required data to save this new leave
    const leave: NewLeaveBody = {
      title: this.formControls.title.value,
      connection: '',
      startDate: new Date(Date.UTC(this.formControls.startDate.value.getFullYear(), this.formControls.startDate.value.getMonth(),
        this.formControls.startDate.value.getDate())).toISOString(),
      endDate: new Date(Date.UTC(this.formControls.endDate.value.getFullYear(), this.formControls.endDate.value.getMonth(),
        this.formControls.endDate.value.getDate())).toISOString(),
      isOvertime: this.formControls.leaveType.value === LeaveTypes.overtime,
      isSickLeave: this.formControls.leaveType.value === LeaveTypes.sick,
    };

    let userForLeaveCreation = this.authenticationService.currentUserInfoValue.id;
    if (this.formControls.selectedUser.value && this.authenticationService.isCurrentUserPrivileged) {
      userForLeaveCreation = this.formControls.selectedUser.value;
    }
    this.leavesService.createALeave(userForLeaveCreation, leave).subscribe(response => {
      this.loading = false;
      if (response.status > 199 && response.status < 300) {
        this.toastComponent.showToast(ToastType.success, 'Success', 'Leave added successfully');
        this.dialogRef.close();
      } else {
        if (response.status === 404) {
          this.toastComponent.showToast(ToastType.error, 'User not found', 'The specified user could not be found. Please try again later');
        } else {
          this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while adding leaves. Please try again later');
        }
      }
    });
  }

  private createNewHoliday() {
    // call the api with the required data to save the new holiday
    const holiday: CreateHolidayBody = {
      title: this.formControls.title.value,
      date: new Date(Date.UTC(this.formControls.startDate.value.getFullYear(), this.formControls.startDate.value.getMonth(),
        this.formControls.startDate.value.getDate())).toISOString(),
    };

    this.holidaysService.createAHoliday(holiday).subscribe(response => {
      this.loading = false;
      if (response.status > 199 && response.status < 300) {
        this.toastComponent.showToast(ToastType.success, 'Success', 'Holiday added successfully');
        this.dialogRef.close();
      } else {
        this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while adding this holiday. Please try again later');
      }
    });

  }

  private editAnExistingLeave() {
    // call the api to edit existing leave

    const leave: NewLeaveBody = {
      title: this.formControls.title.value,
      connection: this.editExistingLeaves.connection,
      startDate: new Date(Date.UTC(this.formControls.startDate.value.getFullYear(), this.formControls.startDate.value.getMonth(),
        this.formControls.startDate.value.getDate())).toISOString(),
      endDate: new Date(Date.UTC(this.formControls.endDate.value.getFullYear(), this.formControls.endDate.value.getMonth(),
        this.formControls.endDate.value.getDate())).toISOString(),
      isOvertime: this.formControls.leaveType.value === LeaveTypes.overtime,
      isSickLeave: this.formControls.leaveType.value === LeaveTypes.sick,
    };

    this.leavesService.editALeave(leave).subscribe(response => {
      this.loading = false;
      if (response.status > 199 && response.status < 300) {
        this.toastComponent.showToast(ToastType.success, 'Success', 'Leaves edited successfully');
        this.dialogRef.close();
      } else {
        if (response.status === 404) {
          this.toastComponent.showToast(ToastType.error, 'Leaves not found',
            'The specified leaves could not be found. Please try again later');
        } else {
          this.toastComponent.showToast(ToastType.error, 'Error', 'There was an error while editing leaves. Please try again later');
        }
      }
    });
  }


  shouldShowUserDropDown() {
    return this.authenticationService.isCurrentUserPrivileged && !this.editExistingLeaves;
  }
}
