import { calculateDate, valueOrDefault, TimeUnit, TimeOperator } from 'msc-dms-commons-angular/shared/util';
import { TimeModelOptions } from './time-options.model';

export class TimeModel {
  value: number;
  unitType: TimeUnit;
  endOfDay?: boolean;
  startOfDay?: boolean;
  roundNearest10Minutes?: boolean;
  roundNearestHour?: boolean;
  coeff10 = 1000 * 60 * 10;
  coeff60 = 1000 * 60 * 60;

  constructor(options: TimeModelOptions) {
    this.value = options.value;
    this.setUnit(options.unit);
    this.endOfDay = valueOrDefault(options.endOfDay, false);
    this.startOfDay = valueOrDefault(options.startOfDay, false);
    this.roundNearest10Minutes = valueOrDefault(options.roundNearest10Minutes, false);
    this.roundNearestHour = valueOrDefault(options.roundNearestHour, false);
  }

  setUnit(units: TimeUnit) {
    this.unitType = units;
  }

  getDateBack(): Date {
    let startDate = new Date();

    if (this.startOfDay) {
      startDate.setUTCHours(0, 0, 0, 0);
      return startDate;
    } else {
      return (startDate = this.findDate(startDate, TimeOperator.Subtract));
    }
  }

  getDateForward(): Date {
    let endDate = new Date();

    if (this.endOfDay) {
      endDate.setUTCHours(23, 59, 59, 999);
      return endDate;
    } else {
      return (endDate = this.findDate(endDate, TimeOperator.Add));
    }
  }

  private findDate(date: Date, operator: TimeOperator): Date {
    date = calculateDate({
      mode: operator,
      unit: this.unitType,
      amount: operator === TimeOperator.Subtract ? this.value : 0,
    });

    const currentCoeff = this.roundNearest10Minutes ? this.coeff10 : this.roundNearestHour ? this.coeff60 : null;

    return currentCoeff == null ? date : (date = new Date(Math.round(date.getTime() / currentCoeff) * currentCoeff));
  }
}
