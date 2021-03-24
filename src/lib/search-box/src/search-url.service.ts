import { Injectable } from '@angular/core';
import { SearchParameter } from './parameters/search-parameter';
import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchQuick } from './parameters/search-quick';
import { ShortcutModel } from './model/shortcut.model';
import { SearchCheckbox } from './parameters/search-checkbox';
import { ParameterType } from './enums/parameter-type.enum';
import { ParameterName } from './enums/parameter-name.enum';
import { TimeModel } from './model/time.model';

@Injectable()
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
      displayParams.forEach((p) => {
        const name = p.getUrlName();
        switch (p.getType()) {
          case ParameterType.Datetime:
            if (
              p.getName() == ParameterName.To ||
              p.getName() == ParameterName.From ||
              p.getName() == ParameterName.RelativeDatetime
            ) {
              const date = p as SearchDatetime;
              addUrlParam(name, date.getDatetimeUrlFormat());
            } else if (p.getName() == ParameterName.QuickRangeFrom) {
              const quickDate = p as SearchDatetime;
              addUrlParam(quickDate.getUrlQuickName(), quickDate.getUrlQuickRange());
            }
            break;
          case ParameterType.HoursRange:
            const hrs = p as SearchHoursRange;
            addUrlParam(hrs.getUrlNameBefore(), hrs.hoursBefore);
            addUrlParam(hrs.getUrlNameAfter(), hrs.hoursAfter);
            break;
          case ParameterType.Checkbox:
            const checkbox = p as SearchCheckbox;
            addUrlParam(name, checkbox.typeValue);
            break;
          default:
            p.getSelectedModels().forEach((s) => addUrlParam(name, s.uri));
        }
      });
    }
    return allParams;
  }

  /** Reads the URL parameters and returns a list of the corresponding SearchParameter with its values */
  getAllRequestParams(
    qParams,
    availableParams: SearchParameter[],
    shortcuts: ShortcutModel[],
    btnHighlight?: boolean[],
  ) {
    const paramValueObj = (name, value) =>
      this.paramValueObj(this.findParamByUrlName(availableParams, name), this.toArray(value));
    const getLabel = (param, values) =>
      values.map((val) => {
        const choice = param.findChoiceByUri(val);
        return choice ? choice.label : val;
      });
    const requested =
      qParams != null
        ? Object.keys(qParams)
            .filter((key) => qParams[key] != null && !this.isSpecialUrlParam(key, availableParams))
            .map((key) => paramValueObj(key, qParams[key]))
            .concat(this.getSpecialRequestParams(qParams, availableParams, shortcuts, btnHighlight))
            .filter((obj) => obj.param != null && obj.value.length > 0)
        : [];

    requested.forEach((obj) => (obj.value = getLabel(obj.param, obj.value)));

    const sorted = [];
    availableParams.forEach((param) => {
      const temp = requested.find((req) => req.param.getName() === param.getName());
      if (temp != null) {
        sorted.push(temp);
      }
    });
    sorted.push(...requested.filter((p) => !sorted.includes(p)));
    return sorted;
  }

  /** Determine if a url param is for date, hour range, query type, or shortcuts */
  isSpecialUrlParam(name: string, availableParams: SearchParameter[]) {
    return availableParams.filter((p) => p.getType() !== ParameterType.Default).some((p) => p.getUrlName() === name);
  }

  /** Parameters that may use a special format (date, hour range, query type, shortcuts) */
  getSpecialRequestParams(
    qParams,
    availableParams: SearchParameter[],
    shortcuts: ShortcutModel[],
    btnHighlight?: boolean[],
  ) {
    return [].concat(
      this.getDateRequestParams(qParams, availableParams, btnHighlight),
      this.getHourRangeRequestParams(qParams, availableParams),
      this.getCheckboxRequestParams(qParams, availableParams),
      this.getShortcutRequestParams(qParams, availableParams, shortcuts),
    );
  }

  getShortcutRequestParams(qParams, availableParams: SearchParameter[], shortcuts: ShortcutModel[]) {
    const asObject = (param) => this.paramValueObj(this.findParamByUrlName(availableParams, param.name), param.values);

    const flatten = (a, b) => a.concat(b);
    return [].concat(
      ...this.toArray(qParams.shortcut).map((label) =>
        shortcuts
          .filter((s) => s.label.toLowerCase() === label.toLowerCase())
          .map((s) => s.addParameters.map(asObject).reduce(flatten)),
      ),
    );
  }

  getDateRequestParams(qParams, availableParams: SearchParameter[], btnHighlight?: boolean[]) {
    //can read obs_datetime but does not produce it
    const paramValue = (param) => {
      if (this.firstValue(qParams['obs_datetime']) != null && param.getUrlName() === 'obsDatetime') {
        return [this.firstValue(qParams['obs_datetime'])];
      } else {
        return [this.firstValue(qParams[param.getUrlName()])];
      }
    };

    const quickRangeFrom = availableParams.find((p) => p.getName() === ParameterName.QuickRangeFrom) as SearchDatetime;
    const rangeName = quickRangeFrom?.getUrlQuickName();
    const quickList = (availableParams.find((p) => p.getName() == ParameterName.QuickRangeOptions) as SearchQuick)
      ?.quickList;
    if (qParams.hasOwnProperty(rangeName) && quickList != null && btnHighlight != null) {
      const quickRangeTo = availableParams.find((p) => p.getName() === ParameterName.QuickRangeTo) as SearchDatetime;
      const rangeValue = qParams[rangeName]; // i.e. last30min
      const result = quickList.find((p) => p.uriLabel == rangeValue);
      const id = quickList.findIndex((p) => p.uriLabel == rangeValue);
      const timeModel = new TimeModel(result.timeSettings);

      btnHighlight[id] = true;

      quickRangeFrom.setFullDatetime(timeModel.getDateBack());
      quickRangeTo.setFullDatetime(timeModel.getDateForward());

      return [
        this.paramValueObj(quickRangeFrom, [quickRangeFrom.getDatetimeUrlFormat()]),
        this.paramValueObj(quickRangeTo, [quickRangeTo.getDatetimeUrlFormat()]),
      ];
    } else {
      return availableParams
        .filter((p) => p.getType() === ParameterType.Datetime)
        .map((p) => this.paramValueObj(p, paramValue(p)))
        .filter((obj) => obj.value[0] != null);
    }
  }

  getHourRangeRequestParams(qParams, availableParams: SearchParameter[]) {
    const hourRange: SearchHoursRange = availableParams.find(
      (p) => p.getType() === ParameterType.HoursRange,
    ) as SearchHoursRange;

    if (hourRange == null) {
      return [];
    }
    const beforeName = hourRange.getUrlNameBefore();
    const afterName = hourRange.getUrlNameAfter();

    //Still able to read hh_before and hh_after url but should no longer produce them
    const grabRangeValue = (name: string) => {
      let numValue;
      if (qParams['hh_before'] != null && name === 'hoursBefore') {
        numValue = parseInt(qParams['hh_before']);
      } else if (qParams['hh_after'] != null && name === 'hoursAfter') {
        numValue = parseInt(qParams['hh_after']);
      } else {
        numValue = parseInt(qParams[name]);
      }
      return !!numValue || numValue === 0 ? numValue : null;
    };

    return [
      this.paramValueObj(hourRange, [
        {
          [beforeName]: grabRangeValue(beforeName),
          [afterName]: grabRangeValue(afterName),
        },
      ]),
    ];
  }

  getCheckboxRequestParams(qParams, availableParams: SearchParameter[]) {
    const checkbox = availableParams.find((p) => p.getType() === ParameterType.Checkbox);
    if (checkbox == null) {
      return [];
    }

    const value = this.firstValue(qParams[checkbox.getUrlName()]);
    return value === (checkbox as SearchCheckbox).typeValue ? [this.paramValueObj(checkbox, [value])] : [];
  }

  private toArray = (value) => (Array.isArray(value) ? value : [value].filter((val) => val != null));

  private firstValue = (value) => this.toArray(value)[0];

  private findParamByUrlName = (searchParams: SearchParameter[], name: string) =>
    searchParams.find((p) => p.getUrlName() === name);
}
