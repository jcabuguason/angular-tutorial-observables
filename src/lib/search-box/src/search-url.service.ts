import { SearchParameter } from './parameters/search-parameter';
import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { ShortcutModel } from './model/shortcut.model';
import { SearchQueryType } from './parameters/search-query-type';
import { ParameterType } from './enums/parameter-type.enum';

export class SearchURLService {
  constructor() {}

  /** used to create URL */
  nameValueObj = (name, value) => ({ name: name, value: value });
  /** used to read from URL and populate search bar */
  paramValueObj = (param, value) => ({ param: param, value: value });

  /** This is for adding to the URL parameters.
   *  Returns the search parameters so it can be used in the url
   */
  createUrlParams(displayParams: SearchParameter[], shortcutSelected?: ShortcutModel) {
    const allParams = [];
    const addUrlParam = (name, value) => allParams.push(this.nameValueObj(name, value));

    if (shortcutSelected != null) {
      addUrlParam('shortcut', shortcutSelected.label);
    } else {
      displayParams.forEach(p => {
        const name = p.getUrlName();
        switch (p.getType()) {
          case ParameterType.SEARCH_DATETIME:
            const date = p as SearchDatetime;
            addUrlParam(name, date.getDatetimeUrlFormat());
            break;
          case ParameterType.SEARCH_HOURS_RANGE:
            const hrs = p as SearchHoursRange;
            addUrlParam(hrs.getUrlNameBefore(), hrs.hoursBefore);
            addUrlParam(hrs.getUrlNameAfter(), hrs.hoursAfter);
            break;
          case ParameterType.SEARCH_QUERY_TYPE:
            const checkbox = p as SearchQueryType;
            addUrlParam(name, checkbox.typeValue);
            break;
          default:
            p.getSelectedModels().forEach(s => addUrlParam(name, s.uri));
        }
      });
    }
    return allParams;
  }

  /** Reads the URL parameters and returns a list of the corresponding SearchParameter with its values */
  getAllRequestParams(qParams, availableParams: SearchParameter[], shortcuts: ShortcutModel[]) {
    const paramValueObj = (name, value) =>
      this.paramValueObj(this.findParamByUrlName(availableParams, name), this.toArray(value));
    const getLabel = (param, values) =>
      values.map(val => {
        const choice = param.findChoiceByUri(val);
        return choice ? choice.label : val;
      });

    const requested =
      qParams != null
        ? Object.keys(qParams)
            .filter(key => qParams[key] != null && !this.isSpecialUrlParam(key, availableParams))
            .map(key => paramValueObj(key, qParams[key]))
            .concat(this.getSpecialRequestParams(qParams, availableParams, shortcuts))
            .filter(obj => obj.param != null && obj.value.length > 0)
        : [];

    requested.forEach(obj => (obj.value = getLabel(obj.param, obj.value)));

    const sorted = [];
    availableParams.forEach(param => {
      const temp = requested.find(req => req.param.getName() === param.getName());
      if (temp != null) {
        sorted.push(temp);
      }
    });
    sorted.push(...requested.filter(p => !sorted.includes(p)));

    return sorted;
  }

  /** Determine if a url param is for date, hour range, query type, or shortcuts */
  isSpecialUrlParam(name: string, availableParams: SearchParameter[]) {
    return availableParams
      .filter(p => p.getType() !== ParameterType.SEARCH_PARAMETER)
      .some(p => p.getUrlName() === name);
  }

  /** Parameters that may use a special format (date, hour range, query type, shortcuts) */
  getSpecialRequestParams(qParams, availableParams: SearchParameter[], shortcuts: ShortcutModel[]) {
    return [].concat(
      this.getDateRequestParams(qParams, availableParams),
      this.getHourRangeRequestParams(qParams, availableParams),
      this.getQueryTypeRequestParams(qParams, availableParams),
      this.getShortcutRequestParams(qParams, availableParams, shortcuts),
    );
  }

  getShortcutRequestParams(qParams, availableParams: SearchParameter[], shortcuts: ShortcutModel[]) {
    const asObject = param => this.paramValueObj(this.findParamByUrlName(availableParams, param.name), param.values);

    const flatten = (a, b) => a.concat(b);
    return [].concat(
      ...this.toArray(qParams.shortcut).map(label =>
        shortcuts
          .filter(s => s.label.toLowerCase() === label.toLowerCase())
          .map(s => s.addParameters.map(asObject).reduce(flatten)),
      ),
    );
  }

  getDateRequestParams(qParams, availableParams: SearchParameter[]) {
    const paramValue = param => [this.firstValue(qParams[param.getUrlName()])];
    return availableParams
      .filter(p => p.getType() === ParameterType.SEARCH_DATETIME)
      .map(p => this.paramValueObj(p, paramValue(p)))
      .filter(obj => obj.value[0] != null);
  }

  getHourRangeRequestParams(qParams, availableParams: SearchParameter[]) {
    const hourRange: SearchHoursRange = availableParams.find(
      p => p.getType() === ParameterType.SEARCH_HOURS_RANGE,
    ) as SearchHoursRange;

    if (hourRange == null) {
      return [];
    }

    const beforeName = hourRange.getUrlNameBefore();
    const afterName = hourRange.getUrlNameAfter();

    const beforeValue = qParams[beforeName];
    const afterValue = qParams[afterName];
    let hours;

    if (beforeValue != null || afterValue != null) {
      hours = {
        [beforeName]: this.firstValue(beforeValue),
        [afterName]: this.firstValue(afterValue),
      };
    }

    return hours != null ? [this.paramValueObj(hourRange, [hours])] : [];
  }

  getQueryTypeRequestParams(qParams, availableParams: SearchParameter[]) {
    const checkbox = availableParams.find(p => p.getType() === ParameterType.SEARCH_QUERY_TYPE);
    if (checkbox == null) {
      return [];
    }

    const value = this.firstValue(qParams[checkbox.getUrlName()]);
    return value === (checkbox as SearchQueryType).typeValue ? [this.paramValueObj(checkbox, [value])] : [];
  }

  private toArray = value => (Array.isArray(value) ? value : [value].filter(val => val != null));

  private firstValue = value => this.toArray(value)[0];

  private findParamByUrlName = (searchParams: SearchParameter[], name: string) =>
    searchParams.find(p => p.getUrlName() === name);
}
