import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventsDTO } from 'src/app/models/eventsDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class EventsService extends GenericApiService {

    eventObserver$: Observable<EventsDTO[]>;
    private eventSubject$: BehaviorSubject<EventsDTO[]> = new BehaviorSubject<EventsDTO[]>(undefined);
    constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.eventObserver$ = this.eventSubject$.asObservable();
    }
    
    createUpdateEvent(file: any, data: EventsDTO): Observable<BaseResponse> {
        const formData = new FormData();
        formData.append('File', file);
        formData.append('ContactId', data.contactId.toString());
        formData.append('Subject', data.subject.toString());
        formData.append('StartDate', (new Date(data.startDate)).toUTCString());
        formData.append('EndDate',  (new Date(data.endDate)).toUTCString());
        formData.append('Time', data.time.toString());
        formData.append('AllDay', data.allDay.toString());
        data.attandees.forEach((item) => formData.append("Attandees[]", item))
        data.tags.forEach((item) => formData.append("Tags[]", item))
        formData.append('EmailAttandees', data.emailAttandees.toString());
        formData.append('Reminders', data.reminders.toString());
        formData.append('Notes', data.notes.toString());
        formData.append('CaseId', data.caseId.toString());
        formData.append('IsFileAdded', data.isFileAdded.toString());
        if(data.id != undefined){
          formData.append('Id', data.id.toString());
        }
        return this.Post(formData, API_URL + API_ENDPOINTS.Events + "/CreateUpdateEvent");
    }

    getEvents(){
        this.GetAll(API_URL + API_ENDPOINTS.Events).subscribe(res => {
            if(res.isSuccessfull){
                this.eventSubject$.next(res.dynamicResult);
            }
        });
    }

    deleteEvent(data: EventsDTO): Observable<BaseResponse> {
        return this.Delete(data.id, API_URL + API_ENDPOINTS.Events);
    }
}  