import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { EventsDTO } from 'src/app/models/eventsDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { EventsService } from 'src/app/services/APIServices/events.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SharedService } from 'src/app/services/shared.service';
import { HomeService } from 'src/app/services/APIServices/home.service';
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  minDate = new Date();
  form: FormGroup;
  buttonLoading = false;
  time: string;
  cases: any[] = [];
  contacts: any[] = [];
  attandeesList: any[] = [];
  attandeesCopy: string;
  @Input() eventSub: Subject<EventsDTO>;
  @Input() modalCloseSub: Subject<boolean>;
  isEditMode: boolean = false;
  file: any;
  fileList: any[] = [];
  isFileAdded: boolean = false;
  inputtage: string[] = [];
  @ViewChild('formDirective') formDirective: FormGroupDirective;

  constructor(private fb: FormBuilder,
    private _caseService: CaseService,
    private _contactService: ContactsService,
    private _eventsService: EventsService,
    private _notification: AlertService,
    private _homeService: HomeService,
    private _sharedService: SharedService) {
    this.generateForm();
  }
  get f() { return this.form.controls }

  ngOnInit(): void {

    this._sharedService.restForm.subscribe(res => {
      this.form.reset();
    })

    this._caseService.caseListObserver$.subscribe(res => {
      if (res)
        this.cases = res;
    });

    this._contactService.contactObserver$.subscribe(res => {
      if (res) {
        this.contacts = res;
        this.attandeesList = res;
        this.attandeesCopy = JSON.stringify(this.attandeesList);
      }
    });

    if (this.eventSub) {
      this.eventSub.subscribe(res => {
        if (res) {
          this.minDate = new Date();
          if (res.startDate < this.minDate) {
            this.minDate = new Date(res.startDate);
          }
          this.form.patchValue(res);
          this.isEditMode = true;
          this.attandeesList = JSON.parse(this.attandeesCopy);
          this.attandeesCopy = JSON.stringify(this.attandeesList);
          const index = this.attandeesList.findIndex(x => x.id == res.contactId);
          if (index > -1) {
            this.attandeesList.splice(index, 1);
          }
          if (res.fileName) {
            this.fileList = [{
              uid: res.id,
              name: res.fileName,
              status: 'done',
              url: res.eventFileBlobURI
            }];
          }
        }
        else {
          this.minDate = new Date();
          this.isEditMode = false;
          this.form.reset({ id: 0, allDay: false, emailAttandees: false, reminders: false, time: '12:00 AM', tags: [], attandees: [] });
          this.fileList = [];
          this.file = null;
        }
      });
    }

    if (this.modalCloseSub) {
      this.modalCloseSub.subscribe(res => {
        if (res) {
          this.attandeesList = JSON.parse(this.attandeesCopy);
          this.formDirective.resetForm();
        }
      })
    }
    if (!this._caseService.cases)
      this._caseService.getCases();

    if (!this._contactService.contacts)
      this._contactService.getContacts();
  }

  generateForm() {
    this.form = this.fb.group({
      id: [0],
      contactId: ['', Validators.required],
      caseId: ['', Validators.required],
      subject: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      time: ['12:00 AM', Validators.required],
      allDay: [false],
      attandees: [[], Validators.required],
      tags: [] = [] ,
      emailAttandees: [false],
      reminders: [false],
      notes: ['', Validators.required]
    }, { updateOn: 'submit' });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.file = file;
    this.fileList = [];
    this.fileList.push(file);
    this.isFileAdded = true;
    return false;
  };

  handleSubmit(formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      return
    }
    this.form.get('tags').setValue(this.inputtage);
    var obj = this.form.value as EventsDTO;
    obj.isFileAdded = this.isFileAdded;
    this._eventsService.createUpdateEvent(this.file, obj).subscribe(res => {
      if (res.isSuccessfull) {
        this.formDirective.resetForm();
        this._eventsService.getEvents();
        // this.generateForm()
        if (this.isEditMode) {
          this._notification.success('Event Updated Successfully!')
        } else {
          this._notification.success('Event Created Successfully!')
          this._sharedService.formSubmited.next();
          this._homeService.getHomeData();
        }
      }
      else {
        if (this.isEditMode) {
          this._notification.error('Error while updating event!')
        } else {
          this._notification.error('Error while creating event!')
        }
      }
    });
  }

  changeOrganizer(event) {
    this.attandeesList = JSON.parse(this.attandeesCopy);
    this.attandeesCopy = JSON.stringify(this.attandeesList);
    const index = this.attandeesList.findIndex(x => x.id == event);
    if (index > -1) {
      this.attandeesList.splice(index, 1);
    }
    var attandees = this.form.controls["attandees"]['_pendingValue'];
    if (attandees) {
      const i = attandees.findIndex(x => x == event);
      if (i > -1) {
        attandees.splice(i, 1);
      }
      this.form.controls["attandees"].setValue(attandees);
    }
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // tslint:disable-next-line:member-ordering
 
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const self = this;
    if ((value || '').trim()) {
      self.inputtage.push(value.trim());
      self.tags.updateValueAndValidity();
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.inputtage.indexOf(tag);

    if (index >= 0) {
      this.inputtage.splice(index, 1);
      this.tags.updateValueAndValidity();
    }
  }

  get tags() {
    return this.form.get('tags');
  }

}
