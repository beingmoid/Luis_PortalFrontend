import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';

const routes: Routes = [
  { path: '', component: ViewDocumentsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
