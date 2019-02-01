import { Injectable, OnDestroy } from '@angular/core';

import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';

import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { MatDialog } from '@angular/material/dialog';
import { StationInfoComponent } from './station-info/station-info.component';
import { FULL_CONFIG } from './default-grid-configs';
import { UserConfigService, ElementVisibility } from 'msc-dms-commons-angular/core/metadata/';

import {
  STN_NAME_FIELD,
  UnitCodeConversionService,
  DMSObs,
  MetadataElements,
  DataElements,
  RawMessage,
  IndexDetails,
} from 'msc-dms-commons-angular/core/obs-util';

// import { NodeLookups } from 'msc-dms-commons-angular/core/metadata';

import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DataGridService implements OnDestroy {
  public columnsGenerated: string[] = [];
  public rowData: object[] = [];
  public columnDefs: any[];
  public columnTypes = { identity: {} };
  public defaultColDef = { menuTabs: ['generalMenuTab', 'filterMenuTab'] };
  public reloadRequested = new Subject();
  public sortRequested = new Subject();
  public chartColumnRequested = new Subject();
  public chartFormRequested = new Subject();
  public chartRequested = new Subject();

  private columnConfiguration: ElementColumnConfiguration;
  private identityHeader;
  private rawHeader;
  private elementsFound: string[] = [];

  constructor(
    public translate: TranslateService,
    public userConfigService: UserConfigService,
    public unitService: UnitCodeConversionService,
    public dialog: MatDialog
  ) {
    userConfigService.loadConfig(FULL_CONFIG);
    this.columnConfiguration = new DefaultColumnConfiguration();
    this.resetHeader();
  }

  ngOnDestroy() {
    this.reloadRequested.unsubscribe();
    this.sortRequested.unsubscribe();
    this.chartColumnRequested.unsubscribe();
    this.chartFormRequested.unsubscribe();
    this.chartRequested.unsubscribe();
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
    this.rowData.push(...obs.map(data => this.convertToRowObject(<DMSObs>data)));
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

  chartColumn(param: any) {
    this.chartColumnRequested.next(param);
  }

  chartObject(param: any) {
    this.chartRequested.next(param);
  }

  chartFormOnColumn(param: any) {
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

  flattenObsIdentities = (obs: DMSObs) => {
    return {
      obsDateTime: obs.obsDateTime,
      receivedDateTime: obs.receivedDateTime,
      uri: obs.identity,
      taxonomy: obs.taxonomy,
      primaryStationId: obs.identifier,
      station: obsUtil.findMetadataValue(obs, 'stn_nam'),
      revision: obsUtil.findRevision(obs),
    };
  };

  flattenMetadataElements(mdElements: MetadataElements[]) {
    const result = {};
    const configElements = this.userConfigService.getElementOrder();

    const buildColumn = element => {
      if (element.name != null && !this.ignoreElement(element.elementID)) {
        const headerID = ColumnConfigurationContainer.findHeaderID(element);
        result[headerID] = element.value;
        this.buildMetadataColumn(element, headerID);
      }
    };

    mdElements.filter(e => e != null && e.elementID != null).forEach(buildColumn);

    // added at the same time with user config
    if (this.columnConfiguration.allowBlankDataColumns) {
      const inMdElements = configElement => mdElements.some(mdElement => mdElement.elementID === configElement);

      configElements.filter(e => this.isMetadataElement(e) && !inMdElements(e)).forEach(buildColumn);
    }

    return result;
  }

  flattenDataElements(dataElements: DataElements[]) {
    const result = {};

    const buildColumn = element => {
      if (!this.ignoreElement(element.elementID)) {
        if (this.elementsFound.indexOf(element.elementID) === -1) {
          this.elementsFound.push(element.elementID);
        }
        const headerID = ColumnConfigurationContainer.findHeaderID(element);
        this.buildElementColumn(element, headerID);
        this.unitService.setPreferredUnits(element);
        const elementData = this.columnConfiguration.createElementData(element, headerID);
        Object.keys(elementData).forEach(key => (result[key] = elementData[key]));
      }
    };

    dataElements.filter(e => e != null && e.elementID != null).forEach(buildColumn);

    return result;
  }

  flattenRawMessage(raw: RawMessage) {
    const result = {};
    if (this.rawHeader == null) {
      this.rawHeader = {
        headerName: this.translate.instant('GRID.RAW'),
        groupId: 'raw',
        children: [
          {
            headerName: this.translate.instant('GRID.HEADER'),
            field: 'raw_header',
            width: 220,
            valueFormatter: this.removeLineBreaks,
          },
        ],
      };
      this.columnDefs.push(this.rawHeader);
    }
    if (this.rawHeader.children.length === 1 && !!raw.message) {
      this.rawHeader.children.push({
        headerName: this.translate.instant('GRID.MESSAGE'),
        field: 'raw_message',
        width: 440,
        columnGroupShow: 'open',
        valueFormatter: this.removeLineBreaks,
      });
    }

    Object.keys(raw).forEach(key => (result[`raw_${key}`] = raw[key]));
    return result;
  }

  convertToRowObject(obs: DMSObs) {
    return {
      ...this.flattenObsIdentities(obs),
      ...this.flattenMetadataElements(obs.metadataElements),
      ...this.flattenDataElements(obs.dataElements),
      ...this.flattenRawMessage(obs.rawMessage),
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
    this.userConfigService
      .getElementOrder()
      .filter(id => !this.ignoreElement(id) && this.elementsFound.indexOf(id) === -1)
      .map(id => ({ elementID: id }))
      .forEach(elem => this.buildElementColumn(elem as DataElements));
  }

  // TODO: This function assumes a flat column config
  private sortColumns() {
    const configOrder = this.userConfigService.getElementOrder();

    const identity = this.columnDefs.find(col => col.groupId === 'identity');
    const identityChildren = identity.children;

    const inColConfig = field =>
      this.columnConfiguration.getIdentityHeaders().children.some(col => col.field === field);

    const pinned = identityChildren.filter(col => inColConfig(col.field));

    // workaround - parent might not have it's ID set
    const getID = col => col.elementID || col.children[0].elementID;

    const dataCols = [];
    const identityCols = pinned;
    const metaCols = this.columnDefs.filter(col => col.headerClass === 'meta');

    configOrder.forEach(e => {
      const inDef = this.columnDefs.filter(col => getID(col) === e && col.headerClass !== 'meta');
      dataCols.push(...inDef);
    });

    const remainingDataCol = col =>
      col.groupId !== 'identity' &&
      col.groupId !== 'raw' &&
      col.headerClass !== 'meta' &&
      configOrder.indexOf(getID(col)) === -1;

    const remainingCols = this.columnDefs.filter(remainingDataCol);
    const remainingIdentityCols = identityChildren.filter(
      col => configOrder.indexOf(col.elementID) === -1 && pinned.indexOf(col) === -1
    );

    dataCols.push(...remainingCols);
    identity.children = identityCols.concat(remainingIdentityCols);

    this.columnDefs = [identity, ...metaCols, ...dataCols, this.rawHeader];
  }

  displayMetadataTable(node) {
    this.dialog.open(StationInfoComponent, {
      data: {
        name: node[STN_NAME_FIELD],
        allData: this.columnDefs
          .filter(group => group.groupId === 'identity' || group.headerClass === 'meta')
          .map(group => group.children)
          .reduce((acc, val) => acc.concat(val))
          .filter(child => node[child.field] != null)
          .map(child => ({
            key: !!child.elementID ? this.userConfigService.getFullDefaultHeader(child.elementID, 3) : child.field,
            value: node[child.field],
          })),
      },
    });
  }

  private isMetadataElement(elementID: string) {
    const split = elementID.split('.');
    return !!split[1] && (split[1] === '7' || split[1] === '8' || split[1] === '9');
  }

  // Formats header name, used without providing user config
  private formatHeaderName(headerName: string): string {
    const format = (piece: string) => piece.charAt(0).toUpperCase() + piece.slice(1);
    return headerName
      .split('_')
      .map(format)
      .join(' ');
  }

  private resetHeader() {
    this.identityHeader = this.columnConfiguration.getIdentityHeaders();
    this.rawHeader = null;
    this.columnDefs = [];
    this.columnDefs.push(this.identityHeader);
  }

  // Get the child node, or create it if it doesn't exist
  private getChildNode(currentNodes: any[], headerName: string, nodeNumber: string, elementID: string) {
    const possibleMatches = currentNodes.filter(node => node.nodeNumber === nodeNumber);

    // workaround - we need to re-evaluate the elementID checking here:
    const elementMatch = possibleMatches.find(node => node.elementID === elementID);
    if (elementMatch != null) {
      return elementMatch;
    }
    // requires setting the ID to bottom-level columns to undefined if they become parents
    const parentMatch = possibleMatches.find(node => node.elementID == null);
    if (parentMatch != null) {
      return parentMatch;
    }

    const newNode: object = {
      headerName: headerName,
      nodeNumber: nodeNumber,
      comparator: this.comparator,
    };

    currentNodes.push(newNode);

    return newNode;
  }

  private columnBoilerplate(node, headerName) {
    const description = this.userConfigService.getDescription(node.elementID);
    return {
      headerName: headerName,
      headerTooltip: !!description ? `${description}: ${headerName}` : undefined,
      children: [],
      elementID: node.elementID,
      comparator: this.comparator,
    };
  }

  private makeDefaultColumn(node) {
    const columnToAdd = this.columnBoilerplate(node, this.userConfigService.getDefaultTag());
    node.children.unshift(columnToAdd);
    // workaround - ensures getChildNode does split early
    node.elementID = undefined;
    return columnToAdd;
  }

  private buildElementColumn(
    element: DataElements,
    headerID: string = ColumnConfigurationContainer.findHeaderID(element)
  ) {
    if (this.columnsGenerated.indexOf(headerID) !== -1) {
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

      // End processing if no header field is found
      if (!headerName) {
        break;
      }

      workingNode = this.getChildNode(currentNodes, headerName, nodes[nodeIndex], elementID);

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
    if (element.indexValue !== undefined) {
      const headerName = element.indexValue ? `${this.getIndexLabel(element)} ${element.indexValue}` : officialTitle;
      columnToAdd = this.columnBoilerplate(workingNode, headerName);
      if (workingNode.children === undefined) {
        workingNode.children = [];
      }
      if (element.indexValue) {
        columnToAdd.columnGroupShow = 'open';
      }

      workingNode.children.push(columnToAdd);
    } else {
      columnToAdd = workingNode;
      // Avoid overwritting layered/official columns
      if (workingNode.children.length) {
        columnToAdd = this.makeDefaultColumn(workingNode);
      }
    }

    if (this.hideDataElement(elementID)) {
      columnToAdd.hide = true;
    }

    this.columnConfiguration.createElementHeader(columnToAdd, headerID);
    this.columnsGenerated.push(headerID);
  }

  private getIndexLabel(element: DataElements): string {
    let label: string;
    switch (element.index.name) {
      case 'sensor_index': /* falls through */
      case 'cloud_layer_index': /* falls through */
      case 'observed_weather_index': {
        label = `${element.index.name.toUpperCase()}_LABEL`;
        break;
      }
      default: {
        label = 'SENSOR_INDEX_LABEL';
        break;
      }
    }
    return this.translate.instant(`GRID.${label}`);
  }

  private buildMetadataColumn(element, headerID) {
    if (this.columnsGenerated.indexOf(headerID) !== -1) {
      return;
    }
    const nodes = element.elementID.split('.');
    const parent = this.getChildNode(
      this.columnDefs,
      this.userConfigService.getSpecificNodeValue(2, nodes[1]),
      nodes[1],
      element.elementID
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
      hide: true,
      type: 'identity',
      elementID: element.elementID,
    };

    if (parent.children === undefined) {
      parent.children = [];
      parent.headerClass = 'meta';
    }
    parent.children.push(header);

    this.columnsGenerated.push(headerID);
  }

  private ignoreElement(elementID: string): boolean {
    return elementID == null || this.userConfigService.getElementVisibility(elementID) === ElementVisibility.NO_LOAD;
  }

  private hideDataElement(elementID: string): boolean {
    // should return default even if use empty user config
    return this.userConfigService.getElementVisibility(elementID) === ElementVisibility.HIDDEN;
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

  private removeLineBreaks(line) {
    if (line.value != null) {
      return line.value.replace(/(\r\n\t|\n|\r\t)/gm, ' ');
    }
  }
}
