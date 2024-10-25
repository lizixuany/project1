import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {PersonalCenterRoutingModule} from './personal-center-routing.module';
import {PersonalCenterComponent} from './personal-center.component';
import {SexPipe} from './sex.pipe';
import {RolePipe} from '../role.pipe';
import {StatePipe} from '../state.pipe';


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
  providers: [],
  bootstrap: [PersonalCenterComponent]
})
export class PersonalCenterModule { }
