import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BankAccountDTO } from 'src/app/models/bankAccountDTO';
import { AlertService } from 'src/app/services/alert.service';
import { BankAccountService } from 'src/app/services/APIServices/bankAccount.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { PermissionService } from 'src/app/services/permission.service';

class FilterObject {
  constructor(private data: any) { }

  index: number = this.data.index;
  bankName: string = this.data.bankName;
  accountName: string = this.data.accountName;
  accountNumber: string = this.data.accountNumber;
  bankAccountTypeName: string = this.data.bankAccountTypeName;
  balance: number = this.data.balance;
}

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  search: string
  listData: any[] = []
  data: BankAccountDTO = new BankAccountDTO();
  AccountForm: FormGroup
  isEditMode: boolean = false
  isVisible: boolean = false
  accountSubject: any;
  bankAccountTypes: any[] = [];

  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;

  showAccount: boolean = false;
  get f() { return this.AccountForm.controls }

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private lookupService: LookupService,
    private bankAccountService: BankAccountService,
    public _permissionService: PermissionService
  ) {
    this.AccountForm = fb.group({
      id: [0],
      bankAccountTypeId: [null, Validators.required],
      bankName: [null, Validators.required],
      accountName: [null, Validators.required],
      accountNumber: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(13)]],
      balance: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      isActive: [false]
    }, { updateOn: 'submit' });
  }

  ngOnInit(): void {
    this.lookupService.bankAccountTypeObserver$.subscribe(res => {
      if (res)
        this.bankAccountTypes = res
    })
    this.lookupService.getBankAccountTypes()

    this.bankAccountService.GetBankAccounts();
    this.bankAccountService.bankAccountsObserver$.subscribe(res => {
      if (res) {
        this.listData = res;
        let index = 0;
        this.listData.forEach(element => {
          element.index = index + 1;
          index++;
        });
        this.listDataCopy = JSON.stringify(this.listData);

        let accountId = history.state.accountId;
        if (accountId)
          this.showSingleAccount(this.listData.find(p => p.id == accountId));

      }
    })
  }

  showModal() {
    this.AccountForm.reset();
    this.isEditMode = false;
    this.isVisible = true;
  }

  editAccount(data: BankAccountDTO) {
    this.AccountForm.patchValue(data);
    this.isEditMode = true;
    this.isVisible = true;
    this.showAccount = false;
  }
  handleCancel() {
    this.isVisible = false
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (!this.AccountForm.valid)
      return;
    var data = this.AccountForm.value as BankAccountDTO;
    if (!this.isEditMode) {
      this.saveBankAccount(data, formDirective);
    }
    else {
      this.updateBankAccount(data, formDirective);
    }
  }

  saveBankAccount(data: BankAccountDTO, formDirective: FormGroupDirective) {
    data.id = 0;
    if (data.isActive == null)
      data.isActive = false;
    this.bankAccountService.SaveBankAccount(data).subscribe(res => {
      if (res.isSuccessfull) {
        formDirective.resetForm();
        this.isVisible = false;
        this.bankAccountService.GetBankAccounts();
        this._notification.success("Bank Account Added Successfully");
      } else {
        this._notification.error("Error Occured")
      }
    })
  }

  updateBankAccount(data: BankAccountDTO, formDirective: FormGroupDirective) {
    this.bankAccountService.UpdateBankAccount(data).subscribe(res => {
      if (res.isSuccessfull) {
        formDirective.resetForm();
        this.isVisible = false;
        this.bankAccountService.GetBankAccounts();
        this._notification.success("Bank Account Updated Successfully");
      } else {
        this._notification.error("Error Occured")
      }
    })
  }

  deleteBankAccount(id) {
    this._notification.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this.bankAccountService.DeleteBankAccount(id).subscribe(res => {
          if (res.isSuccessfull) {
            this.bankAccountService.GetBankAccounts();
            this._notification.success('Account deleted Successfully!');
            this.showAccount = false;
          }
          else
            this._notification.error('Error while deleting account!')
        });
      } else {
        return
      }
    })

  }
  // EditAccounting(){
  //   this.showAccount = false;
  // }
  // DeleteAccounting(){
  //   this.showAccount = false;
  // }
  showSingleAccount(data: BankAccountDTO) {
    this.data = data
    this.showAccount = true;
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