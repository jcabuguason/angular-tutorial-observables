import { Component, OnInit, OnDestroy, Input, Optional, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RawDataService } from './raw-data.service';
import { RawData, RawMessage } from './raw-data.model';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

type HighlightClass = 'suppressed' | 'inactive';

@Component({
  selector: 'commons-raw-data',
  templateUrl: './raw-data.component.html',
  styleUrls: ['./raw-data.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RawDataComponent implements OnInit, OnDestroy {
  useLegacyTable: boolean;
  dataSource: RawMessage;
  displayedColumns = ['position', 'suppressed', 'active', 'description', 'value'];
  data: RawData;
  private ngUnsubscribe = new Subject();

  constructor(
    @Optional() public dialogConfig: DynamicDialogConfig,
    public translate: TranslateService,
    public rawDataService: RawDataService,
  ) {}

  @Input() set rawData(rawData: RawData) {
    this.data = rawData;
    this.displayData();
  }

  ngOnInit() {
    if (this.dialogConfig) {
      this.data = this.dialogConfig.data;
      this.displayData();
    }

    LanguageService.translator.onLangChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.dataSource) {
        this.dataSource = this.buildSource(this.dataSource);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getStaciLink() {
    return `/services/staci/${this.translate.currentLang}/station/${this.data.stationID}/table`;
  }

  buildStationTitle() {
    return `${this.data.stationName} (${this.data.tcID} - ${this.data.date})`;
  }

  formatBooleanValue(value) {
    if (value === '') {
      return value;
    } else {
      return value === 'true' ? this.translate.instant('RAW_DATA.YES') : this.translate.instant('RAW_DATA.NO');
    }
  }

  pickHighlight(row): HighlightClass {
    if (row.suppressed === 'true') {
      return 'suppressed';
    } else if (row.active === 'false') {
      return 'inactive';
    }
  }

  getTooltip(column) {
    if (column === 'position') {
      return this.translate.instant('RAW_DATA.POSITION_FULL');
    } else if (column === 'suppressed') {
      return this.translate.instant('RAW_DATA.SUPPRESSED_FULL');
    } else if (column === 'active') {
      return this.translate.instant('RAW_DATA.ACTIVE_FULL');
    }
  }

  displayData() {
    if (this.data == null) return;
    this.rawDataService.getRawData(this.data.uri).subscribe(
      (res) => {
        this.dataSource = this.buildSource(res['elements']);
        this.useLegacyTable = false;
      },
      (error) => (this.useLegacyTable = true),
    );
  }

  private buildSource(message: any) {
    const currentLang = this.translate.currentLang;
    return message.map((element) => ({
      ...element,
      description: element.name.find((translation) => translation.hasOwnProperty(currentLang))?.[currentLang],
    }));
  }
}
