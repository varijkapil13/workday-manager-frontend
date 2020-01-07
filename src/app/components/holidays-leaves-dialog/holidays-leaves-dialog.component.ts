import {Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DIALOG_DATA, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Leave} from '../../types/leave';
import {AppDateAdapter, CUSTOM_DATE_FORMATS} from '../../helpers/date-format.material';
import {LeaveTypes} from '../../types/leave-types.enum';
import {LeavesDialogData} from '../../types/leaves-dialog-data';
import {DialogType} from '../../types/dialog-types.enum';


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

  constructor(@Inject(MAT_DIALOG_DATA) public data: LeavesDialogData, private formBuilder: FormBuilder) {
    this.isLeavesDialog = data.type === DialogType.leaves;
    this.editExistingLeaves = data.existingLeave;
    this.dialogOpenedForUserWithId = data.userId;
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
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.dialogForm.invalid) {
      return;
    }
    this.loading = true;

    console.log('in submit function');
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

  private createNewLeave() {
    // call the api with the required data to save this new leave

    this.loading = false;
  }

  private editAnExistingLeave() {
    // call the api to edit existing leave
    this.loading = false;
  }

  private createNewHoliday() {
    // call the api with the required data to save the new holiday
    this.loading = false;
  }


}
