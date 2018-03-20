import { TestBed, getTestBed } from '@angular/core/testing';

import StationExample from './example-station';
import { StationInfoService } from './station-info.service';

describe('StationInfoService', () => {
  let service: StationInfoService;
  const sample = StationExample.station1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StationInfoService,
      ]
    });

    const injector = getTestBed();
    service = injector.get(StationInfoService);
    service.setStation(sample);
  });

  it('should contain correct station information', () => {
    expect(service.stationName).toBe('SATURNA CAPMON', 'station_name has no value, should check the languages');
    expect(service.province).toBe('BC');
    expect(service.network).toBe('CA', 'not in original sample data, but should be this stations value');
    expect(service.climateID).toBe('1017099', 'numeric raw field, service puts into string attribute');
    expect(service.tcID).toBe('VTS', 'not in original sample data, but should be this stations value');
    expect(service.wmoID).toBe('71914', 'numeric raw field, service puts into string attribute');
    expect(service.latitude).toBe('48.775', 'numeric raw field, service puts into string attribute');
    expect(service.longitude).toBe('-123.1281', 'numeric raw field, service puts into string attribute');
    expect(service.elevation).toBe('178.000', 'numeric raw field, service puts into string attribute');
  });

  it('might not be needed', () => {
    // If this module stays in Commons, the service should build an instance of Station instead
    // of parsing once station's values and storing them inside the service.
    fail('Re-evaluate the need of this module in Commons, and how it works');
  });

  it('is not vigourous', () => {
    // No badly formatted stations, ensuring the number->string conversions don't allow
    // scientific types
    fail('Tests and Module do not attempt to solve edge cases');
  });

});
