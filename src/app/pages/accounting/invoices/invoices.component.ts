import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CaseNoteDTO } from 'src/app/models/caseNoteDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { InvoiceService } from 'src/app/services/APIServices/invoice.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { RetainerScheduleService } from 'src/app/services/APIServices/retainer-schedule.service';
import { PermissionService } from 'src/app/services/permission.service';
import { UserCompanyDTO } from 'src/app/models/userCompanyDTO';
import { UserService } from 'src/app/services/APIServices/user.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
class FilterObject {
  constructor(private data: any) { }

  index: number = this.data.index;
  invoiceNo: string = this.data.invoiceNo;
  invoiceDate: Date = this.data.invoiceDate;
  dueDate: Date = this.data.dueDate;
  totalAmount: number = this.data.totalAmount;
  paid: number = this.data.paid;
  balance: number = this.data.balance;
}


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {

  
  search: string
  statuses: LookUpDTO[] = [];
  listData: any[] = []
  contacts: any[] = []
  cases: any[] = []
  retainersList: any[] = []
  invoiceForm: FormGroup
  isVisible: boolean = false
  modalTitle: string = "Create New Invoice"
  isEditMode: boolean = false
  caseId: number = 0;
  totalWithoutTaxAmount: number = 0;
  totalTax: number = 0;
  totalPaidToDate: number = 0;
  totalAmount: number = 0;

  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;

  invoiceStatusSubject: Subscription;
  contactSubject: Subscription;
  invoicesSubject: Subscription;
  caseListSubject: Subscription;
  caseRetainersSubject: Subscription;
  showInvoice: boolean = false;

  userCompany: UserCompanyDTO
  invoiceData: any

  public get retainers() { return this.invoiceForm.get('retainers') as FormArray }
  public get timeEntries() { return this.invoiceForm.get('timeEntries') as FormArray }
  public get expenses() { return this.invoiceForm.get('expenses') as FormArray }
  public get flatFees() { return this.invoiceForm.get('flatFees') as FormArray }

  constructor(
    private fb: FormBuilder,
    private _invoiceService: InvoiceService,
    private _notification: AlertService,
    private _contactService: ContactsService,
    private _caseService: CaseService,
    private _retainerScheduleService: RetainerScheduleService,
    private _lookupService: LookupService,
    public _permissionService: PermissionService,
    private _userService: UserService,
  ) {
    this.invoiceForm = fb.group({
      id: [0],
      contactId: [null, { updateOn: 'change', validators: [Validators.required] }],
      caseId: [null, { updateOn: 'change', validators: [Validators.required] }],
      invoiceDate: [null, { updateOn: 'change', validators: [Validators.required] }],
      dueDate: [null, { updateOn: 'change', validators: [Validators.required] }],
      retainerId: [null, { updateOn: 'change', validators: [Validators.required] }],
      statusId: [1, { updateOn: 'change', validators: [Validators.required] }],
      retainers: fb.array([
        fb.group({
          id: [0],
          professionalFees: [null, { updateOn: 'change' }],
          taxes: [0, { updateOn: 'change' }],
          administrativeFees: [null, { updateOn: 'change' }],
          governmentFees: [null, { updateOn: 'change' }],
          otherFees: [null, { updateOn: 'change' }],
          total: [null, { updateOn: 'change' }],
        })
      ]),
      timeEntries: fb.array([
        fb.group({
          id: [0],
          timeEntry: ['12:00 AM', { updateOn: 'change' }],
          description: [null, { updateOn: 'change' }],
          date: [null, { updateOn: 'change' }],
          billedBy: [null, { updateOn: 'change' }],
          hours: [null, { updateOn: 'change' }],
          perHourRate: [null, { updateOn: 'change' }],
          tax: [null, { updateOn: 'change' }],
          total: [null, { updateOn: 'change' }],
        })
      ]),
      expenses: fb.array([
        fb.group({
          id: [0],
          expense: [null, { updateOn: 'change' }],
          description: [null, { updateOn: 'change' }],
          date: [null, { updateOn: 'change' }],
          billedBy: [null, { updateOn: 'change' }],
          qty: [null, { updateOn: 'change' }],
          price: [null, { updateOn: 'change' }],
          tax: [null, { updateOn: 'change' }],
          total: [null, { updateOn: 'change' }],
        })
      ]),
      flatFees: fb.array([
        fb.group({
          id: [0],
          flatFees: [null, { updateOn: 'change' }],
          description: [null, { updateOn: 'change' }],
          date: [null, { updateOn: 'change' }],
          billedBy: [null, { updateOn: 'change' }],
          qty: [null, { updateOn: 'change' }],
          price: [null, { updateOn: 'change' }],
          tax: [null, { updateOn: 'change' }],
          total: [null, { updateOn: 'change' }],
        })
      ]),
      notes: [null],
      terms: [null],
    }, { updateOn: 'submit' })
  }

  get f() { return this.invoiceForm.controls }

  ngOnInit(): void {

    // Get Company Data for Invoice
    this._userService.userCompanyObserver$.subscribe(r => {
      if (r) {
        this.userCompany = r
      }
    })
    this._userService.getUserCompany()
    // Get Case if in Case tab
    this.caseId = history.state.caseId;
    if (this.caseId && this.caseId !== 0) {
      this.invoiceForm.get('caseId').disable()
    }

    this.invoiceStatusSubject = this._lookupService.invoiceStatusObserver$.subscribe(res => {
      if (res)
        this.statuses = res;
    });

    this.contactSubject = this._contactService.contactObserver$.subscribe(res => {
      if (res)
        this.contacts = res;
    });

    this.invoicesSubject = this._invoiceService.invoicesObserver$.subscribe(res => {
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

    this.caseListSubject = this._caseService.caseListObserver$.subscribe(res => {
      if (res)
        this.cases = res;
    });

    this.caseRetainersSubject = this._retainerScheduleService.CaseRetainerScheduleObserver$.subscribe(res => {
      if (res)
        this.retainersList = res;
    });

    this.getInvoicesData();

    if (!this._lookupService.invoiceStatus)
      this._lookupService.getInvoiceStatus();

    if (!this._contactService.contacts)
      this._contactService.getContacts();

    if (!this._caseService.cases)
      this._caseService.getCases();

    if (!this._retainerScheduleService.retainers)
      this._retainerScheduleService.getCaseRetainerSchedule();
  }

  ngOnDestroy() {
    if (this.invoiceStatusSubject) this.invoiceStatusSubject.unsubscribe();
    if (this.contactSubject) this.contactSubject.unsubscribe();
    if (this.invoicesSubject) this.invoicesSubject.unsubscribe();
    if (this.caseListSubject) this.caseListSubject.unsubscribe();
    if (this.caseRetainersSubject) this.caseRetainersSubject.unsubscribe();
  }

  handleCancel() {
    this.isVisible = false
  }

  showModal() {
    this.resetRowsAndpopulateData(null);
    this.invoiceForm.reset();
    if (this.caseId && this.caseId !== 0)
      this.invoiceForm.get("caseId").setValue(this.caseId);
    this.isEditMode = false;
    this.isVisible = true;
  }

  editInvoice(data: { id: number; }) {
    this._invoiceService.getCaseInvoiceById(data.id).subscribe(res => {
      this.invoiceForm.patchValue(res.dynamicResult);
      this.resetRowsAndpopulateData(res.dynamicResult);
      this.isVisible = true;
      this.isEditMode = true;
      this.showInvoice = false;
    });
  }

  resetRowsAndpopulateData(res: any) {
    this.retainers.controls = [];
    this.timeEntries.controls = [];
    this.expenses.controls = [];
    this.flatFees.controls = [];

    if (res && res.retainers.length > 0) {
      res.retainers.forEach(e => {
        this.retainers.push(this.createFormGroup('retainers', e))
      });
    } else {
      this.retainers.push(this.createFormGroup('retainers', null))
    }
    if (res && res.timeEntries.length > 0) {
      res.timeEntries.forEach((e, i) => {
        this.timeEntries.push(this.createFormGroup('timeEntries', e))
      });
    } else {
      this.timeEntries.push(this.createFormGroup('timeEntries', null))
    }
    if (res && res.expenses.length > 0) {
      res.expenses.forEach(e => {
        this.expenses.push(this.createFormGroup('expenses', e))
      });
    } else {
      this.expenses.push(this.createFormGroup('expenses', null))
    }
    if (res && res.flatFees.length > 0) {
      res.flatFees.forEach(e => {
        this.flatFees.push(this.createFormGroup('flatFees', e))
      });
    } else {
      this.flatFees.push(this.createFormGroup('flatFees', null))
    }
    this.onAmountChange();
  }

  onAmountChange() {
    this.totalWithoutTaxAmount = 0;
    let data = this.invoiceForm.value;

    //retainers
    data.retainers.forEach(element => {
      let retainersTotal = 0;
      if (element.professionalFees) {
        retainersTotal += parseInt(element.professionalFees);
      }
      if (element.administrativeFees) {
        retainersTotal += parseInt(element.administrativeFees);
      }
      if (element.governmentFees) {
        retainersTotal += parseInt(element.governmentFees);
      }
      if (element.otherFees) {
        retainersTotal += parseInt(element.otherFees);
      }
      if (element.taxes) {
        retainersTotal += parseInt(element.taxes);
      }
      element.total = retainersTotal;
      if (element.total) {
        this.totalWithoutTaxAmount += parseInt(element.total);
      }
    });

    //time entries
    data.timeEntries.forEach(element => {
      if (element.hours && element.perHourRate) {
        element.total = parseInt(element.hours) * parseInt(element.perHourRate);
      }
      if (element.tax) {
        element.total += parseInt(element.tax);
      }
      if (element.total)
        this.totalWithoutTaxAmount += parseInt(element.total);
    });

    //expenses
    data.expenses.forEach(element => {
      if (element.qty && element.price) {
        element.total = parseInt(element.qty) * parseInt(element.price);
      }

      if (element.tax) {
        element.total += parseInt(element.tax);
      }

      if (element.total)
        this.totalWithoutTaxAmount += parseInt(element.total.toString());
    });

    //flat fee
    data.flatFees.forEach(element => {
      if (element.qty && element.price) {
        element.total = parseInt(element.qty) * parseInt(element.price);
      }

      if (element.tax) {
        element.total += parseInt(element.tax);
      }

      if (element.total)
        this.totalWithoutTaxAmount += parseInt(element.total.toString());
    });

    this.invoiceForm.patchValue(data);

    this.totalTax = (this.totalWithoutTaxAmount / 100) * 13;
    this.totalAmount = (this.totalWithoutTaxAmount + this.totalTax) - this.totalPaidToDate;
  }

  deleteInvoice(data: CaseNoteDTO) {
    this._notification.delete('Are you sure you want to delete!').then(result => {
      if (result.isConfirmed) {
        this._invoiceService.deleteCaseInvoice(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Invoice Deleted successfully");
            this.getInvoicesData();
            this.showInvoice = false;
          }
          else {
            this._notification.success("Error deleting Invoice");
          }
        });
      } else {
        return
      }
    })
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (!this.invoiceForm.valid) {
      return
    }
    if (this.invoiceForm.valid) {

      let data = this.invoiceForm.value;
      if (!data.caseId && this.caseId) {
        data.caseId = this.caseId;
      }
      data.totalAmount = this.totalAmount;
      data.paid = this.totalPaidToDate;
      data.balance = this.totalAmount - this.totalPaidToDate;
      if (this.isEditMode) {
        this._invoiceService.updateCaseInvoice(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Invoice Updated Successfully");
            formDirective.resetForm()
            this.getInvoicesData();
          } else {
            this._notification.error("Error while updating invoice");
          }
        });
      } else {
        data.id = 0;
        data.retainers.forEach((element: { id: number; }) => {
          element.id = 0;
        });
        data.timeEntries.forEach((element: { id: number; }) => {
          element.id = 0;
        });
        data.expenses.forEach((element: { id: number; }) => {
          element.id = 0;
        });
        data.flatFees.forEach((element: { id: number; }) => {
          element.id = 0;
        });
        this._invoiceService.saveCaseInvoice(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Invoice Saved Successfully");
            formDirective.resetForm()
            this.getInvoicesData();
          } else {
            this._notification.error("Error while saving invoice");
          }
        });
      }
      this.handleCancel();
    }
  }

  getInvoicesData() {
    if (this.caseId && this.caseId !== 0) {
      this._invoiceService.getCaseInvoicesByCase(this.caseId);
    } else {
      this._invoiceService.getCaseInvoices();
    }
  }

  /**
   * 
   * @param value Form Value
   */
  createFormGroup(value: any, data: any): FormGroup {

    switch (value) {
      case 'retainers':
        return this.fb.group({
          professionalFees: [data ? data.professionalFees : null, { updateOn: 'change' }],
          taxes: [data ? data.taxes : null, { updateOn: 'change' }],
          administrativeFees: [data ? data.administrativeFees : null, { updateOn: 'change' }],
          governmentFees: [data ? data.governmentFees : null, { updateOn: 'change' }],
          otherFees: [data ? data.otherFees : null, { updateOn: 'change' }],
          total: [data ? data.total : null],
        })

      case 'timeEntries':
        return this.fb.group({
          timeEntry: [data ? data.timeEntry : '12:00 AM', { updateOn: 'change' }],
          description: [data ? data.description : null, { updateOn: 'change' }],
          date: [data ? data.date : null, { updateOn: 'change' }],
          billedBy: [data ? data.billedBy : null, { updateOn: 'change' }],
          hours: [data ? data.hours : null, { updateOn: 'change' }],
          perHourRate: [data ? data.perHourRate : null, { updateOn: 'change' }],
          tax: [data ? data.tax : null, { updateOn: 'change' }],
          total: [data ? data.total : null, { updateOn: 'change' }],
        })
      case 'expenses':
        return this.fb.group({
          expense: [data ? data.expense : null, { updateOn: 'change' }],
          description: [data ? data.description : null, { updateOn: 'change' }],
          date: [data ? data.date : null, { updateOn: 'change' }],
          billedBy: [data ? data.billedBy : null, { updateOn: 'change' }],
          qty: [data ? data.qty : null, { updateOn: 'change' }],
          price: [data ? data.price : null, { updateOn: 'change' }],
          tax: [data ? data.tax : null, { updateOn: 'change' }],
          total: [data ? data.total : null, { updateOn: 'change' }],
        })

      case 'flatFees':
        return this.fb.group({
          flatFees: [data ? data.flatFees : null, { updateOn: 'change' }],
          description: [data ? data.description : null, { updateOn: 'change' }],
          date: [data ? data.date : null, { updateOn: 'change' }],
          billedBy: [data ? data.billedBy : null, { updateOn: 'change' }],
          qty: [data ? data.qty : null, { updateOn: 'change' }],
          price: [data ? data.price : null, { updateOn: 'change' }],
          tax: [data ? data.tax : null, { updateOn: 'change' }],
          total: [data ? data.total : null, { updateOn: 'change' }],
        })

      default:
        break;
    }

  }

  addRatinersFormGroup(data: any = null) {
    this.retainers.push(this.createFormGroup('retainers', data))
  }
  removeReatinersFormGroup(index: number) {
    this.retainers.removeAt(index);
    this.onAmountChange();
  }

  addTimeFormGroup(data: any = null) {
    this.timeEntries.push(this.createFormGroup('timeEntries', data))
  }
  removeTimeFormGroup(index: number) {
    this.timeEntries.removeAt(index);
    this.onAmountChange();
  }

  addExpensesFormGroup(data: any = null) {
    this.expenses.push(this.createFormGroup('expenses', data))
  }
  removeExpensesFormGroup(index: number) {
    this.expenses.removeAt(index);
    this.onAmountChange();
  }

  addFlatFormGroup(data: any = null) {
    this.flatFees.push(this.createFormGroup('flatFees', data))
  }
  removeFlatFormGroup(index: number) {
    this.flatFees.removeAt(index);
    this.onAmountChange();
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

  showSingleInvoice(data: any) {
    this.invoiceData = data;
    this.showInvoice = true;
  }

  getRetainer(id: number) {
    if (id) {
      let temp =  this.retainersList.find(x => x.id == id)
      return temp.dueOnName
    }
    
  }

  downloadFile() {
    const data = document.getElementById('inv');
    html2canvas(data).then(canvas => {
      const imgWidth = 200;
      const pageHeight = 295;
      // const imgHeight = canvas.height * imgWidth / canvas.width;
      const imgHeight = 280;
      // const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 10;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
    });
  }
}