import { TestBed, getTestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import { DataGridService } from './data-grid.service';
import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { VUColumnConfiguration } from './column-configuration/vu-column-configuration.class';
import { AccordianColumnConfiguration } from './column-configuration/accordian-column-configuration.class';
import { UserConfigService, ElementVisibility } from 'msc-dms-commons-angular/core/metadata';

describe('DataGridService', () => {
    let service: DataGridService;
    const hits = require('./sample-hits.json').map(row => row._source);
    const noLoadElement = '1.12.210.0.0.0.0';
    const hiddenElement = '1.13.215.0.0.0.0';
    const blankElement = '1.x.0.0.0.0.0';

    class MockConfigService {
        getElementOrder() {
            return [blankElement];
        }
        getNestingDepth() {
            return 3;
        }
        getFormattedNodeName(elementID, index) {
            return 'node ' + elementID;
        }
        getFormattedSubHeader(elementID) {
            return ',sub header ' + elementID;
        }
        getByElementName(element) {
            return '';
        }
        getMetaElementVisibility(elementID) { }
        getElementIndexTitle(elementID: string): string {
            return 'Layer';
        }
        getElementVisibility(elementID) {
            switch (elementID) {
                case noLoadElement: return ElementVisibility.NO_LOAD;
                case hiddenElement: return ElementVisibility.HIDDEN;
                default: return ElementVisibility.DEFAULT;
            }
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DataGridService,
                UserConfigService,
                { provide: UserConfigService, useClass: MockConfigService }
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
        ).toEqual([ 11, 19, 12, 5, 20, 17, 23, 6, 24, 13, 2 ]);
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

    it('should avoid generating specific rows if configured', () => {
        const someDisplayCols = ['1.11.171.1.62.9.0', '1.12.212.0.0.0.0'];
        service.addRowData(hits[0]);

        const row = service.rowData[0];
        const getKey = (eti: string) => row['e_' + eti.replace(/\./g, '_')];
        expect(getKey(someDisplayCols[0])).toBe('MSNG');
        expect(getKey(someDisplayCols[1])).toBe('100900.0');
        expect(getKey(noLoadElement)).toBeUndefined();
        expect(service.columnDefs.length).toBe(12);
    });

    it('should hide non-displayed rows if configured', () => {
        service.addRowData(hits[0]);

        // only for one-layer of children headers
        const isHidden = (headerName, eti) => service.columnDefs
            .find(n => n.headerName === headerName).children
            .find(n => n.elementID === eti).hide;

        expect(isHidden('node 1.13.215.0.0.0.0', '1.13.215.0.0.0.0')).toBeTruthy();
        expect(service.columnDefs.length).toBe(12);
    });

    it('allow blank columns', () => {
        service.getColumnConfiguration().allowBlankDataColumns = true;
        service.addRowData(hits[0]);

        const row = service.rowData[0];
        const getKey = (eti: string) => row['e_' + eti.replace(/\./g, '_')];
        expect(getKey(blankElement)).toBeUndefined();
        expect(service.columnDefs.length).toBe(13);
    });

});
