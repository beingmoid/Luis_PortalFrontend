import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseTaskDTO } from 'src/app/models/caseTaskDTO';
import { CaseTransactionDTO } from 'src/app/models/caseTransactionDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class TransactionService extends GenericApiService {

  caseTransactionsObserver$: Observable<CaseTransactionDTO[]>;
  private caseTransactionsSubject$: BehaviorSubject<CaseTransactionDTO[]> = new BehaviorSubject<CaseTransactionDTO[]>(undefined);


  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.caseTransactionsObserver$ = this.caseTransactionsSubject$.asObservable();
  }

  getCaseTransactionsByCase(id: number) {
    return this.GetAll(API_URL + API_ENDPOINTS.Transaction + `/GetTransactionsByCase/${id}`).subscribe(res => {
      this.caseTransactionsSubject$.next(res.dynamicResult);
    });
  }

  getCaseTransactions() {
    return this.GetAll(API_URL + API_ENDPOINTS.Transaction).subscribe(res => {
      this.caseTransactionsSubject$.next(res.dynamicResult);
    });
  }

  saveCaseTransaction(data: CaseTransactionDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.Transaction);
  }

  deleteCaseTransaction(data: CaseTransactionDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Transaction);
  }

  getCaseTransactionById(id: number): Observable<BaseResponse> {
    return this.Get(id, API_URL + API_ENDPOINTS.Transaction);
  }

  updateCaseTransaction(data: CaseTransactionDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.Transaction);
  }
}  
