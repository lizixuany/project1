import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageModule} from '../clazz/page/page.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {CourseComponent} from './course.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {CourseRoutingModule} from './course-routing.module';


@NgModule({
  declarations: [
    EditComponent,
    AddComponent,
    CourseComponent
  ],
  imports: [
    CommonModule,
    PageModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CourseRoutingModule
  ],
  exports: [CourseComponent]
})
export class CourseModule { }
