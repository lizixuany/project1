import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolComponent } from './school/school.component';
import { AddComponent } from "./school/add/add.component";


const routes: Routes = [
  {
    path: 'school',
    loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
