import { Component, OnInit } from '@angular/core';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { Subject } from 'rxjs';
import { EventsDTO } from 'src/app/models/eventsDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { EventsService } from 'src/app/services/APIServices/events.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrls: ['./view-calendar.component.scss']
})
export class ViewCalendarComponent implements OnInit {

  selectedDate = new Date();
  mode: NzCalendarMode = 'month';
  modalTitle: string = "New Event";
  isVisible: boolean = false;
  viewEvent: boolean = false;

  current = new Date();

  events: any[] = [];
  dateList: any = [];
  editEventObserverSubject: Subject<EventsDTO> = new Subject();
  viewEventObserverSubject: Subject<EventsDTO> = new Subject();
  closeModalObserverSubject: Subject<boolean> = new Subject();

  constructor(private _caseService: CaseService, private _contactService: ContactsService, private _eventsService: EventsService, private alert: AlertService, public _permissionService: PermissionService) { }

  ngOnInit(): void {
    this.current.setHours(0, 0, 0, 0);
    this._eventsService.eventObserver$.subscribe(res => {
      if (res) {
        this.dateList = [];
        this.isVisible = false;
        this.editEventObserverSubject.next(null);
        this.events = res;
        this.events.forEach(element => {
          element.startDate = new Date(element.startDate);
          element.startDate.setHours(0, 0, 0, 0);
          element.endDate = new Date(element.endDate);
          element.endDate.setHours(0, 0, 0, 0);
          this.getDates(element.startDate, element.endDate)
          element.type = 'warning'
        });

        let eventId = history.state.eventId;
        if (eventId) {
          this.showEvent(this.events.find(p => p.id == eventId), new Date());
        }
      }
    });

    this._eventsService.getEvents();

    if (!this._caseService.cases) {
      this._caseService.getCases();
    }

    if (!this._contactService.contacts) {
      this._contactService.getContacts();
    }
  }

  getDates(startDate, stopDate) {
    var currentDate = new Date(JSON.parse(JSON.stringify(startDate)));
    while (currentDate <= stopDate) {
      var date = new Date(currentDate)
      date.setHours(0, 0, 0, 0);
      if (!this.dateList.includes(date.getTime())) {
        this.dateList.push(date.getTime());
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  getEvents(index, event) {
    return event;
  }

  getMonthEvents(month: Date) {
    return this.events.filter(value => {
      return (value.startDate.getMonth() <= month.getMonth()) && (value.endDate.getMonth() >= month.getMonth());
    });
  }

  showModal(): void {
    this.isVisible = true;
    this.modalTitle = "New Event";
    this.editEventObserverSubject.next(null);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.editEventObserverSubject.next(null);
    this.closeModalObserverSubject.next(true);
  }

  selectedEvent: any;
  showEvent(data: any, selectedDate): void {
    data.selectedDate = selectedDate;
    this.viewEvent = true;
    this.viewEventObserverSubject.next(data);
    this.selectedEvent = data;
  }

  editEvent() {
    this.viewEvent = false
    this.isVisible = true;
    this.editEventObserverSubject.next(this.selectedEvent);
  }

  deleteEvent() {
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._eventsService.deleteEvent(this.selectedEvent).subscribe(res => {
          if (res.isSuccessfull) {
            this.viewEvent = false;
            this._eventsService.getEvents();
            this.alert.success('Event deleted Successfully!')
          }
          else {
            this.viewEvent = false;
            this.alert.error('Error while deleting Event!')
          }
        });
      } else {
        return
      }
    })
  }

  closeViewEvent(): void {
    this.viewEvent = false;
  }

  panelChange(change: { date: Date; mode: string }): void {
    // console.log(change.date, change.mode);
  }

  changeDate(date: any) {
    // console.log(date);
    this.selectedDate = date;
  }
}
