import { SearchQuick } from './search-quick';
import { ParameterName } from '../enums/parameter-name.enum';
import { QuickModel } from '../model/quick.model';
import { TimeUnit } from 'msc-dms-commons-angular/shared/util';

describe('SearchQuick', () => {
  const quickArray: QuickModel[] = [
    {
      label: 'QUICK_MENU.TODAY',
      uriLabel: 'today',
      timeSettings: {
        unit: TimeUnit.Hours,
        startOfDay: true,
        endOfDay: true,
      },
    },
    {
      label: 'QUICK_MENU.LAST_30_MIN',
      uriLabel: 'last30min',
      timeSettings: {
        unit: TimeUnit.Minutes,
        value: 30,
      },
    },
  ];
  const param: SearchQuick = new SearchQuick({
    name: ParameterName.QuickRangeOptions,
    displayName: 'SEARCH_BAR.QUICK_RANGE',
    quickList: quickArray,
    numQuickCols: 3,
  });

  it('should not be required', () => {
    expect(param.isRequired()).toBeFalsy();
  });
});
