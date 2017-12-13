import { ElementColumnConfiguration } from './element-column-configuration.interface';

export class ColumnConfigurationContainer {
  constructor( public name: string, public configuration: ElementColumnConfiguration) {
  }

  static convertHeader(elementHeader: string, index?: number): string {
    let header = 'e_' + elementHeader.replace(/\./gi, '_');

    if (index !== undefined) {
      header += '-L' + Math.trunc(index);
    }
    return header;
  }

  static findHeaderID(element): string {
    return this.convertHeader(element.elementID, element.indexValue);
  }

  static valueOrDash(data, key: string): string {
    try {
      return data[key];
    } catch (e) {
      return '-';
    }
  }
}
