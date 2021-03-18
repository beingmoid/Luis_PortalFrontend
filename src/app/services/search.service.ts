import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS, API_URL } from '../models/Global';
import { GenericApiService } from './APIServices/genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService extends GenericApiService {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getSearchResult(searchText: string) {
    return this.GetAll(API_URL + API_ENDPOINTS.GlobalSearch + `?searchText=${searchText}`);
  }
}
