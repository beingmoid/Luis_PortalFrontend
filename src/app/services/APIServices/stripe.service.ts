import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService extends GenericApiService {

  constructor(private http: HttpClient) {
    super(http);
  }

  getStripePublishKey(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(API_URL + API_ENDPOINTS.StripePublishKey);
  }
}
