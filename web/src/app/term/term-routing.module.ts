import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {TermComponent} from './term.component';
import {AddComponent} from './add/add.component';

const routes = [
  {
    path: '',
    component: TermComponent,
    children: [
      {
        path: 'add',
        component: AddComponent
      }
    ]
  }
] as Route[];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermRoutingModule { }
