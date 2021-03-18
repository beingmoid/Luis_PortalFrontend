import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommissionRoutingModule } from './commission-routing.module';
import { ViewCommissionComponent } from './view-commission/view-commission.component';
import { AddCommissionComponent } from './add-commission/add-commission.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [ViewCommissionComponent, AddCommissionComponent],
  imports: [
    CommonModule,
    SharedModule,
    CommissionRoutingModule
  ]
})
export class CommissionModule { }
