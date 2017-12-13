import { Injectable, EventEmitter } from '@angular/core';

import { ElementColumnConfiguration } from './column-configuration/element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration/column-configuration-container.model';

import { DefaultColumnConfiguration } from './column-configuration/default-column-configuration.class';
import { VUColumnConfiguration } from './column-configuration/vu-column-configuration.class';
// import { NMTColumnConfiguration } from './column-configuration/nmt-column-configuration.class';
// import { MidasColumnConfiguration } from './column-configuration/midas-column-configuration.class';
import { AccordianColumnConfiguration } from './column-configuration/accordian-column-configuration.class';

import NodeLookups from './node.const';

// NOTE: Copy of the old Service from master branch.
// Pasted in for testing against the new, no-aggregate approach when grabbing live data from ES end-point
@Injectable()
export class DataGridAggregateService {

    readonly elementNodeStartIndex: number = 2;
    readonly elementNodeDepth: number = 3;
    readonly headerNodeDepth: number = 3;

    private columnConfigurationOptions: ColumnConfigurationContainer[] = [];
    private defaultColumnConfiguration: ElementColumnConfiguration;
    private columnsGenerated: string[] = [];

    private columnConfiguration: ElementColumnConfiguration;

    public rowData: object[] = [];
    public columnDefs: any[] = this.getStaticHeaders();

    public reloadRequested = new EventEmitter();

    constructor() {
        this.columnConfigurationOptions.push(new ColumnConfigurationContainer('accordian', new AccordianColumnConfiguration()));
        this.columnConfigurationOptions.push(new ColumnConfigurationContainer('vu', new VUColumnConfiguration()));
        // this.columnConfigurationOptions.push(new ColumnConfigurationContainer('nmt', new NMTColumnConfiguration()));
        // this.columnConfigurationOptions.push(new ColumnConfigurationContainer('midas', new MidasColumnConfiguration()));

        this.defaultColumnConfiguration = new DefaultColumnConfiguration();
        this.columnConfigurationOptions.push(new ColumnConfigurationContainer('default', this.defaultColumnConfiguration));
        this.columnConfiguration = new DefaultColumnConfiguration();
    }

    getColumnConfigurations(): object {
        const configs: string[] = [];
        for (const configuration of this.columnConfigurationOptions) {
            configs.push(configuration.name);
        }
        return configs;
    }

    getColumnConfiguration(): ElementColumnConfiguration {
      return this.columnConfiguration;
    }

    setColumnConfiguration(config: string) {
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
        // Locating current node
        for (const currentNode of currentNodes) {
            if (nodeNumber === currentNode.node) {
                if (currentNode.field === undefined) {
                  return currentNode;
                } else {
                  const childClone = Object.assign({}, currentNode);
                  const childNode: object = {'nested': true};
                  currentNode.headerName = headerName;
                  currentNode.children = [childClone, childNode];
                  return childNode;
                }
            }
        }

        // Create new node if doesn't exist
        const childNode: object = {
          'headerName': headerName,
          'node': nodeNumber
        };
        currentNodes.push(childNode);

        return childNode;

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

        const identityHeader = {
          'headerName': 'Identity',
          'children': []
        };

        staticHeaders.push(identityHeader);

        const stationHeader = {
          'headerName': 'Station',
          'field': 'station',
          'width': 100,
          'pinned': true,
        };

        identityHeader.children.push(stationHeader);

        const dateTimeHeader = {
          'headerName': 'Instance Date',
          'field': 'obsDateTime',
          'width': 220,
          'pinned': true,
        };

        identityHeader.children.push(dateTimeHeader);

        const uriHeader = {
          'headerName':  'URI',
          'field':  'uri',
          'width':  1000,
          'columnGroupShow':  'open',
        };
        identityHeader.children.push(uriHeader);

        const latitudeHeader = {
          'headerName': 'Latitude',
          'field': 'latitude',
          'width': 80,
          'columnGroupShow': 'open',
        };
        identityHeader.children.push(latitudeHeader);

        const longitudeHeader = {
          'headerName': 'Longitude',
          'field': 'longitude',
          'width': 80,
          'columnGroupShow': 'open',
        };

        identityHeader.children.push(longitudeHeader);

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

    private buildColumn(element: DataElements, headerID: string) {
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

          workingNode = this.getChildNode(currentNodes, headerName, nodes[i]);

          // Build child node array
          if (workingNode.children === undefined) {
              workingNode.children = [];
          }

          // Work with child nodes
          if (workingNode.nested) {
            workingNode.node = nodes[i + 1];
            workingNode.headerName = this.generateHeaderString(nodes, i);
          }
          // currentNodes = workingNode.children;

          currentNodes = (workingNode.nested) ? [workingNode] : workingNode.children;

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

    private gridifyObs(obs: object): string {

        const parsed: DMSObs = <DMSObs> obs;

        let output = '{';
        output += '"uri": "' + parsed.identity + '",';
        output += '"obsDateTime": "' + parsed.obsDateTime + '",';

        for (const element of parsed.metadataElements) {
            if (element.name === 'lat') {
               output += '"latitude": "' + element.value + '",';
            } else if (element.name === 'long') {
               output += '"longitude": "' + element.value + '",';
            } else if (element.name === 'stn_nam') {
               output += '"station": "' + element.value + '",';
            }
        }

        for (const element of parsed.dataElements) {
          const headerID = ColumnConfigurationContainer.findHeaderID(element);
          if (!this.columnsGenerated.includes(headerID)) {
            this.buildColumn(element, headerID);
          }
          output += this.columnConfiguration.createElementData(element, headerID);

          if (element !== parsed.dataElements[parsed.dataElements.length - 1]) {
              output += ',';
          }
        }

        output += '}';

        return output;
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
