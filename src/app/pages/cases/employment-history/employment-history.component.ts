import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CaseEmploymentHistoryDTO } from 'src/app/models/caseEmployementHistoryDTO copy';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';

@Component({
  selector: 'app-employment-history',
  templateUrl: './employment-history.component.html',
  styleUrls: ['./employment-history.component.scss']
})
export class EmploymentHistoryComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('form') form: FormGroup
  minStartDate = new Date();
  isValid = true;
  constructor(
    private fb: FormBuilder,
    private _caseService: CaseService,
  ) { }

  get employmentHistory() { return this.form.get('caseEmploymentHistories') as FormArray }

  ngOnInit(): void {
    this._caseService.caseObserver$.subscribe(res => {
      if (res) {
        let data = res['caseEmploymentHistories']
        if (this.employmentHistory.controls && this.employmentHistory.controls.length > 0) {
          this.employmentHistory.controls = []
        }
        if (data && data.length > 0) {
          data.forEach(e => {
            this.employmentHistory.push(this.createFormGroup(e))
          });
        } else {
          this.employmentHistory.push(this.createFormGroup(null))
        }
      }
    })

  }

  startDateChange(fg: FormGroup) {
    var endDate = fg.controls["endDate"];
    var startDate = fg.controls["startDate"];
    if (endDate.value < startDate.value) {
      endDate.setErrors({ invalidDate: 'End Date must be greated than Start Date' })
      // fg.controls["endDate"].setValue(new Date(item))
      // this.isValid = false;
    }
  }

  endDateChange(fg: FormGroup) {
    var endDate = fg.controls["endDate"];
    var startDate = fg.controls["startDate"];
    if (endDate.value < startDate.value) {
      // fg.controls["endDate"].setValue(new Date(item))
      // this.isValid = false;
      startDate.setErrors({ invalidDate: 'End Date must be greated than Start Date' })

    }
  }


  getFormGroup(fg: FormGroup) {
    return fg.controls
  }

  /**
 *
 * @param value Form Value
 */
  createFormGroup(value: CaseEmploymentHistoryDTO): FormGroup {
    return this.fb.group({
      id: [value ? value.id : 0],
      employerName: [value ? value.employerName : ''], // str
      jobTitle: [value ? value.jobTitle : ''], // str
      startDate: [value ? value.startDate :'', { updateOn: 'change' }], // date
      endDate: [value ? value.endDate : '', { updateOn: 'change' }], // date
    })
  }

  addFormGroup() {

    this.employmentHistory.push(this.createFormGroup(null))


    // if (this.form.valid) {

    // } else
    //   this._notification.error("Form is Invalid, please fill the required fields")
  }

  removeFormGroup(index: number) {
    this.employmentHistory.removeAt(index);
  }
}
