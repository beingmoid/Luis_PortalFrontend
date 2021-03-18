import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/components/ui/system/Guard/auth.guard';
import { BillingHistoryComponent } from './billing-history/billing-history.component';
import { LogoutComponent } from './logout/logout.component';
import { PlanComponent } from './plan/plan.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'logout', canActivate: [AuthGuard], component: LogoutComponent },
  { path: 'billing-history', canActivate: [AuthGuard], component: BillingHistoryComponent },
  { path: 'plan', component: PlanComponent },
  { 
    path: 'user', 
    canActivate: [AuthGuard], 
    component: UserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
