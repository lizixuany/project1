import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddComponent} from './add/add.component';
import {SchoolComponent} from './school.component';
import {RouterModule} from '@angular/router';
import {SchoolRoutingModule} from './school-routing.module';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {EditComponent} from './edit/edit.component';
import {PageModule} from "../clazz/page/page.module";

@NgModule({
  declarations: [
    AddComponent,
    SchoolComponent,
    EditComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        SchoolRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        PageModule
    ],
  exports: [SchoolComponent]
})
export class SchoolModule {
}
