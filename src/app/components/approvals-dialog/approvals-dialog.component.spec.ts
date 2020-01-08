import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ApprovalsDialogComponent} from './approvals-dialog.component';

describe('ApprovalsDialogComponent', () => {
  let component: ApprovalsDialogComponent;
  let fixture: ComponentFixture<ApprovalsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalsDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
