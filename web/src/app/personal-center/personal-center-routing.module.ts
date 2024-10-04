import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {PersonalCenterComponent} from './personal-center.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

const routes = [
  {
    path: '',
    component: PersonalCenterComponent,
    children: [
      {
        path: 'personal-center/change-password',
        component: ChangePasswordComponent
      }
    ]
  }
] as Route[];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PersonalCenterRoutingModule {
}
