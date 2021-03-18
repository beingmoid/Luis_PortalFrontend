import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';

const routes: Routes = [
  { path: '', component: ViewTasksComponent },
  { path: 'add', component: AddTasksComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
