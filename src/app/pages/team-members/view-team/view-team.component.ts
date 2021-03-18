import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { commissionDTO } from 'src/app/models/commissionDTO';
import { TeamMemberDTO } from 'src/app/models/TeamMemberDTO';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/APIServices/user.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { PermissionService } from 'src/app/services/permission.service';

class FilterObject {
  constructor(private data: TeamMemberDTO) { }

  index: number = this.data.index;
  firstName: string = this.data.firstName;
  lastName: string = this.data.lastName;
  email: string = this.data.email;
  memberStatus: boolean = this.data.memberStatus;
  role: string = this.data.role;
  lastLoggedIn: Date = this.data.lastLoggedIn;
}

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent implements OnInit, OnDestroy {

  search: string
  listData: TeamMemberDTO[] = [];
  teamData: TeamMemberDTO = new TeamMemberDTO();
  isVisible: boolean = false
  modalTitle: string = "New Team Member"
  showAddButton: boolean = true;
  teamMemberSubject: Subscription; 
  userSubject: Subscription;
  numberOfUsers: number;
  teamMemberObserverSubject: Subject<TeamMemberDTO> = new Subject();
  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;
  showTeamMember: boolean = false;
  constructor(private usersService: UserService, private alert: AlertService, private _authService: AuthService, public _permissionService: PermissionService) { }

  ngOnInit(): void {
    this.teamMemberSubject = this.usersService.teamMembersObserver$.subscribe((res: any) => {
      if (res) {
        this.isVisible = false;
        this.listData = res.filter(x => x.role !== "CompanyAdmin");
        let index = 0;
        this.listData.forEach(element => {
          element.index = index + 1;
          index++;
        });
        this.listDataCopy = JSON.stringify(this.listData);
        this.userSubject = this._authService.user.subscribe(res => {
          if (res) {
            if (res.isValidPlan && res.numberOfUsersPurchased <= this.listData.length) {
              this.showAddButton = false;
            }
            else {
              this.showAddButton = true;
            }
            this.numberOfUsers = res.numberOfUsersPurchased;
          }
        })
      }
    })

    if (!this.usersService.TeamMembers) {
      this.usersService.GetUsersForCurrentTenant();
    }
  }

  ngOnDestroy() {
    if (this.userSubject) this.userSubject.unsubscribe();
    if (this.teamMemberSubject) this.teamMemberSubject.unsubscribe();
  }

  showModal(): void {
    this.isVisible = true;
    this.modalTitle = "Add Team Member";
    this.teamMemberObserverSubject.next(null);
  }

  EditTeamMember(data: TeamMemberDTO) {
    this.modalTitle = "Edit Team Member";
    this.isVisible = true;
    this.teamMemberObserverSubject.next(data);
    this.showTeamMember = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.showTeamMember = false;
  }

  deleteTeamMember(userId) {
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this.usersService.deleteTeamMember(userId).subscribe(res => {
          if (res.isSuccessfull) {
            this.usersService.GetUsersForCurrentTenant();
            this.alert.success('User deleted Successfully!')
            this.showTeamMember = false;
          }
          else
            this.alert.error('Error while deleting user!')
        });
      } else {
        return
      }
    })
  }

  // Sorting
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey
    }
  }
  sortNamesFn = (a, b) => a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey])
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey]
  filter() {
    this.listData = JSON.parse(this.listDataCopy);
    if (this.search !== "") {
      this.listData = this.listData.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
      });
    }
  }
  showSingleTaskMember(data: TeamMemberDTO) {
    this.teamData = data;
    // console.log(this.teamData);
    this.showTeamMember = true;
  }
}
