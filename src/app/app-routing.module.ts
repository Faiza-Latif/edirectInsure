import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./project-page/project-page.module').then((m) => m.ProjectPageModule),
     canLoad: [AuthGuard],
  },
  {
    path: 'task',
    loadChildren: () =>
      import('./task-page/task-page.module').then((m) => m.TaskPageModule),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
