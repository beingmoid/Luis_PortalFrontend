import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { PaymentHistoryDTO } from 'src/app/models/paymentHistoryDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class PaymentHistoryService extends GenericApiService {

  paymentHistoryObserver$: Observable<PaymentHistoryDTO[]>;
  private paymentHistorySubject$: BehaviorSubject<PaymentHistoryDTO[]> = new BehaviorSubject<PaymentHistoryDTO[]>(undefined);

  public get paymentHistories() { return this.paymentHistorySubject$.value }

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.paymentHistoryObserver$ = this.paymentHistorySubject$.asObservable();
  }

  getPaymentHistories() {
    return this.GetAll(API_URL + API_ENDPOINTS.PaymentHistory + `/GetPaymentHistories`).subscribe(res => {
      this.paymentHistorySubject$.next(res.dynamicResult);
    });
  }
}