import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-work-in-canada',
  templateUrl: './work-in-canada.component.html',
  styleUrls: ['./work-in-canada.component.scss']
})
export class WorkInCanadaComponent implements OnInit {

  @Input('form') form: FormGroup

  constructor() { }

  get caseWorkInCanada() { return this.form.get('caseWorkInCanada') as FormGroup}

  ngOnInit(): void {
  }

}
