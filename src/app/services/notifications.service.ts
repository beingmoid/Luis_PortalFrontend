import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS, API_URL } from '../models/Global';
import { NotificationDTO } from '../models/NotificationDTO';
import { ApiHandler } from './ApiHandler';

@Injectable({ providedIn: 'root' })

export class NotificationsService extends ApiHandler {

    notificationSubject$: BehaviorSubject<NotificationDTO[]> = new BehaviorSubject(null)
    observable$: Observable<NotificationDTO[]>
    

    constructor(
        private http: HttpClient
    ) {
        super(http);
        this.observable$ = this.notificationSubject$.asObservable()
        const time = interval(180000)
        time.subscribe(r => {
            this.getNotifications()
        });
        
    }

    getNotifications() {
        return this.GetAll(API_URL + API_ENDPOINTS.Notification).pipe(map(x => x.dynamicResult)).subscribe((x) => {
            this.notificationSubject$.next(x);
        })
    }

}