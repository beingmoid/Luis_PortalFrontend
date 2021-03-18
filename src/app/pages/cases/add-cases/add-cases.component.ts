import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { CaseDTO } from 'src/app/models/caseDTO';
import { CaseUserDTO } from 'src/app/models/caseUserDTO';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { TeamMemberDTO } from 'src/app/models/TeamMemberDTO';
import { UserDTO } from 'src/app/models/userDTO';
import { AppDateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { HomeService } from 'src/app/services/APIServices/home.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { UserService } from 'src/app/services/APIServices/user.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-cases',
  templateUrl: './add-cases.component.html',
  styleUrls: ['./add-cases.component.scss'],
  providers: [AppDateFormatPipe]
})
export class AddCasesComponent implements OnInit, OnDestroy {

  @Input() caseDataSub?: Subject<CaseDTO>;

  // Image
  loading = false;
  avatarUrl?: string;
  user: UserDTO;
  form: FormGroup
  contactClientData: ContactDTO[] = [];
  teamMembers: Observable<TeamMemberDTO[]> = new Observable(null)
  contactTeamMemberData: ContactDTO[] = [];
  countryToImmigrate: LookUpDTO[] = [];
  countryData: LookUpDTO[] = [];
  caseStartedBy: string;
  caseTypes: LookUpDTO[] = [];
  caseStatuses: LookUpDTO[] = [];
  caseUserDetail: CaseUserDTO = new CaseUserDTO();

  caseSubject: Subscription;
  contactSubject: Subscription;
  countrySubject: Subscription;
  caseTypeSubject: Subscription;
  caseStatusSubject: Subscription;
  resetFormSubject: Subscription;
  caseUserDetailsSubject: Subscription;

  states: LookUpDTO[] = [];
  cities: LookUpDTO[] = [];

  isEditMode: boolean = false;
  editableCaseId: number = 0;
  minDate = new Date();

  clientId: number
  caseId: number;

  constructor(
    private fb: FormBuilder,
    private _contactService: ContactsService,
    private _authService: AuthService,
    private _caseService: CaseService,
    private _lookUpService: LookupService,
    private _notification: AlertService,
    private _lookupService: LookupService,
    private _router: Router,
    private _sharedService: SharedService,
    private _homeService: HomeService,
    private _userService: UserService,
    private _appDateFormat: AppDateFormatPipe
  ) {

    this.initializeForm(fb);

    this._sharedService.restForm.subscribe(x => {
      this.form.reset();
    });
  }

  private initializeForm(fb: FormBuilder) {
    this.form = fb.group({
      id: [0],
      caseNumber: ['', [Validators.required , Validators.maxLength(18)]],
      contactClientId: ['', [Validators.required]],
      caseTypeId: ['', [Validators.required]],
      countryToImmigrateId: ['', Validators.required],
      teamMemberId: ['', [Validators.required]],
      caseStartedBy: ['', Validators.required],
      caseReferredBy: ['', Validators.required],
      currentLocationId: ['', [Validators.required]],
      statusId: ['', [Validators.required]],
      caseDeadLineDate: ['', [Validators.required]],
      caseOpenDate: ['', [Validators.required]],
      description: ['', [Validators.required]],


      // Additional Information
      caseAdditionalInformation: fb.group({
        id: [0],
        contactInfo: [''],
        cityLocationId: [''],
        provinceId: ['', { updateOn: 'change' }],
        countryOfResidenceId: ['', { updateOn: 'change' }],
        dateOfBirth: [''],
        countryOfCitizenshipId: [''],
        maritalStatusId: [''],
        isSpouseAccompanyingCanada: [false],
        isSpouseCanadianPR: [false],
      }),

      // Immigration History
      caseImmigrationHistory: fb.group({
        id: [0],
        isRefusedApplication: [false],
        isArrested: [false],
        isAppliedForCanad: [false],
        anyFurtherInfo: [''],
      }),

      // School Details
      caseSchoolDetails: fb.group({
        id: [0],
        nameOfSchool: [''],
        preferredCourseId: [''],
        preferredCountryId: ['', { updateOn: 'change' }],
        preferredProvinceId: [''],
        targetStartDate: [''],
        maxTutionBudget: ['', { updateOn: 'change' }],
      }),

      // Educational History
      caseEducationalHistories: fb.array([
        fb.group({
          id: [0],
          nameOfSchool: [''],
          courseName: [''],
          startDate: [''],
          endDate: [''],
        })
      ]),

      // Language Exam
      caseLanguageExams: fb.array([
        fb.group({
          id: [0],
          isTakenExam: [false],
          languageId: [null],
          issueDate: [''],
          ieltsExamId: [null],
          speakingScore: [0, Validators.min(0)], // num
          listeningScore: [0, Validators.min(0)], // num
          readingScore: [0, Validators.min(0)], // num
          writingScore: [0, Validators.min(0)], // num
          isOtherLanguageResult: [false],
        })
      ]),

      // Employment History
      caseEmploymentHistories: fb.array([
        fb.group({
          id: [0],
          employerName: [''],
          jobTitle: [''],
          startDate: ['', {updateOn: 'change'}],
          endDate: ['', {updateOn: 'change'}],
        })
      ]),

      // Passport Details
      casePassportDetail: fb.group({
        id: [0],
        passportNumber: ['', { updateOn: 'change', validators: [Validators.pattern(/^\d+$/)] }],
        countryOfIssueId: [''],
        issueDate: ['', { updateOn: 'change' }],
        expiryDate: ['', { updateOn: 'change' }],
        identityCardNo: ['', { updateOn: 'change', validators: [Validators.pattern(/^\d+$/)] }],
        isUSGreenCard: [false],
      }),

      // Dependents
      caseDependent: fb.group({
        id: [0],
        isHavingDependents: [false],
        howManyDependents: [''],
      }),

      //Primary Parent Details
      casePrimaryParentDetail: fb.group({
        id: [0],
        fatherName: [''],
        fatherResidentialAddress: [''],
        fatherDOB: [''],
        fatherOccupation: [''],
        motherName: [''],
        motherResidentialAddress: [''],
        motherDOB: [''],
        motherOccupation: [''],
      }),

      // Spouse Parent Detailsw
      caseSpouseParentDetail: fb.group({
        id: [0],
        fatherName: [''],
        fatherResidentialAddress: [''],
        fatherDOB: [''],
        fatherOccupation: [''],
        motherName: [''],
        motherResidentialAddress: [''],
        motherDOB: [''],
        motherOccupation: [''],
      }),

      // Sibling Details
      caseSiblings: fb.array([
        fb.group({
          id: [0],
          name: [''],
          occupation: [''],
          dob: [''],
          residentialAddress: [''],
        })
      ]),

      // Applicant Declaration
      caseApplicantDeclaration: fb.group({
        id: [0],
        isCriminalProceeding: [false],
        isUsedArmedStruggle: [false],
        isPreviouslyApplied: [false],
        isAssociatedWithGroup: [false],
        isBeenRefused: [false],
        isMemberOfCriminalOrg: [false],
        isRefusedAdmission: [false],
        isDetained: [false],
        isInvolvedInWarCrime: [false],
        isMental: [false],
      }),

      // Work in Canada
      caseWorkInCanada: fb.group({
        id: [0],
        isHavingOffer: [false],
        isCurrentlyWorkinInCanada: [false],
      }),

      // Finances
      caseFinance: fb.group({
        id: [0],
        amountAvailable: ['', Validators.pattern(/^\d+$/)]},
        { updateOn: 'change' }),

      // Travel History
      caseTravelHistories: fb.array([
        fb.group({
          id: [0],
          destinationCountryId: ['', { updateOn: 'change' }],
          destinationStateId: ['', { updateOn: 'change' }],
          destinationCityId: [''],
          purposeOfTravel: [''],
          from: [''],
          to: [''],
          durationOfStay: [''],
        })
      ]),

      // Emergency Contact
      caseEmergencyContact: fb.group({
        id: [0],
        name: [''],
        relationshipId: [''],
        phone: [''],
        email: ['', Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      }),

      sendUpdateToCustomer: [false],
    }, { updateOn: 'submit' });
  }

  get f() { return this.form.controls }

  ngOnInit(): void {



    this._sharedService.restForm.subscribe(res => {
      this.isEditMode = false;
      // this.form.reset();
    });

    this.subscriptions();

    this._authService.user.subscribe(res => {
      if (res) {

        this.user = res;
        // this.name = res.firstName + " " + res.lastName
        // this.email = res.email
        // this.form.controls["caseStartedBy"].setValue(this._authService.userValue.firstName + " " + this._authService.userValue.lastName);
        this.form.controls["caseStartedBy"].setValue(res.firstName + " " + res.lastName);
        this.form.controls["caseOpenDate"].setValue(new Date());
      }
    });

    this.initializeData();
  }

  openDateChange(item){
    var caseDeadlineDate = this.form.controls.caseDeadLineDate['_pendingValue'];
    var caseOpenDate = this.form.controls.caseOpenDate['_pendingValue'];
    if(caseDeadlineDate < caseOpenDate){
      this.minDate = new Date(item)
      this.form.controls.caseDeadLineDate.setValue(new Date(item))
    }
    else{
      this.minDate = new Date();
    }
  }


  subscriptions() {

    this.caseUserDetailsSubject = this._caseService.caseUserDetailObserver$.subscribe(res => {
      if (res) {

        this.caseUserDetail = res;
      }
    })

    // In Edit
    if (this.caseDataSub) {

      this.caseDataSub.subscribe(res => {
        if (res) {
          this.editableCaseId = res.id;
          this.isEditMode = true;
          this._caseService.getById(this.editableCaseId)
          this._caseService.getCaseUserDetails(this.editableCaseId);
          this.caseSubject = this._caseService.caseObserver$.subscribe(res => {
            if (res) {
              this.setLocalDates(res);
              // Is Edit Mode
              // console.log(res);
              this.form.patchValue(res);
              // console.log("Form", this.form);
              this._caseService.updateCaseChildsSubject$.next(this.form);
            }
          });
        }
        else {
          // this.form.reset();
        }
      });
    }

    this.resetFormSubject = this._caseService.resetCaseForm.subscribe(res => {
      // this.form.patchValue(new CaseDTO())
      if (res) {
        this.isEditMode = false;
        this.form.reset();
        this.initializeForm(this.fb);
        if (this.user) {
          this.form.controls["caseStartedBy"].setValue(this.user.firstName + " " + this.user.lastName);
          this.form.controls["caseOpenDate"].setValue(new Date());
        }
      } else {
        this.caseSubject = this._caseService.caseObserver$.subscribe(res => {
          if (res) {
            this.setLocalDates(res);
            // Is Edit Mode
            // console.log(res);
            this.form.patchValue(res);
            // console.log("Form", this.form);
            this._caseService.updateCaseChildsSubject$.next(this.form);
          }
        });
        // let caseId: number = history.state.caseId;
        // if (caseId && caseId !== 0) {
        //   this.isEditMode = true;
        //   this.editableCaseId = caseId;
        //   this._caseService.getById(this.editableCaseId)
        // }
      }
    })

    this.contactSubject = this._contactService.contactObserver$.subscribe(res => {
      if (res) {
        this.contactClientData = res.filter(x => x.contactTypeName == "Client");
        this.contactTeamMemberData = res.filter(x => x.contactTypeName == "Team Member");
      }
    });

    this.teamMembers = this._userService.teamMembersObserver$

    this.countrySubject = this._lookUpService.countryObserver$.subscribe(res => {
      if (res) {
        this.countryToImmigrate = res.filter(x => x.key == 39);
        this.countryData = res;
      }
    });

    this.caseTypeSubject = this._caseService.caseTypeObserver$.subscribe(res => {
      if (res)
        this.caseTypes = res;
    });

    this.caseStatusSubject = this._lookupService.caseStatusObserver$.subscribe(res => {
      this.caseStatuses = res;
    });

  }

  private setLocalDates(res: CaseDTO) {
    res.createdDate = this._appDateFormat.transformForPatching(res.createdDate);
    res.caseDeadLineDate = this._appDateFormat.transformForPatching(res.caseDeadLineDate);
    res.caseOpenDate = this._appDateFormat.transformForPatching(res.caseOpenDate);
    res.caseAdditionalInformation.dateOfBirth = this._appDateFormat.transformForPatching(res.caseAdditionalInformation.dateOfBirth);
    res.caseSchoolDetails.targetStartDate = this._appDateFormat.transformForPatching(res.caseSchoolDetails.targetStartDate);
    res.casePassportDetail.issueDate = this._appDateFormat.transformForPatching(res.casePassportDetail.issueDate);
    res.casePassportDetail.expiryDate = this._appDateFormat.transformForPatching(res.casePassportDetail.expiryDate);

    res.casePrimaryParentDetail.fatherDOB = this._appDateFormat.transformForPatching(res.casePrimaryParentDetail.fatherDOB);
    res.casePrimaryParentDetail.motherDOB = this._appDateFormat.transformForPatching(res.casePrimaryParentDetail.motherDOB);

    res.caseSpouseParentDetail.fatherDOB = this._appDateFormat.transformForPatching(res.caseSpouseParentDetail.fatherDOB);
    res.caseSpouseParentDetail.motherDOB = this._appDateFormat.transformForPatching(res.caseSpouseParentDetail.motherDOB);

    res.caseEducationalHistories.forEach(element => {
      element.startDate = this._appDateFormat.transformForPatching(element.startDate);
      element.endDate = this._appDateFormat.transformForPatching(element.endDate);
    });
    res.caseEmploymentHistories.forEach(element => {
      element.startDate = this._appDateFormat.transformForPatching(element.startDate);
      element.endDate = this._appDateFormat.transformForPatching(element.endDate);
    });
    res.caseSiblings.forEach(element => {
      element.dob = this._appDateFormat.transformForPatching(element.dob);
    });
    res.caseTravelHistories.forEach(element => {
      element.from = this._appDateFormat.transformForPatching(element.from);
      element.to = this._appDateFormat.transformForPatching(element.to);
    });
  }

  initializeData() {
    if (this.isEditMode) {
      if (!this._caseService.caseUserDetail)
        this._caseService.getCaseUserDetails(this.editableCaseId);
    }

    if (!this._contactService.contacts)
      this._contactService.getContacts();


    if (!this._lookUpService.Countries)
      this._lookUpService.getCountries();

    if (!this._lookUpService.courses)
      this._lookUpService.getCourses();

    if (!this._caseService.caseTypes)
      this._caseService.getCaseTypes();

    if (!this._lookupService.maritalStatuses)
      this._lookupService.getMaritalStatuses();

    if (!this._lookupService.relationships)
      this._lookUpService.getRelationShips();

    if (!this._lookupService.languages)
      this._lookUpService.getLanguages();

    if (!this._lookupService.ieltsExams)
      this._lookUpService.getIeltsExams();

    if (!this._lookupService.statuses)
      this._lookUpService.getStatuses();

    this._userService.GetUsersForCurrentTenant()

  }

  ngOnDestroy() {
    if (this.caseSubject)
      this.caseSubject.unsubscribe();
    if (this.resetFormSubject)
      this.resetFormSubject.unsubscribe();
    if (this.contactSubject)
      this.contactSubject.unsubscribe();
    if (this.countrySubject)
      this.countrySubject.unsubscribe();
    if (this.caseTypeSubject)
      this.caseTypeSubject.unsubscribe();
    if (this.caseStatusSubject)
      this.caseStatusSubject.unsubscribe();
  }

  handleSubmit(formDirective: FormGroupDirective): void {
    
    let data = this.form.value;
    if (this.form.valid) {
      if (this.isEditMode) {
        this._caseService.editCase(this.form.value).subscribe(res => {
        
          if (res.isSuccessfull) {
            this.clientId = this.form.value['contactClientId']
            this._caseService.getRelatedCasesByClient(this.form.value.id);

            formDirective.resetForm();
            this._notification.success("Case Updated Successfully");
            this._sharedService.formSubmited.next();
            // this._router.navigate(['/cases']);
            this._caseService.getById(this.editableCaseId);
            this._router.navigate(['/cases/case'] , { queryParams: {caseId: this.editableCaseId } });

          } else {
            this._notification.error("Error while updating case");
          }
        });
      }
      else {
        data.id = 0;
        data.caseAdditionalInformation.id = 0; 0
        data.caseImmigrationHistory.id = 0;
        data.caseSchoolDetails.id = 0;
        data.caseEducationalHistories.forEach(element => {
          element.id = 0;
        });
        data.caseLanguageExams.forEach(element => {
          element.id = 0;
        });
        data.caseEmploymentHistories.forEach(element => {
          element.id = 0;
        });
        data.casePassportDetail.id = 0;
        data.caseDependent.id = 0;
        data.casePrimaryParentDetail.id = 0;
        data.caseSpouseParentDetail.id = 0;
        data.caseSiblings.forEach(element => {
          element.id = 0;
        });
        data.caseApplicantDeclaration.id = 0;
        data.caseWorkInCanada.id = 0;
        data.caseFinance.id = 0;
        data.caseTravelHistories.forEach(element => {
          element.id = 0;
        });
        data.caseEmergencyContact.id = 0;

        this._caseService.saveCase(data).subscribe(res => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._notification.success("Case Saved Successfully");
            this.form.reset();
            this._sharedService.formSubmited.next();
            // this._router.navigate(['/cases']);
            this._homeService.getHomeData();
          } else {
            this._notification.error("Error while adding case");
          }
        })
      }

    } else {
      this._notification.error("Please fill the required fields");
    }
  }

  // Image Functions start
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this._notification.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this._notification.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this._notification.error('Network error');
        this.loading = false;
        break;
    }
  }
  // end image
}
