import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactsModule } from '../contacts/contacts.module';
import { TasksModule } from '../tasks/tasks.module';
import { TeamMembersModule } from '../team-members/team-members.module';
import { CasesModule } from '../cases/cases.module';
import { CalendarModule } from '../calendar/calendar.module';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
    NgbModule,
    CommonModule,
    HomeRoutingModule,
    ContactsModule,
    TasksModule,
    ContactsModule,
    TeamMembersModule,
    CasesModule,
    CalendarModule
  ]
})
export class HomeModule { }
