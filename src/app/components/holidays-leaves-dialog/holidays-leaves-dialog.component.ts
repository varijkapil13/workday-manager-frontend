import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-holidays-leaves-dialog',
  templateUrl: './holidays-leaves-dialog.component.html',
  styleUrls: ['./holidays-leaves-dialog.component.css'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: {color: 'accent'},
  }]
})
export class HolidaysLeavesDialogComponent implements OnInit {
  dialogForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;
  leaveTypes: any[] = [{
    key: 'leave',
    name: 'Leave  '
  },
    {
      key: 'overtime',
      name: 'Overtime  '
    },
    {
      key: 'sick',
      name: 'Sick Leave'
    }
  ];
  selectedLeaveType = this.leaveTypes[0].key;

  isLeavesDialog = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    this.isLeavesDialog = data.type === 'leaves';
  }

  ngOnInit() {
    this.dialogForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      startDate: new FormControl({value: '', disabled: true}, [Validators.required]),
      endDate: new FormControl({value: '', disabled: true}),
    });
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

  onSubmit() {
    this.submitted = true;

    if (this.dialogForm.invalid) {
      return;
    }
    this.loading = true;

    console.log('in submit function');

  }


}
