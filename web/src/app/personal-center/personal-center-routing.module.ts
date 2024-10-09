import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';
import {PersonalCenterComponent} from './personal-center.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalCenterComponent,
    children: [
      {
        path: 'change-password',
        component: ChangePasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PersonalCenterRoutingModule {
}
