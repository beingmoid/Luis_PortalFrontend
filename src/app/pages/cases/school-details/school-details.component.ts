import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { CaseService } from 'src/app/services/APIServices/case.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.scss']
})
export class SchoolDetailsComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup

  courseSubject: Subscription;
  countrySubject: Subscription;
  updateCaseChildsSubject: Subscription;

  courses: LookUpDTO[] = [];
  countries: LookUpDTO[] = [];
  states: LookUpDTO[] = [];

  constructor(private _lookupService: LookupService, private _caseSerive: CaseService) { }

  get schoolDetails() { return this.form.get('caseSchoolDetails') as FormGroup }

  ngOnInit(): void {
    this.courseSubject = this._lookupService.courseObserver$.subscribe(res => {
      if (res)
        this.courses = res;
    });

    this.countrySubject = this._lookupService.countryObserver$.subscribe(res => {
      if (res)
        this.countries = res;
    });

    //for edit
    // let params: any = history.state.caseId;
    // if (params && params !== 0) {
    this.updateCaseChildsSubject = this._caseSerive.updateCaseChildsSubject$.subscribe(res => {
      if (res) {
        let formGroup = res.get('caseSchoolDetails') as FormGroup;
        if (formGroup.get('id').value !== 0) {
          if (formGroup.get("preferredCountryId").value) {
            this._lookupService.getStates(formGroup.get("preferredCountryId").value).subscribe(res => {
              this.states = res.dynamicResult;
            });
          }
        }
      }
    })
    // }
  }

  ngOnDestroy() {
    if (this.courseSubject) this.courseSubject.unsubscribe();
    if (this.countrySubject) this.countrySubject.unsubscribe();
    if (this.updateCaseChildsSubject) this.courseSubject.unsubscribe();
  }

  countryChange() {
    if (this.schoolDetails.get("preferredCountryId").value) {
      this._lookupService.getStates(this.schoolDetails.get("preferredCountryId").value).subscribe(res => {
        this.states = res.dynamicResult;
      });
    }
  }
}