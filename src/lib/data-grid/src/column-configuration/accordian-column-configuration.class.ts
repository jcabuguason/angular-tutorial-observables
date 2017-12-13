import { ElementColumnConfiguration } from './element-column-configuration.interface';

export class AccordianColumnConfiguration implements ElementColumnConfiguration {
  createElementHeader(workingNode: any, columnID: string) {
    workingNode.children.push({
      'headerName': 'Value',
      'field': columnID + '_v',
    });

    workingNode.children.push({
      'headerName': 'Unit',
      'field': columnID + '_u',
      'columnGroupShow': 'open',
    });

    workingNode.children.push({
      'headerName': 'QA Summary',
      'field': columnID + '_qa',
      'columnGroupShow': 'open',
    });
  }

  createElementData(element, columnID: string) {
    return '"' + columnID + '_v": "' + element.value + '",' +
    '"' + columnID + '_u": "' + element.unit + '",' +
    '"' + columnID + '_qa": "' + element.overallQASummary + '"';
  }

}
