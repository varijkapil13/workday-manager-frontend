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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    HoursComponent,
    LeavesComponent,
    HolidaysComponent,
    ProfileComponent,
    OvertimeComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],

  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
