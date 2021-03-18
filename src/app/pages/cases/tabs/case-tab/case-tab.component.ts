import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CaseDTO } from 'src/app/models/caseDTO';
import { AppDateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-case-tab',
  templateUrl: './case-tab.component.html',
  styleUrls: ['./case-tab.component.scss'],
  providers: [AppDateFormatPipe]
})
export class CaseTabComponent implements OnInit, OnDestroy {

  caseSubject: Subscription;
  contactSubject: Subscription;

  caseObserverSubject: Subject<CaseDTO> = new Subject();
  isVisible = false
  modalTitle = "Add Assignee"
  selectedAssigneeId: number = 0;
  contactList: any[] = []
  caseId: number = 0;
  selectAssigneeName: String;
  case: CaseDTO;
  editVisible = false
  editModalTitle: string = "";
  constructor(
    private _caseService: CaseService,
    private _contactService: ContactsService,
    private router: Router,
    private alert: AlertService,
    public _permissionService: PermissionService,
    private _sharedService: SharedService,
    private _appDateFormat: AppDateFormatPipe,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.caseId = history.state.caseId
    this.route.queryParams.subscribe(params => {
      this.caseId = +params['caseId'] || 0;
    });
    if (this.caseId) {
      this.caseSubject = this._caseService.caseObserver$.subscribe(res => {
        if (res) {
          this.case = res;
          this.setLocalDates(this.case);
          if (res.caseAssigneeId !== null) {
            this.selectedAssigneeId = res.caseAssigneeId;
            this.selectAssigneeName = res.caseAssigneeName;
          }
        }
      });
      this._caseService.getById(this.caseId);
    }
    this.contactSubject = this._contactService.contactObserver$.subscribe(res => {
      if (res) {
        this.contactList = res;
      }
    })

    this._sharedService.formSubmited.subscribe(res => {
      this.editVisible = false;
      this._caseService.getCases();
      this.caseObserverSubject.next(null);
    })
  }

  onSubmit() {
    this._caseService.addUpdateAssignee({ caseId: this.caseId, assigneeId: this.selectedAssigneeId }).subscribe(res => {
      if (res.isSuccessfull) {
        this.alert.success("Assignee Updated successfully");
        this._caseService.getById(this.caseId);
      }
      else {
        this.alert.error("Error updating Assignee");
      }
      this.isVisible = false;
    });
  }

  private setLocalDates(res: CaseDTO) {
    res.createdDate = this._appDateFormat.transformForPatching(res.createdDate);
    res.caseDeadLineDate = this._appDateFormat.transformForPatching(res.caseDeadLineDate);
    res.caseOpenDate = this._appDateFormat.transformForPatching(res.caseOpenDate);
    res.caseAdditionalInformation.dateOfBirth = this._appDateFormat.transformForPatching(res.caseAdditionalInformation.dateOfBirth);
    res.caseSchoolDetails.targetStartDate = this._appDateFormat.transformForPatching(res.caseSchoolDetails.targetStartDate);
    res.casePassportDetail.issueDate = this._appDateFormat.transformForPatching(res.casePassportDetail.issueDate);
    res.casePassportDetail.expiryDate = this._appDateFormat.transformForPatching(res.casePassportDetail.expiryDate);

    res.casePrimaryParentDetail.fatherDOB = this._appDateFormat.transformForPatching(res.casePrimaryParentDetail.fatherDOB);
    res.casePrimaryParentDetail.motherDOB = this._appDateFormat.transformForPatching(res.casePrimaryParentDetail.motherDOB);

    res.caseSpouseParentDetail.fatherDOB = this._appDateFormat.transformForPatching(res.caseSpouseParentDetail.fatherDOB);
    res.caseSpouseParentDetail.motherDOB = this._appDateFormat.transformForPatching(res.caseSpouseParentDetail.motherDOB);

    res.caseEducationalHistories.forEach(element => {
      element.startDate = this._appDateFormat.transformForPatching(element.startDate);
      element.endDate = this._appDateFormat.transformForPatching(element.endDate);
    });
    res.caseEmploymentHistories.forEach(element => {
      element.startDate = this._appDateFormat.transformForPatching(element.startDate);
      element.endDate = this._appDateFormat.transformForPatching(element.endDate);
    });
    res.caseSiblings.forEach(element => {
      element.dob = this._appDateFormat.transformForPatching(element.dob);
    });
    res.caseTravelHistories.forEach(element => {
      element.from = this._appDateFormat.transformForPatching(element.from);
      element.to = this._appDateFormat.transformForPatching(element.to);
    });
  }


  editCase() {
    this._caseService.resetCaseForm.next(false);
    this.editModalTitle = "Update Case";
    this.caseObserverSubject.next(this.case);
    this.editVisible = true
  }

  deleteCase() {
    let data = new CaseDTO();
    data.id = this.caseId;
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._caseService.deleteCase(data).subscribe(res => {
          if (res.isSuccessfull) {
            //  this._caseService.getCases();
            this.alert.success(' Case deleted Successfully!');
            this.router.navigate(['cases']);
          }
          else
            this.alert.error('Error while deleting Case!')
        });
      } else {
        return
      }
    })
  }

  ngOnDestroy() {
    if (this.caseSubject) this.caseSubject.unsubscribe();
    if (this.contactSubject) this.contactSubject.unsubscribe();
  }

}
