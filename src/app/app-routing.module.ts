import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule, NSEmptyOutletComponent } from '@nativescript/angular'

import {LoginComponent} from './login/login.component'
import {HomeComponent} from './home/home.component'
import {RegistrationComponent} from './registration/registration.component'

export const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent },
  {path: "registration", component:RegistrationComponent}

]


@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}

export const navigatableComponents = [
  LoginComponent, HomeComponent, RegistrationComponent
]
