import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageModule} from '../clazz/page/page.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {LessonComponent} from './lesson.component';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {EditComponent} from './edit/edit.component';
import {AddComponent} from './add/add.component';
import {LessonRoutingModule} from './lesson-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    EditComponent,
    AddComponent,
    LessonComponent
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
    LessonRoutingModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [LessonComponent],
  bootstrap: [LessonComponent]
})
export class LessonModule { }
