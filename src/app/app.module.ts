import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule, NativeScriptRouterModule } from '@nativescript/angular'
import { NativeScriptFormsModule } from '@nativescript/angular';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule, navigatableComponents, routes } from './app-routing.module'
import { AppComponent } from './app.component'



@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, FormsModule,NativeScriptModule,
    NativeScriptFormsModule, NativeScriptRouterModule, NativeScriptRouterModule.forRoot(routes)],
  declarations: [AppComponent, ...navigatableComponents],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
