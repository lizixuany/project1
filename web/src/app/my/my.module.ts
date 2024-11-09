import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SchoolSelectModule} from '../school/school-select/school-select.module';
import {ClazzSelectModule} from '../clazz/clazz-select/clazz-select.module';
import {TermSelectModule} from '../term/term-select/term-select.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SchoolSelectModule,
    ClazzSelectModule,
    TermSelectModule,
    ReactiveFormsModule
  ]
})
export class MyModule { }
