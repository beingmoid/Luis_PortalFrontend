import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';
import { AddEventComponent } from './add-event/add-event.component';
import { SharedModule } from 'src/app/shared.module';
import { ViewEventComponent } from './view-event/view-event.component';


@NgModule({
  declarations: [ViewCalendarComponent, AddEventComponent, ViewEventComponent],
  imports: [
    CommonModule,
    SharedModule,
    CalendarRoutingModule
  ],
  exports: [
    AddEventComponent
  ]
})
export class CalendarModule { }
