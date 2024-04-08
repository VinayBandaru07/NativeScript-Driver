import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule, NSEmptyOutletComponent } from '@nativescript/angular'

import {LoginComponent} from './login/login.component'
import {HomeComponent} from './home/home.component'
import {RegistrationComponent} from './registration/registration.component'
import {ReportComponent}from './report_issue/report.component'
import {EditProfileComponent} from './edit_profile/editprofile.component'
import {ExperimentComponent} from './experiment/experiment.component'
import {AttendanceComponent} from './attendance/attendance.component'

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent },
  {path: "registration", component:RegistrationComponent},
  {path:"report", component:ReportComponent},
  {path:"editProfile", component: EditProfileComponent},
  {path:"", component: ExperimentComponent},
  {path:"attendance", component:AttendanceComponent}
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}

export const navigatableComponents = [
  LoginComponent, HomeComponent, RegistrationComponent, ReportComponent, EditProfileComponent, ExperimentComponent,AttendanceComponent
]
