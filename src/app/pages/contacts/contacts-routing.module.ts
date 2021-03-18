import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import { ViewContactsComponent } from './view-contacts/view-contacts.component';

const routes: Routes = [
  { path: '', component: ViewContactsComponent },
  { path: 'add', component: AddContactsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
