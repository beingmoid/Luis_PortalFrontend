import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAnalyticsComponent } from './view-analytics/view-analytics.component';

const routes: Routes = [
  { path: '', component: ViewAnalyticsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
