import { Injectable } from '@angular/core';
import { ObsElement } from '../dms-observation.model';
import { convertDDToDMS } from '../obs-util.class';
import { ValueFormats } from './value-formatter.model';

@Injectable()
export class ValueFormatterService {
  public useFormattedValue = false;

  constructor() {}

  // should be called after unit conversion
  setFormattedValue(element: ObsElement, displayFormat: string) {
    element.displayFormat = displayFormat;

    const numericValue = Number(element.value);
    const convertToDMS = element.displayFormat === ValueFormats.DegreesMinutesSeconds && !isNaN(numericValue);
    element.formattedValue = convertToDMS
      ? convertDDToDMS(numericValue, this.isLatitude(element.elementID))
      : element.value;
  }

  // gets the formatted value from the grid params
  getFormattedValueFromGrid(params) {
    if (this.useFormattedValue) {
      const field = params.column.colDef.field;
      const element = params.node.data[field];
      return element != null && element.formattedValue != null ? element.formattedValue : params.value;
    }
    return params.value;
  }

  private isLatitude(elementID): boolean {
    // "givenNameNode" because that's what the 3rd node in an element is supposed to represent
    // See MR definition: http://dw-stability.to.on.ec.gc.ca:8180/metadata/dms/mr/dm/element_taxonomy_node_3/definition-xml-2.0
    const givenNameNode = elementID.split('.')[2];
    const latitudeNodes = ['34', '97', '861'];
    return elementID != null && latitudeNodes.includes(givenNameNode);
  }
}
