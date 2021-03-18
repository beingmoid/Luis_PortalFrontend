import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { ContactExistsDto } from 'src/app/models/ContactExistsDto';
import { ContactDTO } from 'src/app/models/contactsDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { ContactsService } from 'src/app/services/APIServices/contacts.service';
import { HomeService } from 'src/app/services/APIServices/home.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { AuthService } from 'src/app/services/jwt/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss']
})
export class AddContactsComponent implements OnInit, OnDestroy {

  form: FormGroup
  loading = false;
  avatarUrl: any;
  buttonLoading = false
  isClientAccountCreated = false
  file: any;

  contactTypeSubject: Subscription;
  languagesSubject: Subscription;
  countriesSubject: Subscription;
  statesSubject: Subscription;
  citiesSubject: Subscription;


  @Input() contactDataSub?: Subject<ContactDTO>;

  contactTypeData: LookUpDTO[] = [];
  languages: LookUpDTO[] = [];
  countries: LookUpDTO[] = [];
  states: LookUpDTO[] = [];
  cities: LookUpDTO[] = [];
  contactId: number = null;
  isEditMode: boolean = false;
  emailAlreadyExist: boolean = false;
  imageUploadURL: string = API_URL + API_ENDPOINTS.Contacts + "/UploadContactImage";
  contact: ContactExistsDto = new ContactExistsDto;
  currentEmail: string;

  constructor(
    private fb: FormBuilder,
    private _contactService: ContactsService,
    private alert: AlertService,
    private _lookUpService: LookupService,
    private _sharedService: SharedService,
    private _authService: AuthService,
    private _homeService: HomeService
  ) {
    this.form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactTypeId: ['', Validators.required],
      email: ['', {
        validators: [Validators.required,
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
        updateOn: 'change'
      }],
      cityId: ['', Validators.required],
      stateId: [null, { validators: [Validators.required], updateOn: 'change' }],
      countryId: [null, { validators: [Validators.required], updateOn: 'change' }],
      languageId: ['', Validators.required],
      companyName: [''],
      notes: [''],
      imageName: [''],
      blobURI: ['']
    }, { updateOn: 'submit' });
    this._sharedService.restForm.subscribe(x => {
      this.form.reset();
    });
  }

  get f() { return this.form.controls }

  ngOnInit(): void {
    this.contactTypeSubject = this._contactService.contactTypeObserver$.subscribe(res => {
      this.contactTypeData = res;
    });

    this.languagesSubject = this._lookUpService.languagesObserver$.subscribe(res => {
      this.languages = res;
    });

    this.countriesSubject = this._lookUpService.countryObserver$.subscribe(res => {
      this.countries = res;
    });

    this.statesSubject = this._lookUpService.stateObserver$.subscribe(res => {
      this.states = res;
    });
    this.citiesSubject = this._lookUpService.cityObserver$.subscribe(res => {
      this.cities = res;
    });

    if (this.contactDataSub) {

      this.contactDataSub.subscribe(res => {
        if (res) {
          this.currentEmail = res.email;
          this.form.patchValue(res);
          this.avatarUrl = this.form.get('blobURI').value;
          this.contactId = res.id;
          this.isEditMode = true;
          this.isClientAccountCreated = res.isClientAccountCreated;
          this.countryChange();
        }

        else {
          this.currentEmail = "";
          this.contactId = null;
          this.isClientAccountCreated = false;
          this.avatarUrl = null;
          this.file = null;
          this.form.reset();
        }
      });
    }
    if (!this._contactService.contactTypes)
      this._contactService.getContactTypes();
    this._lookUpService.getLanguages();
    this._lookUpService.getCountries();
  }

  checkEmail() {
    let email = this.form.get('email').value;
    if (email !== null && email !== "" && this.currentEmail !== email) {
      this._authService.CheckEmail(email).subscribe(res => {
        if (!res.isSuccessfull)
          this.form.get('email').setErrors({ 'found': true })
      });
    }
  }

  ngOnDestroy() {
    this.contactTypeSubject.unsubscribe();
    this.languagesSubject.unsubscribe();
    this.countriesSubject.unsubscribe();
    this.statesSubject.unsubscribe();
    this.citiesSubject.unsubscribe();
  }


  handleSubmit(formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      return
    }
    this.buttonLoading = true
    let data = this.form.value as ContactDTO;
    for (let [key, value] of Object.entries(data)) {
      let newValue = (value) || value == '' ? value : ''
      data[key] = newValue
    }
    this.contact.email = data.email;
    this.contact.id = this.isEditMode ? this.contactId : 0;
    if (this.currentEmail !== data.email) {
      this._contactService.isContactExist(data.email).subscribe(res => {
        if (res.dynamicResult) {
          this.emailAlreadyExist = true;
          return;
        } else {
          this.emailAlreadyExist = false;
          if (this.contactId) {
            data.id = this.contactId;
            this.editContacts(data);
          }

          else
            this.saveContacts(data);

          this.contactId = null;
          formDirective.resetForm()
          this.form.reset();
          this._sharedService.formSubmited.next();
        }
      });
    } else {
      // this._contactService.isContactExist(data.email).subscribe(res => {
      // if (res.dynamicResult) {
      //   this.emailAlreadyExist = true;
      //   return;
      // } else {
      this.emailAlreadyExist = false;
      if (this.contactId) {
        data.id = this.contactId;
        this.editContacts(data);
      }
      else
        this.saveContacts(data);

      this.contactId = null;
      formDirective.resetForm()
      this.form.reset();
      this._sharedService.formSubmited.next();
      // }
      // });
    }
  }

  saveContacts(data: ContactDTO) {
    this._contactService.saveContacts(this.file, data).subscribe(res => {
      this.buttonLoading = false
      if (res.isSuccessfull) {
        this._contactService.getContacts();
        this.alert.success('Contact Saved Successfully!')
        this._homeService.getHomeData();
      }
      else
        this.alert.error('Error while saving Contact!')
    });
  }

  editContacts(data: ContactDTO) {
    this._contactService.editContact(this.file, data).subscribe(res => {
      this.buttonLoading = false
      if (res.isSuccessfull) {
        this._contactService.getContacts();
        this.alert.success('Contact Updated Successfully!')
      }
      else
        this.alert.error('Error while updating contact!')
    });
  }

  countryChange() {
    if (this.form.controls["countryId"].value != null && this.form.controls["countryId"].value != undefined) {
      this._lookUpService.getStates(this.form.controls["countryId"].value).subscribe(res => {
        this.states = res.dynamicResult;
      });
      if (this.isEditMode) {
        this.stateChange();
      }
    }
  }

  stateChange() {
    if (this.form.controls["stateId"].value != null && this.form.controls["stateId"].value != undefined) {
      this._lookUpService.getCities(this.form.controls["stateId"].value).subscribe(res => {
        this.cities = res.dynamicResult;
      });
    }
  }

  // Image
  beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      this.alert.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.alert.error('Image must smaller than 2MB!');
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

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private UrlToBase64(url: string, callback: (url) => void): void {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.avatarUrl = info.file.response.dynamicResult.blobURI;
        this.loading = false;
        this.form.get('blobURI').setValue(info.file.response.dynamicResult.blobURI);
        this.form.get('imageName').setValue(info.file.response.dynamicResult.imageName);
        break;
      case 'error':
        this.alert.error('Network error');
        this.loading = false;
        break;
    }
  }
  // end image
}
