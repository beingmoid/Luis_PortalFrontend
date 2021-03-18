import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CaseDTO } from 'src/app/models/caseDTO';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { EventsDTO } from 'src/app/models/eventsDTO';
import { ImmigrationDTO } from 'src/app/models/immigrationDTO';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { HomeService } from 'src/app/services/APIServices/home.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { 

  isVisibleContact: boolean = false;
  contactObserverSubject: Subject<ContactDTO> = new Subject();
  modalTitle: string = "";
  profileCompletion: number;
  showProfileBanner: boolean = false;
  isVisibleCase: boolean = false;
  isVisibleEvent: boolean = false;
  isVisibleTask: boolean = false;
  isVisibleTeamMember: boolean = false;
  mostRecentCases: CaseDTO[] = [];
  casesApprocDeadlines: CaseDTO[] = [];
  casesToBeInvoiced: CaseDTO[] = [];
  mostRecentContact: ContactDTO[] = [];
  upcomingEvents: EventsDTO[] = [];
  caseSubject: Subscription;
  upcomingEventCount: number = 0;
  newAddedCasesCount: number = 0;
  casesApprocDeadlineCount: number = 0;
  casesToBeInvoicedCount: number = 0;

  news: ImmigrationDTO[] = []

  canViewTask: boolean = true;
  canViewContact: boolean = true;
  canViewEvent: boolean = true;
  canViewCase: boolean = true;
  canViewTeam: boolean = true;

  canCreateTask: boolean = true;
  canCreateContact: boolean = true;
  canCreateEvent: boolean = true;
  canCreateCase: boolean = true;
  canCreateTeam: boolean = true;

  constructor(private _authService: AuthService, private _sharedService: SharedService,
    private _contactService: ContactsService, private _caseService: CaseService, private _homeService: HomeService,
    public _permissionService: PermissionService) {

    // this._caseService.recentcaseListObserver$.subscribe(res => {
    //   if (res) {
    //     this.mostRecentCases = res;
    //   }
    // });

    // this._contactService.recentcontactObserver$.subscribe(res => {
    //   if (res) {
    //     this.mostRecentContact = res;
    //   }
    // });

    _sharedService.formSubmited.subscribe(x => {
      this.handleCancelPopUp();
    });

  }

  ngOnInit(): void {
    this._authService.user.subscribe(res => {
      if (res) {
        this.profileCompletion = res.profileCompletion;
        if (this.profileCompletion == 100) {
          this.showProfileBanner = false;
        } else {
          this.showProfileBanner = true;
        }
      }
    });

    if (this._permissionService.getRole() !== 'CompanyAdmin' && this._permissionService.getRole() !== 'Client') {
      let data = this._permissionService.getHomePermissions();
      this.canViewTask = data.task.canView;
      this.canCreateTask = data.task.canCreate;

      this.canViewEvent = data.event.canView;
      this.canCreateEvent = data.event.canCreate;

      this.canViewContact = data.contact.canView;
      this.canCreateContact = data.contact.canCreate;

      this.canViewCase = data.case.canView;
      this.canCreateCase = data.case.canCreate;

      this.canViewTeam = data.team.canView;
      this.canCreateTeam = data.team.canCreate;
    }

    this._homeService.homeDataObserver$.subscribe(res => {
      if (res) {
        this.mostRecentContact = !this.canViewContact ? [] : res.recentModifiedContacts;
        this.mostRecentCases = !this.canViewCase ? [] : res.recentlyModifiedCases;
        this.upcomingEvents = !this.canViewEvent ? [] : res.upcomingEvents;
        this.casesApprocDeadlines = !this.canViewCase ? [] : res.casesApproachingDeadlines;
        this.casesToBeInvoiced = !this.canViewCase ? [] : res.casesToBeInvoiced;

        this.upcomingEventCount = !this.canViewEvent ? 0 : res.upcomingEventsCount;
        this.newAddedCasesCount = !this.canViewCase ? 0 : res.newAddedCasesCount;
        this.casesApprocDeadlineCount = !this.canViewCase ? 0 : res.casesApproachingDeadlineCount;
        this.casesToBeInvoicedCount = !this.canViewCase ? 0 : res.casesToBeInvoicedCount;
        this.news = res.immigrationNews;
      }
    });

    // if (!this._homeService.homeData)
    this._homeService.getHomeData();

    // this.getMostRecentCases();
    // this.getMostRecentContacts();

  }

  ngOnDestroy() {
    if (this.caseSubject) this.caseSubject.unsubscribe();
  }

  handleCancelPopUp() {

    this.isVisibleContact = false;
    this.isVisibleCase = false;
    this.isVisibleTeamMember = false;
    this.isVisibleTask = false;
    this.isVisibleEvent = false;
    this._sharedService.restForm.next();
  }

  getMostRecentCases() {


    this._caseService.getrecentCases();

  }
  getMostRecentContacts() {
    this._contactService.getrecentcontacts();
  }
  ///////Managing PpopUps

  showAddCase() {

    this.isVisibleCase = true;
    this.modalTitle = "Add Case";
  }
  showAddEvent() {
    this.isVisibleEvent = true;
    this.modalTitle = "Add Event"
  }
  showAddContact() {
    this.isVisibleContact = true;
    this.modalTitle = "Add Contact";
  }
  showAddTeamMember() {
    this.isVisibleTeamMember = true;
    this.modalTitle = "Add Team Members"
  }
  showAddTask() {
    this.isVisibleTask = true;
    this.modalTitle = "Add Task"
  }


  ///////PpopUps Ends


}
