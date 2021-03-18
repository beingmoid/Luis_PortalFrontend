import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMembersRoutingModule } from './team-members-routing.module';
import { ViewTeamComponent } from './view-team/view-team.component';
import { ViewRolesComponent } from './view-roles/view-roles.component';
import { AddTeamMemberComponent } from './add-team-member/add-team-member.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { TeammembersComponent } from './teammembers/teammembers.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [ViewTeamComponent, ViewRolesComponent, AddTeamMemberComponent, AddRoleComponent, TeammembersComponent],
  imports: [
    CommonModule,
    SharedModule,
    TeamMembersRoutingModule
  ],exports: [ AddTeamMemberComponent, AddRoleComponent ]
})
export class TeamMembersModule { }
