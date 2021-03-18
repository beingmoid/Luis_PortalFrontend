import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormFilterDTO } from 'src/app/models/formFilterDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class FormService extends GenericApiService {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  GetFilteredForms(queryParams: FormFilterDTO): Observable<BaseResponse> {
    return this.GetAll(API_URL + API_ENDPOINTS.Form + "/GetForms?queryParams=" + encodeURIComponent(JSON.stringify(queryParams)));
  }

  GetFormsByCategoryId(id: number){
    return this.Get(id, API_URL + API_ENDPOINTS.Form + "/GetFormsByCategoryId");
  }

}  