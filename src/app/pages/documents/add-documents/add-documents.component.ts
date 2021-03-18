import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd';
import { Subject, Subscription } from 'rxjs';
import { DocumentDTO } from 'src/app/models/documentDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { DocumentService } from 'src/app/services/APIServices/document.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.scss']
})
export class AddDocumentsComponent implements OnInit {

  documentTypes: LookUpDTO[] = [];
  cases: any[] = [];
  docForm: FormGroup;
  @Input() documentSub: Subject<DocumentDTO>;
  isEditMode: boolean = false;
  isHidden: boolean = false
  @Input() caseId: number;
  @Input() caseNumber: string;
  file: any;
  fileList: any[] = [];
  @ViewChild('formDirective') formGroupDirective: FormGroupDirective
  noFilesError: boolean = false
  selectedCase: any;

  constructor(private fb: FormBuilder,
    private _notification: AlertService,
    private _documentService: DocumentService,
    private _lookupService: LookupService,
    private _caseService: CaseService,
  ) {
    this.generateForm()
  }

  get f() { return this.docForm.controls }

  ngOnInit(): void {
    this._lookupService.documentTypesObserver$.subscribe(res => {
      if (res)
        this.documentTypes = res;
    });

    this._caseService.caseListObserver$.subscribe(res => {
      if (res)
        this.cases = res;
    });

    // this._caseService.caseObserver$.subscribe(res => {
    //   if(res){
    //     this.selectedCase = res;
    //     this.docForm.controls["useForCase"].setValue(this.selectedCase.caseNumber);
    //   }
    // });

    this.documentSub.subscribe(res => {
      if (res) {
        this.caseId = res.caseId;
        this.caseNumber = res.caseName;
        this.docForm.patchValue(res);
        this.isEditMode = true;
        this.noFilesError = false;
        this.fileList = [{
          uid: res.id,
          name: res.documentName,
          status: 'done',
          url: res.documentBlobURI
        }];
      }
      else {
        // this.docForm = null;
        this.generateForm()
        this.noFilesError = false;
        this.isEditMode = false;
        if (this.formGroupDirective)
          this.formGroupDirective.resetForm()
        // this.docForm.clearValidators()
        // this.docForm.updateValueAndValidity()
        this.fileList = [];
        this.file = null;
      }
    });

    if (this.caseId) {
      this.isHidden = true;
    }
  }
  generateForm() {
    // this.docForm = null
    this.docForm = this.fb.group({
      id: [0],
      documentName: [null, Validators.required],
      documentTypeId: [null, Validators.required],
      useForCase: [this.caseNumber],
      caseId: [null],
    }, { updateOn: 'submit' })
  }

  isFileAdded: boolean = false;

  onSubmit(formDirective: FormGroupDirective) {
    if (!this.docForm.valid)
      return;
    var document = new DocumentDTO;
    document = this.docForm.value as DocumentDTO;
    document.useForCase = this.caseNumber;
    document.isFileAdded = this.isFileAdded;
    if (this.fileList.length > 0) {
      this.noFilesError = false;
    } else {
      this.noFilesError = true;
      return;
    }
    if (this.caseId)
      document.caseId = this.caseId;
    this._documentService.UploadCaseDocument(this.file, document).subscribe(res => {
      if (res.isSuccessfull) {
        this.getDocuments();
        formDirective.resetForm();
        this._notification.success('Document Uploaded Successfully!')
      }
      else
        this._notification.error('Error while uploading document!')
    })
  }

  getDocuments() {
    if (this.caseId) {
      this._documentService.GetDocumentsByCase(this.caseId);
    }
    else {
      this._documentService.getDocuments()
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    var extension = file.name.substr(file.name.lastIndexOf('.'));
    if (extension == ".pdf" || extension == ".docx" || extension == ".doc" || extension == ".txt") {
      this.file = file;
      this.fileList = [];
      this.fileList.push(file);
      this.isFileAdded = true;
      return false;
    }
    else {
      this._notification.error('Only pdf, docx, doc and txt files formats are allowed!')
      return false;
    }
  };


}
