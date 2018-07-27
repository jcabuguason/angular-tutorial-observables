import { SearchParameter, ParameterType } from './parameters/search-parameter';
import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { ShortcutModel } from './model/shortcut.model';

export class SearchURLService {
  constructor() {}

  /** used to create URL */
  nameValueObj = (name, value) => ({'name': name, 'value': value});
  /** used to read from URL and populate search bar */
  paramValueObj = (param, value) => ({ 'param': param, 'value': value });

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
        const name = p.getName();

        if (p.getType() === ParameterType.SEARCH_DATETIME) {
          const date = p as SearchDatetime;
          addUrlParam(name, date.getDatetimeUrlFormat());
        } else if (p.getType() === ParameterType.SEARCH_HOURS_RANGE) {
          const hrs = p as SearchHoursRange;
          addUrlParam('hh_before', hrs.hoursBefore);
          addUrlParam('hh_after', hrs.hoursAfter);
        } else {
          p.getSelected().forEach(s => addUrlParam(name, s));
        }
      });
    }
    return allParams;
  }

  /** Reads the URL parameters and returns a list of the corresponding SearchParameter with its values */
  getAllRequestParams(qParams, availableParams: SearchParameter[], shortcuts: ShortcutModel[]) {
    const findParam = (name) => availableParams.find(p => p.getName() === name);
    const paramValueObj = (name, value) => this.paramValueObj(findParam(name), this.toArray(value));

    return qParams != null ?
      Object.keys(qParams)
        .filter(key => qParams[key] != null && !this.isSpecialUrlParam(key, availableParams))
        .map(key => paramValueObj(key, qParams[key]))
        .concat(this.getSpecialRequestParams(qParams, availableParams, shortcuts))
        .filter(obj => obj.param != null && obj.value.length > 0)
      : [];
  }

  /** Determine if url a param might not match search box field names */
  isSpecialUrlParam(name: string, availableParams: SearchParameter[]) {
    return !availableParams
      .filter(p => p.getType() === ParameterType.SEARCH_PARAMETER)
      .some(p => p.getName() === name);
  }

  /** Parameters that don't match search box field names or uses a special format (date, hour range, shortcuts) */
  getSpecialRequestParams(qParams, availableParams: SearchParameter[], shortcuts: ShortcutModel[]) {
    return [].concat(
      this.getDateRequestParams(qParams, availableParams),
      this.getHourRangeRequestParams(qParams, availableParams),
      this.getShortcutRequestParams(qParams, availableParams, shortcuts)
    );
  }

  getShortcutRequestParams(qParams, availableParams: SearchParameter[], shortcuts: ShortcutModel[]) {
    const findParam = (name) => availableParams.find(p => p.getName() === name);
    const paramValueObj = (param) => this.paramValueObj(findParam(param.name), param.values);

    const flatten = (a, b) => a.concat(b);
    return [].concat(
      ...this.toArray(qParams.shortcut).map(label => shortcuts
        .filter(s => s.label.toLowerCase() === label.toLowerCase())
        .map(s => s.addParameters.map(paramValueObj)
          .reduce(flatten)
        )
      )
    );
  }

  getDateRequestParams(qParams, availableParams: SearchParameter[]) {
    const datetimes = availableParams.filter(p => p.getType() === ParameterType.SEARCH_DATETIME);
    const fromDate = this.firstValue(qParams.from);
    const toDate = this.firstValue(qParams.to);

    return [
      this.paramValueObj(datetimes.find(p => p.getName() === 'from'), [fromDate]),
      this.paramValueObj(datetimes.find(p => p.getName() === 'to'), [toDate])
    ].filter(obj => obj.param != null && obj.value[0] != null);
  }

  getHourRangeRequestParams(qParams, availableParams: SearchParameter[]) {
    const hourRange = availableParams.find(p => p.getType() === ParameterType.SEARCH_HOURS_RANGE);
    const before = qParams.hh_before;
    const after = qParams.hh_after;
    let hours;

    if (before != null || after != null) {
      hours = {
        'hh_before': this.firstValue(before),
        'hh_after': this.firstValue(after)
      };
    }

    return (hourRange != null && hours != null)
      ? [this.paramValueObj(hourRange, [hours])]
      : [];
  }

  private toArray(value) {
    return Array.isArray(value) ? value : [value]
      .filter(val => val != null);
  }

  private firstValue(value) {
    return this.toArray(value)[0];
  }

}
