import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { GenericApiService } from './genericApi.service';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class LookupService extends GenericApiService {

  paymentMethodObserver$: Observable<LookUpDTO[]>;
  private paymentMethodSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  priorityObserver$: Observable<LookUpDTO[]>;
  private prioritySubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  martialStatusObserver$: Observable<LookUpDTO[]>;
  private martialStatusSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  languagesObserver$: Observable<LookUpDTO[]>;
  private languagesSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  categoriesObserver$: Observable<LookUpDTO[]>;
  private categoriesSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  countryObserver$: Observable<LookUpDTO[]>;
  private countrySubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  timeZoneObserver$: Observable<string[]>;
  private timeZoneSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

  stateObserver$: Observable<LookUpDTO[]>;
  private stateSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  cityObserver$: Observable<LookUpDTO[]>;
  private citySubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  courseObserver$: Observable<LookUpDTO[]>;
  private courseSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  relationshipObserver$: Observable<LookUpDTO[]>;
  private relationshipSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  ieltsExamObserver$: Observable<LookUpDTO[]>;
  private ieltsExamSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  caseStatusObserver$: Observable<LookUpDTO[]>;
  private caseStatusSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  documentTypesObserver$: Observable<LookUpDTO[]>;
  private documentTypesSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  jobTitleObserver$: Observable<LookUpDTO[]>;
  private jobTitleSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  compensationTypeObserver$: Observable<LookUpDTO[]>;
  private compensationTypeSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  currencyTypeObserver$: Observable<LookUpDTO[]>;
  private currencyTypeSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  compensationAmountObserver$: Observable<LookUpDTO[]>;
  private compensationAmountSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  bankAccountTypeObserver$: Observable<LookUpDTO[]>;
  private bankAccountTypeSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  taxJurisdictionObserver$: Observable<LookUpDTO[]>;
  private taxJurisdictionSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  businessStructureObserver$: Observable<LookUpDTO[]>;
  private businessStructureSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  membershipTypeObserver$: Observable<LookUpDTO[]>;
  private membershipTypeSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  invoiceStatusObserver$: Observable<LookUpDTO[]>;
  private invoiceStatusSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);


  public get priorities() { return this.prioritySubject$.value; }
  public get statuses() { return this.caseStatusSubject$.value; }
  public get paymentMethods() { return this.paymentMethodSubject$.value; }
  public get documentTypes() { return this.documentTypesSubject$.value; }
  public get courses() { return this.courseSubject$.value; }
  public get maritalStatuses() { return this.martialStatusSubject$.value; }
  public get relationships() { return this.relationshipSubject$.value; }
  public get languages() { return this.languagesSubject$.value; }
  public get ieltsExams() { return this.ieltsExamSubject$.value; }
  public get jobTitles() { return this.jobTitleSubject$.value; }
  public get compensationTypes() { return this.compensationTypeSubject$.value; }
  public get currencyTypes() { return this.currencyTypeSubject$.value; }
  public get compensationAmounts() { return this.compensationAmountSubject$.value; }
  public get bankAccountTypes() { return this.bankAccountTypeSubject$.value; }
  public get taxJurisdictions() { return this.taxJurisdictionSubject$.value; }
  public get businessStructure() { return this.businessStructureSubject$.value; }
  public get membershipType() { return this.membershipTypeSubject$.value; }
  public get invoiceStatus() { return this.invoiceStatusSubject$.value; }

  constructor(private http: HttpClient) {
    super(http)
    this.martialStatusObserver$ = this.martialStatusSubject$.asObservable();
    this.languagesObserver$ = this.languagesSubject$.asObservable();
    this.categoriesObserver$ = this.categoriesSubject$.asObservable();
    this.countryObserver$ = this.countrySubject$.asObservable();
    this.stateObserver$ = this.stateSubject$.asObservable();
    this.cityObserver$ = this.citySubject$.asObservable();
    this.courseObserver$ = this.courseSubject$.asObservable();
    this.relationshipObserver$ = this.relationshipSubject$.asObservable();
    this.ieltsExamObserver$ = this.ieltsExamSubject$.asObservable();
    this.caseStatusObserver$ = this.caseStatusSubject$.asObservable();
    this.priorityObserver$ = this.prioritySubject$.asObservable();
    this.paymentMethodObserver$ = this.paymentMethodSubject$.asObservable();
    this.documentTypesObserver$ = this.documentTypesSubject$.asObservable();
    this.jobTitleObserver$ = this.jobTitleSubject$.asObservable()
    this.compensationTypeObserver$ = this.compensationTypeSubject$.asObservable()
    this.currencyTypeObserver$ = this.currencyTypeSubject$.asObservable()
    this.compensationAmountObserver$ = this.compensationAmountSubject$.asObservable()
    this.timeZoneObserver$ = this.timeZoneSubject$.asObservable();
    this.bankAccountTypeObserver$ = this.bankAccountTypeSubject$.asObservable()
    this.taxJurisdictionObserver$ = this.taxJurisdictionSubject$.asObservable()
    this.membershipTypeObserver$ = this.membershipTypeSubject$.asObservable()
    this.businessStructureObserver$ = this.businessStructureSubject$.asObservable()
    this.invoiceStatusObserver$ = this.invoiceStatusSubject$.asObservable()
  }

  public get Countries(): LookUpDTO[] {
    return this.countrySubject$.value;
  }

  getTimeZone() {
    var tzNames = [];
    var zonesList = moment.tz.names();
    zonesList.forEach(element => {
      var zone = moment().tz(element).format('Z');
      tzNames.push(element + " (GMT" + zone + ")");
    });
    this.timeZoneSubject$.next(tzNames);
  }

  getCountries() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetCountries").subscribe(res => {
      this.countrySubject$.next(res.dynamicResult);
    });
  }

  getStates(id: number) {
    if (id)
      return this.Get(id, API_URL + API_ENDPOINTS.LookUp + "/GetStates");
    // .subscribe(res => {
    //   this.stateSubject$.next(res.dynamicResult);
    // });
  }

  getCities(id: number) {
    if (id)
      return this.Get(id, API_URL + API_ENDPOINTS.LookUp + "/GetCities");
    // .subscribe(res => {
    //   this.citySubject$.next(res.dynamicResult);
    // });
  }

  getMaritalStatuses() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetMaritalStatuses").subscribe(res => {
      this.martialStatusSubject$.next(res.dynamicResult);
    });
  }

  getInvoiceStatus() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetInvoiceStatuses").subscribe(res => {
      this.invoiceStatusSubject$.next(res.dynamicResult);
    });
  }

  getLanguages() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetLanguages").subscribe(res => {
      this.languagesSubject$.next(res.dynamicResult);
    });
  }

  getCategories() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetCategories").subscribe(res => {
      this.categoriesSubject$.next(res.dynamicResult);
    });
  }

  getCourses() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetCourses").subscribe(res => {
      this.courseSubject$.next(res.dynamicResult);
    });
  }

  getRelationShips() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetRelationships").subscribe(res => {
      this.relationshipSubject$.next(res.dynamicResult);
    });
  }

  getIeltsExams() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetIELTSExams").subscribe(res => {
      this.ieltsExamSubject$.next(res.dynamicResult);
    });
  }

  getStatuses() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetStatuses").subscribe(res => {
      this.caseStatusSubject$.next(res.dynamicResult);
    });
  }

  getPriorities() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetPriorities").subscribe(res => {
      this.prioritySubject$.next(res.dynamicResult);
    });
  }

  getPaymentMethods() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetPaymentMethods").subscribe(res => {
      this.paymentMethodSubject$.next(res.dynamicResult);
    });
  }

  getDocumentTypes() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetDocumentTypes").subscribe(res => {
      this.documentTypesSubject$.next(res.dynamicResult);
    });
  }

  getJobTitle() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetJobTitle").subscribe(res => {
      this.jobTitleSubject$.next(res.dynamicResult)
    })
  }

  getCompensationType() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetCompensationType").subscribe(res => {
      this.compensationTypeSubject$.next(res.dynamicResult)
    })
  }

  getCurrencyType() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetCurrencyType").subscribe(res => {
      this.currencyTypeSubject$.next(res.dynamicResult)
    })
  }

  getCompensationAmount() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetCompensationAmount").subscribe(res => {
      this.compensationAmountSubject$.next(res.dynamicResult)
    })
  }

  getBankAccountTypes() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetBankAccountTypes").subscribe(res => {
      this.bankAccountTypeSubject$.next(res.dynamicResult)
    })
  }

  getTaxJurisdictions() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetTaxJurisdictions").subscribe(res => {
      this.taxJurisdictionSubject$.next(res.dynamicResult)
    })
  }

  getMembershipTypes() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetMembershipTypes").subscribe(res => {
      this.membershipTypeSubject$.next(res.dynamicResult)
    })
  }

  getBusinessStructures() {
    this.GetAll(API_URL + API_ENDPOINTS.LookUp + "/GetBusinessStructures").subscribe(res => {
      this.businessStructureSubject$.next(res.dynamicResult)
    })
  }
}