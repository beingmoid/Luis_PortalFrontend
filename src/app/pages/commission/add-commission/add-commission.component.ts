import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CaseDTO } from 'src/app/models/caseDTO';
import { commissionDTO } from 'src/app/models/commissionDTO';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CommissionService } from 'src/app/services/APIServices/commission.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';

@Component({
  selector: 'app-add-commission',
  templateUrl: './add-commission.component.html',
  styleUrls: ['./add-commission.component.scss']
})
export class AddCommissionComponent implements OnInit {

  @Input() commissionDataSub: Subject<commissionDTO>;
  form: FormGroup;
  commissionId: number;
  data: commissionDTO;
  isEditMode: boolean = false;
  cases: CaseDTO[] = [];
  caseTypes: LookUpDTO[] = [];
  loading: boolean = false;
  isPaidGreater: boolean = false;
  contactClientData: ContactDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _commissionService: CommissionService,
    private _contactService: ContactsService
  ) {
    this.form = fb.group({
      agentName: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
      caseId: [null, Validators.required],
      caseTypeId: [null, Validators.required],
      contactClientId: [null, Validators.required],
      referredOnDate: [null, Validators.required],
      totalCommission: [null, { updateOn: 'change', validators: [Validators.required , Validators.pattern('^[0-9]*$')] }],
      paid: [null, { updateOn: 'change', validators: [Validators.required , Validators.pattern('^[0-9]*$')] }],
      balance: [null, { updateOn: 'change', validators: [Validators.required] }]
    }, { updateOn: 'submit' })
  }

  get f() { return this.form.controls }

  ngOnInit(): void {

    this._contactService.contactObserver$.subscribe(res => {
      if (res) {
        this.contactClientData = res.filter(x => x.contactTypeName == "Client");
      }
    });

    this._commissionService.caseListObserver$.subscribe(res => {
      if (res)
        this.cases = res;
    });
    this._commissionService.getCases();
    this._commissionService.caseTypeObserver$.subscribe(res => {
      this.caseTypes = res;
    });
    this._commissionService.getCaseTypes();

    this.commissionDataSub.subscribe(res => {
      if (res) {
        this.form.patchValue(res);
        this.commissionId = res.id;
        this.isEditMode = true;
      }

      else {
        this.form.reset();
        this.commissionId = null;
        this.isEditMode = false;
      }
    });

    if (!this._contactService.contacts)
      this._contactService.getContacts();

  }

  calculateBalance() {
    this.form.value.balance = this.form.value.totalCommission - this.form.value.paid;
    if (this.form.value.balance < 0) {
      this.form.value.balance = 0;
      this.form.value.paid = 0;
      //this.f['paid'].setErrors({ 'greater': 'true' })
      this.isPaidGreater = true;
    } else {
      this.isPaidGreater = false;
    }
    this.form.value.balance = parseFloat(this.form.value.balance).toFixed(2);
    this.form.patchValue({ 'balance': this.form.value.balance });

  }

  handleSubmit(formDirective: FormGroupDirective) {

    if (this.form.invalid || this.isPaidGreater) {
      return
    }
    this.loading = true
    let data = this.form.value as commissionDTO;
    if (this.isEditMode) {
      data.id = this.commissionId;
      this._commissionService.editCommission(data).subscribe(res => {
        this.loading = false
        if (res.isSuccessfull) {
          formDirective.resetForm()
          this._commissionService.getCommissions();
          this._notification.success('Commission Updated Successfully!')
        }
        else {
          this._notification.error('Error while updating Commission!')
        }
      });
    } else {
      this.loading = false
      this._commissionService.saveCommission(data).subscribe(res => {
        if (res.isSuccessfull) {
          formDirective.resetForm()
          this._commissionService.getCommissions();
          this._notification.success('Commission Saved Successfully!')
        }
        else {
          this._notification.error('Error while saving Commission!')
        }
      });
    }

  }
}
