import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-of-conditions',
  templateUrl: './terms-of-conditions.component.html',
  styleUrls: ['../style.component.scss']
})
export class TermsOfConditionsComponent implements OnInit {

  isVisible:boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}
