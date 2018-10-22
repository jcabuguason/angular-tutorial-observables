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

import { NodeLookups } from 'msc-dms-commons-angular/core/metadata';

import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

@Injectable()
export class DataGridService {

    public columnsGenerated: string[] = [];
    public rowData: object[] = [];
    public columnDefs: any[];
    public columnTypes = { 'identity': {} };
    public defaultColDef = { menuTabs: ['generalMenuTab', 'filterMenuTab'] };
    public reloadRequested = new EventEmitter();
    public chartColumnRequested = new EventEmitter();

    private columnConfiguration: ElementColumnConfiguration;
    private identityHeader;
    private rawHeader;

    constructor(public userConfigService: UserConfigService, public dialog: MatDialog) {
        userConfigService.loadConfig(FULL_CONFIG);
        this.columnConfiguration = new DefaultColumnConfiguration();
        this.resetHeader();
    }

    getColumnConfiguration(): ElementColumnConfiguration {
        return this.columnConfiguration;
    }

    setColumnConfiguration(columnConfig: ElementColumnConfiguration) {
        this.columnConfiguration = columnConfig;
        this.resetHeader();
    }

    addRowData(obs: object) {
        this.rowData.push(this.convertToRowObject(<DMSObs> obs));
    }

    addAllData(obs: object[]) {
        this.rowData.push(...obs.map((data) => this.convertToRowObject(<DMSObs> data)));
        this.sortColumns();
        this.reloadGrid();
    }

    removeAllData() {
        this.rowData = [];
        this.columnsGenerated = [];
        this.resetHeader();
        this.reloadGrid();
    }

    reloadGrid() {
        this.reloadRequested.emit();
    }

    chartColumn(param) {
        this.chartColumnRequested.emit(param);
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
            if (element.name != null && !this.ignoreElement(element)) {
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
        const configElements = this.userConfigService.getElementOrder();

        const buildColumn = (element) => {
            if (!this.ignoreElement(element)) {
                const headerID = ColumnConfigurationContainer.findHeaderID(element);
                this.buildElementColumn(element, headerID);
                const elementData = this.columnConfiguration.createElementData(element, headerID);
                Object.keys(elementData).forEach(key => result[key] = elementData[key]);
            }
        };

        dataElements.filter(e => e != null)
                    .filter(e => e.elementID != null)
                    .forEach(buildColumn);

        // added at the same time with user config
        if (this.columnConfiguration.allowBlankDataColumns) {
            const inDataElements = (configElement) => dataElements.some(dataElem => dataElem.elementID === configElement);

            configElements.filter(configElem => !inDataElements(configElem) && !this.isMetadatElement(configElem))
                .forEach(e => buildColumn({elementID: e}));
        }

        return result;
    }

    flattenRawMessage(raw: RawMessage) {
      const result = {};
      if (this.rawHeader == null) {
        this.rawHeader = {
          'headerName': 'Raw',
          'children': [{
            'headerName': 'Header',
            'field': 'raw_header',
            'width': 220,
          }]
        };
        this.columnDefs.push(this.rawHeader);
      }
      if (this.rawHeader.children.length === 1 && !!raw.message) {
        this.rawHeader.children.push({
          'headerName': 'Message',
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

    sortColumns() {
        if (!this.rowData.length) {
            return;
        }

        const configOrder = this.userConfigService.getElementOrder();

        const identity = this.columnDefs.find(col => col.headerName === 'Identity');
        const identityChildren = identity.children;

        const inColConfig = (field) => this.columnConfiguration.getIdentityHeaders().children
            .some(col => col.field === field);

        const pinned = identityChildren.filter(col => inColConfig(col.field));

        const dataCols = [];
        const identityCols = pinned;

        configOrder.forEach(e => {
            const inDef = this.columnDefs.filter(col => col.elementID === e);
            const inIdentityDef = identityChildren.filter(col => col.elementID === e && !pinned.some(pin => pin === col));

            if (inDef.length > 0) {
                dataCols.push(...inDef);
            } else if (inIdentityDef.length > 0) {
                identityCols.push(...inIdentityDef);
            }
        });

        const remainingDataCol = (col) => col.headerName !== 'Identity'
            && col.headerName !== 'Raw'
            && configOrder.indexOf(col.elementID) === -1;

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
        this.columnDefs = [];
        this.columnDefs.push(this.identityHeader);
    }

    // Get the child node, or create it if it doesn't exist
    private getChildNode(currentNodes: any[], headerName: string, nodeNumber: string, elementID: string): object {
        for (const currentNode of currentNodes) {
            if (currentNode.nodeNumber === nodeNumber) {
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

    private buildElementColumn(element: DataElements, headerID: string) {
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
          if (!headerName) { break; }

          workingNode = this.getChildNode(currentNodes, headerName, nodes[nodeIndex], elementID);

            if (workingNode.headerTooltip === undefined) {
                workingNode.headerTooltip = this.userConfigService.getDescription(elementID, i);
            }

            // Build child node array
            if (workingNode.children === undefined) {
                workingNode.children = [];
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
          ? `${this.userConfigService.getElementIndexTitle(elementID)} ${element.indexValue}`
          : officialTitle;
        const description = this.userConfigService.getDescription(elementID);
        const headerTooltip = !!description ? `${description}: ${headerName}` : undefined;
        columnToAdd = {
          'headerName': headerName,
          'headerTooltip': headerTooltip,
          'children': [],
          'elementID' : elementID,
        };
        if (workingNode.children === undefined) {
          workingNode.children = [];
        }

        if (columnToAdd.headerName === officialTitle) {
          for (const node of workingNode.children) {
              node.columnGroupShow = 'open';
          }
        } else {
            for (const node of workingNode.children) {
                if (node.headerName === officialTitle) {
                    columnToAdd.columnGroupShow = 'open';
                    break;
                }
            }
        }

        workingNode.children.push(columnToAdd);

      } else {
        columnToAdd = workingNode;
        // Avoid overwritting layered/official columns
        if (workingNode.children.length
            && workingNode.children[0].headerName !== this.userConfigService.getDefaultTag()
            && workingNode.children[0].headerName !== officialTitle) {
          const headerName = this.userConfigService.getDefaultTag();
          const description = this.userConfigService.getDescription(elementID);
          const headerTooltip = !description ? `${description}: ${headerName}` : undefined;
          columnToAdd = {
            'headerName': headerName,
            'headerTooltip': headerTooltip,
            'children': [],
            'elementID': elementID
          };
          workingNode.elementID = undefined;
          workingNode.children.unshift(columnToAdd);
        }
      }


        if (this.hideDataElement(elementID)) {
          columnToAdd.hide = true;
        }

        this.columnConfiguration.createElementHeader(columnToAdd, headerID);
        this.columnsGenerated.push(headerID);
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

    private ignoreElement(element: MetadataElements | DataElements): boolean {
        return element.elementID == null ||
          this.userConfigService.getElementVisibility(element.elementID) === ElementVisibility.NO_LOAD;
    }

    private hideDataElement(elementID: string): boolean {
        // should return default even if use empty user config
        return this.userConfigService.getElementVisibility(elementID) === ElementVisibility.HIDDEN;
    }
}

export interface DMSElementSummary {
    aggregations: Aggregation;
}

export interface Aggregation {
    dataElements: ESDataElements;
}

export interface ESDataElements {
    index: ElementIndex;
}

export interface ElementIndex {
    buckets: Buckets[];
}

export interface Buckets {
    key: string;
    maxIndex: Index;
    minIndex: Index;
}

export interface Index {
    value: number;
}

export interface DMSObs {
    identity: string; // URI
    identifier: string; // Primary station identifier
    taxonomy: string;
    obsDateTime: string; // TODO: Switch to moment.js datetime?
    location: Location;
    receivedDateTime: string;
    parentIdentity: string;
    author: Author;
    jsonVersion: string;
    rawMessage: RawMessage;
    metadataElements: MetadataElements[];
    dataElements: DataElements[];
}

export interface Author {
    build: string;
    name: string;
    version: number;
}

// TODO: This is outdated, will be fixed when we add models to commons?
export interface DataElements {
    name: string;
    value: string;
    unit: string;
    elementID: string;
    overallQASummary: number;
    indexValue: number;
}

export interface Location {
    type: string;
    coordinates: string;
}

export interface MetadataElements {
    name: string;
    value: string;
    unit: string;
    elementID: string;
}
export interface RawMessage {
    header: string;
    message: string;
}
