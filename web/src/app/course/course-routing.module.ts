import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {CourseComponent} from './course.component';
import {AddComponent} from './add/add.component';
import {EditComponent} from './edit/edit.component';

const routes = [
  {
    path: '',
    component: CourseComponent,
    children: [
      {
        path: 'add',
        component: AddComponent
      },
      {
        path: 'edit/:id',
        component: EditComponent
      }
    ]
  }
] as Route[];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
