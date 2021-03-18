import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject, Subscription } from 'rxjs';
import { CaseTaskDTO } from 'src/app/models/caseTaskDTO';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AppDateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { TaskService } from 'src/app/services/APIServices/task.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss'],
  providers: [AppDateFormatPipe]
})
export class AddTasksComponent implements OnInit, OnDestroy {

  taskForm: FormGroup
  isEditMode: boolean = false
  assignedToList: ContactDTO[] = [];
  assignedByList: ContactDTO[] = [];
  statuses: LookUpDTO[] = [];
  priorities: LookUpDTO[] = [];
  caseId: number = 0;
  modalRef: NzModalRef;
  @Input() caseTaskSubject?: Subject<CaseTaskDTO>;
  @Output() doneSubmission?= new EventEmitter<boolean>(false);

  contactSubject: Subscription;
  caseStatusSubject: Subscription;
  prioritySubject: Subscription;
  time: string;
  loading: boolean = false
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private _notifitions: AlertService,
    private _contactService: ContactsService,
    private _lookupService: LookupService,
    private _taskService: TaskService,
    private _sharedService: SharedService,
    private _appDateFormatPipe: AppDateFormatPipe
  ) {

    this.taskForm = fb.group({
      id: [0],
      taskName: [null, Validators.required],
      assignedToId: [null, Validators.required],
      assignedById: [null, Validators.required],
      dueDate: [null, Validators.required],
      // time: ["12:00 AM", [Validators.required, Validators.pattern('([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])')]], // pattern invalid 
      time: ["12:00 AM", Validators.required],
      priorityId: [null, Validators.required],
      statusId: [null, Validators.required],
      notes: [null, Validators.required],
      sendUpdate: [false],
    }, { updateOn: 'submit' });
    this._sharedService.restForm.subscribe(x => {
      this.taskForm.reset();
      this.taskForm.clearValidators();
      this.taskForm.patchValue({ time: '12:00 AM' });
    });
  }

  ngOnInit(): void {
    this.caseId = history.state.caseId;

    this.contactSubject = this._contactService.contactObserver$.subscribe(res => {
      if (res) {
        this.assignedToList = res;
        this.assignedByList = res;
      }
    });

    this.caseStatusSubject = this._lookupService.caseStatusObserver$.subscribe(res => {
      if (res)
        this.statuses = res;
    });

    this.prioritySubject = this._lookupService.priorityObserver$.subscribe(res => {
      if (res)
        this.priorities = res;
    });

    if (this.caseTaskSubject) {

      this.caseTaskSubject.subscribe(res => {
        if (res) {
          this.isEditMode = true;
          this.time = res.time;
          res.dueDate = this._appDateFormatPipe.transformForPatching(res.dueDate);
          this.taskForm.patchValue(res);
        }
        else {
          this.isEditMode = false;
          this.taskForm.reset();
          this.taskForm.patchValue({ time: '12:00 AM' });

        }
      });
    }


    if (!this._contactService.contacts)
      this._contactService.getContacts();

    if (!this._lookupService.statuses)
      this._lookupService.getStatuses();

    if (!this._lookupService.priorities)
      this._lookupService.getPriorities();
  }

  ngOnDestroy() {
    if (this.contactSubject) this.contactSubject.unsubscribe();
    if (this.caseStatusSubject) this.caseStatusSubject.unsubscribe();
    if (this.prioritySubject) this.prioritySubject.unsubscribe();
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.taskForm.invalid) {
      return
    }
    this.loading = true

    let data = this.taskForm.value as CaseTaskDTO;
    if (data.sendUpdate == null)
      data.sendUpdate = false;
    data.caseId = this.caseId;
    if (this.isEditMode) {
      this._taskService.updateCaseTask(data).subscribe(res => {
        this.loading = false
        if (res.isSuccessfull) {
          formDirective.resetForm();
          if (this.caseId > 0) {
            this._taskService.getCaseTasksByCase(this.caseId);
          }
          this._notifitions.success("Task Updated successfully");
          this.taskForm.reset();
          this.taskForm.clearValidators();
          this._taskService.isViewed.next();
          this._sharedService.formSubmited.next();
        }
        else {
          this._notifitions.error("Error Updating Task");
        }
      });
    }
    else {
      this.loading = false
      data.id = 0;
      this._taskService.saveCaseTask(data).subscribe(res => {
        if (res.isSuccessfull) {
          formDirective.resetForm();
          /// this._taskService.getCaseTasksByCase(this.caseId);
          this._notifitions.success("Task saved successfully");
          this.taskForm.reset();
          this.taskForm.clearValidators();
          this._taskService.isViewed.next();
          this._sharedService.formSubmited.next();
        }
        else {
          this._notifitions.error("Error Saving Task");
        }
      });
    }
  }
  get f() { return this.taskForm.controls }

}
