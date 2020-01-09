import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CustomMaterialModule} from './core/material.module';
import {AppRoutingModule} from './core/app.routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorInterceptor} from './helpers/error.interceptor';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {LoginComponent} from './components/login/login.component';
import {HolidaysComponent} from './components/holidays/holidays.component';
import {LeavesComponent} from './components/leaves/leaves.component';
import {HoursComponent} from './components/hours/hours.component';
import {UserComponent} from './components/user/user.component';
import {ProfileComponent} from './components/profile/profile.component';
import {OvertimeComponent} from './components/overtime/overtime.component';
import {ReportsComponent} from './components/reports/reports.component';
// Syncfusion scheduler
import {RecurrenceEditorModule, ScheduleModule} from '@syncfusion/ej2-angular-schedule';
// Syncfusion scheduler
import {AuthenticatedLayoutComponent} from './components/layouts/authenticated-layout/authenticated-layout.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FileUploaderComponent} from './components/file-uploader/file-uploader.component';
import {HolidaysLeavesDialogComponent} from './components/holidays-leaves-dialog/holidays-leaves-dialog.component';
import {UserCardComponent} from './components/user-card/user-card.component';
import {ApprovalsDialogComponent} from './components/approvals-dialog/approvals-dialog.component';
import {ToastComponentComponent} from './components/toast-component/toast-component.component';
import {ToastModule} from '@syncfusion/ej2-angular-notifications';

@NgModule({
  entryComponents: [
    HolidaysLeavesDialogComponent,
    ApprovalsDialogComponent,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    HoursComponent,
    LeavesComponent,
    HolidaysComponent,
    ProfileComponent,
    OvertimeComponent,
    ReportsComponent,
    AuthenticatedLayoutComponent,
    FileUploaderComponent,
    HolidaysLeavesDialogComponent,
    UserCardComponent,
    ApprovalsDialogComponent,
    ToastComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ScheduleModule,
    RecurrenceEditorModule,
    FlexLayoutModule,
    AppRoutingModule,
    ToastModule,
  ],

  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
