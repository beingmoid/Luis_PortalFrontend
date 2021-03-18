import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { CaseService } from 'src/app/services/APIServices/case.service';

@Component({
  selector: 'app-sibling-details',
  templateUrl: './sibling-details.component.html',
  styleUrls: ['./sibling-details.component.scss']
})
export class SiblingDetailsComponent implements OnInit {

  @Input('form') form: FormGroup

  constructor(
    private fb: FormBuilder,
    private _caseService: CaseService,
  ) { }

  public get caseSiblings() { return this.form.get('caseSiblings') as FormArray }

  getFormGroup(fg: FormGroup) {
    return fg.controls
  }
  ngOnInit(): void {
    this._caseService.caseObserver$.subscribe(res => {
      if (res) {
        let data = res['caseSiblings']
        if (this.caseSiblings.controls && this.caseSiblings.controls.length > 0) {
          this.caseSiblings.controls = []
        }
        if (data && data.length > 0) {
          data.forEach(e => {
            this.caseSiblings.push(this.createFormGroup(e))
          });
        } else {
          this.caseSiblings.push(this.createFormGroup(null))
        }
      }
    })
  }
  /**
  * 
  * @param value Form Value
  */
  createFormGroup(value): FormGroup {
    return this.fb.group({
      id: [value ? value.id : 0],
      name: [value ? value.name : ''], // str
      occupation: [value ? value.occupation : ''], // str
      dob: [value ? value.dob : ''], // str
      residentialAddress: [value ? value.residentialAddress : ''], // str
    })
  }

  addFormGroup() {
    this.caseSiblings.push(this.createFormGroup(null))
    // if (this.form.valid) {

    // } else
    //   this._notification.error("Form is Invalid, please fill the required fields")
  }

  removeFormGroup(index: number) {
    this.caseSiblings.removeAt(index);
  }

}
