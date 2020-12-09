import { ParameterType } from '../enums/parameter-type.enum';
import { QuickParameterOptions } from '../model/parameter-options.model';
import { SearchParameter } from './search-parameter';
import { valueOrDefault } from 'msc-dms-commons-angular/shared/util';
import { QuickModel } from '../model/quick.model';
export class SearchQuick extends SearchParameter {
  quickList: QuickModel[];
  btnHighlight: boolean[];
  numQuickCols: number;

  constructor(options: QuickParameterOptions) {
    super({ ...options, choices: [], timesUsable: 1 });
    this.setType(ParameterType.Quick);
    this.quickList = valueOrDefault(options.quickList, []);
    this.btnHighlight = this.quickList.map((x) => false);
    this.numQuickCols = valueOrDefault(options.numQuickCols, 3);
  }

  isRequired(): boolean {
    return false;
  }
}
