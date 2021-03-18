import { Component, Input, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { ExcelJson } from 'src/app/models/exportDTO';
import { AuditService } from 'src/app/services/APIServices/audit.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-history-contact',
  templateUrl: './history-contact.component.html',
  styleUrls: ['./history-contact.component.scss']
})
export class HistoryContactComponent implements OnInit {

  listData: any[] = []

  filteredData: any[] = []
  pageSize: number = 10
  pageIndex: number = 1
  pageTotal: number = 0;
  loading: boolean = false
  @Input() searchContact: string = "";
  visible = false;
  selectedCol: string = "";
  columnsList: any[] = ["Name", "AuditedBy", "AuditDate", "AuditType"];

  @Input() filterContactObserver: Subject<boolean>;
  @Input() exportContactObserver: Subject<boolean>;
  constructor(private auditService: AuditService, private exportService: ExportService) { }

  ngOnInit(): void {
    //this.auditService.getCaseHistory();
    this.auditService.contactHistoryObserver$.subscribe(res => {
      if(res){
        this.listData = res.items;
        this.pageTotal = res.totalCount;
        this.loading = false;
      }
    })
    this.filterContactObserver.subscribe(res => { 
      if(res)
        this.search();
    });
    this.exportContactObserver.subscribe(res => {
      if(res)
        this.exportToExcel();
    })
  }

  params: NzTableQueryParams
  getData(params: NzTableQueryParams) {
    this.loading = true;
    this.params = params;
    params['isFilter'] = true;
    this.params['filterValue'] = this.searchContact;
    this.auditService.getContactHistory(params);
  }

  // search(){
  //   this.params.filter = [];
  //   this.columnsList.forEach(element => {
  //     var obj = {
  //       key: element,
  //       value: this.searchContact
  //     }
  //     this.params.filter.push(obj);
  //   });
  //   this.getData(this.params);
  // }
  search(){
    this.getData(this.params);
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
        { A: 'Contact Name', B: 'Created/Updated By', C: 'Date & Time', D: 'Description' }
      ],
      skipHeader: true
    };
    this.listData.forEach(element => {
      udt.data.push({
        A: element.name,
        B: element.auditedBy,
        C: element.auditDate,
        D: element.description
      });
    });
    edata.push(udt);
    this.exportService.exportJsonToExcel(edata, 'contact_history');
  }
}
