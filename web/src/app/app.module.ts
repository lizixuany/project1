import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {WelcomeComponent} from './welcome.component';
import {IndexComponent} from './index/index.component';
import {NavComponent} from './nav/nav.component';
import {LoginComponent} from './login/login.component';
import {PersonalCenterComponent} from './personal-center/personal-center.component';
import {RouterModule} from '@angular/router';
import {SexPipe} from './personal-center/sex.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    IndexComponent,
    NavComponent,
    LoginComponent,
    PersonalCenterComponent,
    SexPipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [IndexComponent]
})
export class AppModule { }
