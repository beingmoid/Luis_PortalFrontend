import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { ViewContactsComponent } from './view-contacts/view-contacts.component';
import { SharedModule } from 'src/app/shared.module';
 


@NgModule({
  declarations: [AddContactsComponent, ViewContactsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ContactsRoutingModule
  ], exports: [ AddContactsComponent ]
})
export class ContactsModule { }
