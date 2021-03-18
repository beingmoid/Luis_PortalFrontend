import { Component, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { debounceTime, delay } from 'rxjs/operators'
import { SearchResponseDTO } from 'src/app/models/searchResponseDTO'
import { SearchService } from 'src/app/services/search.service'

@Component({
  selector: 'cui-topbar-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class TopbarSearchComponent {
  @ViewChild('liveSearchInput') liveSearchInput: ElementRef

  showSearch: boolean = false
  searchText: string = ''
  searchResultData: SearchResponseDTO[] = [];

  constructor(private _searchService: SearchService, private _router: Router) {
    //document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
  }

  setVisible() {
    this.showSearch = true
    setTimeout(() => {
      this.liveSearchInput.nativeElement.focus()
    }, 100)
  }

  setHidden() {
    this.showSearch = false
  }

  handleKeyUp(event: any) {
    this.searchResultData = [];
    if (this.showSearch) {
      const key = event.keyCode.toString()
      if (key == '13') {
        this._searchService.getSearchResult(this.searchText).subscribe(res => {
          let index = 0;
          this.searchResultData = res.dynamicResult;
          this.searchResultData.forEach(element => {
            element.index = index + 1;
            index++;
          });
        });
      }
      if (key === '27') {
        this.setHidden()
      }
    }
  }

  handleSearchNavigation(data: SearchResponseDTO) {
    this.showSearch = false
    this.searchResultData = [];
    this.searchText = "";
    switch (data.table) {
      case "Case":
        this._router.navigate(['cases/case'], { state: { caseId: data.id } });
        break;

      case "CaseTask":
        this._router.navigate(['tasks'], { state: { taskId: data.id } });
        break;

      case "Commission":
        this._router.navigate(['commission'], { state: { commissionId: data.id } });
        break;

      case "CaseDocument":
        this._router.navigate(['documents'], { state: { documentId: data.id } });
        break;

      case "BankAccount":
        this._router.navigate(['accounting'], { state: { accountId: data.id } });
        break;

      case "Contact":
        this._router.navigate(['contacts'], { state: { contactId: data.id } });
        break;

      case "Events":
        this._router.navigate(['calendar'], { state: { eventId: data.id } });
        break;

      default:
        break;
    }
  }

}
