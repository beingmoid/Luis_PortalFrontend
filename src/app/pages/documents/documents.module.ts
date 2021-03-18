import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';
import { SharedModule } from 'src/app/shared.module';
import { AddDocumentsComponent } from './add-documents/add-documents.component';


@NgModule({
  declarations: [ ViewDocumentsComponent, AddDocumentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    DocumentsRoutingModule
  ],
  exports: [
    ViewDocumentsComponent
  ]
})
export class DocumentsModule { }
