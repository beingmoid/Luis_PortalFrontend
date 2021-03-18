import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCasesComponent } from './add-cases/add-cases.component';
import { ViewCasesComponent } from './view-cases/view-cases.component';
import { ViewSingleCaseComponent } from './view-single-case/view-single-case.component';

const routes: Routes = [
  { path: '', component: ViewCasesComponent },
  // { path: 'add', component: AddCasesComponent },
 { path: 'edit', component: AddCasesComponent },
  { path: 'case', component: ViewSingleCaseComponent  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule { }
