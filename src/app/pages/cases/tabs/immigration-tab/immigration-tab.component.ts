import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { caseImmigrationDepartmentStatusDTO } from 'src/app/models/caseImmigrationDepartmentStatusDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ImmigrationService } from 'src/app/services/APIServices/immigration.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-immigration-tab',
  templateUrl: './immigration-tab.component.html',
  styleUrls: ['./immigration-tab.component.scss']
})
export class ImmigrationTabComponent implements OnInit, OnDestroy {

  isVisible: boolean = false
  data: caseImmigrationDepartmentStatusDTO;
  statuses: LookUpDTO[] = [];
  statusForm: FormGroup
  caseId: number = 0;

  immigrationDepartmentStatusSubject: Subscription;
  statusesSubject: Subscription;

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _immigrationService: ImmigrationService,
    private _lookupService: LookupService,
    private _caseService: CaseService
  ) {
    this.statusForm = fb.group({
      id: [0],
      statusId: [null, Validators.required],
      notes: [null, Validators.required],
      sendUpdateToCustomer: [false],
    }, {updateOn: 'submit'})
  }

  ngOnInit(): void {
    this.caseId = history.state.caseId;

    this.statusesSubject = this._lookupService.caseStatusObserver$.subscribe(res => {
      if (res)
        this.statuses = res;
    });

    this.immigrationDepartmentStatusSubject = this._immigrationService.immigrationDepartmentStatusObserver$.subscribe(res => {
      if (res)
        this.data = res;
    });

    if (this.caseId && this.caseId !== 0)
      this._immigrationService.getImmigrationDepartmentStatusByCase(this.caseId);

    if (!this._lookupService.statuses)
      this._lookupService.getStatuses();
  }

  ngOnDestroy() {
    if (this.statusesSubject) this.statusesSubject.unsubscribe();
    if (this.immigrationDepartmentStatusSubject) this.immigrationDepartmentStatusSubject.unsubscribe();
  }

  showModal() {
    this.statusForm.patchValue(this._immigrationService.immigrationDepartmentStatus);
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  onSubmit() {
    if (this.statusForm.valid) {
      this._immigrationService.editImmigrationDepartmentStatus(this.statusForm.value).subscribe(res => {
        if (res.isSuccessfull) {
          this._notification.success("Immigration department status updated successfully");
          this._immigrationService.getImmigrationDepartmentStatusByCase(this.caseId);
          this._caseService.getCaseUserDetails(this.caseId);
          this.handleCancel();
        }
        else {
          this._notification.error("Error updating immigration department status");
        }
      });
    }
  }
}
