import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'appDateFormat'
})

export class AppDateFormatPipe extends DatePipe implements PipeTransform {

  transform(value: Date, addTime?: any): any {
    if (value) {
      let date = new Date(moment.utc(value).local().toString());
      if (!addTime)
        return super.transform(date, 'MMMM dd, yyyy');
      else
        return super.transform(value, 'MMMM dd, yyyy HH:mm:ss')
    }
    return null;
  }

  transformForPatching(value: Date) {
    if (value) {
      return new Date(moment.utc(value).local().toString());
    }
    return null;
  }
}