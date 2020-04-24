import { ElementColumnConfiguration } from './element-column-configuration.interface';
import { grabIndexValue } from 'msc-dms-commons-angular/core/obs-util';

// @dynamic
export class ColumnConfigurationContainer {
  constructor(public name: string, public configuration: ElementColumnConfiguration) {}

  static convertHeader(elementHeader: string, index?: number): string {
    let header = `e_${elementHeader.replace(/\./gi, '_')}`;

    if (index !== undefined) {
      header += `-L${Math.trunc(index)}`;
    }
    return header;
  }

  static findHeaderID(element): string {
    return ColumnConfigurationContainer.convertHeader(element.elementID, grabIndexValue(element));
  }

  static valueOrDash(data, key: string): string {
    return data && data[key] ? data[key] : '-';
  }

  static removeLayers(element: string): string {
    return element.replace(/-L[0-9]+/gi, '');
  }
}
