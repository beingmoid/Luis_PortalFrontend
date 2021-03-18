import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { RetainerScheduleComponent } from './retainer-schedule/retainer-schedule.component';
import { AccountsComponent } from './accounts/accounts.component';
import { SharedModule } from 'src/app/shared.module';
import { TabsComponent } from './tabs/tabs.component';


@NgModule({
  declarations: [ TransactionsComponent, InvoicesComponent, RetainerScheduleComponent, AccountsComponent, TabsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccountingRoutingModule
  ],
  exports: [
    TabsComponent
  ]
})
export class AccountingModule { }
