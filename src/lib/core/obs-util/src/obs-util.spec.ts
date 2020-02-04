import * as obsUtil from './obs-util.class';

describe('ObsUtil', () => {
  const obsList = require('../../../data-chart/src/sample-data-1032731.json').hits.hits;
  const obs1 = obsList[0]._source;
  const obs2 = obsList[1]._source;
  it('should find metadata', () => {
    expect(obsUtil.findMetadataValue(obs1, obsUtil.PROVINCE_ELEMENT)).toBe('BC');

    expect(obsUtil.findMetadataValue(obs1, 'nonexistant')).toBeUndefined();
  });

  it('should find revision', () => {
    expect(obsUtil.findMetadataValue(obs1, obsUtil.CORRECTION_ELEMENT)).toBe('orig');
    expect(obsUtil.findMetadataValue(obs1, obsUtil.VERSION_ELEMENT)).toBe('0');
    expect(obsUtil.findRevision(obs1)).toBe('orig');

    const setMeta = (n, v) => (obs1.metadataElements.find(md => md.name === n).value = v);
    setMeta('ver', 5);
    expect(obsUtil.findRevision(obs1)).toBe('orig_v5');
    setMeta('cor', 'CCA');
    expect(obsUtil.findRevision(obs1)).toBe('CCA_v5');

    // obs2 only 'rev' instead of 'cor'
    expect(obsUtil.findRevision(obs2)).toBe('orig_v2');

    const revIndex = obs2.metadataElements.findIndex(md => md.name === 'rev');
    const revObj = obs2.metadataElements.splice(revIndex, 1)[0];
    expect(obsUtil.findRevision(obs2)).toBe('');
    obs2.metadataElements.push(revObj);
  });

  it('should compare datetimes', () => {
    obs1.obsDateTime = '2017-01-01T03:00:00.000Z';
    obs2.obsDateTime = '2018-04-22T03:00:00.000Z';
    expect(obsUtil.compareObsTimeFromObs(obs1, obs2)).toBeLessThan(0);

    expect(obsUtil.compareObsTime('2018-04-22T00:00:00.000Z', '2018-04-30T22:00:00.000Z')).toBeLessThan(0);
    expect(obsUtil.compareObsTime('2018-04-30T22:00:00.000Z', '2018-04-22T00:00:00.000Z')).toBeGreaterThan(0);
    expect(obsUtil.compareObsTime('2018-04-22T00:00:00.000Z', '2018-04-22T00:00:00.000Z')).toBe(0);
    expect(obsUtil.compareObsTime(Date.parse('2018-04-22T00:00:00.000Z'), Date.parse('2018-04-22T00:00:00.000Z'))).toBe(
      0,
    );
    expect(obsUtil.compareObsTime('not-real', '2018-04-22T00:00:00.000Z')).toBe(-1);
    expect(obsUtil.compareObsTime('2018-04-22T00:00:00.000Z', 'not-real')).toBe(1);
    expect(obsUtil.compareObsTime('not-real', 'also-not-real')).toBe(0);
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
    expect(obsUtil.formatElementID('e_1_2_3_4_5_6_7')).toBe('1.2.3.4.5.6.7');
  });

  it('should modify date format correctly', () => {
    expect(obsUtil.formatDateToISO('2018-11-11T02:00')).toBe('2018-11-11T02:00:00.000Z');
    expect(obsUtil.formatDateRemoveSeconds('2018-11-11T02:00:00.000Z')).toBe('2018-11-11T02:00');
    expect(obsUtil.formatDateRemoveSecondsAndTimeDelimeter('2018-11-11T02:00:00.000Z')).toBe('2018-11-11 02:00');
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
