import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import {AddComponent} from './add/add.component';
// import {EditComponent} from './edit/edit.component';
import {PersonalCenterComponent} from './personal-center/personal-center.component';
import {WelcomeComponent} from './welcome.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {
    path: 'school',
    loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
  },
  {
    path: 'term',
    loadChildren: () => import('./term/term.module').then(m => m.TermModule)
  },
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'clazz',
    loadChildren: () => import('./clazz/clazz.module').then(m => m.ClazzModule)
  },
  {
    path: 'user',
    component: AppComponent
  },
  {
    path: 'personal-center',
    component: PersonalCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
