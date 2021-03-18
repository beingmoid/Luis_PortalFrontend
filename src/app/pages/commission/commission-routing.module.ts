import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCommissionComponent } from './add-commission/add-commission.component';
import { ViewCommissionComponent } from './view-commission/view-commission.component';

const routes: Routes = [
  { path: '', component: ViewCommissionComponent },
  { path: 'add', component: AddCommissionComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommissionRoutingModule { }
