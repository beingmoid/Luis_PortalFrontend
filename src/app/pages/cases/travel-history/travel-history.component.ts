import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-travel-history',
  templateUrl: './travel-history.component.html',
  styleUrls: ['./travel-history.component.scss']
})
export class TravelHistoryComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup

  countries: LookUpDTO[] = [];
  states = { 0: [] }
  cities = { 0: [] }
  countriesSubject: Subscription;
  constructor(
    private _lookupService: LookupService,
    private fb: FormBuilder,
    private _caseService: CaseService,
  ) { }

  public get caseTravelHistory() { return this.form.get('caseTravelHistories') as FormArray }
  getFormGroup(fg: FormGroup) {
    return fg.controls
  }
  ngOnInit(): void {
    this.countriesSubject = this._lookupService.countryObserver$.subscribe(res => {
      this.countries = res;
    });

    this._caseService.caseObserver$.subscribe(res => {
      if (res) {
        let data = res['caseTravelHistories']
        if (this.caseTravelHistory.controls && this.caseTravelHistory.controls.length > 0) {
          this.caseTravelHistory.controls = []
        }
        if (data && data.length > 0) {
          data.forEach((e, i) => {
            this.countryChangeForEdit(e.destinationCountryId, i);
            this.stateChangeForEdit(e.destinationStateId, i);
            this.caseTravelHistory.push(this.createFormGroup(e))
          });
        } else {
          this.caseTravelHistory.push(this.createFormGroup(null))
        }
      }
    })
  }

  ngOnDestroy() {
    if (this.countriesSubject)
      this.countriesSubject.unsubscribe();
  }

  countryChange(index: string) {
    this._lookupService.getStates(this.caseTravelHistory.controls[index].get("destinationCountryId").value).subscribe(res => {
      this.states[index] = res.dynamicResult;
    });
  }

  countryChangeForEdit(countryId: number, index: number) {
    if(countryId) {
      this._lookupService.getStates(countryId).subscribe(res => {
        this.states[index] = res.dynamicResult;
      });
    }
  }

  stateChange(index: string) {
    this._lookupService.getCities(this.caseTravelHistory.controls[index].get("destinationStateId").value).subscribe(res => {
      this.cities[index] = res.dynamicResult;
    });;
  }

  stateChangeForEdit(stateId: number, index: number) {
    if(stateId) {
      this._lookupService.getCities(stateId).subscribe(res => {
        this.cities[index] = res.dynamicResult;
      })
    }
  }
  /**
   * 
   * @param value Form Value
   */
  createFormGroup(value): FormGroup {
    return this.fb.group({
      id: [value ? value.id : 0],
      destinationCountryId: [value ? value.destinationCountryId : '', { updateOn: 'change' }], // dd
      destinationStateId: [value ? value.destinationStateId : '', { updateOn: 'change' }],
      destinationCityId: [value ? value.destinationCityId : ''], // dd
      purposeOfTravel: [value ? value.purposeOfTravel : ''], // str
      from: [value ? value.from : ''], // date
      to: [value ? value.to : ''], // date
      durationOfStay: [value ? value.durationOfStay : ''], // date
    })
  }

  addFormGroup() {
    this.caseTravelHistory.push(this.createFormGroup(null))
    // if (this.form.valid) {

    // } else
    //   this._notification.error("Form is Invalid, please fill the required fields")
  }

  removeFormGroup(index: number) {
    this.caseTravelHistory.removeAt(index);
  }
}
