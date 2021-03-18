import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { ResetPasswordDTO } from 'src/app/models/resetPasswordDTO';
import { UserAccountingSettingsDTO } from 'src/app/models/UserAccountingSettingsDTO';
import { UserCompanyDTO } from 'src/app/models/userCompanyDTO';
import { UserCompanySettingsDTO } from 'src/app/models/userCompanySettingsDTO';
import { UserPersonalSettingsDTO } from 'src/app/models/userPersonalSettingsDTO';
import { AlertService } from 'src/app/services/alert.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { UserService } from 'src/app/services/APIServices/user.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  form: FormGroup
  passwordForm: FormGroup
  profileForm: FormGroup
  settingForm: FormGroup
  infoForm: FormGroup
  accountingForm: FormGroup
  profileCompletion: number;
  avatarUrl: any
  companyAvatarUrl: any
  file: any;
  companyFile: any;
  jobTitles: LookUpDTO[] = []
  currencyTypes: LookUpDTO[] = []
  languages: LookUpDTO[] = []
  countries: LookUpDTO[] = []
  states: LookUpDTO[] = []
  cities: LookUpDTO[] = []
  taxJurisdictions: LookUpDTO[] = []
  membershipTypes: LookUpDTO[] = []
  businessStructures: LookUpDTO[] = []
  tzNames: string[] = [];

  selectedTimeZone = 'UCT (GMT+00:00)'
  isCurrentPasswordChanged: boolean = false
  loading: boolean = false
  currentEmail: string
  isHasPermission: boolean = false
  userRole: any;

  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private lookupService: LookupService,
    private _authService: AuthService,
    private _userService: UserService,
    private _permissionService: PermissionService,
    private _router: Router,
  ) {
    // Password Form
    this.passwordForm = fb.group({
      id: [0],
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.min(8), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()_-])[A-Za-z\d$@$!%*?&#^()_-].{6,}")]],
      confirmPassword: [null, [Validators.required, Validators.min(8), Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()_-])[A-Za-z\d$@$!%*?&#^()_-].{6,}")]],
      enableTwoStepVerification: [false],
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });

    // Personal Setings Form 
    this.profileForm = fb.group({
      id: [0],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      jobTitleId: [null],
      email: [null, Validators.required],
      phoneNo: [null],
      timeZone: [null],
      recieveProductEmails: [false],
      recieveNotifications: [false],

    }, { updateOn: 'submit' })
    // })

    // Company Settings Form
    this.settingForm = fb.group({
      id: [0],
      currencyId: [null],
      languageId: [null],
      caseAutoNumbering: [true],
      contactAutoNumbering: [true]
    }, { updateOn: 'submit' })

    // Company Info Form
    this.infoForm = fb.group({
      id: [0],
      companyOwner: [null],
      legalBusinessName: [null],
      countryId: [null, {updateOn: 'change'}],
      provinceId: [null, {updateOn: 'change'}],
      cityId: [null],
      zipCode: [null, [Validators.maxLength(5)]],
      phoneNo: [null],
      companyEmail: [null],
      website: [null, [Validators.pattern(/^(https?:\/\/)*[a-z0-9-]+(\.[a-z0-9-]+)+(\/[a-z0-9-]+)*\/?$/)]],
      licenseNo: [null],
      taxId: [null],

      ownerName: [null],
      ownerCountryId: [null],
      ownerPhoneNo: [null],
      primaryOwnerEmail: [null],
      ownerMembershipTypeId: [null],
      businessStructureId: [null],
      ownerLicenseNo: [null],
    }, { updateOn: 'submit' })

    this.accountingForm = fb.group({
      chargeSalesTax: [false],
      taxJurisdictionId: [null],
      defaultTaxCode: [null],
      percentage: [null, [Validators.max(100), Validators.maxLength(5), Validators.pattern(/^(?:\d*\.\d{1,2}|\d+)$/)]]}, 
      { updateOn: 'submit' })
  }

  get pf() { return this.passwordForm.controls }
  get prof() { return this.profileForm.controls }
  get info() { return this.infoForm.controls }
  get acc() { return this.accountingForm.controls }

  ngOnInit(): void {
    this.isHasPermission = this._permissionService.canView;
    this.userRole = this._permissionService.getRole()
    // if (!this._permissionService.canView) {
    //   this._router.navigate(['/home'])
    // }

    this._authService.user.subscribe(res => {
      if (res) {
        this.profileCompletion = res.profileCompletion;
      }
    });

    this._userService.userPersonalSettingsObserver$.subscribe(res => {
      if (res) {
        this.avatarUrl = res.imageURL
        this.currentEmail = res.email
        this.profileForm.patchValue(res);
      }
    })

    this._userService.userCompanySettingsObserver$.subscribe(res => {
      if (res) {
        this.settingForm.patchValue(res);
      }
    })

    this._userService.userAccountingSettingsObserver$.subscribe(res => {
      if (res) {
        this.accountingForm.patchValue(res);
      }
    })

    this._userService.userCompanyObserver$.subscribe(res => {
      if (res) {
        this.companyAvatarUrl = res.blobImageURI;
        this.infoForm.patchValue(res);
      }
    })

    // Get Job title
    this.lookupService.getJobTitle()
    this.lookupService.jobTitleObserver$.subscribe(data => {
      this.jobTitles = data
    })

    // Get Time zones
    this.lookupService.timeZoneObserver$.subscribe(res => {
      if (res) {
        this.tzNames = res;
      }
    })

    // Get Business Structures
    this.lookupService.getBusinessStructures();
    this.lookupService.businessStructureObserver$.subscribe(res => {
      if (res) {
        this.businessStructures = res;
      }
    })

    // Get Membership Types
    this.lookupService.getMembershipTypes();
    this.lookupService.membershipTypeObserver$.subscribe(res => {
      if (res) {
        this.membershipTypes = res;
      }
    })

    // Get Currency Type
    this.lookupService.getCurrencyType()
    this.lookupService.currencyTypeObserver$.subscribe(data => {
      this.currencyTypes = data
    })

    // Get languages
    this.lookupService.getLanguages()
    this.lookupService.languagesObserver$.subscribe(res => {
      this.languages = res;
    });

    // Get Tax Jurisdictions
    this.lookupService.getTaxJurisdictions()
    this.lookupService.taxJurisdictionObserver$.subscribe(res => {
      this.taxJurisdictions = res;
    });

    // Get Countries
    this.lookupService.getCountries()
    this.lookupService.countryObserver$.subscribe(res => {
      this.countries = res;
    });

    this.info.countryId.valueChanges.subscribe(val => {
      if (val !== null) {
        this.lookupService.getStates(val).subscribe(res => {
          this.states = res.dynamicResult
        })
      }
    })

    this.info['provinceId'].valueChanges.subscribe(val => {
      if (val !== null) {
        this.lookupService.getCities(val).subscribe(res => {
          this.cities = res.dynamicResult
        })
      }
    })

    // if (!this._userService.userPersonalSetting)
    this._userService.getUserPersonalSettings()

    if (!this._userService.userCompanySettings)
      this._userService.getCompanySettings()

    if (!this._userService.userAccountingSettings)
      this._userService.getAccountingSettings()

    if (!this._userService.userCompany)
      this._userService.getUserCompany()

  }


  countryChange(val) {
    if (val !== null) {
      this.lookupService.getStates(val).subscribe(res => {
        this.states = res.dynamicResult
      })
    }
  }
  provinceChange(val) {
    if (val !== null) {
      this.lookupService.getCities(val).subscribe(res => {
        this.cities = res.dynamicResult
      })
    }
  }

  // Personal Settings
  submitPersonalSettings(form: FormGroupDirective) {
    this.profileForm.updateValueAndValidity()
    if (this.profileForm.valid) {
      let data = this.profileForm.value as UserPersonalSettingsDTO;

      data.timeZone = this.selectedTimeZone;
      if (data.email === this.currentEmail) {
        this.updatePersonalSettings(data)
      } else {
        this._authService.CheckEmail(data.email).subscribe(res => {
          if (!res.isSuccessfull) {
            this.profileForm.get('email').setErrors({ 'found': 'Email already exists' })
          } else {
            this.updatePersonalSettings(data)
          }
        });
      }
    } else {
      return
    }
  }

  updatePersonalSettings(data: UserPersonalSettingsDTO) {
    if (!data.jobTitleId)
      data.jobTitleId = 0;
    for (let [key, value] of Object.entries(data)) {
      let newValue = (value) || value == '' ? value : ''
      data[key] = newValue
    }
    this._userService.updateUserPersonalSettings(this.file, data).subscribe(res => {
      if (res.isSuccessfull) {
        this._authService.currentAccount();
        this._userService.getUserPersonalSettings();
        this._notification.success("Settings updated successfully")
      } else {
        this._notification.error("Error Updating Personal Settings")
      }
    });
  }

  // Company Settings
  submitCompanySettings(form: FormGroupDirective) {
    if (this.settingForm.valid) {
      let data = this.settingForm.value as UserCompanySettingsDTO;

      this._userService.updateUserCompanySettings(data).subscribe(res => {
        if (res.isSuccessfull) {
          this._authService.currentAccount();
          this._userService.getCompanySettings()
          this._notification.success("Settings updated successfully")
        } else {
          this._notification.error("Error Updating Company Settings")
        }
      });
    } else {
      return
    }
  }

  // Company Information
  submitCompanyInfo(form: FormGroupDirective) {
    if (this.infoForm.valid) {
      let data = this.infoForm.value as UserCompanyDTO;
      if (!data.cityId)
        data.cityId = 0;
      if (!data.ownerCountryId)
        data.ownerCountryId = 0;
      if (!data.ownerMembershipTypeId)
        data.ownerMembershipTypeId = 0;
      if (!data.businessStructureId)
        data.businessStructureId = 0;

      for (let [key, value] of Object.entries(data)) {
        let newValue = (value) || value == '' ? value : ''
        data[key] = newValue
      }
      this._userService.updateUserCompany(this.companyFile, data).subscribe(res => {
        if (res.isSuccessfull) {
          this._authService.currentAccount();
          this._userService.getUserCompany();
          this._notification.success("Settings updated successfully")
        } else {
          this._notification.error("Error Error Updating Company Information")
        }
      });
    } else {
      return
    }
  }

  // Accounting
  submitAccounting(form: FormGroupDirective) {
    if (this.accountingForm.valid) {
      // this._authService.currentAccount();
      let data = this.accountingForm.value as UserAccountingSettingsDTO;
      data.taxJurisdictionId = data.taxJurisdictionId ? data.taxJurisdictionId : 0

      this._userService.updateUserAccountingSettings(data).subscribe(res => {
        if (res.isSuccessfull) {
          this._authService.currentAccount();
          this._userService.getAccountingSettings();
          this._notification.success("Settings updated successfully")
        } else {
          this._notification.error("Error Updating Accouting Settings")
        }
      });
    } else {
      return
    }
  }


  // Image
  beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      this._notification.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this._notification.error('Image must smaller than 2MB!');
      return false;
    }
    if (isJpgOrPng && isLt2M) {
      this.loading = true;
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatarUrl = reader.result;
        this.loading = false;
      };
    }
    return false;
  };


  beforeCompanyUpload = (file: File): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      this._notification.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this._notification.error('Image must smaller than 2MB!');
      return false;
    }
    this.companyFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.companyAvatarUrl = reader.result;
    };
    return false;
  };

  // Update Password
  submitPasswordForm(formDirective: FormGroupDirective): void {
    if (this.passwordForm.valid) {
      let data = this.passwordForm.value as ResetPasswordDTO
      this._authService.resetPassword(data).subscribe(res => {
        if (res.isSuccessfull) {
          this._notification.confirm("Password Changed Successfully", "Do you want to logout now!").then(result => {
            if (result.isConfirmed) {
              this._authService.logout()
              formDirective.resetForm()
              this.passwordForm.reset()
            }else{
              formDirective.resetForm()
              this.passwordForm.reset()
            }
          })
          // formDirective.resetForm()
          // this.passwordForm.reset();
        } else {
          if (res.errorMessage === "Incorrect password.")
            this._notification.error("Current password is Incorrect")
          else
            this._notification.error("Error changing Password")
        }
      });
    } else {
      return
    }
  }


}
