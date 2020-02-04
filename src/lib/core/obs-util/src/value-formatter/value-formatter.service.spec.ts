import { TestBed, getTestBed } from '@angular/core/testing';
import { DataElements } from '../dms-observation.model';
import { ValueFormatterService } from './value-formatter.service';
import { ValueFormats } from './value-formatter.model';

describe('ValueFormatterService', () => {
  let service: ValueFormatterService;

  const originalLatitude = '50.11151';
  const formattedLatitude = `50\xB0 06' 41.436" DIRECTION.NORTH_SHORT`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueFormatterService],
    });
    service = getTestBed().get(ValueFormatterService);
  });

  it('should format element', () => {
    const latitudeElement: DataElements = {
      name: 'latitude',
      elementID: '1.7.97.0.0.0.0',
      value: originalLatitude,
      unit: 'unitless',
    };
    service.setFormattedValue(latitudeElement, ValueFormats.DegreesMinutesSeconds);
    expect(latitudeElement.formattedValue).toEqual(formattedLatitude);
  });

  describe('using grid params', () => {
    const latitudeElement: DataElements = {
      name: 'latitude',
      elementID: '1.7.97.0.0.0.0',
      value: originalLatitude,
      unit: 'unitless',
      formattedValue: formattedLatitude,
    };
    const longitudeElement: DataElements = {
      name: 'longitude',
      elementID: '1.7.98.0.0.0.0',
      value: '-132',
      unit: 'unitless',
      formattedValue: '-132',
    };
    const gridParams = {
      column: {
        colDef: {
          field: 'e_1_7_97_0_0_0_0',
        },
      },
      node: {
        data: {
          e_1_7_97_0_0_0_0: latitudeElement,
          e_1_7_98_0_0_0_0: longitudeElement,
        },
      },
      value: originalLatitude,
    };

    it('should get the formatted value', () => {
      service.useFormattedValue = true;
      expect(service.getFormattedValueFromGrid(gridParams)).toBe(formattedLatitude);
    });

    it('should get the unformatted value using grid params', () => {
      service.useFormattedValue = false;
      expect(service.getFormattedValueFromGrid(gridParams)).toBe(originalLatitude);
    });
  });
});
