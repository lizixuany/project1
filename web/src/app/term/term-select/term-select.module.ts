import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TermSelectComponent} from './term-select.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [TermSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TermSelectComponent
  ]
})
export class TermSelectModule { }
