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
import {RoleChangeComponent} from './role-change/role-change.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    ChangePasswordComponent,
    RoleChangeComponent,
    PersonalCenterComponent,
    SexPipe,
    RolePipe,
    StatePipe
  ],
  entryComponents: [
    RoleChangeComponent // 添加到这里
  ],
  imports: [
    BrowserModule,
    PersonalCenterRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MatDialogModule
  ],
  exports: [SexPipe, RolePipe, StatePipe],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XAuthTokenInterceptor, multi: true}
  ],
  bootstrap: [PersonalCenterComponent]
})
export class PersonalCenterModule { }
