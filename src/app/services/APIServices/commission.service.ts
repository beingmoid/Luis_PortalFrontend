import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseDTO } from 'src/app/models/caseDTO';
import { CaseUserDTO } from 'src/app/models/caseUserDTO';
import { commissionDTO } from 'src/app/models/commissionDTO';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class CommissionService extends GenericApiService {

  resetCaseForm: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  updateCaseChildsSubject$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(undefined);

  caseObserver$: Observable<CaseDTO>;
  private caseSubject$: BehaviorSubject<CaseDTO> = new BehaviorSubject<CaseDTO>(undefined);

  caseListObserver$: Observable<CaseDTO[]>;
  private caseListSubject$: BehaviorSubject<CaseDTO[]> = new BehaviorSubject<CaseDTO[]>(undefined);

  caseTypeObserver$: Observable<LookUpDTO[]>;
  private caseTypeSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  // caseStatusObserver$: Observable<LookUpDTO[]>;

  // caseUserDetailObserver$: Observable<CaseUserDTO>;
  commissionObserver$: Observable<commissionDTO[]>;
  private commissionSubject$: BehaviorSubject<commissionDTO[]> = new BehaviorSubject<commissionDTO[]>(undefined);
 

  public get cases() { return this.caseListSubject$.value }
  public get caseTypes() { return this.caseTypeSubject$.value }
  public get Commissions() { return this.commissionSubject$.value }
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.caseObserver$ = this.caseSubject$.asObservable();
    this.caseTypeObserver$ = this.caseTypeSubject$.asObservable();
    this.caseListObserver$ = this.caseListSubject$.asObservable();
    this.commissionObserver$ = this.commissionSubject$.asObservable();
  }

  getCases() {
    this.GetAll(API_URL + API_ENDPOINTS.Case).subscribe(res => {
      this.caseListSubject$.next(res.dynamicResult);
    });
  }

  getCaseTypes() {
    this.GetAll(API_URL + API_ENDPOINTS.Case + "/GetCaseTypes").subscribe(res => {
      this.caseTypeSubject$.next(res.dynamicResult);
    });
  }
 
  getCommissions() { 
    this.GetAll(API_URL + API_ENDPOINTS.Commission).subscribe(res => {
      this.commissionSubject$.next(res.dynamicResult);
    });
  }

  saveCommission(data: commissionDTO): Observable<BaseResponse> {
    // console.log("Post Called ");
    return this.Post(data, API_URL + API_ENDPOINTS.Commission);
  }

  editCommission(data: commissionDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.Commission);
  }
  deleteCommission(data: commissionDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Commission);
  }

}  