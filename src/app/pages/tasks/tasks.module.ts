import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { AddTasksComponent } from './add-tasks/add-tasks.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [AddTasksComponent, ViewTasksComponent],
  imports: [
    CommonModule,
    SharedModule,
    TasksRoutingModule
  ],
  exports: [ ViewTasksComponent  ,  AddTasksComponent]
})
export class TasksModule { }
