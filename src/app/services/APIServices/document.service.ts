import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DocumentDTO } from 'src/app/models/documentDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class DocumentService extends GenericApiService {

  documentsObserver$: Observable<DocumentDTO[]>;
  private documentsSubject$: BehaviorSubject<DocumentDTO[]> = new BehaviorSubject<DocumentDTO[]>(undefined);

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.documentsObserver$ = this.documentsSubject$.asObservable();
  }

  GetDocumentsByCase(caseId: number) {
    return this.Get(caseId, API_URL + API_ENDPOINTS.Document + "/GetDocumentsByCase").subscribe(res => {
      this.documentsSubject$.next(res.dynamicResult);
    });
  }

  getDocuments() {
    return this.GetAll(API_URL + API_ENDPOINTS.Document).subscribe(res => {
      this.documentsSubject$.next(res.dynamicResult);
    });
  }

  UploadCaseDocument(file: any, document: DocumentDTO): Observable<BaseResponse> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('DocumentName', document.documentName);
    formData.append('DocumentTypeId', document.documentTypeId ? document.documentTypeId.toString() : '1');
    formData.append('UseForCase', document.useForCase ? document.useForCase.toString() : '');
    formData.append('IsFileAdded', document.isFileAdded ? document.isFileAdded.toString() : 'false');
    if(document.id != undefined){
      formData.append('Id', document.id.toString());
    }
    if(document.caseId != undefined){
      formData.append('CaseId', document.caseId.toString());
    }
    return this.Post(formData, API_URL + API_ENDPOINTS.Document + "/UploadCaseDocument");
  }

  DeleteDocument(data: DocumentDTO): Observable<BaseResponse> {
    return this.Delete(data.id, API_URL + API_ENDPOINTS.Document);
  }
}  