import { Component, OnInit } from '@angular/core';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-forms-tab',
  templateUrl: './forms-tab.component.html',
  styleUrls: ['./forms-tab.component.scss']
})
export class FormsTabComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
