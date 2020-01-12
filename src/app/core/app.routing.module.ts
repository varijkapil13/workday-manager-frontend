import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../auth.guard';
import {SidebarLinkValues} from '../helpers/AppConfiguration';
import {HoursComponent} from '../components/hours/hours.component';
import {LoginComponent} from '../components/login/login.component';
import {OvertimeComponent} from '../components/overtime/overtime.component';
import {LeavesComponent} from '../components/leaves/leaves.component';
import {HolidaysComponent} from '../components/holidays/holidays.component';
import {ProfileComponent} from '../components/profile/profile.component';
import {ReportsComponent} from '../components/reports/reports.component';
import {UserComponent} from '../components/user/user.component';
import {AuthenticatedLayoutComponent} from '../components/layouts/authenticated-layout/authenticated-layout.component';

const routes: Routes = [
  {
    path: '', component: AuthenticatedLayoutComponent, canActivate: [AuthGuard], children: [
      {path: SidebarLinkValues.home.link, component: HoursComponent},
      {path: SidebarLinkValues.hours.link, component: HoursComponent},
      {path: SidebarLinkValues.overtime.link, component: OvertimeComponent},
      {path: SidebarLinkValues.leaves.link, component: LeavesComponent},
      {path: SidebarLinkValues.holidays.link, component: HolidaysComponent},
      {path: SidebarLinkValues.profile.link, component: ProfileComponent},
      {path: SidebarLinkValues.users.link, component: UserComponent},
      {path: SidebarLinkValues.reports.link, component: ReportsComponent},
    ]
  },
  {path: 'login', component: LoginComponent},

  // {path: '**', redirectTo: ''}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {enableTracing: false})
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule {
}
