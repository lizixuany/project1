import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageModule} from '../clazz/page/page.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {LessonComponent} from './lesson.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AddComponent} from './add/add.component';
import {LessonRoutingModule} from './lesson-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {SchoolSelectModule} from '../school/school-select/school-select.module';
import {TermSelectModule} from '../term/term-select/term-select.module';
import {CourseModule} from '../course/course.module';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    AddComponent,
    LessonComponent,
    CreateComponent
  ],
  entryComponents: [
    AddComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    PageModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LessonRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    SchoolSelectModule,
    TermSelectModule,
    CourseModule
  ],
  exports: [LessonComponent],
  bootstrap: [LessonComponent]
})
export class LessonModule { }
