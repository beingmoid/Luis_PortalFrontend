import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-applicant-declaration',
  templateUrl: './applicant-declaration.component.html',
  styleUrls: ['./applicant-declaration.component.scss']
})
export class ApplicantDeclarationComponent implements OnInit {

  @Input('form') form: FormGroup

  constructor() { }

  get caseApplicantDeclaration() { return this.form.get('caseApplicantDeclaration') as FormGroup}

  ngOnInit(): void {
  }

}
