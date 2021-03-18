import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { CaseDTO } from 'src/app/models/caseDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SharedService } from 'src/app/services/shared.service';

class FilterObject {
  constructor(private data: CaseDTO) { }

  index: number = this.data.index;
  contactClientName: string = this.data.contactClientName;
  caseNumber: string = this.data.caseNumber;
  caseTypeName: string = this.data.caseTypeName;
  createdDate: Date = this.data.createdDate;
  caseDeadLineDate: Date = this.data.caseDeadLineDate;
  caseStatusName: string = this.data.caseStatusName;
}

@Component({
  selector: 'app-view-cases',
  templateUrl: './view-cases.component.html',
  styleUrls: ['./view-cases.component.scss']
})
export class ViewCasesComponent implements OnInit, OnDestroy {

  search: string
  listData: any[] = []
  listOfSelection: any
  checked = false;
  caseSubject: Subscription;
  casesList: CaseDTO[] = [];
  isVisible: boolean = false
  modalTitle = "Add New Case"

  caseObserverSubject: Subject<CaseDTO> = new Subject();
  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;

  constructor(private _caseService: CaseService,
     private alert: AlertService, private router: Router, 
     private _sharedService: SharedService,
      public _permissionService: PermissionService ,
      private _router: Router,) { }

  ngOnInit(): void {
    this.caseSubject = this._caseService.caseListObserver$.subscribe(res => {
      if (res) {
        this.casesList = res;
        let index = 0;
        this.casesList.forEach(element => {
          element.index = index + 1
          index++;
        });
        this.listDataCopy = JSON.stringify(this.casesList);
      }
    });
    

    this._caseService.getCases();

    this._sharedService.formSubmited.subscribe(res => {
      this.isVisible = false;
      this._caseService.getCases();
    })
  }

  ngOnDestroy() {
    if (this.caseSubject) this.caseSubject.unsubscribe();
  }

  addCase() {
    this._caseService.resetCaseForm.next(true);
    this.modalTitle = "Add New Case";
    this.caseObserverSubject.next(null);
    this.isVisible = true
  }

  editCase(data) {
    // this._caseService.resetCaseForm.next(false);
    this.modalTitle = "Update Case";
    this.caseObserverSubject.next(data);
    this.isVisible = true
  }

  handleCancel() {
    this.isVisible = false
    this.caseObserverSubject.next(null);
    this._caseService.resetCaseForm.next(true);
  }
  deleteCase(data) {
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._caseService.deleteCase(data).subscribe(res => {
          if (res.isSuccessfull) {
            this.isVisible = false;
            this._caseService.getCases();
            this.alert.success('Case deleted Successfully!')
          }
          else {

            this.alert.error('Error while deleting Case!')
          }
        });
      } else {
        return
      }
    })
  }

  showSingleCase(data: CaseDTO) {

    let id = data.id;
    let caseNumber = data.caseNumber;
    if (id) {
      this.router.navigate(['cases/case'], { queryParams: { caseId: id } })
    }
  }

  // Sorting
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey
    }
  }
  sortNamesFn = (a, b) => a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey])
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey]
  filter() {
    this.casesList = JSON.parse(this.listDataCopy);
    if (this.search !== "") {
      this.casesList = this.casesList.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
      });
    }
  }
}
