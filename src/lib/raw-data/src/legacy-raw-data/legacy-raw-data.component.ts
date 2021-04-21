import { Component, Input } from '@angular/core';
import { RawMessage } from '../raw-data.model';

@Component({
  selector: 'commons-legacy-raw-data',
  templateUrl: './legacy-raw-data.component.html',
  styleUrls: ['../raw-data.component.css'],
})
export class LegacyRawDataComponent {
  oldDataColumns = ['position', 'value'];
  dataSource: RawMessage;

  @Input() set rawMessage(message: string) {
    this.dataSource = this.buildSource(message);
  }

  private buildSource(message: string) {
    return message
      .split(/\s*[,\s/#;]\s*/)
      .slice(1)
      .map((key, i) => ({
        position: i + 1,
        value: key,
      }));
  }
}
