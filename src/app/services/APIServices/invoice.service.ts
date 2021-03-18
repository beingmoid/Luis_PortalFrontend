import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseNoteDTO } from 'src/app/models/caseNoteDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService extends GenericApiService {

  invoicesObserver$: Observable<CaseNoteDTO[]>;
  private invoicesSubject$: BehaviorSubject<CaseNoteDTO[]> = new BehaviorSubject<CaseNoteDTO[]>(undefined);


  get invoices() { return this.invoicesSubject$.value; }

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.invoicesObserver$ = this.invoicesSubject$.asObservable();
  }

  getCaseInvoices() {
    return this.GetAll(API_URL + API_ENDPOINTS.Invoice).subscribe(res => {
      this.invoicesSubject$.next(res.dynamicResult);
    });
  }

  getCaseInvoicesByCase(id: number) {
    return this.GetAll(API_URL + API_ENDPOINTS.Invoice + `/GetInvoicesByCase/${id}`).subscribe(res => {
      this.invoicesSubject$.next(res.dynamicResult);
    });
  }

  saveCaseInvoice(data: CaseNoteDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.Invoice);
  }

  deleteCaseInvoice(data: CaseNoteDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Invoice);
  }

  getCaseInvoiceById(id: number): Observable<BaseResponse> {
    return this.Get(id, API_URL + API_ENDPOINTS.Invoice);
  }

  updateCaseInvoice(data: CaseNoteDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.Invoice);
  }
}