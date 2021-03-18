import { Component } from '@angular/core'
import { NotificationDTO } from 'src/app/models/NotificationDTO'
import { NotificationsService } from 'src/app/services/notifications.service'
import { PermissionService } from 'src/app/services/permission.service'

@Component({
  selector: 'cui-topbar-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class TopbarActionsComponent {
  count = 0
  events: NotificationDTO[] = []
  alerts: NotificationDTO[] = []
  actions: NotificationDTO[] = []
  role: string = ''

  constructor(
    private _notification: NotificationsService,
    private _permission: PermissionService,
  ) {
    this.role = _permission.getRole()
    _notification.observable$.subscribe((res: NotificationDTO[]) => {
     
      if (res && res.length > 0) {
        this.events = []
        this.alerts = []
        this.actions = []
        res.forEach(e => {
          if (e.typeName == "Event") {
            this.events.push(e);
          }
          if (e.typeName == "Alert") {
            this.alerts.push(e);
          }
          if (e.typeName == "Action") {
            this.actions.push(e);
          }
        });
        if(this.role == 'CompanyAdmin') {
          this.count = (res && res.length) ? res.length : 0 
        } else if(this.role == 'Client') {
          this.count = this.actions.length
        } else {
          this.count = res.length - this.alerts.length
        }
      } else {
        this.events = []
        this.alerts = []
        this.actions = []
        this.count = 0
      }
      // console.log('res:', res, this.role)
    })
    _notification.getNotifications()
  }
}
