import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { EventsDTO } from 'src/app/models/eventsDTO';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {

  
  @Input() eventSub: Subject<EventsDTO>;
  contacts: any[] = [];
  attandeesList: any[] = [];
  event: any = new EventsDTO;
  @Output() edit = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<boolean>();
  constructor(private _contactService: ContactsService, public _permissionService: PermissionService) { }

  ngOnInit(): void {
    this._contactService.contactObserver$.subscribe(res => {
      if(res)
        this.contacts = res;
    });
    
    this.eventSub.subscribe(res => {
      if (res) {
        this.attandeesList = [];
        this.event = res;
        var tempContact = JSON.parse(JSON.stringify(this.contacts));
        var attandees = JSON.parse(JSON.stringify(this.event.attandees));
        var otherAttandees = tempContact.filter(function(v) {
          return attandees.indexOf(v.id) > -1;
        })
        this.attandeesList = otherAttandees;
        var organizer = tempContact.find(x => x.id == this.event.contactId);
        organizer.name = organizer.name + " (Organizer)"
        this.attandeesList.unshift(organizer);
      }
    });
  }

  editEvent(){
    this.edit.next(true);
  }

  deleteEvent(){
    this.delete.next(true);
  }

  downloadAttachment() {
    window.location.href = this.event.eventFileBlobURI;
    //saveAs(this.event.eventFileBlobURI,  this.event.eventFileBlobName);
  }

}
