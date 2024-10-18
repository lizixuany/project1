import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TermComponent} from './term.component';
import {RouterModule} from '@angular/router';
import {TermRoutingModule} from './term-routing.module';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AddComponent} from './add/add.component';
import {PageModule} from '../clazz/page/page.module';
import {EditComponent} from './edit/edit.component';
import {SchoolSelectModule} from '../school/school-select/school-select.module';

@NgModule({
  declarations: [TermComponent, AddComponent, EditComponent],
    imports: [
      CommonModule,
      RouterModule,
      TermRoutingModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      PageModule,
      SchoolSelectModule
    ]
})
export class TermModule { }
