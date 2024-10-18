import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SchoolSelectComponent} from './school-select.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [SchoolSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    SchoolSelectComponent
  ]
})
export class SchoolSelectModule { }
