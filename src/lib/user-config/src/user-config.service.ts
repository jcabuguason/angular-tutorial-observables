import { Injectable } from '@angular/core';

import { MetadataService } from '../../metadata/src/service';

import { ElementNodeConfig,
         GenericNodeConfig,
         SubHeaderConfig,
         ElementSubHeaderConfig,
         MetaElementVisibility,
         ElementVisibility,
         ElementNameConfig,
         Lang,
        } from './user-config.model';

import NodeLookups from './node.const';
import { IncludeExclude } from '../../core/src/include-exclude.class';
import { MDInstanceDefinition } from '../../metadata/src/model';
import { MDInstanceElement } from '../../metadata/src/model';

@Injectable()
export class UserConfigService {

    // The order of elements in the grid
    private elementOrder: string[] = [];

    // Include/Exclude util for Loading Metadata Elements
    private loadMetaElements: IncludeExclude = new IncludeExclude([], []);

    // Include/Exclude util for Pinning Metadata Elements
    private pinMetaElements: IncludeExclude = new IncludeExclude([], []);

    // Include/Exclude util for Loading Data Elements
    private loadDataElements: IncludeExclude = new IncludeExclude([], []);

    // Include/Exclude util for Visibility of Data Elements
    private visibleDataElements: IncludeExclude = new IncludeExclude([], []);

    // Element name configuration
    private elementNameConfig: ElementNameConfig[] = [];

    // Element node naming configuration
    private elementNodeConfig: ElementNodeConfig[] = [];

    // Node naming configuration
    private genericNodeConfig: GenericNodeConfig[] = [];

    // Default sub header config
    private defaultSubHeaderConfig: SubHeaderConfig = { displaySubHeader: true, subHeaderStart: 5, subHeaderEnd: 7 };

    // Generic sub header config
    private genericSubHeaderConfig: SubHeaderConfig = this.defaultSubHeaderConfig;

    // Specific element sub header configs
    private elementSubHeaderConfigs: ElementSubHeaderConfig[] = [];

    // Nesting depth of grid
    private nestingDepth = 4;

    // The language used in the config
    private lang: Lang = Lang.ENGLISH;

    // Function for creating an inclusive array with the specific range
    private range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start);

    constructor(private metadataService: MetadataService) {}

    resetDefaults() {
        this.elementOrder = [];

        this.loadMetaElements = new IncludeExclude([], []);
        this.pinMetaElements = new IncludeExclude([], []);
        this.loadDataElements = new IncludeExclude([], []);
        this.visibleDataElements = new IncludeExclude([], []);

        this.elementNameConfig = [];
        this.elementNodeConfig = [];
        this.genericNodeConfig = [];

        this.genericSubHeaderConfig = this.defaultSubHeaderConfig;
        this.elementSubHeaderConfigs = [];

        this.nestingDepth = 4;

    }

    setLanguage(lang: Lang) {
        this.lang = lang;
    }

    // Loads the given user configuration
    loadProfile(configName: string) {
        this.metadataService.loadInstance('', configName)
            .subscribe((param) => {
                this.loadConfig(param);
            });

    }

    loadConfig(mdInstance: MDInstanceDefinition) {

        this.resetDefaults();

        const pinMetaElemIncl = [];
        const pinMetaElemExcl = [];
        const loadMetaElemIncl = [];
        const loadMetaElemExcl = [];
        const loadDataElemIncl = [];
        const loadDataElemExcl = [];
        const visibleDataElemIncl = [];
        const visibleDataElemExcl = [];

        // Convert element taxonomy to regex
        // eti.replace(/\./g, '\\.').replace(/\*/g, '\.*')

        // TODO: Find a cleaner way of handling this
        for (const element of mdInstance.elements) {

            // Element ordering
            if (element.group === 'element-order' && element.name === 'grid-order') {
                this.elementOrder[Number(element.index) - 1] = element.value;
            }

            // Configuring Include/Exclude for Metadata
            if (element.group === 'pin-meta-elements' && element.name === 'include') {
                pinMetaElemIncl.push(element.value);
            }
            if (element.group === 'pin-meta-elements' && element.name === 'exclude') {
                pinMetaElemExcl.push(element.value);
            }
            if (element.group === 'load-meta-elements' && element.name === 'include') {
                loadMetaElemIncl.push(element.value);
            }
            if (element.group === 'load-meta-elements' && element.name === 'exclude') {
                loadMetaElemExcl.push(element.value);
            }

            // Configuring Include/Exclude for Data
            if (element.group === 'visible-elements' && element.name === 'include') {
                visibleDataElemIncl.push(element.value);
            }
            if (element.group === 'visible-elements' && element.name === 'exclude') {
                visibleDataElemExcl.push(element.value);
            }
            if (element.group === 'load-elements' && element.name === 'include') {
                loadDataElemIncl.push(element.value);
            }
            if (element.group === 'load-elements' && element.name === 'exclude') {
                loadDataElemExcl.push(element.value);
            }

            // Configuring nesting level
            if (element.group === 'nesting' && element.name === 'nesting-depth') {
                this.nestingDepth = Number(element.value);
            }

            // Configuring sub-headers
            if (element.group === 'header' && element.name === 'show-sub-header') {
                this.genericSubHeaderConfig = new SubHeaderConfig(Boolean(element.value === 'true'), element);
            }
            if (element.group === 'header' && element.name === 'element-sub-header') {
                this.elementSubHeaderConfigs.push(new ElementSubHeaderConfig(element));
            }

            // Configuring renaming
            if (element.group === 'node-rename' && element.name === 'node-index') {
                this.genericNodeConfig.push(new GenericNodeConfig(element));
            }
            if (element.group === 'element-node-rename' && element.name === 'element-id') {
                this.elementNodeConfig.push(new ElementNodeConfig(element));
            }
            if (element.group === 'element-rename' && element.name === 'element-id') {
                this.elementNameConfig.push(new ElementNameConfig(element));
            }

        }

        this.loadMetaElements = new IncludeExclude(loadMetaElemIncl, loadMetaElemExcl);
        this.pinMetaElements = new IncludeExclude(pinMetaElemIncl, pinMetaElemExcl);
        this.loadDataElements = new IncludeExclude(loadDataElemIncl, loadDataElemExcl);
        this.visibleDataElements = new IncludeExclude(visibleDataElemIncl, visibleDataElemExcl);

    }

    getElementVisibility(elementID: string): ElementVisibility {

        if (!this.loadDataElements.checkIncludeExclude(elementID)) {
            return ElementVisibility.NO_LOAD;
        }

        if (!this.visibleDataElements.checkIncludeExclude(elementID)) {
            return ElementVisibility.HIDDEN;
        }

        return ElementVisibility.DEFAULT;
    }

    getMetaElementVisibility(elementID: string): MetaElementVisibility {

        if (!this.loadMetaElements.checkIncludeExclude(elementID)) {
            return MetaElementVisibility.NO_LOAD;
        }

        if (this.pinMetaElements.checkIncludeExclude(elementID)) {
            return MetaElementVisibility.PINNED;
        }

        return MetaElementVisibility.DEFAULT;
    }

    getNestingDepth() {
        return this.nestingDepth;
    }

    getElementOrder() {
        return this.elementOrder;
    }

    getSubHeader(elementID: string) {
        const headerConfig = this.getSubHeaderConfig(elementID);

        return (headerConfig.displaySubHeader)
            ? this.range(headerConfig.subHeaderStart, headerConfig.subHeaderEnd)
                .map(nodeIndex => this.getNodeName(elementID, nodeIndex))
                .join(',')
            : '';
    }

    getSubHeaderConfig(elementID: string): SubHeaderConfig {
        return this.elementSubHeaderConfigs
                .filter((config) => config.elementID === elementID)
                .shift()
            || this.genericSubHeaderConfig;
    }


    getFormatedNodeName(elementID: string, nodeIndex: number): string {
        return this.getNodeName(elementID, nodeIndex)
            .split('_')
            .map((piece: string) => piece[0].toUpperCase() + piece.slice(1))
            .join(' ');
    }

    getNodeName(elementID: string, nodeIndex: number): string {
        const nodeValue = elementID.split('.')[nodeIndex - 1];

        return this.getByElementName(elementID, nodeIndex)
            || this.getByElementNode(elementID, nodeIndex)
            || this.getByGenericNode(nodeIndex, nodeValue)
            || this.getDefaultNodeName(nodeIndex, nodeValue);
    }

    getByElementName(elementID: string, nodeIndex: number) {
        return (nodeIndex === this.nestingDepth)
            ? this.elementNameConfig
                .filter(config => config.elementID === elementID)
                .map(nodeMap => nodeMap.getName(this.lang))
                .shift()
            : '';
    }

    getByElementNode(elementID: string, nodeIndex: number) {
        return this.elementNodeConfig
            .filter(config => config.elementID === elementID)
            .map(config => config.nodeMap)
            .reduce((a, b) => a.concat(b), [])
            .filter(nodeMap => nodeMap.nodeIndex === nodeIndex)
            .map(nodeMap => nodeMap.getName(this.lang))
            .shift();
    }

    getByGenericNode(nodeIndex: number, nodeValue: string) {
        return this.genericNodeConfig
            .filter(config => config.nodeIndex === nodeIndex)
            .map(config => config.nodeMap)
            .reduce((a, b) => a.concat(b), [])
            .filter(nodeMap => nodeMap.nodeValue === nodeValue)
            .map(nodeMap => nodeMap.getName(this.lang))
            .shift();
    }

    // Gets the specific node headers
    private getDefaultNodeName(nodeIndex: number, nodeValue: string): string {
        if (nodeIndex === 2) {
            return NodeLookups.node2[nodeValue];
        } else if (nodeIndex === 3) {
            return NodeLookups.node3[nodeValue];
        } else if (nodeIndex === 4) {
            return NodeLookups.node4[nodeValue];
        } else if (nodeIndex === 5) {
            return NodeLookups.node5[nodeValue];
        } else if (nodeIndex === 6) {
            return NodeLookups.node6[nodeValue];
        } else if (nodeIndex === 7) {
            return NodeLookups.node7[nodeValue];
        }
    }
}
