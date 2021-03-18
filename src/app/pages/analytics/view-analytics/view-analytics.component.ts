import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import c3 from 'c3';
import { AnalyticsService } from 'src/app/services/APIServices/analytics.service';

@Component({
  selector: 'app-view-analytics',
  templateUrl: './view-analytics.component.html',
  styleUrls: ['./view-analytics.component.scss'],
  providers: [DatePipe]
})
export class ViewAnalyticsComponent implements OnInit, AfterViewInit {
  casesPerDayDate = new Date();
  casesStatusDate = new Date();
  appliedCasesDate = new Date();
  caseRevenuePerMonthDate = new Date();
  recievablePayablesDataDate = new Date();

  casesPerDayMessage: string = "";
  constructor(private analyticService: AnalyticsService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getWeeklyCasesChartData();
    this.getCaseStatuses();
    this.getCaseApplied();
    this.getCaseRevenuePerMonthData();
    this.getRecievablePayablesData();
  }

  getWeeklyCasesChartData(): void {
    if (this.casesPerDayDate) {
      this.analyticService.getCasesPerDayInWeek(this.casesPerDayDate.toISOString()).subscribe(res => {
        this.casesPerDayMessage = `Showing result from ${this._datePipe.transform(res.dynamicResult.startDate, 'MMMM dd, yyyy')} to ${this._datePipe.transform(res.dynamicResult.endDate, 'MMMM dd, yyyy')}`
        this.generateAreaChart(res.dynamicResult.data);
      });
    }
  }

  getCaseStatuses() {
    this.analyticService.getCaseStatuses(this.casesStatusDate.toISOString()).subscribe(res => {
      let arrayOfColumns: any[] = [];
      res.dynamicResult.forEach(element => {
        arrayOfColumns.push([element.title, element.count]);
      });
      this.generateCaseStatusPieChart(arrayOfColumns);
    });
  }

  getCaseApplied() {
    this.analyticService.getCaseApplied(this.appliedCasesDate.toISOString()).subscribe(res => {
      let data = res.dynamicResult;
      let arrayOfColumns: any[] = [];
      res.dynamicResult.forEach(element => {
        arrayOfColumns.push([element.title, element.count]);
      });
      this.generateAppliedPieChart(arrayOfColumns);
    });
  }

  getCaseRevenuePerMonthData() {
    this.analyticService.getRevenuePerMonthData(this.caseRevenuePerMonthDate.toISOString()).subscribe(res => {
      this.generateRevenueBarChart(res.dynamicResult);
    });
  }

  getRecievablePayablesData() {
    this.analyticService.getRecievablePayablesData(this.recievablePayablesDataDate.toISOString()).subscribe(res => {
      this.generateAccountStackedBarChart(res.dynamicResult.recievables, res.dynamicResult.payables);
    });
  }

  generateAreaChart(columns) {
    var columnList = ['Cases'];
    columnList = columnList.concat(columns)
    const casePerDay = c3.generate({
      bindto: '#casePerDay',
      size: {
        // width: 900,
        // height: 260
      },
      data: {
        columns: [
          columnList
        ],
        types: {
          Cases: 'area-spline',
        },
      },
      axis: {
        x: {
          type: 'category',
          categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },

      },
      color: {
        pattern: ['#109cf1'],
      },
      legend: {
        show: false
      }
    })
  }

  generateCaseStatusPieChart(columns: any[]) {
    const caseStatus = c3.generate({
      bindto: '#caseStatus',
      size: {
        // width: 460,
        // height: 265
      },
      data: {
        columns: columns,
        type: 'pie',
      },
      color: {
        pattern: ['#fb8832', '#007aff'],
      },
    })

  }

  generateAppliedPieChart(columns: any[]) {
    const applied = c3.generate({
      bindto: '#applied',
      size: {
        // width: 460,
        // height: 260
      },
      data: {
        columns: columns,
        type: 'pie',
      },
      color: {
        pattern: ['#fb8832', '#007aff'],
      },
    })
  }

  generateRevenueBarChart(columns) {
    let columnList = ['Revenue'];
    columnList = columnList.concat(columns);
    const revenue = c3.generate({
      bindto: '#revenue',
      size: {
        // width: 460,
        // height: 260
      },
      data: {
        columns: [
          columnList
        ],
        type: 'bar',
      },
      axis: {
        x: {
          type: 'category',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

      },
      color: {
        pattern: ['#007aff'],
      },
    })
  }

  generateAccountStackedBarChart(recievablesColumns, payablesColumns) {
    let recievables = ['Recievables']
    let payables = ['Payables']

    recievables = recievables.concat(recievablesColumns);
    payables = payables.concat(payablesColumns);

    const accounts = c3.generate({
      bindto: '#accounts',
      size: {
        // width: 460,
        // height: 260
      },
      data: {
        columns: [
          recievables,
          payables
        ],
        type: 'bar',
        groups: [
          ['Recievables', 'Payables']
        ]
      },
      axis: {
        x: {
          type: 'category',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

      },
      color: {
        pattern: ['#fb8832', '#007aff'],
      },
    })
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.


  }

}
