import { Component, OnInit } from '@angular/core';

import { ColumnApi, GridApi, GridOptions } from 'ag-grid/main';

import { DataGridService } from './data-grid.service';

@Component({
  selector: 'commons-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {
    private gridOptions: GridOptions;
    private icons: any;

    public rowData: any[];
    public columnDefs: any[];
    public rowCount: string;
    public showToolPanel: boolean;

    private gridApi: GridApi;
    private gridColumnApi: ColumnApi;

    private getMainMenuItems;

    constructor(private gridService: DataGridService) {
        this.gridOptions = <GridOptions>{};

        this.columnDefs = this.gridService.columnDefs;
        this.rowData = this.gridService.rowData;

        this.gridOptions.rowData = this.gridService.rowData;
        this.gridOptions.columnDefs = this.gridService.columnDefs;
        this.showToolPanel = true;

        // Part of change where non-commons components get passed in??
        this.getMainMenuItems = this.gridService.getColumnConfiguration().getMenuItems;
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    ngOnInit() {
        this.gridService.reloadRequested
           .subscribe(
               () => {
                   this.gridApi.setRowData(this.rowData);
                   this.gridApi.setColumnDefs(this.columnDefs);
               }
           );
    }

}
