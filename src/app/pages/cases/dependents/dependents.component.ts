import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrls: ['./dependents.component.scss']
})
export class DependentsComponent implements OnInit {

  @Input('form') form: FormGroup

  constructor() { }

  public get caseDependents() { return this.form.get('caseDependent') as FormGroup }

  ngOnInit(): void {
  }

}
