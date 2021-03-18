import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoryLoginComponent } from './history-login/history-login.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: '', component: HistoryComponent },
  { path: 'login', component: HistoryLoginComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
