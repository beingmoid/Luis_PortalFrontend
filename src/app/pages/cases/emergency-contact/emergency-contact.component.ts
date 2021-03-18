import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LookUpDTO } from 'src/app/models/lookUpDTO';
import { LookupService } from 'src/app/services/APIServices/lookup.service';

@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss']
})
export class EmergencyContactComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup

  relationships: LookUpDTO[] = [];
  relationshipSubject: Subscription;

  constructor(private _lookupService: LookupService) { }

  get caseEmergencyContact() { return this.form.get('caseEmergencyContact') as FormGroup }

  ngOnInit(): void {
    this.relationshipSubject = this._lookupService.relationshipObserver$.subscribe(res => {
      this.relationships = res;
    });
  }

  ngOnDestroy() {
    if (this.relationshipSubject)
      this.relationshipSubject.unsubscribe();
  }
}
