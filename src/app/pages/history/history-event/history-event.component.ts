import { Component, Input, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { ExcelJson } from 'src/app/models/exportDTO';
import { AuditService } from 'src/app/services/APIServices/audit.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-history-event',
  templateUrl: './history-event.component.html',
  styleUrls: ['./history-event.component.scss']
})
export class HistoryEventComponent implements OnInit {

  listData: any[] = []

  filteredData: any[] = []
  pageSize: number = 10
  pageIndex: number = 1
  pageTotal: number = 0;
  loading: boolean = false
  @Input() searchEvent: string = "";
  visible = false;
  selectedCol: string = "";
  columnsList: any[] = ["Name", "AuditedBy", "AuditDate", "AuditType"];

  @Input() filterEventObserver: Subject<boolean>;
  @Input() exportEventObserver: Subject<boolean>;
  constructor(private auditService: AuditService, private exportService: ExportService) { }

  ngOnInit(): void {
    //this.auditService.getCaseHistory();
    this.auditService.eventHistoryObserver$.subscribe(res => {
      if(res){
        this.listData = res.items;
        this.pageTotal = res.totalCount;
        this.loading = false;
      }
    })
    this.filterEventObserver.subscribe(res => { 
      if(res)
        this.search();
    });
    this.exportEventObserver.subscribe(res => {
      if(res)
        this.exportToExcel();
    })
  }

  params: NzTableQueryParams
  getData(params: NzTableQueryParams) {
    this.loading = true;
    this.params = params;
    params['isFilter'] = true;
    this.params['filterValue'] = this.searchEvent;
    this.auditService.getEventHistory(params);
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
        { A: 'Event Name', B: 'Created/Updated By', C: 'Date & Time', D: 'Description' }
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
    this.exportService.exportJsonToExcel(edata, 'event_history');
  }

}
