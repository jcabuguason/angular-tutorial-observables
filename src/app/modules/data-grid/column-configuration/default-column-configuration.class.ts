import { ElementColumnConfiguration } from './element-column-configuration.interface';

export class DefaultColumnConfiguration implements ElementColumnConfiguration {
  createElementHeader(workingNode: any, columnID: string) {
    workingNode.field = columnID;
    workingNode.children = undefined;
  }

  createElementData(element, columnID: string) {
    return '"' + columnID + '": "' + element.value + '"';
  }

}
