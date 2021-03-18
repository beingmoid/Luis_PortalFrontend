import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableData, NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd';
import { Subject, Subscription } from 'rxjs';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { AlertService } from 'src/app/services/alert.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { PermissionService } from 'src/app/services/permission.service';

class FilterObject {
  constructor(private data: ContactDTO) { }

  index: number = this.data.index;
  name: string = this.data.name;
  contactTypeName: string = this.data.contactTypeName;
  email: string = this.data.email;
  createdDate: Date = this.data.createdDate;
  countryName: string = this.data.countryName;
}

@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.scss']
})

export class ViewContactsComponent implements OnInit {
  [x: string]: any;

  listData: ContactDTO[] = [];
  listDataCopy: string;
  listOfSelection: any;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: any[] = [];
  listOfData: any[] = [];
  setOfCheckedId = new Set<number>();
  contact: ContactDTO = new ContactDTO();
  search: string;

  pageSize: number = 10;
  isVisible: boolean = false;
  showContact: boolean = false

  filterMessage: string = "";
  filterCountMessage: string = "";

  modalTitle: string = "Add New Contact"
  contactSubject: Subscription;
  contactObserverSubject: Subject<ContactDTO> = new Subject();
  typeFilter: any[] = [];

  listOfColumns: any[] = [];

  @ViewChild('filterTable') filterTable: NzTableData

  constructor(
    private _contactService: ContactsService,
    private alert: AlertService,
    public _permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this._contactService.contactTypeObserver$.subscribe(res => {
      if (res) {
        if (this.typeFilter.length == 0) {
          res.forEach(element => {
            this.typeFilter.push({ text: element.value, value: element.value })
          });
          this.listOfColumns = this.createTableColumnHeaders(this.typeFilter);
        }
      }
    })

    this.contactSubject = this._contactService.contactObserver$.subscribe(res => {
      if (res) {
        this.listData = res;
        let index = 0;
        this.listData.forEach(element => {
          element.index = index + 1
          index++;
        });
        this.listDataCopy = JSON.stringify(this.listData);

        let contactId = history.state.contactId;
        if (contactId)
          this.showSingleContacts(this.listData.find(p => p.id == contactId));

      }
      this.isVisible = false;
    });

    this._contactService.getContactTypes();

    this._contactService.getContacts();
  }

  private createTableColumnHeaders(typeFilter: any[]) {
    return [
      {
        name: '#',
        sortOrder: null,
        sortFn: (a: ContactDTO, b: ContactDTO) => a.index - b.index,
        sortDirections: ['ascend', 'descend', null]
      },
      {
        name: 'Name',
        sortOrder: null,
        sortFn: (a: ContactDTO, b: ContactDTO) => a.name.localeCompare(b.name),
        sortDirections: ['ascend', 'descend', null]
      },
      {
        name: 'Type',
        sortOrder: null,
        sortFn: (a: ContactDTO, b: ContactDTO) => a.contactTypeName.localeCompare(b.contactTypeName),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: true,
        listOfFilter: typeFilter,
        filterFn: this.filterContactTypes
      },
      {
        name: 'Email',
        sortOrder: null,
        sortFn: (a: ContactDTO, b: ContactDTO) => a.email.localeCompare(b.email),
        sortDirections: ['ascend', 'descend', null]
      },
      {
        name: 'Creation Date',
        sortOrder: null,
        sortFn: (a: ContactDTO, b: ContactDTO) => a.createdDate.toString().localeCompare(b.createdDate.toString()),
        sortDirections: ['ascend', 'descend', null]
      },
      {
        name: 'Country',
        sortOrder: null,
        sortFn: (a: ContactDTO, b: ContactDTO) => a.countryName.localeCompare(b.countryName),
        sortDirections: ['ascend', 'descend', null]
      },
      {
        name: 'Actions'
      }
    ];
  }

  filterContactTypes = (list: string[], item: ContactDTO) => {
    // this.filterCountMessage = `Filters (${this.filterTable.data.length} results):`;
    this.filterCountMessage = `Filters (${this.listData.filter(p => list.includes(p.contactTypeName)).length} results):`;
    let types = "";
    for (let index = 0; index < list.length; index++) {
      types += index < list.length - 1 ? `${list[index]}, ` : `${list[index]}`;
    }
    this.filterMessage = `Type: ${types}`;
    return list.some(name => item.contactTypeName.indexOf(name) !== -1)
  }

  ngOnDestroy() {
    this.contactSubject.unsubscribe();
  }

  filterChanged(event) {
    if (event.length == 0) {
      this.filterCountMessage = null;
      this.filterMessage = null;
    }
  }

  showModal(): void {
    this.isVisible = true;
    this.modalTitle = "Add New Contact";
    this.contactObserverSubject.next(null);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.showContact = false
  }

  handleSubmit() {

  }

  // handleCancelView(): void{
  //   this.showContact = false
  // }

  EditContacts(data: ContactDTO) {
    this.modalTitle = "Edit Contact";
    this.isVisible = true;
    this.showContact = false;
    this.contactObserverSubject.next(data);
  }

  DeleteContacts(data: ContactDTO) {
    this.alert.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._contactService.deleteContact(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._contactService.getContacts();
            this.alert.success(res.message)
            this.showContact = false;
          }
          else
            this.alert.error(res.message)
        });
      } else {
        return
      }
    })
  }

  showSingleContacts(data: ContactDTO) {
    // let id = data.id;
    this.contact = data;
    this.showContact = true;
    //     if (id) {
    //   this.router.navigate(['contacts/contact'], { state: { contactId: id } })
    // }
  }

  createClientAccount(data) {
    this.alert.confirm("Are you sure?", `You want create ${data.name}'s account?`).then(async result => {
      if (result.isConfirmed) {
        this._contactService.createAccount(data).subscribe(res => {
          if (res.isSuccessfull) {
            this.alert.success("Account Created Successfully! Verification email sent to client's Email address.");
            this._contactService.getContacts();
          } else {
            this.alert.error("Error Occurred while creating account");
          }
        })
      } else {
        return
      }
    })
  }

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

  resetFilters(): void {
    // this.search = "";
    // this.listData = JSON.parse(this.listDataCopy);
    this.filterMessage = null;
    this.listOfColumns = this.createTableColumnHeaders(this.typeFilter);
  }
}