import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasesRoutingModule } from './cases-routing.module';
import { ViewCasesComponent } from './view-cases/view-cases.component';
import { AddCasesComponent } from './add-cases/add-cases.component';
import { SharedModule } from 'src/app/shared.module';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { ImmigrationHistoryComponent } from './immigration-history/immigration-history.component';
import { SchoolDetailsComponent } from './school-details/school-details.component';
import { EducationalHistoryComponent } from './educational-history/educational-history.component';
import { LanguageExamComponent } from './language-exam/language-exam.component';
import { EmploymentHistoryComponent } from './employment-history/employment-history.component';
import { PassportDetailsComponent } from './passport-details/passport-details.component';
import { DependentsComponent } from './dependents/dependents.component';
import { PrimaryParentsDetailsComponent } from './primary-parents-details/primary-parents-details.component';
import { SpouseParentsDetailsComponent } from './spouse-parents-details/spouse-parents-details.component';
import { SiblingDetailsComponent } from './sibling-details/sibling-details.component';
import { ApplicantDeclarationComponent } from './applicant-declaration/applicant-declaration.component';
import { WorkInCanadaComponent } from './work-in-canada/work-in-canada.component';
import { FinancesComponent } from './finances/finances.component';
import { TravelHistoryComponent } from './travel-history/travel-history.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { ViewSingleCaseComponent } from './view-single-case/view-single-case.component';
import { CaseTabComponent } from './tabs/case-tab/case-tab.component';
import { RelatedCaseTabComponent } from './tabs/related-case-tab/related-case-tab.component';
import { DocumentsTabComponent } from './tabs/documents-tab/documents-tab.component';
import { FormsTabComponent } from './tabs/forms-tab/forms-tab.component';
import { NotesTabComponent } from './tabs/notes-tab/notes-tab.component';
import { TaskTabComponent } from './tabs/task-tab/task-tab.component';
import { AccountingTabComponent } from './tabs/accounting-tab/accounting-tab.component';
import { ImmigrationTabComponent } from './tabs/immigration-tab/immigration-tab.component';
import { TasksModule } from '../tasks/tasks.module';
import { AccountingModule } from '../accounting/accounting.module';
import { DocumentsModule } from '../documents/documents.module';
import { FormsModule } from '../forms/forms.module';


@NgModule({
  declarations: [ViewCasesComponent, AddCasesComponent, AdditionalInfoComponent, ImmigrationHistoryComponent, SchoolDetailsComponent, EducationalHistoryComponent, LanguageExamComponent, EmploymentHistoryComponent, PassportDetailsComponent, DependentsComponent, PrimaryParentsDetailsComponent, SpouseParentsDetailsComponent, SiblingDetailsComponent, ApplicantDeclarationComponent, WorkInCanadaComponent, FinancesComponent, TravelHistoryComponent, EmergencyContactComponent, ViewSingleCaseComponent, CaseTabComponent, RelatedCaseTabComponent, DocumentsTabComponent, FormsTabComponent, NotesTabComponent, TaskTabComponent, AccountingTabComponent, ImmigrationTabComponent],
  imports: [
    CommonModule,
    SharedModule,
    CasesRoutingModule,
    TasksModule,
    AccountingModule,
    DocumentsModule,
    FormsModule,
  ], exports: [  AddCasesComponent ]
})
export class CasesModule { }
