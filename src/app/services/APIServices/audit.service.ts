import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { GenericApiService } from './genericApi.service';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class AuditService extends GenericApiService {

  caseHistoryObserver$: Observable<any>;
  private caseHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  eventHistoryObserver$: Observable<any>;
  private eventHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  contactHistoryObserver$: Observable<any>;
  private contactHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  accountHistoryObserver$: Observable<any>;
  private accountHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  
  documentHistoryObserver$: Observable<any>;
  private documentHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  commissionHistoryObserver$: Observable<any>;
  private commissionHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  taskHistoryObserver$: Observable<any>;
  private taskHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  loginHistoryObserver$: Observable<any>;
  private loginHistorySubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {
    super(http)
    this.caseHistoryObserver$ = this.caseHistorySubject$.asObservable();
    this.eventHistoryObserver$ = this.eventHistorySubject$.asObservable();
    this.contactHistoryObserver$ = this.contactHistorySubject$.asObservable();
    this.accountHistoryObserver$ = this.accountHistorySubject$.asObservable();
    this.documentHistoryObserver$ = this.documentHistorySubject$.asObservable();
    this.commissionHistoryObserver$ = this.commissionHistorySubject$.asObservable();
    this.taskHistoryObserver$ = this.taskHistorySubject$.asObservable();
    this.loginHistoryObserver$ = this.loginHistorySubject$.asObservable();
  }

  getCaseHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetCaseHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.caseHistorySubject$.next(res.dynamicResult);
      }
    } );
  }

  getEventHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetEventHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.eventHistorySubject$.next(res.dynamicResult);
      }
    } );
  }

  getContactHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetContactHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.contactHistorySubject$.next(res.dynamicResult);
      }
    } );
  }

  getBankAccountHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetBankAccountHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.accountHistorySubject$.next(res.dynamicResult);
      }
    });
  }

  getDocumentHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetDocumentHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.documentHistorySubject$.next(res.dynamicResult);
      }
    });
  }

  getCommissionHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetCommissionHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.commissionHistorySubject$.next(res.dynamicResult);
      }
    });
    return this.GetAll(API_URL + API_ENDPOINTS.Audit + "/GetCommissionHistory");
  }

  getTaskHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetTaskHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.taskHistorySubject$.next(res.dynamicResult);
      }
    });
  }

  getLoginHistory(queryParams = null) {
    var url = API_URL + API_ENDPOINTS.Audit + "/GetLoginHistory";
    if (queryParams) {
			url += '?queryParams=' + encodeURIComponent(JSON.stringify(queryParams));
		}
    return this.GetAll(url).subscribe(res => {
      if(res.isSuccessfull){
        this.loginHistorySubject$.next(res.dynamicResult);
      }
    });
  }

}