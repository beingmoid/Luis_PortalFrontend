import { Injectable, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelJson } from '../models/exportDTO';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor() { }

  public exportJsonToExcel(json: ExcelJson[], fileName: string): void {
    // inserting first blank row
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      json[0].data,
      this.getOptions(json[0])
    );
    var wscols = [
      {wch:15},
      {wch:20},
      {wch:30},
      {wch:40}
    ];

    worksheet['!cols'] = wscols;
    for (let i = 1, length = json.length; i < length; i++) {
      // adding a dummy row for separation
      XLSX.utils.sheet_add_json(
        worksheet,
        [{}],
        this.getOptions(
          {
            data: [],
            skipHeader: true
          }, -1)
      );
      XLSX.utils.sheet_add_json(
        worksheet,
        json[i].data,
        this.getOptions(json[i], -1)
      );
    }
    const workbook: XLSX.WorkBook = { Sheets: { Sheet1: worksheet }, SheetNames: ['Sheet1'] };
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`, { bookType: 'xlsx', type: 'buffer' });
  }

  private getOptions(json: ExcelJson, origin?: number): any {
    const options = {
      skipHeader: true,
      origin: -1,
      header: []
    };
    options.skipHeader = json.skipHeader ? json.skipHeader : false;
    if (!options.skipHeader && json.header && json.header.length) {
      options.header = json.header;
    }
    if (origin) {
      options.origin = origin ? origin : -1;
    }
    return options;
  }


}