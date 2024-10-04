import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {PersonalCenterRoutingModule} from './personal-center-routing.module';
import {PersonalCenterComponent} from './personal-center.component';

@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    PersonalCenterRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [PersonalCenterComponent]
})
export class PersonalCenterModule { }
