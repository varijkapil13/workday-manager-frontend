import {UserRoles} from '../types/user-roles.enum';
import {environment} from '../../environments/environment';

const baseApiUrl = environment.production ? 'http://localhost:7254' : 'http://localhost:8080';
export const ApiUrls = {
  login: baseApiUrl + '/authenticate',
  workdays: baseApiUrl + '/api/workdays',
  overtimes: baseApiUrl + '/api/overtimes',
  holidays: baseApiUrl + '/api/holidays',
  leaves: baseApiUrl + '/api/leaves',
  profile: baseApiUrl + '/api/profile',
  users: baseApiUrl + '/api/users'
};

export const SidebarLinkValues = {
  login: {link: 'login', name: 'Login', icon: 'home'},
  home: {link: '', name: 'Home', icon: 'home'},
  hours: {link: 'hours', name: 'Hours', icon: 'access_time'},
  leaves: {link: 'leaves', name: 'Leaves', icon: 'flight_takeoff'},
  holidays: {link: 'holidays', name: 'Holidays', icon: 'favorite'},
  overtime: {link: 'overtime', name: 'Overtime', icon: 'attach_money'},
  profile: {link: 'profile', name: 'Profile', icon: 'account_circle'},
  users: {link: 'users', name: 'Users', icon: 'supervisor_account'},
  reports: {link: 'reports', name: 'Reports', icon: 'bar_chart'},
};
export const SidebarLinks = [
  // {
  //   link: SidebarLinkValues.home.link,
  //   name: SidebarLinkValues.home.name,
  //   icon: SidebarLinkValues.home.icon,
  //   roles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER, UserRoles.USER]
  // },
  {
    link: SidebarLinkValues.hours.link,
    name: SidebarLinkValues.hours.name,
    icon: SidebarLinkValues.hours.icon,
    roles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER, UserRoles.USER]
  },
  {
    link: SidebarLinkValues.overtime.link,
    name: SidebarLinkValues.overtime.name,
    icon: SidebarLinkValues.overtime.icon,
    roles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER, UserRoles.USER]
  },
  {
    link: SidebarLinkValues.leaves.link,
    name: SidebarLinkValues.leaves.name,
    icon: SidebarLinkValues.leaves.icon,
    roles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER, UserRoles.USER]
  },
  {
    link: SidebarLinkValues.holidays.link,
    name: SidebarLinkValues.holidays.name,
    icon: SidebarLinkValues.holidays.icon,
    roles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER, UserRoles.USER]
  },
  {
    link: SidebarLinkValues.profile.link,
    name: SidebarLinkValues.profile.name,
    icon: SidebarLinkValues.profile.icon,
    roles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER, UserRoles.USER]
  },
  {
    link: SidebarLinkValues.users.link,
    name: SidebarLinkValues.users.name,
    icon: SidebarLinkValues.users.icon,
    roles: [UserRoles.ADMINISTRATOR, UserRoles.MANAGER]
  },
];
