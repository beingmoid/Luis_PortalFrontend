import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaseTransactionDTO } from 'src/app/models/caseTransactionDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { InvoiceService } from 'src/app/services/APIServices/invoice.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { TransactionService } from 'src/app/services/APIServices/transaction.service';
import { PermissionService } from 'src/app/services/permission.service';

class FiletObject {
  constructor(private data: CaseTransactionDTO) { }

  index: number = this.data.index;
  invoiceNo: string = this.data.invoiceNo;
  invoiceDate: Date = this.data.invoiceDate;
  requested: string = this.data.requested;
  paid: number = this.data.paid;
  paymentReceivedDate: Date = this.data.paymentReceivedDate;
  paymentMethodName: string = this.data.paymentMethodName;
  notes: string = this.data.notes;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  search: string
  listData: CaseTransactionDTO[] = []
  transaction: CaseTransactionDTO = new CaseTransactionDTO();
  isVisible: boolean = false
  modalTitle: string = "Create New Transaction"
  isEditMode: boolean = false
  caseId: number = 0;
  transactionForm: FormGroup;
  paymentMethods: LookUpDTO[] = [];
  invoices: any[] = [];
  invoiceSubject: Subscription;
  transactionSubject: Subscription;
  paymentMethodSubject: Subscription;

  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;
  showTransaction: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _lookupService: LookupService,
    private _transactionService: TransactionService,
    private _invoiceService: InvoiceService,
    public _permissionService: PermissionService
  ) {
    this.transactionForm = fb.group({
      id: [0],
      invoiceId: [null, Validators.required],
      invoiceDate: [null, Validators.required],
      requested: [null],
      paid: [null, Validators.required],
      paymentReceivedDate: [null, Validators.required],
      paymentMethodId: [null, Validators.required],
      accountNumber: [null, [Validators.required, Validators.maxLength(18)]],
      accountTransfer: [false, { updateOn: 'change' }],
      transferedFrom: [null, Validators.maxLength(18)],
      transferedTo: [null, Validators.maxLength(18)],
      notes: [null],
    }, { updateOn: 'submit' })
  }

  get f() { return this.transactionForm.controls }

  ngOnInit(): void {
    this.caseId = history.state.caseId;

    this.invoiceSubject = this._invoiceService.invoicesObserver$.subscribe(res => {
      if (res)
        this.invoices = res;
    });

    this.transactionSubject = this._transactionService.caseTransactionsObserver$.subscribe(res => {
      if (res) {
        this.listData = res;
        let index = 0;
        this.listData.forEach(element => {
          element.index = index + 1;
          index++;
        });
        this.listDataCopy = JSON.stringify(this.listData);
      }
    });

    this.paymentMethodSubject = this._lookupService.paymentMethodObserver$.subscribe(res => {
      this.paymentMethods = res;
    });

    if (!this._invoiceService.invoices) {
      if (this.caseId && this.caseId !== 0) {
        this._invoiceService.getCaseInvoicesByCase(this.caseId);
      } else {
        this._invoiceService.getCaseInvoices();
      }
    }

    if (!this._lookupService.paymentMethods)
      this._lookupService.getPaymentMethods()

    this.refreshData();

  }

  ngOnDestroy() {
    if (this.invoiceSubject) this.invoiceSubject.unsubscribe();
    if (this.transactionSubject) this.transactionSubject.unsubscribe();
    if (this.paymentMethodSubject) this.paymentMethodSubject.unsubscribe();
  }

  // get aF() { return this.transactionForm.get("accountTransfer").value }

  handleCancel() {
    this.isVisible = false
  }

  editTransaction(data) {
    this.isEditMode = true;
    this.isVisible = true;
    this.transactionForm.patchValue(data);
    this.showTransaction = false;
  }

  deleteTransaction(data) {
    this._notification.delete('Are you sure you want to delete!').then(result => {
      if (result.isConfirmed) {
        this._transactionService.deleteCaseTransaction(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Retainer Schedule Deleted successfully");
            this.refreshData();
            this.showTransaction = false;
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

  showModal() {
    this.transactionForm.reset();
    this.transactionForm.patchValue({ accountTransfer: false })
    this.isEditMode = false;
    this.isVisible = true;
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.transactionForm.valid) {
      let data = this.transactionForm.value as CaseTransactionDTO;
      if (!this.caseId) {
        let inv = this.invoices.find(r => {
          if (r.id === this.transactionForm.value.invoiceId) {
            return r
          }
        });
        this.caseId = inv.caseId
      }
      data.caseId = this.caseId
      if (!data.accountTransfer)
        data.accountTransfer = false;
      if (this.isEditMode) {
        this._transactionService.updateCaseTransaction(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Transaction Updated Successfully");
            formDirective.resetForm()
            this.refreshData();
          } else {
            this._notification.error("Error while updating transaction");
          }
        });
      } else {
        data.id = 0;
        this._transactionService.saveCaseTransaction(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Transaction Saved Successfully");
            formDirective.resetForm()
            this.refreshData();
          }
          else {
            this._notification.error("Error while saving transaction");
          }
        });
      }
      this.handleCancel();
    }
  }

  refreshData() {
    if (this.caseId && this.caseId !== 0) {
      this._transactionService.getCaseTransactionsByCase(this.caseId);
    } else {
      this._transactionService.getCaseTransactions();
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
        let data = new FiletObject(item);
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
  showSingleTransaction(data: CaseTransactionDTO) {
    this.transaction = data;
    this.showTransaction = true;
  }
}
