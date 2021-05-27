import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ValueFormatterService } from 'msc-dms-commons-angular/core/obs-util';
import { ElementVisibility, MR_MAPPING_CONFIG, UserConfigService } from 'msc-dms-commons-angular/core/user-config';
import { CombinedHttpLoader } from 'msc-dms-commons-angular/shared/language';
import { VUColumnConfiguration } from './column-configuration/vu-column-configuration.class';
import { GridService } from './grid.service';

const noLoadElement = '1.19.265.7.1.1.0';
const hiddenElement = '1.24.314.7.10.4.6';
const blankElement = '1.x.0.0.0.0.0';

// Needs to be Injectable because it's extending the actual service. Can the needed functions be mocked instead?
@Injectable()
class MockConfigService extends UserConfigService {
  getElementOrder = () => [blankElement]; // forces a blank column
  getNestingDepth = () => 3;
  getFormattedNodeName = (elementID, index) => `node ${elementID}`;
  getFormattedSubHeader = (elementID) => '';
  getByElementName = (element) => '';
  getElementVisibility(elementID) {
    switch (elementID) {
      case noLoadElement:
        return ElementVisibility.NoLoad;
      case hiddenElement:
        return ElementVisibility.Hidden;
      default:
        return ElementVisibility.Default;
    }
  }
  getMetaElementVisibility(elementID) {}
  getDescription = (elementID: string, nodeIndex: number): string => '';
  getElementOfficialIndexTitle = (elementID: string) => 'Official';
  getDefaultTag = () => 'Layer';
}

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (httpClient) =>
              new CombinedHttpLoader(httpClient, '0', [{ prefix: '../../../assets/i18n/', suffix: '.json' }]),
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        GridService,
        TranslateService,
        ValueFormatterService,
        { provide: UserConfigService, useClass: MockConfigService },
        { provide: MR_MAPPING_CONFIG, useValue: {} },
      ],
    });

    service = getTestBed().inject(GridService);
  });

  it('should set column configurations', () => {
    const getName = () => service.getColumnConfiguration().constructor.name;
    expect(getName()).toBe('DefaultColumnConfiguration');

    service.setColumnConfiguration(new VUColumnConfiguration());
    expect(getName()).toBe('VUColumnConfiguration');
  });
});
