import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {WelcomeComponent} from './welcome.component';
import {IndexComponent} from './index/index.component';
import {NavComponent} from './nav/nav.component';
import {LoginComponent} from './login/login.component';
import {SchoolModule} from './school/school.module';
import {PageModule} from './clazz/page/page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PersonalCenterModule} from './personal-center/personal-center.module';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';
import {SchoolSelectModule} from './school/school-select/school-select.module';
import {ClazzSelectModule} from './clazz/clazz-select/clazz-select.module';
import {MatDialogModule} from '@angular/material/dialog';
import {XAuthTokenInterceptor} from './x-auth-token.interceptor';
import {SweetAlertService} from './service/sweet-alert.service';
import {CourseScheduleComponent} from './course-schedule/course-schedule.component';
import {MatOptionModule} from "@angular/material/core";
import {TermSelectModule} from "./term/term-select/term-select.module";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    IndexComponent,
    NavComponent,
    LoginComponent,
    AddComponent,
    EditComponent,
    CourseScheduleComponent
  ],
  entryComponents: [
    AddComponent, // 确保 AddComponent 在这里
    EditComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SchoolModule,
    BrowserAnimationsModule,
    PersonalCenterModule,
    SchoolSelectModule,
    ClazzSelectModule,
    PageModule,
    MatDialogModule,
    MatOptionModule,
    TermSelectModule,
    MatSelectModule
  ],
  providers: [
    SweetAlertService,
    {provide: HTTP_INTERCEPTORS, useClass: XAuthTokenInterceptor, multi: true}
  ],
  exports: [
  ],
  bootstrap: [IndexComponent]
})
export class AppModule { }
