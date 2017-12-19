import { ElementColumnConfiguration } from './element-column-configuration.interface';

export class VUColumnConfiguration implements ElementColumnConfiguration {

  createElementHeader(workingNode: any, elementTaxonomy: string) {
    workingNode.children.push({
      'headerName': 'Value',
      'field': elementTaxonomy + '_v',
    });

    workingNode.children.push({
      'headerName': 'Unit',
      'field': elementTaxonomy + '_u',
    });
  }

  createElementData(element, columnID: string) {
    return '"' + columnID + '_v" : "' + element.value + '",' +
    '"' + columnID + '_u" : "' + element.unit + '"';
  }

}
