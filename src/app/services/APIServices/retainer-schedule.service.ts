import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseRetainerScheduleDTO } from 'src/app/models/CaseRetainerScheduleDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class RetainerScheduleService extends GenericApiService {

  CaseRetainerScheduleObserver$: Observable<CaseRetainerScheduleDTO[]>;
  private CaseRetainerScheduleSubject$: BehaviorSubject<CaseRetainerScheduleDTO[]> = new BehaviorSubject<CaseRetainerScheduleDTO[]>(undefined);

  get retainers() { return this.CaseRetainerScheduleSubject$.value }

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.CaseRetainerScheduleObserver$ = this.CaseRetainerScheduleSubject$.asObservable();
  }

  getCaseRetainerScheduleByCase(id: number) {
    this.GetAll(API_URL + API_ENDPOINTS.RetainerSchedule + `/GetRetainerSchedulesByCase/${id}`).subscribe(res => {
      this.CaseRetainerScheduleSubject$.next(res.dynamicResult);
    });
  }

  getCaseRetainerSchedule() {
    this.GetAll(API_URL + API_ENDPOINTS.RetainerSchedule).subscribe(res => {
      this.CaseRetainerScheduleSubject$.next(res.dynamicResult);
    });
  }

  saveCaseRetainerSchedule(data: CaseRetainerScheduleDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.RetainerSchedule);
  }

  deleteCaseRetainerSchedule(data: CaseRetainerScheduleDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.RetainerSchedule);
  }

  getCaseRetainerScheduleById(id: number): Observable<BaseResponse> {
    return this.Get(id, API_URL + API_ENDPOINTS.RetainerSchedule);
  }

  updateCaseRetainerSchedule(data: CaseRetainerScheduleDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.RetainerSchedule);
  }
}  