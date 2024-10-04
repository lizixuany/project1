import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SchoolComponent } from './school.component';
import { AddComponent } from "./add/add.component";
import { EditComponent } from "./edit/edit.component";


const routes = [
  {
    path: '',
    component: SchoolComponent,
    children: [
      {
        path: 'add',
        component: AddComponent
      },
      {
        path: 'edit/:school_id',
        component: EditComponent
      }
    ]
  }
] as Route[];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
