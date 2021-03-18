import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaymentHistoryDTO } from 'src/app/models/paymentHistoryDTO';
import { AlertService } from 'src/app/services/alert.service';
import { PaymentHistoryService } from 'src/app/services/APIServices/payment-history.service';

class FilterObject {
  constructor(private data: PaymentHistoryDTO) { }

  index: number = this.data.index;
  subscriptionPlanName: string = this.data.subscriptionPlanName;
  subscriptionPlanBillingType: string = this.data.subscriptionPlanBillingType;
  payment: number = this.data.payment;
  numberOfUsers: number = this.data.numberOfUsers;
  paymentDate: Date = this.data.paymentDate;
  endDate: Date = this.data.endDate;
  recurringDate: Date = this.data.recurringDate;
}

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.scss']
})
export class BillingHistoryComponent implements OnInit {

  listData: PaymentHistoryDTO[] = [];
  invoice: PaymentHistoryDTO = new PaymentHistoryDTO();
  search: string
  data: any[] = [];
  listOfSelection: any;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: any[] = [];
  listOfData: any[] = [];
  setOfCheckedId = new Set<number>();
  showInvoice: boolean = false;
  pageSize: number = 10;
  sortColumnKey: string;
  listDataCopy: string;

  isVisible: boolean = false;
  paymentHistorySubject: Subscription;

  constructor(
    private _paymentHistoryService: PaymentHistoryService,
    private alert: AlertService

  ) { }

  ngOnInit(): void {
    this.paymentHistorySubject = this._paymentHistoryService.paymentHistoryObserver$.subscribe(res => {
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

    if (!this._paymentHistoryService.paymentHistories)
      this._paymentHistoryService.getPaymentHistories();
  }

  ngOnDestroy() {
    if (this.paymentHistorySubject) this.paymentHistorySubject.unsubscribe();
  }

  openStripeReciept(url: string) {
    window.open(url, '_blank');
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.showInvoice = false;
  }
  showSingleInvoice(url: string) {
    // this.invoice = data;
    // this.showInvoice = true;
    window.open(url, '_blank');
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
