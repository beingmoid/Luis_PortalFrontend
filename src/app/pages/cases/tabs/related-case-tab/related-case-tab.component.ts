import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
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
  selector: 'app-related-case-tab',
  templateUrl: './related-case-tab.component.html',
  styleUrls: ['./related-case-tab.component.scss']
})
export class RelatedCaseTabComponent implements OnInit {

  relatedCaseList: CaseDTO[] = []
  search: string
  @Input() ClientIdSubject: BehaviorSubject<number>;
  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;
  modalTitle: string = "";
  caseObserverSubject: Subject<CaseDTO> = new Subject();
  isVisible: boolean = false;


  constructor(
    private _caseService: CaseService,
    private alert: AlertService,
    private router: Router,
    public _permissionService: PermissionService,
    private _sharedService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.relatedCaseList = []
    this.ClientIdSubject.subscribe(id => {
      if (id === undefined) {
        return;
      }
      if (id !== 0) {
        this._caseService.getRelatedCasesByClient(id);
        this._caseService.relatedCaseObserver$.subscribe(res => {
        
          if (res) {
            let index = 0;
            this.relatedCaseList = res
            this.relatedCaseList.forEach(element => {
              element.index = index + 1;
              index++;
            });
           
            this.listDataCopy = JSON.stringify(this.relatedCaseList);
          }
        })
        // (res => {
        //     console.log('res:', res)
        //     this.relatedCaseList = res;
        //     let index = 0;
        //     this.relatedCaseList.forEach(element => {
        //       element.index = index + 1;
        //       index++;
        //     });
        //     this.listDataCopy = JSON.stringify(this.relatedCaseList);
        //   });
        // }
      }



      // if(this.relatedCaseList && this.relatedCaseList.length > 0) {
      //   // this.relatedCaseList.forEach(element => {
      //   //   element.index = index + 1;
      //   //   index++;
      //   // });
      //   this.listDataCopy = JSON.stringify(this.relatedCaseList);
      // }
    })

    this._sharedService.formSubmited.subscribe(res => {
      this.isVisible = false;
      // this._caseService.getCases();
    })
  }

  editCase(data) {
    this.modalTitle = "Update Case";
    this.caseObserverSubject.next(data);
    this.isVisible = true



    // this._caseService.resetCaseForm.next(false);
    // this.router.navigate(['cases/edit'], { state: { caseId: data.id } })
  }

  deleteCase(data) {
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._caseService.deleteCase(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._caseService.getCases();
            this.alert.success('Case deleted Successfully!')
          }
          else
            this.alert.error('Error while deleting Related Case!')
        });
      } else {
        return
      }
    })

  }


  handleCancel() {
    this.isVisible = false
    this.caseObserverSubject.next(null);
    this._caseService.resetCaseForm.next(true);
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
    this.relatedCaseList = JSON.parse(this.listDataCopy);
    if (this.search !== "") {
      this.relatedCaseList = this.relatedCaseList.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
      }
      );
    }
  }
}
