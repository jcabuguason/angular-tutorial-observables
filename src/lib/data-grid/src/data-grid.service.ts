import { Injectable, EventEmitter } from '@angular/core';

import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';

import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { VUColumnConfiguration } from './column-configuration/vu-column-configuration.class';
import { AccordianColumnConfiguration } from './column-configuration/accordian-column-configuration.class';

import NodeLookups from './node.const';

@Injectable()
export class DataGridService {

    readonly elementNodeStartIndex: number = 2;
    readonly elementNodeDepth: number = 3;
    readonly headerNodeDepth: number = 6 - this.elementNodeDepth;

    private columnConfigurationOptions: ColumnConfigurationContainer[] = [];
    private defaultColumnConfiguration: ElementColumnConfiguration;
    private columnsGenerated: string[] = [];

    private columnConfiguration: ElementColumnConfiguration;
    private identityHeader;

    public rowData: object[] = [];
    public columnDefs: any[] = this.getStaticHeaders();

    public reloadRequested = new EventEmitter();

    constructor() {
        this.columnConfigurationOptions.push(new ColumnConfigurationContainer('accordian', new AccordianColumnConfiguration()));
        this.columnConfigurationOptions.push(new ColumnConfigurationContainer('vu', new VUColumnConfiguration()));

        this.defaultColumnConfiguration = new DefaultColumnConfiguration();
        this.columnConfigurationOptions.push(new ColumnConfigurationContainer('default', this.defaultColumnConfiguration));
        this.columnConfiguration = new DefaultColumnConfiguration();
    }

    getDefaultColumnConfigurations(): object {
        const configs: string[] = [];
        for (const configuration of this.columnConfigurationOptions) {
            configs.push(configuration.name);
        }
        return configs;
    }

    getColumnConfiguration(): ElementColumnConfiguration {
      return this.columnConfiguration;
    }

    setColumnConfiguration(columnConfig: ElementColumnConfiguration) {
        this.columnConfiguration = columnConfig;
    }

    // Only works for Column Configs set up by Commons (Defaults)
    setColumnConfigurationByString(config: string) {
        this.columnConfiguration = null;
        for (const configuration of this.columnConfigurationOptions) {
            if (config === configuration.name) {
                this.columnConfiguration = configuration.configuration;
            }
        }
        if (this.columnConfiguration == null) {
            this.columnConfiguration = this.defaultColumnConfiguration;
        }
    }

    addRowData(obs: object) {
        this.rowData.push(JSON.parse(this.gridifyObs(obs)));
    }

    addAllData(obs: object[]) {
        for (const data of obs) {
            this.addRowData(data);
        }
        this.reloadGrid();
    }

    reloadGrid() {
        this.reloadRequested.emit();
    }

    // Formats header name
    private formatHeaderName(headerName: string): string {
        const pieces = headerName.split('_');
        for (let i = 0; i < pieces.length; i++) {
            pieces[i] = pieces[i].charAt(0).toUpperCase() + pieces[i].substr(1);
        }
        return pieces.join(' ');
    }

    // Get the child node, or create it if it doesn't exist
    private getChildNode(currentNodes: any[], headerName: string, nodeNumber: string): object {

        for (const currentNode of currentNodes) {
            if (currentNode.nodeNumber === nodeNumber) {
              if (currentNode.terminal === 'true' ) {
                break;
              }
              else {
                return currentNode;
              }
            }
        }

        const newNode: object = {
          'headerName': headerName,
          'terminal': 'unknown',
          'nodeNumber': nodeNumber
        }

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

    // Creates the static headers
    private getStaticHeaders(): any[] {
        const staticHeaders: any[] = [];

        this.identityHeader = {
          'headerName': 'Identity',
          'children': []
        };

        staticHeaders.push(this.identityHeader);

        const stationHeader = {
          'headerName': 'Station',
          'field': 'station',
          'width': 100,
          'pinned': true
        };
        this.identityHeader.children.push(stationHeader);

        const dateTimeHeader = {
          'headerName': 'Instance Date',
          'field': 'obsDateTime',
          'width': 220,
          'pinned': true
        };
        this.identityHeader.children.push(dateTimeHeader);

        return staticHeaders;

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

    private generateHeaderString(nodes:string[], index: number) {
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
              workingNode.terminal = 'false';
              break;
          }

          workingNode = this.getChildNode(currentNodes, headerName, nodes[i]);

          // Build child node array
          if (workingNode.children === undefined) {
              workingNode.children = [];
          }

          currentNodes = workingNode.children;

      }

      workingNode.elementID = element.elementID;

      if (workingNode.terminal === 'unknown') {
          workingNode.terminal = 'true';
      }

      if (!workingNode.children.length) {
          workingNode.headerName += this.createSubHeader(headerDepth, nodes);
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
        workingNode.children.push(columnToAdd);
      } else {
        columnToAdd = workingNode;
        // Avoid overwritting layered/official columns
        if (workingNode.children.length && workingNode.children[0].headerName !== 'Basic') {
          columnToAdd = {
            'headerName': 'Basic',
            'children': [],
          };
          workingNode.children.unshift(columnToAdd);
        }
      }

      this.columnConfiguration.createElementHeader(columnToAdd, headerID);
      this.columnsGenerated.push(headerID);
    }

    private buildMetadataColumn(headerID: string) {
      if (this.columnsGenerated.indexOf(headerID) !== -1) {
        return;
      }

      const header = {
        'headerName': headerID,
        'field': headerID,
        'width': 80,
        'columnGroupShow': 'open',
      };

      this.identityHeader.children.push(header);


      this.columnsGenerated.push(headerID);
    }

    private gridifyObs(obs: object): string {

        const parsed: DMSObs = <DMSObs> obs;

        let output = '{';
        output += '"obsDateTime": "' + parsed.obsDateTime + '",';
        output += '"uri": "' + parsed.identity + '",';

        for (const element of parsed.metadataElements) {
            if (element.name === 'stn_nam') {
               output += '"station": "' + element.value + '",';
            }
            else if (element.name !== undefined) {
               const headerID = this.formatHeaderName(element.name);
               this.buildMetadataColumn(headerID);
               output += '"' + headerID + '": "' + element.value + '",';
            }
        }

        for (const element of parsed.dataElements) {
          const headerID = ColumnConfigurationContainer.findHeaderID(element);

          this.buildElementColumn(element, headerID);

          output += this.columnConfiguration.createElementData(element, headerID);

          if (element !== parsed.dataElements[parsed.dataElements.length - 1]) {
              output += ',';
          }
        }

        output += '}';

        return output;
    }

}

interface DMSElementSummary {
    aggregations: Aggregation;
}

interface Aggregation {
    dataElements: ESDataElements;
}

interface ESDataElements {
    index: ElementIndex;
}

interface ElementIndex {
    buckets: Buckets[];
}

interface Buckets {
    key: string;
    maxIndex: Index;
    minIndex: Index;
}

interface Index {
    value: number;
}



interface DMSObs {
    identity: string;
    obsDateTime: string;
    location: Location;
    receivedDate: string;
    parentIdentity: string;
    author: Author;
    jsonVersion: string;
    rawMessage: RawMessage;
    metadataElements: MetadataElements[];
    dataElements: DataElements[];
}

interface Author {
    build: string;
    name: string;
    version: number;
}

// TODO: This is outdated, will be fixed when we add models to commons?
interface DataElements {
    name: string;
    value: string;
    unit: string;
    elementID: string;
    overallQASummary: number;
    indexValue: number;
}

interface Location {
    type: string;
    coordinates: string;
}

interface MetadataElements {
    name: string;
    value: string;
    unit: string;
}
interface RawMessage {
    header: string;
    message: string;
}
