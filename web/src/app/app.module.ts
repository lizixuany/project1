import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {WelcomeComponent} from './welcome.component';
import {IndexComponent} from './index/index.component';
import {NavComponent} from './nav/nav.component';
import {LoginComponent} from './login/login.component';
import {SchoolModule} from './school/school.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PersonalCenterModule} from './personal-center/personal-center.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    IndexComponent,
    NavComponent,
    LoginComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SchoolModule,
    BrowserAnimationsModule,
    PersonalCenterModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [IndexComponent]
})
export class AppModule { }
