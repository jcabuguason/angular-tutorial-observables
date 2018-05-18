import { Injectable, EventEmitter } from '@angular/core';

import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';

import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';

import {
    UserConfigService,
    ElementVisibility,
    MetaElementVisibility
} from 'msc-dms-commons-angular/core/metadata/';

import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

@Injectable()
export class DataGridService {

    public columnsGenerated: string[] = [];
    public rowData: object[] = [];
    public columnDefs: any[];
    public columnTypes = { 'identity': {} };
    public reloadRequested = new EventEmitter();
    public chartColumnRequested = new EventEmitter();

    private columnConfiguration: ElementColumnConfiguration;
    private identityHeader;

    constructor(public userConfigService: UserConfigService) {
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
        return this.columnConfiguration.getContextMenuItems();
    }

    getMainMenuItems() {
        return this.columnConfiguration.getMainMenuItems(this);
    }

    flattenObsIdentities = (obs: DMSObs) => {
        return {
            obsDateTime: obs.obsDateTime,
            receivedDateTime: obs.receivedDateTime,
            uri: obs.identity,
            station: obsUtil.findMetadataValue(obs, 'stn_nam'),
            revision: obsUtil.findRevision(obs),
        };
    }

    flattenMetadataElements(mdElements: MetadataElements[]) {
        const result = {};

        const buildColumn = (element) => {
            if (element.name != null && !this.ignoreMetaElement(element)) {
                result[element.name] = element.value;
                this.buildMetadataColumn(element, element.name);
            }
        };

        mdElements.forEach(buildColumn);

        return result;
    }

    flattenDataElements(dataElements: DataElements[]) {
        const result = {};
        const configElements = this.userConfigService.getElementOrder();

        const buildColumn = (element) => {
            if (!this.ignoreDataElement(element)) {
                const headerID = ColumnConfigurationContainer.findHeaderID(element);
                this.buildElementColumn(element, headerID);
                const elementData = this.columnConfiguration.createElementData(element, headerID);
                Object.keys(elementData).forEach(key => result[key] = elementData[key]);
            }
        };

        dataElements.forEach(buildColumn);

        if (this.columnConfiguration.allowBlankDataColumns) {
            const inDataElements = (configElement) => dataElements.some(dataElem => dataElem.elementID === configElement);
            configElements.filter(configElem => !inDataElements(configElem))
                .forEach(e => buildColumn({elementID: e}));
        }

        return result;
    }

    convertToRowObject(obs: DMSObs) {
        return {
            ...this.flattenObsIdentities(obs),
            ...this.flattenMetadataElements(obs.metadataElements),
            ...this.flattenDataElements(obs.dataElements),
        };
    }

    sortColumns() {
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

        const remainingCols = this.columnDefs.filter(col => col.headerName !== 'Identity' && configOrder.indexOf(col.elementID) === -1);
        const remainingIdentityCols = identityChildren.filter(col => configOrder.indexOf(col.elementID) === -1
            && pinned.indexOf(col) === -1);

        dataCols.push(...remainingCols);
        identity.children = identityCols.concat(remainingIdentityCols);

        this.columnDefs = [identity, ...dataCols];
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
          'nodeNumber': nodeNumber
        };

        currentNodes.push(newNode);

        return newNode;

    }

    private generateHeaderString(elementID: string, index: number) {
      return this.userConfigService.getFormattedNodeName(elementID, index);
    }

    private buildElementColumn(element: DataElements, headerID: string) {
      if (this.columnsGenerated.indexOf(headerID) !== -1) {
        return;
      }

      const elementID = element.elementID;
      const nodes = element.elementID.split('.');
      let currentNodes: any[] = this.columnDefs;
      let workingNode;
      const nestingDepth = this.userConfigService.getNestingDepth();
      // find workingNode to add to
      for (let i = 2; i <= nestingDepth; i++) {
          const headerName = this.generateHeaderString(elementID, i);

          // End processing if no header field is found
          if (headerName === undefined) {
              break;
          }

          workingNode = this.getChildNode(currentNodes, headerName, nodes[i], elementID);

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
        columnToAdd = {
          'headerName': (element.indexValue ? 'Layer ' + element.indexValue : 'Official'),
          'children': [],
        };
        if (workingNode.children === undefined) {
          workingNode.children = [];
        }

        if (columnToAdd.headerName === 'Official') {
            for (const node of workingNode.children) {
                node.columnGroupShow = 'open';
            }
        } else {
            for (const node of workingNode.children) {
                if (node.headerName === 'Official') {
                    columnToAdd.columnGroupShow = 'open';
                    break;
                }
            }
        }

        workingNode.children.push(columnToAdd);

      } else {
        columnToAdd = workingNode;
        // Avoid overwritting layered/official columns
        if (workingNode.children.length && workingNode.children[0].headerName !== 'Default') {
          columnToAdd = {
            'headerName': 'Default',
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
      if (this.columnsGenerated.indexOf(headerID) !== -1) {
        return;
      }

      const header = {
        'headerName': this.userConfigService.getByElementName(element.elementID),
        'field': headerID,
        'width': 80,
        'columnGroupShow': 'open',
        'type': 'identity',
        'pinned': this.pinMetaElement(element.elementID),
        'elementID': element.elementID,
      };

      if (this.identityHeader.children === undefined) { this.identityHeader.children = []; }
      this.identityHeader.children.push(header);

      this.columnsGenerated.push(headerID);
    }

    private ignoreMetaElement(element: MetadataElements): boolean {
        return element.elementID != null
            ? this.userConfigService.getMetaElementVisibility(element.elementID) === MetaElementVisibility.NO_LOAD
            : false;
    }

    private ignoreDataElement(element: DataElements): boolean {
        return element.elementID != null
            ? this.userConfigService.getElementVisibility(element.elementID) === ElementVisibility.NO_LOAD
            : false;
    }

    private pinMetaElement(elementID: string): boolean {
        return this.userConfigService.getMetaElementVisibility(elementID) === MetaElementVisibility.PINNED;
    }

    private hideDataElement(elementID: string): boolean {
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
    identity: string;
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
