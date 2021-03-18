import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss']
})
export class FinancesComponent implements OnInit {

  @Input('form') form: FormGroup

  constructor() { }

  get caseFinances() { return this.form.get('caseFinance') as FormGroup}
  get caseFormControl() { return this.form.controls["caseFinance"]["controls"] }

  ngOnInit(): void {
  }

}
