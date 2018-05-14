import { Injectable, EventEmitter } from '@angular/core';

import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';

import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';

import { UserConfigService } from '../../user-config/src/user-config.service';
import { ElementVisibility, MetaElementVisibility } from '../../user-config/src/user-config.model';

import NodeLookups from './node.const';

import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

@Injectable()
export class DataGridService {

    readonly elementNodeStartIndex: number = 2;
    readonly elementNodeDepth: number = 3;
    readonly headerNodeDepth: number = 6 - this.elementNodeDepth;

    public columnsGenerated: string[] = [];
    public rowData: object[] = [];
    public columnDefs: any[];
    public columnTypes = { 'identity': {} };
    public reloadRequested = new EventEmitter();
    public chartColumnRequested = new EventEmitter();

    private columnConfiguration: ElementColumnConfiguration;
    private identityHeader;
    private createBlankColumns = false;

    constructor(
        public userConfigService: UserConfigService,
        private allowBlankColumns: boolean,
    ) {
        this.columnConfiguration = new DefaultColumnConfiguration();
        this.createBlankColumns = allowBlankColumns;
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
        for (const element of mdElements) {
            if (element.elementID == null || this.ignoreMetaElement(element.elementID)) { continue; }
            const headerID = ColumnConfigurationContainer.findHeaderID(element);
            this.buildMetadataColumn(element, headerID);
        }
        return result;
    }

    flattenDataElements(dataElements: DataElements[]) {
        const result = {};
        const configOrder = this.userConfigService.getElementOrder();
        const createdDataElements = [];

        const buildColumn = (element) => {
            if (!element.elementID == null && !this.ignoreDataElement(element.elementID)) {
                const headerID = ColumnConfigurationContainer.findHeaderID(element);
                this.buildElementColumn(element, headerID);
                const elementData = this.columnConfiguration.createElementData(element, headerID);
                Object.keys(elementData).forEach(key => result[key] = elementData[key]);
            }
        };

        configOrder.forEach(configElement => {
            const elements = dataElements.filter(e => e.elementID === configElement);
            if (elements.length > 0) {
                createdDataElements.push(...elements);
                elements.forEach(e => buildColumn(e));
            } else if (this.createBlankColumns) {
                buildColumn({ elementID: configElement });
            }
        });

        const remainingElements = dataElements.filter(e => !createdDataElements.includes(e));
        remainingElements.forEach(e => {
            if (!e.elementID == null && !this.ignoreDataElement(e.elementID)) {
                buildColumn(e);
            }
        });

        return result;
    }

    convertToRowObject(obs: DMSObs) {
        return {
            ...this.flattenObsIdentities(obs),
            ...this.flattenMetadataElements(obs.metadataElements),
            ...this.flattenDataElements(obs.dataElements),
        };
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

    // Gets the specific node headers
    private getNodeHeader(elementID: string, nodeNumber: number): string {
        return this.userConfigService.getNodeName(elementID, nodeNumber);
    }

    private generateHeaderString(elementID: string, index: number) {
      const firstDraft = this.getNodeHeader(elementID, index);
      return (firstDraft === undefined)
        ? firstDraft
        : this.userConfigService.getFormattedNodeName(elementID, index);
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
        'headerName': this.userConfigService.getSubHeader(element.elementID),
        'field': headerID,
        'width': 80,
        'columnGroupShow': 'open',
        'type': 'identity',
        'pinned': this.pinMetaElement(element.elementID),
      };

      if (this.identityHeader.children === undefined) { this.identityHeader.children = []; }
      this.identityHeader.children.push(header);

      this.columnsGenerated.push(headerID);
    }

    private ignoreMetaElement(elementID: string): boolean {
        return this.userConfigService.getMetaElementVisibility(elementID) === MetaElementVisibility.NO_LOAD;
    }

    private ignoreDataElement(elementID: string): boolean {
        return this.userConfigService.getElementVisibility(elementID) === ElementVisibility.NO_LOAD;
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
