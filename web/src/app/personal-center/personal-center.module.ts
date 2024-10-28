import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {PersonalCenterRoutingModule} from './personal-center-routing.module';
import {PersonalCenterComponent} from './personal-center.component';
import {SexPipe} from './sex.pipe';
import {RolePipe} from '../role.pipe';
import {StatePipe} from '../state.pipe';
import {XAuthTokenInterceptor} from '../x-auth-token.interceptor';


@NgModule({
  declarations: [
    ChangePasswordComponent,
    PersonalCenterComponent,
    SexPipe,
    RolePipe,
    StatePipe
  ],
  imports: [
    BrowserModule,
    PersonalCenterRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  exports: [SexPipe, RolePipe, StatePipe],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XAuthTokenInterceptor, multi: true}
  ],
  bootstrap: [PersonalCenterComponent]
})
export class PersonalCenterModule { }
