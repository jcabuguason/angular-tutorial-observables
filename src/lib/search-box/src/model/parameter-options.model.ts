import { ChoiceModel } from './choice.model';
import { SearchParameter } from '../parameters/search-parameter';

export interface ParameterOptions {
  name: string;
  displayName?: string;
  urlName?: string;
  choices?: ChoiceModel[];
  restricted?: boolean;
  required?: boolean;
  timesUsable?: number;
  placeholder?: string;
  sortAlpha?: boolean;
  defaultSelectedLabels?: string[];
}

export interface HoursRangeParameterOptions extends ParameterOptions {
  urlNameBefore?: string;
  urlNameAfter?: string;
  defaultHoursBefore?: number;
  defaultHoursAfter?: number;
}

export interface DatetimeParameterOptions extends ParameterOptions {
  includeTime?: boolean;
  defaultDatetime?: string | Date;
  startYear?: number;
  endYear?: number;
}

export interface CheckboxParameterOptions extends ParameterOptions {
  typeValue: string; // value to indicate when this should be checked
  requiredParams: SearchParameter[]; // SearchParameters that need to be filled to execute a search
  defaultChecked?: boolean;
}
