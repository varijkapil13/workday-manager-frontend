import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonthlyHoursDialogComponent} from './monthly-hours-dialog.component';

describe('MonthlyHoursDialogComponent', () => {
  let component: MonthlyHoursDialogComponent;
  let fixture: ComponentFixture<MonthlyHoursDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyHoursDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyHoursDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
