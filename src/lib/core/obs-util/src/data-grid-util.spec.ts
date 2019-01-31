import * as dataGridUtil from './data-grid-util.class';

describe('DataGridUtil', () => {
  const dataObs = (date, stn, cor, ver, rev, tax) => ({
    obsDateTime: date,
    primaryStationId: stn,
    cor: cor,
    ver: ver,
    revision: rev,
    taxonomy: tax,
  });

  const latestDate = '2017-01-01T00:00:00.000Z';
  const latestStn = '123';
  const latestCor = 'CCB';
  const latestVer = '0';
  const latestTax = 'taxonomy';
  const allObs = {
    0: {
      data: dataObs(latestDate, latestStn, 'orig', latestVer, 'orig', latestTax),
    },
    1: {
      data: dataObs(latestDate, latestStn, 'CCA', latestVer, 'CCA', latestTax),
    },
    2: {
      data: dataObs(latestDate, latestStn, latestCor, latestVer, 'CCB', latestTax),
    },
    3: {
      data: dataObs(latestDate, 'abc', latestCor, '1', 'CCB_v1', latestTax),
    },
    4: {
      data: dataObs('2017-12-12T00:10:00.000Z', latestStn, latestCor, '1', 'CCB_v1', latestTax),
    },
    5: {
      data: dataObs(latestDate, latestStn, latestCor, latestVer, 'CCB', 'diffTaxonomy'),
    },
  };

  it('should determine if latest obs', () => {
    const paramsForData = (index: string) => ({
      node: {
        data: allObs[index].data,
        rowModel: { nodeManager: { allNodesMap: allObs } },
      },
    });
    const paramsOldOrig = paramsForData('0');
    const paramsOldCCA = paramsForData('1');
    const paramsLatestStn123 = paramsForData('2');

    expect(dataGridUtil.isLatest(paramsOldOrig)).toBeFalsy();
    expect(dataGridUtil.isLatest(paramsOldCCA)).toBeFalsy();
    expect(dataGridUtil.isLatest(paramsLatestStn123)).toBeTruthy();

    const paramsLatestStnAbc = paramsForData('3');
    const paramsLatestStn123Time = paramsForData('4');
    const paramsLatestTaxonomy = paramsForData('5');

    expect(dataGridUtil.isLatest(paramsLatestStnAbc)).toBeTruthy();
    expect(dataGridUtil.isLatest(paramsLatestStn123Time)).toBeTruthy();
    expect(dataGridUtil.isLatest(paramsLatestTaxonomy)).toBeTruthy();
  });
});
