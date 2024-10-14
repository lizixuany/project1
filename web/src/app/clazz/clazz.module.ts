import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ClazzRoutingModule} from './clazz-routing.module';
import {ClazzComponent} from './clazz.component';
import {AddComponent} from './add/add.component';
import {KlassSelectComponent} from './klass-select/klass-select.component';
import {PageModule} from './page/page.module';
import {EditComponent} from './edit/edit.component';

@NgModule({
  declarations: [
    ClazzComponent,
    AddComponent,
    EditComponent,
    KlassSelectComponent
  ],
  imports: [
    CommonModule,
    ClazzRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    PageModule
  ],
  providers: [],
  bootstrap: [ClazzComponent]
})
export class ClazzModule { }
