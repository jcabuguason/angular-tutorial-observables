import { TimeUnit } from 'msc-dms-commons-angular/shared/util';
export interface TimeModelOptions {
  value?: number;
  unit: TimeUnit;
  endOfDay?: boolean;
  startOfDay?: boolean;
  roundNearest10Minutes?: boolean;
  roundNearestHour?: boolean;
}
