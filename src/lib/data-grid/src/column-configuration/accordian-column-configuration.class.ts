import { ElementColumnConfiguration } from './element-column-configuration.interface';
import { DataColumnConfiguration } from './data-column-configuration.abstract';

export class AccordianColumnConfiguration extends DataColumnConfiguration implements ElementColumnConfiguration {
  createElementHeader(workingNode: any, columnID: string) {
    workingNode.children.push(
      {
        'headerName': 'Value',
        'field': columnID + '_v',
      },
      {
        'headerName': 'Unit',
        'field': columnID + '_u',
        'columnGroupShow': 'open',
      },
      {
        'headerName': 'QA Summary',
        'field': columnID + '_qa',
        'columnGroupShow': 'open',
      }
    );
  }

  createElementData(element, columnID: string) {
    return {
      [columnID + '_v']: element.value,
      [columnID + '_u']: element.unit,
      [columnID + '_qa']: element.overallQASummary,
    };
  }

}
