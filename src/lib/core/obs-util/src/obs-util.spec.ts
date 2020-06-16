import * as obsUtil from './obs-util.class';

describe('ObsUtil', () => {
  const obsList = require('../../../../assets/sample-data/502s001.json').hits.hits;
  const obs1 = obsList[0]._source;
  const obs2 = obsList[1]._source;
  it('should find matching elements', () => {
    expect(obsUtil.findFirstValue(obs1, obsUtil.PROVINCE_ELEMENT)).toBe('MB');

    expect(obsUtil.findFirstValue(obs1, 'nonexistant')).toBe('');
  });

  it('should find revision', () => {
    expect(obsUtil.findFirstValue(obs1, obsUtil.CORRECTION_ELEMENT)).toBe('orig');
    expect(obsUtil.findFirstValue(obs1, obsUtil.VERSION_ELEMENT)).toBe('0');
    expect(obsUtil.findRevision(obs1)).toBe('orig');

    const tweakValue = (id, v) => (obs1[obsUtil.formatElementToEsKey(id)][0].value = v);
    tweakValue(obsUtil.VERSION_ELEMENT, 5);
    expect(obsUtil.findRevision(obs1)).toBe('orig_v5');
    tweakValue(obsUtil.CORRECTION_ELEMENT, 'CCA');
    expect(obsUtil.findRevision(obs1)).toBe('CCA_v5');

    // obs2 was tweaked to use 'rev' instead of 'cor'+'ver'
    expect(obsUtil.findRevision(obs2)).toBe('orig_v2');
  });

  it('should compare datetimes', () => {
    expect(obsUtil.compareObsTimeFromObs(obs1, obs2)).toBeLessThan(0);
  });

  it('should compare revisions', () => {
    expect(obsUtil.compareRevision('orig', 'orig')).toBe(0);
    expect(obsUtil.compareRevision('orig', 'orig_v1')).toBe(-1);
    expect(obsUtil.compareRevision('orig_v1', 'orig')).toBe(1);

    expect(obsUtil.compareRevision('orig', 'CCA')).toBe(-1);
    expect(obsUtil.compareRevision('orig_v99', 'CCA')).toBe(-1);
    expect(obsUtil.compareRevision('CCA_v1', 'CCA')).toBe(1);

    expect(obsUtil.compareRevision('CCA', 'CCB')).toBe(-1);
    expect(obsUtil.compareRevision('CCA_v8', 'CCB_v4')).toBe(-1);

    expect(obsUtil.compareRevision('', 'orig')).toBe(-1);
    expect(obsUtil.compareRevision('', 'CCA')).toBe(-1);

    expect(obsUtil.compareRevision(null, 'orig')).toBe(-1);
    expect(obsUtil.compareRevision(null, null)).toBe(0);
    expect(obsUtil.compareRevision('orig', null)).toBe(1);
  });

  it('should format QA Values', () => {
    expect(obsUtil.formatQAValue(100)).toBe('100');
    expect(obsUtil.formatQAValue(0)).toBe('0');
    expect(obsUtil.formatQAValue(-1)).toBe('-1');
    expect(obsUtil.formatQAValue(undefined)).toBe('N/A');
    expect(obsUtil.formatQAValue(null)).toBe('N/A');
  });

  it('should modify element ID format correctly', () => {
    expect(obsUtil.formatElementToColumn('1.2.3.4.5.6.7')).toBe('e_1_2_3_4_5_6_7');
    expect(obsUtil.formatColumnToElementID('e_1_2_3_4_5_6_7')).toBe('1.2.3.4.5.6.7');
    expect(obsUtil.formatColumnToElementID('e_5_5_5_5_5_5_5-L0')).toBe('5.5.5.5.5.5.5');
    expect(obsUtil.formatColumnToElementID('e_7_6_5_4_3_2_1-L12')).toBe('7.6.5.4.3.2.1');
  });

  it('should find string values in an obs', () => {
    // Multiple valid elements within obs
    expect(obsUtil.findFirstValue(obs1, '1.11.172.2.5.3.0')).toBe('223.7376');
    // MSNG value
    expect(obsUtil.findFirstValue(obs1, '1.14.221.2.1.1.0')).toBe('MSNG');
    // Element does not exist
    expect(obsUtil.findFirstValue(obs1, '123.123.123.123.123.123.123')).toBe('');
  });

  it('should find numeric values in an obs', () => {
    // Multiple valid elements within obs
    expect(obsUtil.findFirstValueNum(obs1, '1.11.172.2.5.3.0')).toBe(223.7376);
    // MSNG value
    expect(obsUtil.findFirstValueNum(obs1, '1.14.221.2.1.1.0')).toBeUndefined();
    // Element does not exist
    expect(obsUtil.findFirstValueNum(obs1, '123.123.123.123.123.123.123')).toBeUndefined();
  });

  describe('converting latitude/longitude values ', () => {
    // values from CA station 1037553
    // confirmed results with: https://www.latlong.net/lat-long-dms.html, https://www.fcc.gov/media/radio/dms-decimal
    it('should convert latitude element', () => {
      const lat = 50.11151;
      const expectedLat = `50\xB0 06' 41.436" DIRECTION.NORTH_SHORT`;
      expect(obsUtil.convertDDToDMS(lat, true)).toBe(expectedLat);
    });

    it('should convert longitude element', () => {
      const long = -127.94;
      const expectedLong = `127\xB0 56' 24.000" DIRECTION.WEST_SHORT`;
      expect(obsUtil.convertDDToDMS(long, false)).toBe(expectedLong);
    });
  });
});
