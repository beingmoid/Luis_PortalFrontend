import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-passport-details',
  templateUrl: './passport-details.component.html',
  styleUrls: ['./passport-details.component.scss']
})
export class PassportDetailsComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup

  countries: LookUpDTO[] = [];
  countriesSubject: Subscription;
  minDate = new Date();
  constructor(private _lookupService: LookupService) { }

  public get casePassportDetails() { return this.form.get('casePassportDetail') as FormGroup }
  
  get passportFormControl() { return this.form.controls["casePassportDetail"]["controls"] }

  ngOnInit(): void {
    this.countriesSubject = this._lookupService.countryObserver$.subscribe(res => {
      this.countries = res;
    });
  }

  issueDateChange(item){
    var issueDate =  this.form.controls["casePassportDetail"]["controls"]["issueDate"].value;// fg.controls["endDate"]['_pendingValue'];
    var expiryDate = this.form.controls["casePassportDetail"]["controls"]["expiryDate"].value; //fg.controls["startDate"]['_pendingValue'];
    this.minDate = new Date(item);
    if(expiryDate < issueDate){
      this.form.controls["casePassportDetail"]["controls"]["expiryDate"].setValue(new Date(item))
    }
  }

  ngOnDestroy() {
    if (this.countriesSubject)
      this.countriesSubject.unsubscribe();
  }
}
