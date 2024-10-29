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
import {SchoolSelectModule} from '../school/school-select/school-select.module';
import {ClazzSelectModule} from '../clazz/clazz-select/clazz-select.module';
import {TermSelectModule} from '../term/term-select/term-select.module';
import {MatDialogModule} from '@angular/material/dialog';
import {SoryPipe} from './sory.pipe';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    EditComponent,
    AddComponent,
    CourseComponent,
    SoryPipe
  ],
  entryComponents: [
    EditComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    PageModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CourseRoutingModule,
    SchoolSelectModule,
    ClazzSelectModule,
    TermSelectModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [CourseComponent],
  bootstrap: [CourseComponent]
})
export class CourseModule { }
