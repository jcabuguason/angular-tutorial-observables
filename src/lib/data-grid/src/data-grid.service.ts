import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ElementGroup, ElementVisibility, UserConfigService } from 'msc-dms-commons-angular/core/user-config';
import {
  DMSObs,
  ObsElement,
  STATION_NAME_ELEMENT,
  STATION_NAME_FIELD,
  UnitCodeConversionService,
  ValueFormatterService,
  decodeRawMessage,
  findFirstValue,
  findRevision,
  getFormattedMetadata,
  getIndexLabelTranslationKey,
  grabIndexValue,
  grabDataElements,
  grabMetadataElements,
} from 'msc-dms-commons-angular/core/obs-util';
import { Subject } from 'rxjs';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';
import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { FULL_CONFIG } from './default-grid-configs';
import { StationInfoComponent } from './station-info/station-info.component';

@Injectable()
export class DataGridService implements OnDestroy {
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
  public chartFormRequested: Subject<{ station?: string; element?: string }> = new Subject();
  public recenterObs = new Subject();
  private columnConfiguration: ElementColumnConfiguration;
  private identityHeader;
  private rawGroupHeader;
  private elementsFound: string[] = [];

  constructor(
    public translate: TranslateService,
    public userConfigService: UserConfigService,
    public unitService: UnitCodeConversionService,
    public dialog: MatDialog,
    public valueFormatterService: ValueFormatterService,
  ) {
    userConfigService.loadConfig(FULL_CONFIG);
    this.columnConfiguration = new DefaultColumnConfiguration();
    this.resetHeader();
  }

  ngOnDestroy() {
    this.reloadRequested.unsubscribe();
    this.sortRequested.unsubscribe();
    this.chartFormRequested.unsubscribe();
    this.recenterObs.unsubscribe();
  }

  getColumnConfiguration(): ElementColumnConfiguration {
    return this.columnConfiguration;
  }

  getElementsFound(): string[] {
    return this.elementsFound;
  }

  setColumnConfiguration(columnConfig: ElementColumnConfiguration) {
    this.columnConfiguration = columnConfig;
    this.resetHeader();
  }

  addRowData(obs: object) {
    this.addAllData([obs]);
  }

  addAllData(obs: object[]) {
    this.rowData.push(...obs.map((data) => this.convertToRowObject(<DMSObs>data)));
    this.adjustColumns();
    this.reloadGrid();
  }

  setData(obs: object[]) {
    this.wipeRecords();
    this.addAllData(obs);
  }

  removeAllData() {
    this.wipeRecords();
    this.reloadGrid();
  }

  wipeRecords() {
    this.rowData = [];
    this.columnsGenerated = [];
    this.elementsFound = [];
    this.resetHeader();
  }

  reloadGrid() {
    this.reloadRequested.next();
  }

  requestFilledChartForm(param: { station?: string; element?: string }) {
    this.chartFormRequested.next(param);
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

  flattenObsIdentities(obs: DMSObs) {
    return {
      obsDateTime: obs.obsDateTime,
      receivedDateTime: obs.receivedDateTime,
      uri: obs.identity,
      taxonomy: obs.taxonomy,
      primaryStationId: obs.identifier,
      station: findFirstValue(obs, STATION_NAME_ELEMENT) || obs.identifier,
      revision: findRevision(obs),
    };
  }

  flattenMetadataElements(obs: DMSObs) {
    const result = {};

    const buildColumn = (element) => {
      if (element.name != null && !this.isIgnoredElement(element.elementID, true)) {
        const headerID = ColumnConfigurationContainer.findHeaderID(element);
        result[headerID] = element;
        this.buildMetadataColumn(element, headerID);
        this.updateElementValue(element);
      }
    };

    grabMetadataElements(obs)
      .filter((e) => e != null && e.elementID != null)
      .forEach(buildColumn);

    return result;
  }

  flattenDataElements(obs: DMSObs) {
    const result = {};

    const buildColumn = (element) => {
      if (!this.isIgnoredElement(element.elementID)) {
        if (!this.elementsFound.includes(element.elementID)) {
          this.elementsFound.push(element.elementID);
        }
        const headerID = ColumnConfigurationContainer.findHeaderID(element);
        this.buildElementColumn(element, headerID);
        this.updateElementValue(element);
        const elementData = this.columnConfiguration.createElementData(element, headerID);
        Object.keys(elementData).forEach((key) => (result[key] = elementData[key]));
      }
    };

    grabDataElements(obs)
      .filter((e) => e != null && e.elementID != null)
      .forEach(buildColumn);

    return result;
  }

  flattenRawMessage(obs: DMSObs) {
    const result = {};
    if (!this.userConfigService.isLoadRawData()) {
      return result;
    }
    this.buildRawColumn(obs.rawMessage);
    result['raw_header'] = obs.rawHeader;
    result['raw_message'] = decodeRawMessage(obs.rawMessage);
    return result;
  }

  convertToRowObject(obs: DMSObs) {
    return {
      ...this.flattenObsIdentities(obs),
      ...this.flattenMetadataElements(obs),
      ...this.flattenDataElements(obs),
      ...this.flattenRawMessage(obs),
    };
  }

  adjustColumns() {
    if (!this.rowData.length) {
      return;
    }

    if (this.columnConfiguration.allowBlankDataColumns) {
      this.addEmptyDataColumns();
    }

    this.sortColumns();
  }

  private addEmptyDataColumns() {
    const isMetadata = (id) => this.userConfigService.loadAsMetadata(id);

    this.userConfigService
      .getElementOrder()
      .filter((id) => !this.isIgnoredElement(id, isMetadata(id)) && !this.elementsFound.includes(id))
      .map((id) => ({ elementID: id }))
      .forEach((elem) => {
        isMetadata(elem.elementID)
          ? this.buildMetadataColumn(elem as ObsElement)
          : this.buildElementColumn(elem as ObsElement);
      });
  }

  // TODO: This function assumes a flat column config
  private sortColumns() {
    const configOrder = this.userConfigService.getElementOrder();

    this.columnDefs = [this.identityHeader, ...this.sortMetadataCols(configOrder), ...this.sortDataCols(configOrder)];

    if (this.userConfigService.isLoadRawData()) {
      this.columnDefs.push(this.rawGroupHeader);
    }
  }

  private sortDataCols(elementOrder: string[]) {
    const sortedDataCols = [];
    const unsortedDataCols = this.columnDefs.filter(
      (col) => col.groupId !== 'identity' && col.groupId !== 'raw' && col.headerClass !== 'meta',
    );
    // workaround - parent might not have it's ID set
    const getID = (col) => col.elementID || col.children[0].elementID;

    elementOrder.forEach((elementID) => {
      const columns = unsortedDataCols.filter((col) => getID(col) === elementID);
      sortedDataCols.push(...columns);
    });

    return this.groupColumns(
      sortedDataCols.concat(unsortedDataCols.filter((col) => !elementOrder.includes(getID(col)))),
    );
  }

  private sortMetadataCols(elementOrder: string[]) {
    const metadataGroups = this.columnDefs.filter((col) => col.headerClass === 'meta');
    const remainingCol = (col) => !elementOrder.includes(col.elementID);
    const getID = (col) => col.elementID || col.children[0].elementID;

    // there may be multiple metadata element groups (Identification, Quality Assessment Summary, etc.)
    metadataGroups.forEach((group) => {
      const unsortedColumns = group.children;
      const sortedColumns = [];

      elementOrder.forEach((elementID) => {
        const matchingColumns = unsortedColumns.filter((col) => getID(col) === elementID);
        sortedColumns.push(...matchingColumns);
      });

      group.children = this.groupColumns(sortedColumns.concat(unsortedColumns.filter(remainingCol)));
    });

    const sortedGroups = metadataGroups.sort((a, b) => {
      const indexA = elementOrder.indexOf(getID(a));
      const indexB = elementOrder.indexOf(getID(b));
      // move the groups without column ordering to the end
      if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      }
      // order groups based on column ordering
      return indexA === indexB ? 0 : indexA < indexB ? -1 : 1;
    });

    return sortedGroups;
  }

  getMetadataTableInfo(nodeData) {
    return {
      name: getFormattedMetadata(nodeData[STATION_NAME_FIELD]),
      allData: this.columnDefs
        .filter((group) => group.groupId === 'identity' || group.headerClass === 'meta')
        .map((group) => group.children)
        .reduce((acc, val) => acc.concat(val))
        .filter((child) => nodeData[child.field] != null)
        .map((child) => ({
          key: !!child.elementID ? this.userConfigService.getFullDefaultHeader(child.elementID, 3) : child.field,
          value: getFormattedMetadata(nodeData[child.field]),
        })),
    };
  }

  displayMetadataTable(nodeData) {
    this.dialog.open(StationInfoComponent, {
      data: this.getMetadataTableInfo(nodeData),
    });
  }

  private resetHeader() {
    this.identityHeader = this.columnConfiguration.getIdentityHeaders();
    this.rawGroupHeader = null;
    this.columnDefs = [];
    this.columnDefs.push(this.identityHeader);
  }

  // Get the child node, or create it if it doesn't exist
  private getChildNode(
    currentNodes: any[],
    headerName: string,
    nodeNumber: string,
    elementID: string,
    isMaxDepth?: boolean,
  ) {
    const possibleMatches = currentNodes.filter((node) => node.nodeNumber === nodeNumber);

    // workaround - we need to re-evaluate the elementID checking here:
    const elementMatch = possibleMatches.find((node) => node.elementID === elementID);
    if (elementMatch != null) {
      return elementMatch;
    }
    // requires setting the ID to bottom-level columns to undefined if they become parents
    if (!isMaxDepth) {
      const parentMatch = possibleMatches.find((node) => node.elementID == null);
      if (parentMatch != null) {
        return parentMatch;
      }
    }

    const newNode: object = {
      headerName: headerName,
      headerClass: headerName === '' ? 'blank-header' : 'filled-header',
      nodeNumber: nodeNumber,
      comparator: this.comparator,
    };

    currentNodes.push(newNode);

    return newNode;
  }

  private columnBoilerplate(node, headerName, indexValue = -1) {
    const description = this.userConfigService.getDescription(node.elementID);
    return {
      headerName: headerName,
      headerTooltip: !!description ? `${description}: ${headerName}` : undefined,
      children: [],
      elementID: node.elementID,
      indexValue: indexValue,
      comparator: this.comparator,
    };
  }

  private makeDefaultColumn(node) {
    const columnToAdd = this.columnBoilerplate(node, this.userConfigService.getDefaultTag());
    node.children.unshift(columnToAdd);
    return columnToAdd;
  }

  private buildElementColumn(
    element: ObsElement,
    headerID: string = ColumnConfigurationContainer.findHeaderID(element),
  ) {
    if (this.columnsGenerated.includes(headerID)) {
      return;
    }
    const elementID = element.elementID;
    const nodes = elementID.split('.');
    let currentNodes: any[] = this.columnDefs;
    let workingNode;

    const startIndex = 2;
    const nestingDepth = this.userConfigService.getNestingDepth(elementID);
    const officialTitle = this.userConfigService.getElementOfficialIndexTitle(elementID);

    // find workingNode to add to
    for (let i = startIndex; i <= nestingDepth; i++) {
      const headerName = this.userConfigService.getFormattedNodeName(elementID, i);
      const nodeIndex = i - 1;

      // When we reach a "0" node, try to use the previous working node if it exists
      // Otherwise create a new child node for the new header
      if (!headerName && workingNode == null) {
        break;
      } else if (!!headerName) {
        workingNode = this.getChildNode(currentNodes, headerName, nodes[nodeIndex], elementID, i === nestingDepth);
      }

      if (workingNode.headerTooltip == null) {
        workingNode.headerTooltip = this.userConfigService.getDescription(elementID, i);
      }

      // Build child node array
      if (workingNode.children === undefined) {
        workingNode.children = [];
      }

      // workaround - field signifies a bottom-level column:
      // this column needs to go from a bottom-level to a default with siblings
      if (!!workingNode.field) {
        this.columnConfiguration.createElementHeader(this.makeDefaultColumn(workingNode), workingNode.field);
        workingNode.field = undefined;
      }
      currentNodes = workingNode.children;
    }

    if (workingNode.elementID === undefined) {
      workingNode.elementID = elementID;

      if (!workingNode.children.length) {
        workingNode.headerName += this.userConfigService.getFormattedSubHeader(elementID);
      }
    }

    // Generate layer children if needed
    let columnToAdd;
    const elementIndexValue = grabIndexValue(element);
    if (elementIndexValue !== undefined) {
      const headerName = elementIndexValue
        ? `${this.translate.instant(getIndexLabelTranslationKey(element))} ${elementIndexValue}`
        : officialTitle;
      columnToAdd = this.columnBoilerplate(workingNode, headerName, elementIndexValue);
      if (workingNode.children === undefined) {
        workingNode.children = [];
      }
      if (!!elementIndexValue) {
        columnToAdd.columnGroupShow = 'open';
        workingNode.openByDefault = this.columnConfiguration.expandNestedDataColumns;
      }

      workingNode.children.push(columnToAdd);
    } else {
      columnToAdd = workingNode;
      // Avoid overwritting layered/official columns
      if (workingNode.children.length) {
        columnToAdd = this.makeDefaultColumn(workingNode);
      } else if (nestingDepth === startIndex) {
        columnToAdd.headerClass = 'flat-header';
      }
    }

    // Default -> Official -> Index 1 -> ... Index N
    workingNode.children.sort((a, b) => (a.indexValue === b.indexValue ? 0 : a.indexValue < b.indexValue ? -1 : 1));

    if (this.isHiddenElement(elementID)) {
      columnToAdd.hide = true;
    }

    columnToAdd.sort = this.userConfigService.getSortType(element.elementID);
    this.addElementColumnProperties(columnToAdd);

    this.columnConfiguration.createElementHeader(columnToAdd, headerID);
    this.columnsGenerated.push(headerID);
  }

  addElementColumnProperties(column: any) {
    // empty, but allow apps to overwrite this
  }

  private buildMetadataColumn(
    element: ObsElement,
    headerID: string = ColumnConfigurationContainer.findHeaderID(element),
  ) {
    if (this.columnsGenerated.includes(headerID)) {
      return;
    }
    const nodes = element.elementID.split('.');
    const parent = this.getChildNode(
      this.columnDefs,
      this.userConfigService.getSpecificNodeValue(2, nodes[1]),
      nodes[1],
      element.elementID,
    );
    const getHeaderName = () => {
      const node2 = this.userConfigService.getFormattedNodeName(element.elementID, 2);
      return parent.headerName === node2 ? this.userConfigService.getFormattedNodeName(element.elementID, 3) : node2;
    };

    // metadata name using userConfigService may be slightly different than 2.5.6
    const header = {
      headerName: getHeaderName(),
      headerTooltip: this.userConfigService.getDescription(element.elementID),
      field: headerID,
      width: 80,
      hide: this.isHiddenElement(element.elementID, true),
      type: 'identity',
      elementID: element.elementID,
      sort: this.userConfigService.getSortType(element.elementID),
    };

    if (parent.children === undefined) {
      parent.children = [];
      parent.headerClass = 'meta';
    }
    parent.children.push(header);

    this.columnConfiguration.createElementHeader(header, headerID);
    this.columnsGenerated.push(headerID);
  }

  private isIgnoredElement(elementID: string, isMetadata?: boolean): boolean {
    return (
      elementID == null ||
      this.userConfigService.getElementVisibility(elementID, isMetadata) === ElementVisibility.NoLoad
    );
  }

  private isHiddenElement(elementID: string, isMetadata?: boolean): boolean {
    // should return default even if use empty user config
    return this.userConfigService.getElementVisibility(elementID, isMetadata) === ElementVisibility.Hidden;
  }

  /** Comparator used for sorting data element columns */
  private comparator(valueA: any, valueB: any) {
    // Deal with blank and missing values
    const isBlank = (value: any): boolean => value == null || value === '' || value === '-';

    const compareMissing = (valueAMissing: boolean, valueBMissing: boolean): number => {
      if (valueAMissing && valueBMissing) {
        return 0;
      }
      if (valueAMissing) {
        return -1;
      }
      if (valueBMissing) {
        return 1;
      }
    };

    const blankResult = compareMissing(isBlank(valueA), isBlank(valueB));
    if (blankResult != null) {
      return blankResult;
    }

    const msngResult = compareMissing(valueA === 'MSNG', valueB === 'MSNG');
    if (msngResult != null) {
      return msngResult;
    }

    // Deal with numbers in string format
    if (!isNaN(valueA) && !isNaN(valueB)) {
      valueA = Number(valueA);
      valueB = Number(valueB);
    }
    // Function used in the default sort of ag-grid so no performance change in terms of sorting
    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
  }

  private buildRawColumn(rawMessage: string) {
    if (this.rawGroupHeader == null) {
      this.rawGroupHeader = this.columnConfiguration.getRawGroupHeader();
      if (this.userConfigService.isLoadRawHeader()) {
        this.rawGroupHeader.children.push(this.columnConfiguration.getRawHeader());
      }
      this.columnDefs.push(this.rawGroupHeader);
    }

    if (!!rawMessage) {
      const rawMessageHeader = this.columnConfiguration.getRawMessageHeader();
      const children = this.rawGroupHeader.children.map((child) => child.field);
      if (!children.includes(rawMessageHeader.field)) {
        this.rawGroupHeader.children.push(rawMessageHeader);
      }
    }

    for (const rawCol of this.rawGroupHeader.children) {
      rawCol.hide = !this.userConfigService.isVisibleRawData();
    }
  }

  private updateElementValue(element: ObsElement) {
    this.unitService.setPreferredUnits(element);
    this.valueFormatterService.setFormattedValue(
      element,
      this.userConfigService.getElementDisplayFormat(element.elementID),
    );
  }

  private groupColumns(columns) {
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
