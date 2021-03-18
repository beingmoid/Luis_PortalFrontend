import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiHandler } from './ApiHandler';
import { Dummy } from '../models/DummyModel';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL, API_ENDPOINTS } from '../models/Global';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class DummyService extends ApiHandler {

    subscriptionsDataObserver$: Observable<Dummy[]>;
    subscriptionsDataSubject$: BehaviorSubject<Dummy[]> = new BehaviorSubject<Dummy[]>(undefined);

    constructor(private httpClient: HttpClient) {
        super(httpClient);
        this.subscriptionsDataObserver$ = this.subscriptionsDataSubject$.asObservable();

    }

    GetDummyList() {
        return this.GetAll(API_ENDPOINTS.DummyList).pipe(map(x => x.dynamicResult)).subscribe((x) => {
            this.subscriptionsDataSubject$.next(x);
        })
    }

    GetItem(id: any) {
        return this.Get(id, API_ENDPOINTS.DummyGet).pipe(map(x => x.dynamicResult)).toPromise<Dummy>();

    } 

    AddUpdateItem(id: any, model: Dummy) {
        return this.Post(id, API_ENDPOINTS.DummyAdd, model).pipe(map(x => x.dynamicResult)).toPromise<boolean>();
    }

    DeleteDummy(id: any) {
        return this.Delete(id, API_ENDPOINTS.DummyDelete).pipe(map(x => x.dynamicResult)).toPromise<boolean>();

    }

}