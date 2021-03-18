import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-spouse-parents-details',
  templateUrl: './spouse-parents-details.component.html',
  styleUrls: ['./spouse-parents-details.component.scss']
})
export class SpouseParentsDetailsComponent implements OnInit {

  @Input('form') form: FormGroup

  constructor() { }

  public get caseSpouseParentDetails() { return this.form.get('caseSpouseParentDetail') as FormGroup }

  ngOnInit(): void {
  }

}
