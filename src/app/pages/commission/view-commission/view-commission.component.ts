import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { commissionDTO } from 'src/app/models/commissionDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CommissionService } from 'src/app/services/APIServices/commission.service';

class FilterObject {
  constructor(private data: commissionDTO) { }

  index: number = this.data.index;
  agentName: string = this.data.agentName;
  companyName: string = this.data.companyName;
  case: string = this.data.case;
  caseTypeName: string = this.data.caseTypeName;
  totalCommission: number = this.data.totalCommission;
  paid: number = this.data.paid;
  balance: number = this.data.balance;
}

@Component({
  selector: 'app-view-commission',
  templateUrl: './view-commission.component.html',
  styleUrls: ['./view-commission.component.scss']
})
export class ViewCommissionComponent implements OnInit {

  commissionObserverSubject: Subject<commissionDTO> = new Subject();
  contactSubject: Subscription;
  search: string;
  listData: commissionDTO[] = [];
  listOfSelection: any;
  checked = false;
  isVisible: boolean = false;
  modalTitle: string = "New Commission";
  commission: commissionDTO = new commissionDTO();
  showCommission: boolean = false;
  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;

  constructor(
    private commissionService: CommissionService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.commissionService.commissionObserver$.subscribe(res => {
      if (res) {
        this.listData = res;
        let index = 0;
        this.listData.forEach(element => {
          element.index = index + 1;
          index++;
        });
        this.listDataCopy = JSON.stringify(this.listData);

        let commisionId = history.state.commissionId;
        if (commisionId)
          this.showSingleCommission(this.listData.find(p => p.id == commisionId));
      }
      this.isVisible = false;
    });
    this.commissionService.getCommissions();

  }
  DeleteCommission(data: commissionDTO) {
    this.alert.delete().then(result => {
      if (result.isConfirmed) {
        this.commissionService.deleteCommission(data).subscribe(res => {
          if (res.isSuccessfull) {
            this.commissionService.getCommissions();
            this.alert.success('Commission deleted Successfully!')
            this.showCommission = false;
          }
          else
            this.alert.error('Error while deleting Commission!')
        });
      } else {
        return
      }
    })

  }

  showModal(): void {
    this.isVisible = true;
    this.modalTitle = "New Commission";
    this.commissionObserverSubject.next(null);
    this.showCommission = false;
  }

  handleEdit(data: commissionDTO) {
    this.modalTitle = "Edit Commission";
    this.isVisible = true;
    this.showCommission = false;

    this.commissionObserverSubject.next(data);
  }
  handleCancel() {
    this.isVisible = false;
    this.showCommission = false;
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

  showSingleCommission(data: commissionDTO) {
    this.commission = data;
    this.showCommission = true;
  }
}
