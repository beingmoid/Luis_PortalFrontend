import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseDTO } from 'src/app/models/caseDTO';
import { CaseUserDTO } from 'src/app/models/caseUserDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class CaseService extends GenericApiService {

  resetCaseForm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  updateCaseChildsSubject$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(undefined);

  caseObserver$: Observable<CaseDTO>;
  private caseSubject$: BehaviorSubject<CaseDTO> = new BehaviorSubject<CaseDTO>(undefined);

  caseListObserver$: Observable<CaseDTO[]>;
  private caseListSubject$: BehaviorSubject<CaseDTO[]> = new BehaviorSubject<CaseDTO[]>(undefined);

  recentcaseListObserver$: Observable<CaseDTO[]>;
  private recentcaseListSubject$: BehaviorSubject<CaseDTO[]> = new BehaviorSubject<CaseDTO[]>(undefined);
  
  caseTypeObserver$: Observable<LookUpDTO[]>;
  private caseTypeSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  caseStatusObserver$: Observable<LookUpDTO[]>;
  private caseStatusSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  caseUserDetailObserver$: Observable<CaseUserDTO>;
  private caseUserDetailSubject$: BehaviorSubject<CaseUserDTO> = new BehaviorSubject<CaseUserDTO>(undefined);
 
  relatedCaseObserver$: Observable<CaseDTO[]>;
  private relatedCaseSubject$: BehaviorSubject<CaseDTO[]> = new BehaviorSubject<CaseDTO[]>(undefined);

  public get cases() { return this.caseListSubject$.value }
  public get caseTypes() { return this.caseTypeSubject$.value }
  public get caseUserDetail() { return this.caseUserDetailSubject$.value }
  public get recentCases() {return this.recentcaseListSubject$.value}

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.caseObserver$ = this.caseSubject$.asObservable();
    this.caseTypeObserver$ = this.caseTypeSubject$.asObservable();
    this.caseStatusObserver$ = this.caseStatusSubject$.asObservable();
    this.caseListObserver$ = this.caseListSubject$.asObservable();
    this.caseUserDetailObserver$ = this.caseUserDetailSubject$.asObservable();
    this.recentcaseListObserver$ = this.recentcaseListSubject$.asObservable();
    this.relatedCaseObserver$ = this.relatedCaseSubject$.asObservable();
  }

  getCases() {
    this.GetAll(API_URL + API_ENDPOINTS.Case).subscribe(res => {
      this.caseListSubject$.next(res.dynamicResult);
    });
  }
  getrecentCases() {
    this.GetAll(API_URL + API_ENDPOINTS.Case+"/GetRecentlyModified").subscribe(res => { 
      this.recentcaseListSubject$.next(res.dynamicResult);
    });
  }

  getCaseTypes() {
    this.GetAll(API_URL + API_ENDPOINTS.Case + "/GetCaseTypes").subscribe(res => {
      this.caseTypeSubject$.next(res.dynamicResult);
    });
  }

  getCaseStatus() {
    this.GetAll(API_URL + API_ENDPOINTS.Case + "/GetStatuses").subscribe(res => {
      this.caseStatusSubject$.next(res.dynamicResult);
    });
  }

  getById(id: number) {
    this.Get(id, API_URL + API_ENDPOINTS.Case).subscribe(res => {
      this.caseSubject$.next(res.dynamicResult);
    });
  }

  saveCase(data: CaseDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.Case);
  }

  editCase(data: CaseDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.Case);
  }

  deleteCase(data: CaseDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Case);
  }

  getCaseUserDetails(caseId: number) {
    return this.Get(caseId, API_URL + API_ENDPOINTS.Case + "/GetCaseUserDetails").subscribe(res => {
      this.caseUserDetailSubject$.next(res.dynamicResult);
    });
  }

  getRelatedCasesByClient(id: number) {
    return this.Get(id, API_URL + API_ENDPOINTS.Case + "/GetRelatedCasesByClient").subscribe(res => {
      this.relatedCaseSubject$.next(res.dynamicResult);
    });
  }

  addUpdateAssignee(data: any): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.Case + `/AddEditAssignee`);
  }
}  