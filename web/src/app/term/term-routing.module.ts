import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {TermComponent} from './term.component';

const routes = [
  {
    path: '',
    component: TermComponent
  }
] as Route[];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermRoutingModule { }
