import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd';
import { ExcelJson } from 'src/app/models/exportDTO';
import { AuditService } from 'src/app/services/APIServices/audit.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-history-login',
  templateUrl: './history-login.component.html',
  styleUrls: ['./history-login.component.scss']
})
export class HistoryLoginComponent implements OnInit {

  listData: any[] = []

  filteredData: any[] = []
  pageSize: number = 10
  pageIndex: number = 1
  pageTotal: number = 0;
  loading: boolean = false
  search: string = "";
  visible = false;
  selectedCol: string = "";
  columnsList: any[] = ["Name", "AuditedBy", "AuditDate", "AuditType"];
  constructor(private auditService: AuditService, private exportService: ExportService) { }

  ngOnInit(): void {
    //this.auditService.getCaseHistory();
    this.auditService.loginHistoryObserver$.subscribe(res => {
      if(res){
        this.listData = res.items;
        this.pageTotal = res.totalCount;
        this.loading = false;
      }
    })
  }

  params: NzTableQueryParams
  getData(params: NzTableQueryParams) {
    this.loading = true;
    this.params = params;
    params['isFilter'] = true;
    this.params['filterValue'] = this.search;
    this.auditService.getLoginHistory(params);
  }

  Filter(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      // this.params.filter = [];
      // this.columnsList.forEach(element => {
      //   var obj = {
      //     key: element,
      //     value: this.search
      //   }
      //   this.params.filter.push(obj);
      // });
      this.getData(this.params);
    }
  }

  onPageIndexChange(event){
    this.params.pageIndex = event;
    this.getData(this.params);
  }

  onPageSizeChange(event){
    this.params.pageSize = event;
    this.getData(this.params);
  }

  exportToExcel(): void {
    const edata: Array<ExcelJson> = [];
    const udt: ExcelJson = {
      data: [
        { A: 'User Name', B: 'Created/Updated By', C: 'Description' }
      ],
      skipHeader: true
    };
    this.listData.forEach(element => {
      udt.data.push({
        A: element.name,
        B: element.auditedBy,
        C: element.description
      });
    });
    edata.push(udt);
    this.exportService.exportJsonToExcel(edata, 'login_history');
  }

}
