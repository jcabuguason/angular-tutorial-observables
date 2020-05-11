import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UnitCodeConversionService } from './unit-code-conversion.service';
import { UNIT_CODE_CONVERSION_CONFIG, UnitCodeConversionConfig } from './unit-code-conversion.config';
import { ObsElement } from '../dms-observation.model';
import { FromUnits } from './unit-code-conversion.model';

describe('UnitCodeConversionService', () => {
  let service: UnitCodeConversionService;
  let config: UnitCodeConversionConfig;
  let unitConversions: FromUnits;

  beforeEach(() => {
    config = {
      endpoint: 'http://www.test.com',
    };

    unitConversions = {
      Pa: {
        daPa: {
          multiplier: 0.1,
          offset: 0.0,
        },
      },
      m: {
        mm: {
          multiplier: 1000.0,
          offset: 0.0,
        },
        ft: {
          multiplier: 3.2808399,
          offset: 0.0,
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnitCodeConversionService, { provide: UNIT_CODE_CONVERSION_CONFIG, useValue: config }],
    });

    service = getTestBed().inject(UnitCodeConversionService);
  });

  it('should return same value due to non-number element value', () => {
    const element: ObsElement = {
      name: 'temp',
      elementID: '1.2.3.4.5.6.7',
      value: 'Marlowe',
      unit: 'm',
    };
    service.convertElement(element, unitConversions, 'm');
    expect(element.preferredValue).toBe('Marlowe');
  });

  it('should return converted value', () => {
    const element: ObsElement = {
      name: 'temp',
      elementID: '1.2.3.4.5.6.7',
      value: '42',
      unit: 'Pa',
    };
    service.convertElement(element, unitConversions, 'daPa');
    expect(element.preferredValue).toBe('4.2');
  });

  it('should return same value as no conversion exists', () => {
    const element: ObsElement = {
      name: 'temp',
      elementID: '1.2.3.4.5.6.7',
      value: '42',
      unit: 'm',
    };
    service.convertElement(element, unitConversions, 'daPa');
    expect(element.preferredValue).toBe('42');
  });

  it('should return a rounded value', () => {
    const element: ObsElement = {
      name: 'temp',
      elementID: '1.2.3.4.5.6.7',
      value: '42.123',
      unit: 'm',
    };
    service.convertElement(element, unitConversions, 'm', 1);
    expect(element.preferredValue).toBe('42.1');
  });

  it('should return converted code value', () => {
    expect(service.codeSubstitution('E', 'airmet_sigmet', 'compass_direction').codeValue).toBe('E');
    expect(service.codeSubstitution('E', 'airmet_sigmet', 'compass_direction').en).toBe('East');
  });

  it('should return same code value since conversion was invalid', () => {
    expect(service.codeSubstitution('Indiana', 'airmet_sigmet', 'compass_direction')).toBeUndefined();
  });
});
