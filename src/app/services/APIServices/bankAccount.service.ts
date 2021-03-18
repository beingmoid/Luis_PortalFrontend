import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BankAccountDTO } from 'src/app/models/bankAccountDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { RoleClaimsDTO } from 'src/app/models/roleClaimsDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService extends GenericApiService {

  bankAccountsObserver$: Observable<BankAccountDTO[]>;
  private bankAccountsSubject$: BehaviorSubject<BankAccountDTO[]> = new BehaviorSubject<BankAccountDTO[]>(undefined);

  public get bankAccounts() { return this.bankAccountsSubject$.value; }
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.bankAccountsObserver$ = this.bankAccountsSubject$.asObservable()
  }

  SaveBankAccount(data) {
    return this.Post(data, API_URL + API_ENDPOINTS.BankAccount + "/SaveBankAccount");
  }

  UpdateBankAccount(data: BankAccountDTO) {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.BankAccount + "/UpdateBankAccount");
  }

  GetBankAccounts() {
    this.GetAll(API_URL + API_ENDPOINTS.BankAccount + "/GetBankAccounts").subscribe(res => {
      this.bankAccountsSubject$.next(res.dynamicResult);
    });
  }

  DeleteBankAccount(id): Observable<BaseResponse> {
    return this.Delete(id, API_URL + API_ENDPOINTS.BankAccount + "/DeleteBankAccount");
  }
}  
