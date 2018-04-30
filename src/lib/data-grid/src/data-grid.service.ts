import { Injectable, EventEmitter } from '@angular/core';

import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';

import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';

import NodeLookups from './node.const';

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
    private userDisplayColumns: string[] = [];

    constructor() {
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

    setUserDisplayColumns(userDC: string[]) {
        this.userDisplayColumns = userDC;
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

    flattenObsIdentities(obs: DMSObs) {
        const findValue = (name) => obs.metadataElements.filter(md => md.name === name).map(md => md.value)[0];
        let rev: string;
        const correction = findValue('cor');
        if (correction !== undefined) {
            const version = findValue('ver');
            rev = (Number(version) > 0) ? `${correction}_v${version}` : correction;
        }
        return {
            obsDateTime: obs.obsDateTime,
            receivedDateTime: obs.receivedDateTime,
            uri: obs.identity,
            station: findValue('stn_nam'),
            revision: rev,
        };
    }

    flattenMetadataElements(mdElements: MetadataElements[]) {
        const result = {};
        for (const element of mdElements) {
            if (element.name === 'stn_nam') {
               result['station'] = element.value;
            } else if (element.name !== undefined) {
                result[element.name] = element.value;
                this.buildMetadataColumn(element.name);
            }
        }
        return result;
    }

    flattenDataElements(dataElements: DataElements[]) {
        const result = {};
        for (const element of dataElements) {
            if (element.elementID == null || this.ignoreDataElement(element)) { continue; }
            const headerID = ColumnConfigurationContainer.findHeaderID(element);
            this.buildElementColumn(element, headerID);
            const elementData = this.columnConfiguration.createElementData(element, headerID);
            Object.keys(elementData).forEach(key => result[key] = elementData[key]);
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

    private resetHeader() {
        this.identityHeader = this.columnConfiguration.getIdentityHeaders();
        this.columnDefs = [];
        this.columnDefs.push(this.identityHeader);
    }

    // Formats header name
    private formatHeaderName(headerName: string): string {
        const format = (piece: string) => piece.charAt(0).toUpperCase() + piece.slice(1);
        return headerName.split('_').map(format).join(' ');
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

    private createSubHeader(headerDepth: number, nodes: string[]) {
        let headerNode = ' (';

        for (let j = headerDepth; j < (headerDepth + this.headerNodeDepth); j++) {
            const node = this.getNodeHeader((j + 1), nodes[j]);

            if (node === undefined) {
                break;
            }

            if (j !== headerDepth) {
                headerNode += ',';
            }

            headerNode += node;

        }

        headerNode += ')';

        if (headerNode !== ' ()') {
            return headerNode;
        } else {
            return '';
        }
    }

    private generateHeaderString(nodes: string[], index: number) {
      const firstDraft = this.getNodeHeader((index + 1), nodes[index]);
      return (firstDraft === undefined)
        ? firstDraft
        : this.formatHeaderName(firstDraft);
    }

    private buildElementColumn(element: DataElements, headerID: string) {
      if (this.columnsGenerated.indexOf(headerID) !== -1) {
        return;
      }
      const nodes = element.elementID.split('.');
      let currentNodes: any[] = this.columnDefs;
      let workingNode;
      const headerDepth = this.elementNodeStartIndex + this.elementNodeDepth - 1;
      // find workingNode to add to
      for (let i = (this.elementNodeStartIndex - 1); i < headerDepth; i++) {
          const headerName = this.generateHeaderString(nodes, i);

          // End processing if no header field is found
          if (headerName === undefined) {
              break;
          }

          workingNode = this.getChildNode(currentNodes, headerName, nodes[i], element.elementID);

          // Build child node array
          if (workingNode.children === undefined) {
              workingNode.children = [];
          }

          currentNodes = workingNode.children;

      }

      if (workingNode.elementID === undefined) {

        workingNode.elementID = element.elementID;

        if (!workingNode.children.length) {
            workingNode.headerName += this.createSubHeader(headerDepth, nodes);
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
            'elementID': element.elementID
          };
          workingNode.elementID = undefined;
          workingNode.children.unshift(columnToAdd);
        }
      }

      // Checking if this element exists in user element list
      if ((this.userDisplayColumns != null ) &&
          (this.userDisplayColumns.length ) &&
          (this.userDisplayColumns.indexOf(element.elementID) < 0)) {
        columnToAdd.hide = true;
      }

      this.columnConfiguration.createElementHeader(columnToAdd, headerID);
      this.columnsGenerated.push(headerID);
    }

    private buildMetadataColumn(headerID: string) {
      if (this.columnsGenerated.indexOf(headerID) !== -1) {
        return;
      }

      const header = {
        'headerName': this.formatHeaderName(headerID),
        'field': headerID,
        'width': 80,
        'columnGroupShow': 'open',
        'type': 'identity'
      };

      if (this.identityHeader.children === undefined) { this.identityHeader.children = []; }
      this.identityHeader.children.push(header);

      this.columnsGenerated.push(headerID);
    }

    private ignoreDataElement(element: DataElements): boolean {
        return this.columnConfiguration.ignoreHideableColumns
            && this.userDisplayColumns.indexOf(element.elementID) < 0;
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
}
export interface RawMessage {
    header: string;
    message: string;
}
