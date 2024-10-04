import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import {AddComponent} from './add/add.component';
// import {EditComponent} from './edit/edit.component';
import {PersonalCenterComponent} from './personal-center/personal-center.component';
import {WelcomeComponent} from './welcome.component';
import {AppComponent} from './app.component';

const routes: Routes = [
  {
    path: 'school',
    loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
  },
  {
    path: 'term',
    loadChildren: () => import('./term/term.module').then(m => m.TermModule)
  },{
    path: '',
    component: WelcomeComponent
  },
  // {
  //   path: 'clazz',
  //   loadChildren: () => import('./clazz/clazz.module').then(m => m.ClazzModule)
  // },
  // {
  //   path: 'student',
  //   loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
  // },
  {
    path: 'user',
    component: AppComponent
  },
  // {
  //   path: 'user/add',
  //   component: AddComponent
  // },
  // {
  //   path: 'user/edit/:id',
  //   component: EditComponent
  // },
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
