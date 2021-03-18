import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventComponent } from './add-event/add-event.component';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';

const routes: Routes = [
  { path: '', component: ViewCalendarComponent },
  { path: 'add', component: AddEventComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
