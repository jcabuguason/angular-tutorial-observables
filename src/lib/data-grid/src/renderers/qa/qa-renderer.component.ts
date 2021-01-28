import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { qaTranslationKey } from 'msc-dms-commons-angular/core/obs-util';

@Component({
  selector: 'commons-qa-renderer',
  templateUrl: './qa-renderer.component.html',
  styleUrls: ['../general-renderer.component.css', './qa-renderer.component.scss'],
})
export class QaRendererComponent implements ICellRendererAngularComp {
  constructor(public translate: TranslateService) {}
  // Used if the component is called in another template
  @Input() showDescription: boolean;
  @Input() qa: string;

  // Used if the component is set up as the column's renderer framework
  agInit(params: any): void {
    if (params.data[params.taxonomy] !== undefined) {
      this.qa = params.data[params.taxonomy]['overallQASummary'];
    }
  }

  refresh(): boolean {
    return false;
  }

  title = (qa: string) => {
    return this.showDescription
      ? `${this.translate.instant(qaTranslationKey(qa, 'label'))}: ${this.translate.instant(
          qaTranslationKey(qa, 'description'),
        )}`
      : `${this.translate.instant(qaTranslationKey(qa, 'label'))}`;
  };
}
