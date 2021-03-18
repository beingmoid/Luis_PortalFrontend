import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { HomeDTO } from 'src/app/models/homeDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends GenericApiService {


  homeDataObserver$: Observable<HomeDTO>;
  private homeDataSubject$: BehaviorSubject<HomeDTO> = new BehaviorSubject<HomeDTO>(undefined);


  public get homeData() { return this.homeDataSubject$.value; }

  constructor(private httpClient: HttpClient) {
    super(httpClient);

    this.homeDataObserver$ = this.homeDataSubject$.asObservable();
  }

  getHomeData() {
    this.GetAll(API_URL + API_ENDPOINTS.HomeData).subscribe(res => {
      this.homeDataSubject$.next(res.dynamicResult);
    });
  }
}
