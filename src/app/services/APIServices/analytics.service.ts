import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService extends GenericApiService {

  caseHistoryObserver$: Observable<any>;
  private caseHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {
    super(http)
  }

  getCasesPerDayInWeek(date: string) {
    var url = API_URL + API_ENDPOINTS.Analytics + `/GetCasesPerDayInWeek?date=${date}`;
    return this.GetAll(url);
  }

  getCaseStatuses(date) {
    var url = API_URL + API_ENDPOINTS.Analytics + `/GetCaseStatuses?date=${date}`;
    return this.GetAll(url);
  }

  getCaseApplied(date) {
    var url = API_URL + API_ENDPOINTS.Analytics + `/GetCaseAppliedData?date=${date}`;
    return this.GetAll(url);
  }

  getRevenuePerMonthData(date) {
    var url = API_URL + API_ENDPOINTS.Analytics + `/GetRevenuePerMonthData?date=${date}`;
    return this.GetAll(url);
  }

  getRecievablePayablesData(date) {
    var url = API_URL + API_ENDPOINTS.Analytics + `/GetRecievablePayablesData?date=${date}`;
    return this.GetAll(url);
  }
}