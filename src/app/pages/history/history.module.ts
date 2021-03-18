import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history/history.component';
import { SharedModule } from 'src/app/shared.module';
import { HistoryCaseComponent } from './history-case/history-case.component';
import { HistoryContactComponent } from './history-contact/history-contact.component';
import { HistoryAccountComponent } from './history-account/history-account.component';
import { HistoryDocumentComponent } from './history-document/history-document.component';
import { HistoryCommissionComponent } from './history-commission/history-commission.component';
import { HistoryTaskComponent } from './history-task/history-task.component';
import { HistoryLoginComponent } from './history-login/history-login.component';
import { HistoryEventComponent } from './history-event/history-event.component';


@NgModule({
  declarations: [ HistoryComponent, HistoryCaseComponent, HistoryContactComponent, HistoryAccountComponent, HistoryDocumentComponent, HistoryCommissionComponent, HistoryTaskComponent, HistoryLoginComponent, HistoryEventComponent],
  imports: [
    CommonModule,
    SharedModule,
    HistoryRoutingModule
  ]
})
export class HistoryModule { }
