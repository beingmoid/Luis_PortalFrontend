import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CaseEducationHistoryDTO } from 'src/app/models/caseEducationHistoryDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';

@Component({
  selector: 'app-educational-history',
  templateUrl: './educational-history.component.html',
  styleUrls: ['./educational-history.component.scss']
})
export class EducationalHistoryComponent implements OnInit {

  @Input('form') form: FormGroup
  minStartDate = new Date();


  constructor(
    private cdr: ChangeDetectorRef,
    private _notification: AlertService,
    private fb: FormBuilder,
    private _caseService: CaseService,
  ) { }

  public get educationalHistory() { return this.form.get('caseEducationalHistories') as FormArray }

  ngOnInit(): void {
    this._caseService.caseObserver$.subscribe(res => {
      if (res) {
        let data = res['caseEducationalHistories']
        if (this.educationalHistory.controls && this.educationalHistory.controls.length > 0) {
          this.educationalHistory.controls = []
        }
        if (data && data.length > 0) {
          data.forEach(e => {
            this.educationalHistory.push(this.createFormGroup(e))
          })
        } else {
          this.educationalHistory.push(this.createFormGroup(null))
        }

      }
    })
  }

  startDateChange(item, fg: FormGroup){
    var endDate = fg.controls["endDate"]['_pendingValue'];
    var startDate = fg.controls["startDate"]['_pendingValue'];
    if(endDate < startDate){
      fg.controls["endDate"].setValue(new Date(item))
    }
  }

  getFormGroup(fg: FormGroup) {
    return fg.controls
  }

  /**
   * 
   * @param value Form Value
   */
  createFormGroup(value: CaseEducationHistoryDTO): FormGroup {
    // let val = value ? value : null;
    return this.fb.group({
      id: [0],
      nameOfSchool: [value ? value.nameOfSchool : null], // str
      courseName: [value ? value.courseName : null], // str
      startDate: [value ? value.startDate : null], // date
      endDate: [value ? value.endDate : null], // date
    })

  }

  addFormGroup() {
    this.educationalHistory.push(this.createFormGroup(null))
    // if (this.form.valid) {

    // } else 
    //   this._notification.error("Form Not Valid, please fill the required fields")
  }

  removeFormGroup(index: number) {
    this.educationalHistory.removeAt(index);
  }

}
