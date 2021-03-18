import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaseRetainerScheduleDTO } from 'src/app/models/CaseRetainerScheduleDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { RetainerScheduleService } from 'src/app/services/APIServices/retainer-schedule.service';
import { PermissionService } from 'src/app/services/permission.service';

class FiltetObject {
  constructor(private data: CaseRetainerScheduleDTO) { }

  index: number = this.data.index;
  caseName: string = this.data.caseName;
  description: string = this.data.description;
  dueOnName: string = this.data.dueOnName;
  specificDate: Date = this.data.specificDate;
  total: number = this.data.total;
}


@Component({
  selector: 'app-retainer-schedule',
  templateUrl: './retainer-schedule.component.html',
  styleUrls: ['./retainer-schedule.component.scss']
})
export class RetainerScheduleComponent implements OnInit, OnDestroy {

  search: string
  listData: CaseRetainerScheduleDTO[] = []
  data: CaseRetainerScheduleDTO = new CaseRetainerScheduleDTO();
  casesList: any[] = [];
  dueOnList: any[] = [];
  retainerForm: FormGroup
  isVisible: boolean = false
  modalTitle: string = "Create New Retainer Schedule"
  isEditMode: boolean = false
  caseId: number = 0;

  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;

  caseSubject: Subscription;
  contactSubject: Subscription;
  showRetainerSchedule: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _retainerScheduleService: RetainerScheduleService,
    private _caseService: CaseService,
    private _contactService: ContactsService,
    public _permissionService: PermissionService
  ) {
    this.retainerForm = fb.group({
      id: [0],
      caseId: [null, Validators.required],
      description: [null, Validators.required],
      dueOnId: [null, Validators.required],
      taxRate: [0, Validators.required],
      specificDate: [null, Validators.required],
      professionalFees: [0, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]],
      taxes: [0, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]],
      admissionFees: [0, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]],
      governmentFees: [0, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]],
      otherFees: [0, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]],
      total: [0, [Validators.required, Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]],
    }, { updateOn: 'submit' })
  }

  get f() { return this.retainerForm.controls }


  ngOnInit(): void {
    this.caseId = history.state.caseId;

    if (this.caseId && this.caseId !== 0) {
      this.f['caseId'].disable()
      this._retainerScheduleService.getCaseRetainerScheduleByCase(this.caseId);
    }
    else {
      this._retainerScheduleService.getCaseRetainerSchedule();
    }

    this.caseSubject = this._caseService.caseListObserver$.subscribe(res => {
      if (res) {
        this.casesList = res;
      }
    })

    this.contactSubject = this._contactService.contactObserver$.subscribe(res => {
      if (res) {
        this.dueOnList = res;
      }
    })

    this._retainerScheduleService.CaseRetainerScheduleObserver$.subscribe(res => {
      if (res) {
        let index = 0;
        this.listData = res;
        this.listData.forEach(element => {
          element.index = index + 1;
          index++;
        });
      }
      this.listDataCopy = JSON.stringify(this.listData);
    })

    if (!this._caseService.cases)
      this._caseService.getCases();

    if (!this._contactService.contacts)
      this._contactService.getContacts();
  }

  ngOnDestroy() {
    if (this.caseSubject) this.caseSubject.unsubscribe();
    if (this.contactSubject) this.contactSubject.unsubscribe();
  }

  handleCancel() {
    this.isVisible = false
  }

  deleteRetainerSchedule(data) {
    this._notification.delete('Are you sure you want to delete!').then(result => {
      if (result.isConfirmed) {
        this._retainerScheduleService.deleteCaseRetainerSchedule(data).subscribe(res => {
          if (res.isSuccessfull) {

            this._notification.success("Retainer Schedule Deleted successfully");
            this.showRetainerSchedule = false;

            if (this.caseId && this.caseId !== 0)
              this._retainerScheduleService.getCaseRetainerScheduleByCase(this.caseId);
            else
              this._retainerScheduleService.getCaseRetainerSchedule();
          }
          else {
            this._notification.success("Error deleting Retainer Schedule");
          }
        });
      } else {
        return
      }
    })
  }

  editRetainerSchedule(data: CaseRetainerScheduleDTO) {
    this.isEditMode = true;
    this.isVisible = true;
    this.showRetainerSchedule = false;
    this.retainerForm.patchValue(data);
  }

  showModal() {
    this.retainerForm.reset();
    if (this.caseId && this.caseId !== 0)
      this.retainerForm.get("caseId").setValue(this.caseId);
    this.isEditMode = false;
    this.isVisible = true;
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.retainerForm.valid) {
      let data = this.retainerForm.value as CaseRetainerScheduleDTO;
      if(!data.caseId && this.caseId)
        data.caseId = this.caseId;
      if (this.isEditMode) {
        this._retainerScheduleService.updateCaseRetainerSchedule(data).subscribe(res => {
          if (res.isSuccessfull) {
            if (this.caseId && this.caseId !== 0)
              this._retainerScheduleService.getCaseRetainerScheduleByCase(this.caseId);
            else
              this._retainerScheduleService.getCaseRetainerSchedule();

            this._notification.success("Retainer Schedule updated successfully");
            formDirective.resetForm();
            this.isVisible = false
          }
          else {
            this._notification.error("Error while saving updating Schedule");
          }
        });
      } else {
        data.id = 0;
        this._retainerScheduleService.saveCaseRetainerSchedule(data).subscribe(res => {
          if (res.isSuccessfull) {
            if (this.caseId && this.caseId !== 0)
              this._retainerScheduleService.getCaseRetainerScheduleByCase(this.caseId);
            else
              this._retainerScheduleService.getCaseRetainerSchedule();

            this._notification.success("Retainer Schedule saved successfully");
            formDirective.resetForm();
            this.isVisible = false
          }
          else {
            this._notification.error("Error while saving Retainer Schedule");
          }
        });
      }
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
    this.listData = JSON.parse(this.listDataCopy);
    if (this.search !== "") {
      this.listData = this.listData.filter(item => {
        let data = new FiltetObject(item);
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


  showSingalRetainerSchedule(data: CaseRetainerScheduleDTO) {
    this.data = data;
    this.showRetainerSchedule = true
  }
}
