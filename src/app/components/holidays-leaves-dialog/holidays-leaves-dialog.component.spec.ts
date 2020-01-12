import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HolidaysLeavesDialogComponent} from './holidays-leaves-dialog.component';

describe('HolidaysLeavesDialogComponent', () => {
  let component: HolidaysLeavesDialogComponent;
  let fixture: ComponentFixture<HolidaysLeavesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HolidaysLeavesDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaysLeavesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
