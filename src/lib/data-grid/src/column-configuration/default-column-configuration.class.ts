import { ElementColumnConfiguration } from './element-column-configuration.interface';
import { DataColumnConfiguration } from './data-column-configuration.abstract';

export class DefaultColumnConfiguration extends DataColumnConfiguration implements ElementColumnConfiguration {
  createElementHeader(workingNode: any, columnID: string) {
    workingNode.field = columnID;
    workingNode.children = undefined;
  }

  createElementData(element, columnID: string) {
    return {
      [columnID]: element.value,
    };
  }
}
