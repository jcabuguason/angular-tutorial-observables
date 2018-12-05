import { Injectable, EventEmitter } from '@angular/core';

import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';

import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { MatDialog } from '@angular/material/dialog';
import { StationInfoComponent } from './station-info/station-info.component';
import { FULL_CONFIG } from './default-grid-configs';
import {
    UserConfigService,
    ElementVisibility,
} from 'msc-dms-commons-angular/core/metadata/';

import { DMSObs, MetadataElements, DataElements, RawMessage, IndexDetails } from 'msc-dms-commons-angular/core/obs-util';
import { UnitCodeConversionService } from 'msc-dms-commons-angular/core/obs-util';

import { NodeLookups } from 'msc-dms-commons-angular/core/metadata';

import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DataGridService {
    public columnsGenerated: string[] = [];
    public rowData: object[] = [];
    public columnDefs: any[];
    public columnTypes = { 'identity': {} };
    public defaultColDef = { menuTabs: ['generalMenuTab', 'filterMenuTab'] };
    public reloadRequested = new EventEmitter();
    public chartColumnRequested = new EventEmitter();
    public chartFormRequested = new EventEmitter();
    public chartRequested = new EventEmitter();

    private columnConfiguration: ElementColumnConfiguration;
    private identityHeader;
    private rawHeader;
    private elementsFound: string[] = [];

    constructor(
      public translate: TranslateService,
      public userConfigService: UserConfigService,
      public unitService: UnitCodeConversionService,
      public dialog: MatDialog,
    ) {
        userConfigService.loadConfig(FULL_CONFIG);
        this.columnConfiguration = new DefaultColumnConfiguration();
        this.resetHeader();
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
        this.rowData.push(...obs.map((data) => this.convertToRowObject(<DMSObs> data)));
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
        this.reloadRequested.emit();
    }

    chartColumn(param) {
        this.chartColumnRequested.emit(param);
    }

    chartObject(param) {
        this.chartRequested.emit(param);

    }
    chartFormOnColumn(param) {
        this.chartFormRequested.emit(param);
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
    }

    flattenMetadataElements(mdElements: MetadataElements[]) {
        const result = {};
        const configElements = this.userConfigService.getElementOrder();

        const buildColumn = (element) => {
            if (element.name != null && !this.ignoreElement(element.elementID)) {
                result[element.name] = element.value;
                this.buildMetadataColumn(element, element.name);
            }
        };

        mdElements.filter(e => e != null && e.elementID != null)
            .forEach(buildColumn);

        // added at the same time with user config
        if (this.columnConfiguration.allowBlankDataColumns) {
            const inMdElements = (configElement) => mdElements.some(mdElement => mdElement.elementID === configElement);

            configElements.filter(e => this.isMetadatElement(e) && !inMdElements(e))
                .forEach(buildColumn);
        }

        return result;
    }

    flattenDataElements(dataElements: DataElements[]) {
        const result = {};

        const buildColumn = (element) => {
            if (!this.ignoreElement(element.elementID)) {
                if (this.elementsFound.indexOf(element.elementID) === -1) { this.elementsFound.push(element.elementID); }
                const headerID = ColumnConfigurationContainer.findHeaderID(element);
                this.buildElementColumn(element, headerID);
                this.unitService.setPreferredUnits(element);
                const elementData = this.columnConfiguration.createElementData(element, headerID);
                Object.keys(elementData).forEach(key => result[key] = elementData[key]);
            }
        };

        dataElements.filter(e => e != null && e.elementID != null)
                    .forEach(buildColumn);

        return result;
    }

    flattenRawMessage(raw: RawMessage) {
      const result = {};
      if (this.rawHeader == null) {
        this.rawHeader = {
          'headerName': this.translate.instant('GRID.RAW'),
          'groupId': 'raw',
          'children': [{
            'headerName': this.translate.instant('GRID.HEADER'),
            'field': 'raw_header',
            'width': 220,
          }]
        };
        this.columnDefs.push(this.rawHeader);
      }
      if (this.rawHeader.children.length === 1 && !!raw.message) {
        this.rawHeader.children.push({
          'headerName': this.translate.instant('GRID.MESSAGE'),
          'field': 'raw_message',
          'width': 440,
          'columnGroupShow': 'open',
        });
      }

        Object.keys(raw).forEach(key => result[`raw_${key}`] = raw[key]);
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
      this.userConfigService.getElementOrder()
        .filter(id => !this.ignoreElement(id) && this.elementsFound.indexOf(id) === -1)
        .map(id => ({elementID: id}))
        .forEach(elem => this.buildElementColumn(elem as DataElements));
    }

    // TODO: This function assumes a flat column config
    private sortColumns() {
        const configOrder = this.userConfigService.getElementOrder();

        const identity = this.columnDefs.find(col => col.groupId === 'identity');
        const identityChildren = identity.children;

        const inColConfig = (field) => this.columnConfiguration.getIdentityHeaders().children
            .some(col => col.field === field);

        const pinned = identityChildren.filter(col => inColConfig(col.field));

        // workaround - parent might not have it's ID set
        const getID = (col) => col.elementID || col.children[0].elementID;

        const dataCols = [];
        const identityCols = pinned;

        configOrder.forEach(e => {
            const inDef = this.columnDefs.filter(col => getID(col) === e);
            const inIdentityDef = identityChildren.filter(col => col.elementID === e && !pinned.some(pin => pin === col));

            if (inDef.length > 0) {
                dataCols.push(...inDef);
            } else if (inIdentityDef.length > 0) {
                identityCols.push(...inIdentityDef);
            }
        });

        const remainingDataCol = (col) => col.groupId !== 'identity'
            && col.groupId !== 'raw'
            && configOrder.indexOf(getID(col)) === -1;

        const remainingCols = this.columnDefs.filter(remainingDataCol);
        const remainingIdentityCols = identityChildren.filter(col => configOrder.indexOf(col.elementID) === -1
            && pinned.indexOf(col) === -1);

        dataCols.push(...remainingCols);
        identity.children = identityCols.concat(remainingIdentityCols);

        this.columnDefs = [identity, ...dataCols, this.rawHeader];
    }

    displayMetadataTable(allData) {
        const identity = (key) => !(key.startsWith('e_') || key.startsWith('raw_'));
        this.dialog.open(StationInfoComponent, {
            data: {
                name: allData.stn_nam,
                allData: Object.keys(allData).filter(identity).map(key => ({
                    'key': key,
                    'value': allData[key]
                }))
            }
        });
    }

    // checks element ID to determine if its a metadata element
    private isMetadatElement(elementID: string) {
        const identitifer = Object.keys(NodeLookups.node2)
            .find(key => NodeLookups.node2[key] === 'identification');

        return elementID.split('.')[1] === identitifer;
    }

    // Formats header name, used without providing user config
    private formatHeaderName(headerName: string): string {
        const format = (piece: string) => piece.charAt(0).toUpperCase() + piece.slice(1);
        return headerName.split('_').map(format).join(' ');
    }

    private resetHeader() {
        this.identityHeader = this.columnConfiguration.getIdentityHeaders();
        this.rawHeader = null;
        this.columnDefs = [];
        this.columnDefs.push(this.identityHeader);
    }

    // Get the child node, or create it if it doesn't exist
    private getChildNode(currentNodes: any[], headerName: string, nodeNumber: string, elementID: string): object {
        for (const currentNode of currentNodes) {
            if (currentNode.nodeNumber === nodeNumber) {
              // workaround - we need to re-evaluate the elementID checking here:
              // requires setting the ID to bottom-level columns to undefined if they become parents
              if (currentNode.elementID === undefined || elementID === currentNode.elementID) {
                return currentNode;
              }
            }
        }

        const newNode: object = {
            'headerName': headerName,
            'nodeNumber': nodeNumber,
        };

        currentNodes.push(newNode);

        return newNode;
    }

    // used without providing user config
    // Gets the specific node headers
    private getNodeHeader(nodeNumber: number, nodeHeader: string): string {
        if (nodeNumber === 2) {
            return NodeLookups.node2[nodeHeader];
        } else if (nodeNumber === 3) {
            return NodeLookups.node3[nodeHeader];
        } else if (nodeNumber === 4) {
            return NodeLookups.node4[nodeHeader];
        } else if (nodeNumber === 5) {
            return NodeLookups.node5[nodeHeader];
        } else if (nodeNumber === 6) {
            return NodeLookups.node6[nodeHeader];
        } else if (nodeNumber === 7) {
            return NodeLookups.node7[nodeHeader];
        }
    }

    private columnBoilerplate(node, headerName) {
      const description = this.userConfigService.getDescription(node.elementID);
      return {
        'headerName': headerName,
        'headerTooltip': !!description ? `${description}: ${headerName}` : undefined,
        'children': [],
        'elementID': node.elementID
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
      if (this.columnsGenerated.indexOf(headerID) !== -1) { return; }
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
        if (!headerName) { break; }

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
        const headerName = (element.indexValue)
          ? `${this.getIndexLabel(element)} ${element.indexValue}`
          : officialTitle;
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
          label = `${element.index.name.toUpperCase()}_LABEL`; break;
        }
        default: {
          label = 'SENSOR_INDEX_LABEL'; break;
        }
      }
      return this.translate.instant(`GRID.${label}`);
    }


    private buildMetadataColumn(element, headerID) {
      if (this.columnsGenerated.indexOf(headerID) !== -1) { return; }
      // metadata name using userConfigService may be slightly different than 2.5.6
        const header = {
            'headerName': this.userConfigService.getByElementName(element.elementID),
            'field': headerID,
            'width': 80,
            'hide': true,
            'type': 'identity',
            'elementID': element.elementID,
        };

        if (this.identityHeader.children === undefined) { this.identityHeader.children = []; }
        this.identityHeader.children.push(header);

        this.columnsGenerated.push(headerID);
    }

    private ignoreElement(elementID: string): boolean {
        return elementID == null ||
          this.userConfigService.getElementVisibility(elementID) === ElementVisibility.NO_LOAD;
    }

    private hideDataElement(elementID: string): boolean {
        // should return default even if use empty user config
        return this.userConfigService.getElementVisibility(elementID) === ElementVisibility.HIDDEN;
    }
}
