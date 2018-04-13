import { TestBed, getTestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import { DataGridService } from './data-grid.service';
import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { VUColumnConfiguration } from './column-configuration/vu-column-configuration.class';
import { AccordianColumnConfiguration } from './column-configuration/accordian-column-configuration.class';

describe('DataGridService', () => {
    let service: DataGridService;
    const hits = require('./sample-hits.json').map(row => row._source);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DataGridService,
            ],
        });

        service = getTestBed().get(DataGridService);
    });

    it('should set column configurations', () => {
        const getName = () => service.getColumnConfiguration().constructor.name;
        expect(getName()).toBe('DefaultColumnConfiguration');

        service.setColumnConfiguration(new VUColumnConfiguration());
        expect(getName()).toBe('VUColumnConfiguration');
    });

    it('should add a single obs', () => {
        expect(service.rowData.length).toBe(0);
        expect(service.columnDefs.length).toBe(1);
        expect(service.columnDefs[0].children)
            .toEqual(service.getColumnConfiguration().getIdentityHeaders().children);

        service.addRowData(hits[0]);
        expect(service.rowData.length).toBe(1);
        expect(service.columnDefs.length).toBe(12);

        const row = service.rowData[0];
        expect(row['clim_id']).toBe('1021270');
        expect(row['station']).toBe('Campbell River');
        expect(row['e_1_24_340_0_10_4_6']).toBe('48');
        expect(row['e_7_7_7_7_7_7_7']).toBeUndefined();

        expect(service.columnDefs
            .filter(col => col.headerName !== 'Identity')
            .map(col => Number(col.nodeNumber))
        ).toEqual([11, 12, 19, 5, 20, 17, 23, 6, 24, 13, 2]);
    });

    it('should add a list of obs', () => {
        expect(service.rowData.length).toBe(0);

        service.addAllData(hits);

        expect(service.rowData.length).toBe(hits.length);

        const rows = service.rowData;
        expect(rows[0]['obsDateTime']).toBe('2018-03-05T01:00:00Z');
        expect(rows[1]['obsDateTime']).toBe('2018-03-05T02:00:00Z');
    });

    it('should clear the data', () => {
        service.addAllData(hits);
        service.removeAllData();

        expect(service.rowData).toEqual([]);
        expect(service.columnDefs.length).toBe(1);
    });

    it('should add value-unit rows when configured', () => {
        service.setColumnConfiguration(new VUColumnConfiguration());
        service.addRowData(hits[0]);

        const row = service.rowData[0];
        expect(row['e_1_24_340_0_10_4_6_v']).toBe('48');
        expect(row['e_1_24_340_0_10_4_6_u']).toBe('°');
    });

    it('should avoid generating hidden rows if configured', () => {
        const displayCols = ['1.11.171.1.62.9.0', '1.12.212.0.0.0.0'];
        service.getColumnConfiguration().ignoreHideableColumns = true;
        service.setUserDisplayColumns(displayCols);
        service.addRowData(hits[0]);

        const row = service.rowData[0];
        const getKey = (eti: string) => row['e_' + eti.replace(/\./g, '_')];
        expect(getKey(displayCols[0])).toBe('MSNG');
        expect(getKey(displayCols[1])).toBe('100900.0');
        expect(getKey('1.12.214.0.0.0.0')).toBeUndefined();
        expect(service.columnDefs.length).toBe(3);
    });

    it('should hide non-displayed rows if configured', () => {
        service.setUserDisplayColumns(['1.12.212.0.0.0.0']);
        service.addRowData(hits[0]);

        const row = service.rowData[0];
        const getKey = (eti: string) => row['e_' + eti.replace(/\./g, '_')];
        expect(getKey('1.12.212.0.0.0.0')).toBe('100900.0');
        expect(getKey('1.12.214.0.0.0.0')).toBe('0');

        // only for one-layer of children headers
        const isHidden = (headerName, eti) => service.columnDefs
            .find(n => n.headerName === headerName).children
            .find(n => n.elementID === eti).hide;

        expect(isHidden('Pressure', '1.12.212.0.0.0.0')).toBeUndefined();
        expect(isHidden('Pressure', '1.12.214.0.0.0.0')).toBeTruthy();
        expect(service.columnDefs.length).toBe(12);
    });

});
