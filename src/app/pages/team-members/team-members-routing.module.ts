import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeammembersComponent } from './teammembers/teammembers.component';

const routes: Routes = [
  { path: '', component: TeammembersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMembersRoutingModule { }
