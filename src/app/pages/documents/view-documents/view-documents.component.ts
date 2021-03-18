import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DocumentDTO } from 'src/app/models/documentDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { DocumentService } from 'src/app/services/APIServices/document.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { PermissionService } from 'src/app/services/permission.service';

class FilterObject {
  constructor(private data: DocumentDTO) { }

  index: number = this.data.index;
  documentName: string = this.data.documentName;
  createdDate: Date = this.data.createdDate;
  documentTypeName: string = this.data.documentTypeName;
  useForCase: string = this.data.useForCase;
  caseName: string = this.data.caseName;
}

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.scss']
})
export class ViewDocumentsComponent implements OnInit {

  clientSearch: string
  personalSearch: string
  listData: DocumentDTO[] = []
  clientDocuments: DocumentDTO[] = []
  personalDocuments: DocumentDTO[] = []
  document: DocumentDTO = new DocumentDTO();
  showDocument: boolean = false
  isVisible: boolean = false
  modalTitle: string = "Upload Documents"
  isEditMode: boolean = false
  caseId: number;
  caseNumber: string;
  updateToCustomer: boolean = false
  documentSubject: Subscription;
  documentObserverSubject: Subject<DocumentDTO> = new Subject();

  sortColumnKey: string;
  personalDocumentsCopy: string;
  clientDocumentsCopy: string;
  personalPageSize: number = 10;
  clientPageSize: number = 10;
  constructor(
    private _documentService: DocumentService,
    private _lookupService: LookupService,
    private _caseService: CaseService,
    private alert: AlertService,
    public _permissionService: PermissionService
  ) {
  }

  ngOnInit(): void {

    if (!this._lookupService.documentTypes) {
      this._lookupService.getDocumentTypes();
    }

    if (!this._caseService.cases) {
      this._caseService.getCases();
    }

    if (history.state.caseId)
      this.caseId = history.state.caseId
    if (history.state.caseNumber)
      this.caseNumber = history.state.caseNumber
    this.getDocuments();

    this.documentSubject = this._documentService.documentsObserver$.subscribe(res => {
      if (res) {
        this.personalDocuments = [];
        this.clientDocuments = [];
        res.forEach(element => {
          if (element.documentCategoryTypeName == 'Personal') {
            this.personalDocuments.push(element);
          } else {
            this.clientDocuments.push(element);
          }
        });

        let personalIndex = 0;
        let clientIndex = 0;

        this.personalDocuments.forEach(element => {
          element.index = personalIndex + 1;
          personalIndex++;
        });
        this.clientDocuments.forEach(element => {
          element.index = clientIndex + 1;
          clientIndex++;
        });

        let documentId = history.state.documentId;
        if (documentId)
          this.showSingleDocuments(this.clientDocuments.find(p => p.id == documentId));

        this.personalDocumentsCopy = JSON.stringify(this.personalDocuments);
        this.clientDocumentsCopy = JSON.stringify(this.clientDocuments);

        this.isVisible = false;
      }
    });
  }

  selectedTabName: string = 'general';
  changeTab(tabName) {
    this.selectedTabName = tabName;
  }

  getDocuments() {
    if (this.caseId) {
      this._documentService.GetDocumentsByCase(this.caseId);
    }
    else {
      this._documentService.getDocuments();
    }
  }

  addDocument() {
    this.isVisible = true;
    this.documentObserverSubject.next(null);
    this.showDocument = false;
  }

  editDocument(data: DocumentDTO) {
    this.isVisible = true;
    this.isEditMode = true;
    this.documentObserverSubject.next(data);
    this.showDocument = false;
  }

  deleteDocument(data: DocumentDTO) {
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._documentService.DeleteDocument(data).subscribe(res => {
          if (res.isSuccessfull) {
            this.getDocuments();
            this.alert.success('Document deleted Successfully!')
            this.showDocument = false
          }
          else
            this.alert.error('Error while deleting Document!')
        });
      } else {
        return
      }
    })
  }
  // showModal(): void {
  //   this.isVisible = true;

  // }
  handleCancel() {
    this.isVisible = false
    this.showDocument = false
  }

  // Sorting
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey
    }
  }
  sortNamesFn = (a, b) => a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey])
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey]
  filterPersonal() {
    this.personalDocuments = JSON.parse(this.personalDocumentsCopy);
    if (this.personalSearch !== "") {
      this.personalDocuments = this.personalDocuments.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.personalSearch.toLowerCase())
        )
      });
    }
  }

  filterClient() {
    this.clientDocuments = JSON.parse(this.clientDocumentsCopy);
    if (this.clientSearch !== "") {
      this.clientDocuments = this.clientDocuments.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.clientSearch.toLowerCase())
        )
      });
    }
  }
  showSingleDocuments(data: DocumentDTO) {
    this.document = data;
    this.showDocument = true;
  }
}
