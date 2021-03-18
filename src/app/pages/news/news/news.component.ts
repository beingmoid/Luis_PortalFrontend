import { Component, OnInit } from '@angular/core';
import { ImmigrationService } from 'src/app/services/APIServices/immigration.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  immigrations: any[] = []
  defaultImage: string = "assets/images/no-data/noNews.svg";
  constructor(private _immigrationService: ImmigrationService) { }

  ngOnInit(): void {
    this._immigrationService.getImmigrations();

    this._immigrationService.immigrationObserver$.subscribe(res => {
      if (res) {
        this.immigrations = res;
      }
    });
  }

}
