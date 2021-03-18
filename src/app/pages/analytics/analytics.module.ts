import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { ViewAnalyticsComponent } from './view-analytics/view-analytics.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [ViewAnalyticsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }
