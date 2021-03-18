import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  searchCase: string = '';
  searchEvent: string = '';
  searchContact: string = '';
  searchAccount: string = '';
  searchTask: string = '';
  searchCommission: string = '';
  searchDocument: string = '';
  tabName: string = 'Case';
  filterCaseSubject: Subject<boolean> = new BehaviorSubject(false);
  filterEventSubject: Subject<boolean> = new BehaviorSubject(false);
  filterContactSubject: Subject<boolean> = new BehaviorSubject(false);
  filterAccountSubject: Subject<boolean> = new BehaviorSubject(false);
  filterTaskSubject: Subject<boolean> = new BehaviorSubject(false);
  filterCommissionSubject: Subject<boolean> = new BehaviorSubject(false);
  filterDocumentSubject: Subject<boolean> = new BehaviorSubject(false);

  exportCaseSubject: Subject<boolean> = new BehaviorSubject(false);
  exportEventSubject: Subject<boolean> = new BehaviorSubject(false);
  exportTaskSubject: Subject<boolean> = new BehaviorSubject(false);
  exportContactSubject: Subject<boolean> = new BehaviorSubject(false);
  exportCommissionSubject: Subject<boolean> = new BehaviorSubject(false);
  exportAccountSubject: Subject<boolean> = new BehaviorSubject(false); 
  exportDocumentSubject: Subject<boolean> = new BehaviorSubject(false);

  ShowCaseHistory: boolean = false;
  ShowEventHistory: boolean = false;
  ShowTaskHistory: boolean = false;
  ShowContactHistory: boolean = false;
  ShowCommissionHistory: boolean = false;
  ShowAccountHistory: boolean = false;
  ShowDocumentHistory: boolean = false;
  constructor(private permissionService: PermissionService) { }

  ngOnInit(): void {
    var permissionsList = this.permissionService.getHistoryPermissions;
    this.ShowCaseHistory = (permissionsList.findIndex(x => x == "History_Case") > -1);
    this.ShowEventHistory = (permissionsList.findIndex(x => x == "History_Event") > -1);
    this.ShowTaskHistory = (permissionsList.findIndex(x => x == "History_Task") > -1);
    this.ShowAccountHistory = (permissionsList.findIndex(x => x == "History_Accounting") > -1);
    this.ShowDocumentHistory = (permissionsList.findIndex(x => x == "History_Documents") > -1);
    this.ShowContactHistory = (permissionsList.findIndex(x => x == "History_Contact") > -1);
    this.ShowCommissionHistory = (permissionsList.findIndex(x => x == "History_Commission") > -1);
  }

  changeTab(tabName){
    this.tabName = tabName;
  }

  ExportData(){
    if(this.tabName == "Case"){
      this.exportCaseSubject.next(true);
    }
    else if(this.tabName == "Event"){
      this.exportEventSubject.next(true);
    }
    else if(this.tabName == "Task"){
      this.exportTaskSubject.next(true);
    }
    else if(this.tabName == "Contact"){
      this.exportContactSubject.next(true);
    }
    else if(this.tabName == "Commission"){
      this.exportCommissionSubject.next(true);
    }
    else if(this.tabName == "Accounting"){
      this.exportAccountSubject.next(true);
    }
    else if(this.tabName == "Documents"){
      this.exportDocumentSubject.next(true);
    }
  }

  FilterCase(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      this.filterCaseSubject.next(true);
    }
  }

  FilterEvent(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      this.filterEventSubject.next(true);
    }
  }

  FilterContact(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      this.filterContactSubject.next(true);
    }
  }

  FilterAccount(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      this.filterAccountSubject.next(true);
    }
  }

  FilterTask(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      this.filterTaskSubject.next(true);
    }
  }

  FilterCommission(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      this.filterCommissionSubject.next(true);
    }
  }

  FilterDocument(ev){
    if ((ev.code == "Enter") || (ev.code == "Backspace")) {
      this.filterDocumentSubject.next(true);
    }
  }

}
