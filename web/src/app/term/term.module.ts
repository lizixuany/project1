import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TermComponent} from './term.component';
import {RouterModule} from '@angular/router';
import {TermRoutingModule} from './term-routing.module';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AddComponent} from './add/add.component';

@NgModule({
  declarations: [TermComponent, AddComponent],
  imports: [
    CommonModule,
    RouterModule,
    TermRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class TermModule { }
