import { Injectable } from '@angular/core';
import { ClaimType } from '../models/claimsConstant';

class HomePermissionsObject {
  team: { canView: boolean, canCreate: boolean };
  contact: { canView: boolean, canCreate: boolean };
  task: { canView: boolean, canCreate: boolean };
  case: { canView: boolean, canCreate: boolean };
  event: { canView: boolean, canCreate: boolean };
}

@Injectable({
  providedIn: 'root'
})


export class PermissionService {

  permission: any;
  homePermission: any;
  role: any;
  historyPermissions: any[] = [];
  homePermissionsObject: HomePermissionsObject = {
    team: { canView: false, canCreate: false },
    contact: { canView: false, canCreate: false },
    task: { canView: false, canCreate: false },
    case: { canView: false, canCreate: false },
    event: { canView: false, canCreate: false },
  };

  constructor() { }

  setPermissions(name: string, tokenPayload: any) {
    this.historyPermissions = [];
    this.role = tokenPayload.Role
    if (tokenPayload.Role === "CompanyAdmin") {
      this.permission = ["Create", "View", "Edit", "Delete"]
      Object.keys(ClaimType).forEach(element => {
        if (element.includes("History")) {
          this.historyPermissions.push(element);
        }
      });
    } else {
      if (tokenPayload[name]) {
        if (typeof tokenPayload[name] === "string") {
          this.permission = [`${tokenPayload[name]}`]
        } else {
          this.permission = tokenPayload[name]
        }
      }
      if (Object.keys(tokenPayload).findIndex(x => x.includes("History")) > -1) {
        Object.keys(tokenPayload).forEach(element => {
          if (element.includes("History")) {
            this.historyPermissions.push(element);
          }
        });
      }
    }
  }

  setHomePermissions(tokenPayload: any) {
    Object.keys(tokenPayload).forEach((element, index) => {
      if (element == "Team") {
        this.homePermissionsObject.team.canView = JSON.stringify(Object.values(tokenPayload)[index]).includes('View');
        this.homePermissionsObject.team.canCreate = JSON.stringify(Object.values(tokenPayload)[index]).includes('Create');
      }
      else if (element == "Calendar") {
        this.homePermissionsObject.event.canView = JSON.stringify(Object.values(tokenPayload)[index]).includes('View');
        this.homePermissionsObject.event.canCreate = JSON.stringify(Object.values(tokenPayload)[index]).includes('Create');
      }
      else if (element == "Contacts") {
        this.homePermissionsObject.contact.canView = JSON.stringify(Object.values(tokenPayload)[index]).includes('View');
        this.homePermissionsObject.contact.canCreate = JSON.stringify(Object.values(tokenPayload)[index]).includes('Create');
      }
      else if (element == "Tasks") {
        this.homePermissionsObject.task.canView = JSON.stringify(Object.values(tokenPayload)[index]).includes('View');
        this.homePermissionsObject.task.canCreate = JSON.stringify(Object.values(tokenPayload)[index]).includes('Create');
      }
      else if (element == "Cases") {
        this.homePermissionsObject.case.canView = JSON.stringify(Object.values(tokenPayload)[index]).includes('View');
        this.homePermissionsObject.case.canCreate = JSON.stringify(Object.values(tokenPayload)[index]).includes('Create');
      }
    });
  }

  getRole() {
    return this.role
  }

  getPermissions() {
    return this.permission;
  }

  getHomePermissions() {
    return this.homePermissionsObject;
  }

  public get getHistoryPermissions() {
    return this.historyPermissions;
  }

  public get canView() {
    return this.permission && this.permission.indexOf('View') > -1;
  }

  public get canCreate() {
    return this.permission && this.permission.indexOf('Create') > -1;
  }

  public get canEdit() {
    return this.permission && this.permission.indexOf('Edit') > -1;
  }

  public get canDelete() {
    return this.permission && this.permission.indexOf('Delete') > -1;
  }
}
