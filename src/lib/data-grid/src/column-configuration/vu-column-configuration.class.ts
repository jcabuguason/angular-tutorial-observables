import { ElementColumnConfiguration } from './element-column-configuration.interface';
import { DataColumnConfiguration } from './data-column-configuration.abstract';

export class VUColumnConfiguration extends DataColumnConfiguration implements ElementColumnConfiguration {
  createElementHeader(workingNode: any, elementTaxonomy: string) {
    if (workingNode.children == null) {
      workingNode.children = [];
    }
    workingNode.children.push(
      ...[
        {
          headerName: 'Value',
          field: elementTaxonomy + '_v',
        },
        {
          headerName: 'Unit',
          field: elementTaxonomy + '_u',
        },
      ]
    );
  }

  createElementData(element, columnID: string) {
    return {
      [columnID + '_v']: element.value,
      [columnID + '_u']: element.unit,
    };
  }
}
