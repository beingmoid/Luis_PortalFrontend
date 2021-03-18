import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdditionalInfoComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup

  public get additionalInfo() { return this.form.get('caseAdditionalInformation') as FormGroup }

  countries: LookUpDTO[] = [];
  states: LookUpDTO[] = [];
  cities: LookUpDTO[] = [];
  maritalStatuses: LookUpDTO[] = [];

  countriesSubject: Subscription;
  maritalStatusesSubject: Subscription;
  updateCaseChildsSubject: Subscription;
  mixDate = new Date();

  constructor(private _lookupService: LookupService, private _caseSerive: CaseService) { }

  ngOnInit(): void {
    this.maritalStatusesSubject = this._lookupService.martialStatusObserver$.subscribe(res => {
      if (res)
        this.maritalStatuses = res;
    });

    this.countriesSubject = this._lookupService.countryObserver$.subscribe(res => {
      if (res)
        this.countries = res;
    });

    //for edit
    // let params: any = history.state.caseId;
    // if (params && params !== 0) {
    this.updateCaseChildsSubject = this._caseSerive.updateCaseChildsSubject$.subscribe(res => {
      if (res) {
        let formGroup = res.get('caseAdditionalInformation') as FormGroup;
        if (formGroup.get('id').value !== 0) {
          if (formGroup.get("countryOfResidenceId").value) {
            this._lookupService.getStates(formGroup.get("countryOfResidenceId").value).subscribe(res => {
              this.states = res.dynamicResult;
            });
          }
          if (formGroup.get("provinceId").value) {
            this._lookupService.getCities(formGroup.get("provinceId").value).subscribe(res => {
              this.cities = res.dynamicResult;
            });
          }
        }
      }
    })
    // }
  }

  ngOnDestroy() {
    if (this.countriesSubject)
      this.countriesSubject.unsubscribe();
    if (this.maritalStatusesSubject)
      this.maritalStatusesSubject.unsubscribe();
    if (this.updateCaseChildsSubject)
      this.updateCaseChildsSubject.unsubscribe();
  }

  countryChange() {
    if (this.additionalInfo.get("countryOfResidenceId").value) {
      this._lookupService.getStates(this.additionalInfo.get("countryOfResidenceId").value).subscribe(res => {
        this.states = res.dynamicResult;
      });
    }
  }

  stateChange() {
    if (this.additionalInfo.get("provinceId").value) {
      this._lookupService.getCities(this.additionalInfo.get("provinceId").value).subscribe(res => {
        this.cities = res.dynamicResult;
      });;
    }
  }
}
