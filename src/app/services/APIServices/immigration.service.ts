import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { caseImmigrationDepartmentStatusDTO } from 'src/app/models/caseImmigrationDepartmentStatusDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { ImmigrationDTO } from 'src/app/models/immigrationDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class ImmigrationService extends GenericApiService {

  immigrationDepartmentStatusListObserver$: Observable<caseImmigrationDepartmentStatusDTO[]>;
  private immigrationDepartmentStatusListSubject$: BehaviorSubject<caseImmigrationDepartmentStatusDTO[]> = new BehaviorSubject<caseImmigrationDepartmentStatusDTO[]>(undefined);

  immigrationDepartmentStatusObserver$: Observable<caseImmigrationDepartmentStatusDTO>;
  private immigrationDepartmentStatusSubject$: BehaviorSubject<caseImmigrationDepartmentStatusDTO> = new BehaviorSubject<caseImmigrationDepartmentStatusDTO>(undefined);

  public get immigrationDepartmentStatusList() { return this.immigrationDepartmentStatusListSubject$.value; }
  public get immigrationDepartmentStatus() { return this.immigrationDepartmentStatusSubject$.value; }

  immigrationObserver$: Observable<ImmigrationDTO[]>;
  private immigrationSubject$: BehaviorSubject<ImmigrationDTO[]> = new BehaviorSubject<ImmigrationDTO[]>(undefined);

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.immigrationDepartmentStatusObserver$ = this.immigrationDepartmentStatusSubject$.asObservable();
    this.immigrationDepartmentStatusListObserver$ = this.immigrationDepartmentStatusListSubject$.asObservable();
    this.immigrationObserver$ = this.immigrationSubject$.asObservable();
  }

  getImmigrationDepartmentStatus() {
    this.GetAll(API_URL + API_ENDPOINTS.ImmigrationDepartmentStatus).subscribe(res => {
      this.immigrationDepartmentStatusListSubject$.next(res.dynamicResult);
    });
  }

  getImmigrationDepartmentStatusByCase(id: number) {
    this.GetAll(API_URL + API_ENDPOINTS.ImmigrationDepartmentStatus + `/GetImmigrationDepartmentStatusByCase/${id}`).subscribe(res => {
      this.immigrationDepartmentStatusSubject$.next(res.dynamicResult);
    });
  }

  editImmigrationDepartmentStatus(data: caseImmigrationDepartmentStatusDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.ImmigrationDepartmentStatus);
  }

  getImmigrations() {
    return this.GetAll(API_URL + API_ENDPOINTS.Immigration + "/GetImmigrations").subscribe(res => {
      this.immigrationSubject$.next(res.dynamicResult);
    });
  }
}  