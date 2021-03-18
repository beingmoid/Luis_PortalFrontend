import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { SharedModule } from 'src/app/shared.module';
import { PlanComponent } from './plan/plan.component';
import { BillingHistoryComponent } from './billing-history/billing-history.component';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [LogoutComponent, PlanComponent, BillingHistoryComponent, UserComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
