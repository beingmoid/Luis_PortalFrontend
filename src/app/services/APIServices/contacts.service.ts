import { Injectable } from '@angular/core';
import { GenericApiService } from './genericApi.service';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { HttpClient } from '@angular/common/http';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { ContactExistsDto } from 'src/app/models/ContactExistsDto';

@Injectable({
  providedIn: 'root'
})

export class ContactsService extends GenericApiService {

  contactObserver$: Observable<ContactDTO[]>;
  private contactSubject$: BehaviorSubject<ContactDTO[]> = new BehaviorSubject<ContactDTO[]>(undefined);

  contactTypeObserver$: Observable<LookUpDTO[]>;
  private contactTypeSubject$: BehaviorSubject<LookUpDTO[]> = new BehaviorSubject<LookUpDTO[]>(undefined);

  recentcontactObserver$: Observable<ContactDTO[]>;
  private recentcontactSubject$: BehaviorSubject<ContactDTO[]> = new BehaviorSubject<ContactDTO[]>(undefined);

  public get contacts() { return this.contactSubject$.value; }
  public get recentcontacts() { return this.recentcontactSubject$.value; }
  public get contactTypes() { return this.contactTypeSubject$.value; }



  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.contactObserver$ = this.contactSubject$.asObservable();
    this.contactTypeObserver$ = this.contactTypeSubject$.asObservable();
    this.recentcontactObserver$ = this.recentcontactSubject$.asObservable();
  }

  getContacts() {
    this.GetAll(API_URL + API_ENDPOINTS.Contacts + "/GetContacts").subscribe(res => {
      this.contactSubject$.next(res.dynamicResult);
    });
  }
  getrecentcontacts() {
    this.GetAll(API_URL + API_ENDPOINTS.Contacts + "/GetRecentModifiedContacts").subscribe(res => {
      this.recentcontactSubject$.next(res.dynamicResult);
    });
  }

  getContactTypes() {
    this.GetAll(API_URL + API_ENDPOINTS.Contacts + "/GetContactTypes").subscribe(res => {
      this.contactTypeSubject$.next(res.dynamicResult);
    });
  }

  saveContacts(file: any, data: ContactDTO): Observable<BaseResponse> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FirstName', data.firstName);
    formData.append('LastName', data.lastName);
    formData.append('Name', data.name);
    formData.append('Email', data.email);
    formData.append('CompanyName', data.companyName);
    formData.append('Notes', data.notes);
    formData.append('ContactTypeId', data.contactTypeId.toString());
    formData.append('CityId', data.cityId.toString());
    formData.append('StateId', data.stateId.toString());
    formData.append('CountryId', data.countryId.toString());
    formData.append('LanguageId', data.languageId.toString());
    return this.Post(formData, API_URL + API_ENDPOINTS.Contacts);
  }

  editContact(file: any, data: ContactDTO): Observable<BaseResponse> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('FirstName', data.firstName);
    formData.append('LastName', data.lastName);
    formData.append('Name', data.name);
    formData.append('Email', data.email);
    formData.append('CompanyName', data.companyName);
    formData.append('Notes', data.notes);
    formData.append('ContactTypeId', data.contactTypeId.toString());
    formData.append('CityId', data.cityId.toString());
    formData.append('StateId', data.stateId.toString());
    formData.append('CountryId', data.countryId.toString());
    formData.append('LanguageId', data.languageId.toString());
    formData.append('ImageName', data.imageName);
    return this.Update(data.id, formData, API_URL + API_ENDPOINTS.Contacts);
  }
  deleteContact(data: ContactDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Contacts);
  }

  isContactExist(email): Observable<BaseResponse> {
    return this.Get(email, API_URL + API_ENDPOINTS.Contacts + '/IsContactExist');
    //return this.IsContactExist(API_URL + API_ENDPOINTS.Contacts+"/IsContactExist/");
  }

  createAccount(data: ContactDTO) {
    return this.Post(data, API_URL + API_ENDPOINTS.Users + "/CreateClientAccount");
  }

}  