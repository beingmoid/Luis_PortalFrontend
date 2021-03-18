import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-primary-parents-details',
  templateUrl: './primary-parents-details.component.html',
  styleUrls: ['./primary-parents-details.component.scss']
})
export class PrimaryParentsDetailsComponent implements OnInit {

  @Input('form') form: FormGroup
  maxDate = new Date();

  constructor() { }

  public get casePrimaryParentDetails() { return this.form.get('casePrimaryParentDetail') as FormGroup }

  ngOnInit(): void {
  }

}
