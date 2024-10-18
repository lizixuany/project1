import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ClazzRoutingModule} from './clazz-routing.module';
import {ClazzComponent} from './clazz.component';
import {AddComponent} from './add/add.component';
import {PageModule} from './page/page.module';
import {EditComponent} from './edit/edit.component';
import {ClazzService} from '../service/clazz.service';
import {ClazzSelectModule} from './clazz-select/clazz-select.module';
import {SchoolSelectModule} from '../school/school-select/school-select.module';

@NgModule({
  declarations: [
    ClazzComponent,
    AddComponent,
    EditComponent
  ],
    imports: [
      CommonModule,
      ClazzRoutingModule,
      ReactiveFormsModule,
      HttpClientModule,
      FormsModule,
      RouterModule,
      PageModule,
      ClazzSelectModule,
      SchoolSelectModule
    ],
  providers: [ClazzService],
  bootstrap: [ClazzComponent]
})
export class ClazzModule { }
