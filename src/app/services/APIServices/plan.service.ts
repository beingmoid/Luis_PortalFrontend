import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { PlanDTO } from 'src/app/models/planDTO';
import { UpgradePlanDTO } from 'src/app/models/upgradePlanDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class PlanService extends GenericApiService {

  plansObserver$: Observable<PlanDTO[]>;
  private planSubject$: BehaviorSubject<PlanDTO[]> = new BehaviorSubject<PlanDTO[]>(undefined);

  public get plans() { return this.planSubject$.value }

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.plansObserver$ = this.planSubject$.asObservable();
  }

  getPlans() {
    return this.GetAll(API_URL + API_ENDPOINTS.Subscription).subscribe(res => {
      this.planSubject$.next(res.dynamicResult);
    });
  }

  upgradePlan(data: UpgradePlanDTO) {
    return this.Post(data, API_URL + API_ENDPOINTS.Auth + "/UpgradePlan")
  }

  cancelSubscriptionPlan(data: PlanDTO) {
    return this.Get(data.id, API_URL + API_ENDPOINTS.Auth + "/CancelSubscription")
  }

  updateBillingDetails(newSource: string) {
    return this.GetAll(API_URL + API_ENDPOINTS.Auth + `/UpdateBillingDetails?newSource=${newSource}`)
  }

  updateSubscription(id: number, quantity: number) {
    return this.GetAll(API_URL + API_ENDPOINTS.Auth + `/UpdateSubscription?id=${id}&quantity=${quantity}`)
  }
}  
