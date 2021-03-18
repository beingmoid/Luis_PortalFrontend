import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CaseTaskDTO } from 'src/app/models/caseTaskDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService extends GenericApiService {
  isViewed = new Subject();

  caseTasksObserver$: Observable<CaseTaskDTO[]>;
  private caseTasksSubject$: BehaviorSubject<CaseTaskDTO[]> = new BehaviorSubject<CaseTaskDTO[]>(undefined);


  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.caseTasksObserver$ = this.caseTasksSubject$.asObservable();
  }

  getCaseTasksByCase(id: number) {
    return this.GetAll(API_URL + API_ENDPOINTS.Task + `/GetTasksByCase/${id}`).subscribe(res => {
      this.caseTasksSubject$.next(res.dynamicResult);
    });
  }

  getCaseTasks() {
    return this.GetAll(API_URL + API_ENDPOINTS.Task).subscribe(res => {
      this.caseTasksSubject$.next(res.dynamicResult);
    });
  }

  saveCaseTask(data: CaseTaskDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.Task);
  }

  deleteCaseTask(data: CaseTaskDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Task);
  }

  getCaseTaskById(id: number): Observable<BaseResponse> {
    return this.Get(id, API_URL + API_ENDPOINTS.Task);
  }

  updateCaseTask(data: CaseTaskDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.Task);
  }
}  
