import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { TeamMemberDTO } from 'src/app/models/TeamMemberDTO';
import { AlertService } from 'src/app/services/alert.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { RoleService } from 'src/app/services/APIServices/role.service';
import { TeamMemberService } from 'src/app/services/APIServices/team-member.service';
import { UserService } from 'src/app/services/APIServices/user.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-team-member',
  templateUrl: './add-team-member.component.html',
  styleUrls: ['./add-team-member.component.scss']
})
export class AddTeamMemberComponent implements OnInit {

  form: FormGroup
  imageUploadURL: string = ''
  avatarUrl?: string | ArrayBuffer;
  isEditMode: boolean = false;
  loading = false;
  roles: any;
  data: TeamMemberDTO
  countries: LookUpDTO[] = []
  states: LookUpDTO[] = []
  cities: LookUpDTO[] = []
  jobTitles: any[] = []
  compensationTypes: any[] = []
  currencyTypes: any[] = []
  compensationAmounts: any[] = [];
  file: any;
  buttonLoading: boolean = false;
  tzNames: string[] = [];
  selectedTimeZone = 'UCT (GMT+00:00)'
  currentEmail: string

  @Input() teamMemberDataSub: Subject<TeamMemberDTO>;

  constructor(
    private alert: AlertService,
    private lookupService: LookupService,
    private fb: FormBuilder,
    private teamMemberService: TeamMemberService,
    private roleService: RoleService,
    private usersService: UserService,
    private _authService: AuthService,
    private _sharedService: SharedService
  ) {
    this.generateForm();
    this._sharedService.restForm.subscribe(x => {
      this.form.reset();
    });
  }

  generateForm() {
    this.form = this.fb.group({
      id: [""],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, { updateOn: 'blur' , validators: [Validators.required,
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]}],
      timeZone: [null],
      role: [null, Validators.required],
      jobTitleId: [null],

      address: [null],
      countryId: [null, { updateOn: 'change' }],
      stateId: [null, { updateOn: 'change' }],
      cityId: [null],
      phoneNumber: [null],
      secondaryPhoneNumber: [null],

      compensationTypeId: [null],
      currencyTypeId: [null],
      compensationAmountId: [null],
      memberStatus: [true],
    }, { updateOn: 'submit' })
  }

  get f() { return this.form.controls }
  get emailControl() { return this.form.controls["email"] }

  ngOnInit(): void {

    if (this.teamMemberDataSub) {
      this.teamMemberDataSub.subscribe(res => {
        if (res) {
          this.form.patchValue(res);
          this.avatarUrl = res.blobURI;
          this.isEditMode = true;
          this.currentEmail = res.email
          this.countryChange();
        }

        else {
          this.isEditMode = false;
          this.avatarUrl = null;
          this.generateForm();
        }
      });
    }

    this.lookupService.timeZoneObserver$.subscribe(res => {
      if (res) {
        this.tzNames = res;
      }
    })

    this.lookupService.countryObserver$.subscribe(res => {
      if (res)
        this.countries = res
    })
    this.lookupService.getCountries()

    // Get Job title
    this.lookupService.getJobTitle()
    this.lookupService.jobTitleObserver$.subscribe(data => {
      this.jobTitles = data
    })

    // Get Compensation Type
    this.lookupService.getCompensationType()
    this.lookupService.compensationTypeObserver$.subscribe(data => {
      this.compensationTypes = data
    })

    // Get Currency Type
    this.lookupService.getCurrencyType()
    this.lookupService.currencyTypeObserver$.subscribe(data => {
      this.currencyTypes = data
    })

    // Get Compensation Amount
    this.lookupService.getCompensationAmount()
    this.lookupService.compensationAmountObserver$.subscribe(data => {
      this.compensationAmounts = data
    })

    this.roleService.roleListObserver$.subscribe(res => {
      if (res) {
        this.roles = res;
      }
    });
    this.roleService.GetAllRoles();

    // this.emailControl.valueChanges.subscribe(email => {

    // })
  }


  countryChange() {
    if (this.form.controls["countryId"].value != null && this.form.controls["countryId"].value != undefined) {
      this.lookupService.getStates(this.form.controls["countryId"].value).subscribe(res => {
        this.states = res.dynamicResult;
      });
      if (this.isEditMode) {
        this.stateChange();
      }
    }
  }

  stateChange() {
    if (this.form.controls["stateId"].value != null && this.form.controls["stateId"].value != undefined) {
      this.lookupService.getCities(this.form.controls["stateId"].value).subscribe(res => {
        this.cities = res.dynamicResult;
      });
    }
  }

  checkEmail() {
    let email = this.emailControl.value;
    if (email !== null && email !== "" && this.currentEmail !== email) {
      this._authService.CheckEmail(email).subscribe(res => {
        if (!res.isSuccessfull)
          this.emailControl.setErrors({ 'found': 'Email already exists' })
      });
    }
  }

  beforeUpload = (file: File): boolean => {
    this.file = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.avatarUrl = reader.result;
    };
    return false;
  };

  onSubmit(formDirective: FormGroupDirective) {
    if (!this.form.valid)
      return;

    this.buttonLoading = true
    var document = new TeamMemberDTO;
    document = this.form.value as TeamMemberDTO;
    document.timeZone = this.selectedTimeZone
    document.jobTitleId = document.jobTitleId ? document.jobTitleId : 0
    document.compensationTypeId = document.compensationTypeId ? document.compensationTypeId : 0
    document.currencyTypeId = document.currencyTypeId ? document.currencyTypeId : 0
    document.compensationAmountId = document.compensationAmountId ? document.compensationAmountId : 0

    let email = this.emailControl.value;
    if (email !== null && email !== "" && this.currentEmail !== email) {
      this._authService.CheckEmail(email).subscribe(res => {
        this.buttonLoading = false
        if (!res.isSuccessfull) {
          this.emailControl.setErrors({ 'found': 'Email already exists' })

        }
        else {
          this.sendData(formDirective, document);
        }
      });
    } else {
      this.buttonLoading = false
      this.sendData(formDirective, document);
    }
  }

  sendData(formDirective, document) {
    this.teamMemberService.UploadTeamMember(this.file, document).subscribe(res => {
      this.buttonLoading = false
      if (res.isSuccessfull) {
        this.usersService.GetUsersForCurrentTenant();
        formDirective.resetForm()
        this.avatarUrl = null;
        if (!this.isEditMode) {
          this.alert.success('Team member Added Successfully!');
          this._sharedService.formSubmited.next();
        }
        else {
          this.alert.success('Team member Updated Successfully!');
        }
      }
      else
        if (!this.isEditMode) {
          this.alert.error('Error while uploading team member!');
          this._sharedService.formSubmited.next();
        }
        else {
          this.alert.error('Error while updating team member!');
        }
    })
  }
}
