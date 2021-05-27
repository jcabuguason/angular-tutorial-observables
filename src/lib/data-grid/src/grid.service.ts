import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValueFormatterService } from 'msc-dms-commons-angular/core/obs-util';
import { ElementGroup, UserConfigService } from 'msc-dms-commons-angular/core/user-config';
import { Subject } from 'rxjs';
import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { FULL_CONFIG } from './default-grid-configs';

@Injectable()
export class GridService implements OnDestroy {
  public columnsGenerated: string[] = [];
  public rowData: object[] = [];
  public columnDefs: any[];
  public columnTypes = { identity: {} };
  public defaultColDef = {
    filter: true,
    resizable: true,
    sortable: true,
    menuTabs: ['generalMenuTab', 'filterMenuTab'],
  };
  public reloadRequested = new Subject();
  public sortRequested = new Subject();
  private columnConfiguration: ElementColumnConfiguration;

  constructor(
    protected translate: TranslateService,
    protected userConfigService: UserConfigService,
    protected valueFormatterService: ValueFormatterService,
  ) {
    this.userConfigService.loadConfig(FULL_CONFIG);
    this.columnConfiguration = new DefaultColumnConfiguration();
    this.resetHeader();
  }

  ngOnDestroy() {
    this.reloadRequested.unsubscribe();
    this.sortRequested.unsubscribe();
  }

  getColumnConfiguration(): ElementColumnConfiguration {
    return this.columnConfiguration;
  }

  setColumnConfiguration(columnConfig: ElementColumnConfiguration) {
    this.columnConfiguration = columnConfig;
    this.resetHeader();
  }

  reloadGrid() {
    this.reloadRequested.next();
  }

  requestSortModelChange(param: any) {
    this.sortRequested.next(param);
  }

  getContextMenuItems() {
    return this.columnConfiguration.getContextMenuItems(this);
  }

  getMainMenuItems() {
    return this.columnConfiguration.getMainMenuItems(this);
  }

  expandAllColumns(columnApi, expand: boolean) {
    const groupIds = [];
    const getGroupIds = (colGroup) => {
      if (colGroup.children) {
        const allChildrenDisplayed = colGroup.children.length === colGroup.displayedChildren.length;
        // Mark groups who's children don't match the given expand/collapse command
        if (expand ? !allChildrenDisplayed : allChildrenDisplayed) {
          groupIds.push(colGroup.groupId);
        }
        colGroup.children.forEach((child) => getGroupIds(child));
      }
      return colGroup;
    };

    columnApi
      .getAllDisplayedColumnGroups()
      .filter((col) => col.groupId !== 'identity' && col.groupId !== 'raw' && col.headerClass !== 'meta')
      .forEach((col) => getGroupIds(col));

    groupIds.forEach((id) => columnApi.setColumnGroupOpened(id, expand));
  }

  resetHeader() {
    this.columnDefs = [];
  }

  addRowData(data: object) {
    this.addAllData([data]);
  }

  setData(data: object[]) {
    this.wipeRecords();
    this.addAllData(data);
  }

  removeAllData() {
    this.wipeRecords();
    this.reloadGrid();
  }

  wipeRecords() {
    this.rowData = [];
    this.columnsGenerated = [];
    this.resetHeader();
  }

  addAllData(data: object[]) {
    this.rowData.push(...data);
    this.adjustColumns();
    this.reloadGrid();
  }

  adjustColumns() {
    if (!this.rowData.length) {
      return;
    }

    if (this.columnConfiguration.allowBlankDataColumns) {
      this.addEmptyColumns();
    }

    this.sortColumns();
  }

  addEmptyColumns() {}
  sortColumns() {}

  groupColumns(columns) {
    if (this.userConfigService.getAllElementGroups().length === 0) {
      return columns;
    }

    const groupedColumns = [];
    const createGroup = (configGroup: ElementGroup) => ({
      headerName: configGroup.groupName.getName(),
      headerTooltip: configGroup.groupDescription.getName(),
      groupId: configGroup.groupID,
      children: [],
    });

    // TODO group multiple ids in the order each id is defined
    for (const curCol of columns) {
      const configGroup: ElementGroup = this.userConfigService.getElementGroup(curCol.elementID);
      if (configGroup == null) {
        groupedColumns.push(curCol);
        continue;
      }

      let groupDef = groupedColumns.find((col) => col.groupId === configGroup.groupID);
      if (groupDef == null) {
        groupDef = createGroup(configGroup);
        groupedColumns.push(groupDef);
      }

      if (curCol.headerClass === 'flat-header') {
        curCol.headerClass = 'filled-header';
      }

      groupDef.children.push(curCol);
    }

    return groupedColumns;
  }
}
