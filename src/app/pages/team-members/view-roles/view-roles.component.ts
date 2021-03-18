import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { RoleService } from 'src/app/services/APIServices/role.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-view-roles',
  templateUrl: './view-roles.component.html',
  styleUrls: ['./view-roles.component.scss']
})
export class ViewRolesComponent implements OnInit {

  search: string
  listData: any[] = []
  isVisible: boolean = false
  modalTitle: string = "New Role"
  roleIdObserverSubject: Subject<string> = new Subject();
  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;

  constructor(private roleService: RoleService, private alert: AlertService, public _permissionService: PermissionService) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.roleService.roleListObserver$.subscribe(res => {
      if (res) {
        this.isVisible = false;
        this.listData = res;
        this.listDataCopy = JSON.stringify(this.listData);
      }
    });
  }

  addRole() {
    this.isVisible = true
    this.modalTitle = "New Role"
    this.roleIdObserverSubject.next(undefined);
  }

  editRole(roleId) {
    this.isVisible = true
    this.modalTitle = "Update Role"
    this.roleIdObserverSubject.next(roleId);
  }

  deleteRole(roleId) {
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this.roleService.deleteRole(roleId).subscribe(res => {
          if (res.isSuccessfull) {
            this.getAllRoles();
            this.alert.success('Role deleted Successfully!')
          }
          else
            this.alert.error('Error while deleting Role!')
        });
      } else {
        return
      }
    })
  }

  getAllRoles() {
    this.roleService.GetAllRoles();
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
      this.listData = this.listData.filter(item =>
        Object.keys(item).some(
          k =>
            item[k] != null &&
            item[k]
              .toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
      );
    }
  }

}
