import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseNoteDTO } from 'src/app/models/caseNoteDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class NoteService extends GenericApiService {

  caseNotesObserver$: Observable<CaseNoteDTO[]>;
  private caseNotesSubject$: BehaviorSubject<CaseNoteDTO[]> = new BehaviorSubject<CaseNoteDTO[]>(undefined);

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.caseNotesObserver$ = this.caseNotesSubject$.asObservable();
  }

  getCaseNotesByCase(id: number) {
    return this.GetAll(API_URL + API_ENDPOINTS.Note + `/GetNotesByCase/${id}`).subscribe(res => {
      this.caseNotesSubject$.next(res.dynamicResult);
    });
  }

  saveCaseNote(data: CaseNoteDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.Note);
  }

  deleteCaseNote(data: CaseNoteDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Note);
  }

  getCaseNoteById(id: number): Observable<BaseResponse> {
    return this.Get(id, API_URL + API_ENDPOINTS.Note);
  }

  updateCaseNote(data: CaseNoteDTO): Observable<BaseResponse> {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.Note);
  }
}