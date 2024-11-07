import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PersonalCenterComponent} from './personal-center/personal-center.component';
import {WelcomeComponent} from './welcome.component';
import {AppComponent} from './app.component';
import {IndexComponent} from './index/index.component';
import {TripComponent} from './trip/trip.component';
import {CourseScheduleComponent} from './course-schedule/course-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'login',
    component: IndexComponent
  },
  {
    path: 'school',
    loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
  },
  {
    path: 'term',
    loadChildren: () => import('./term/term.module').then(m => m.TermModule)
  },
  {
    path: 'clazz',
    loadChildren: () => import('./clazz/clazz.module').then(m => m.ClazzModule)
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then(m => m.CourseModule)
  },
  {
    path: 'user',
    component: AppComponent
  },
  {
    path: 'personal-center',
    component: PersonalCenterComponent
  },
  {
    path: 'course-schedule',
    component: CourseScheduleComponent
  },
  {
    path: 'trip',
    component: TripComponent
  },
  {
    path: 'lesson',
    loadChildren: () => import('./lesson/lesson.module').then(m => m.LessonModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
