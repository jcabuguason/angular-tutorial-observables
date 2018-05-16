import { Injectable } from '@angular/core';

import { MetadataService } from '../service';

import {
    ElementNodeConfig,
    GenericNodeConfig,
    SubHeaderConfig,
    ElementSubHeaderConfig,
    MetaElementVisibility,
    ElementVisibility,
    ElementNameConfig,
    Lang,
} from './user-config.model';

import NodeLookups from './node.const';
import { IncludeExclude } from '../include-exclude/include-exclude.class';
import { MDInstanceDefinition, MDInstanceElement } from '../model/';

@Injectable()
export class UserConfigService {

    // The order of elements in the grid
    private elementOrder: string[];

    // Include/Exclude util for Loading Metadata Elements
    private loadMetaElements: IncludeExclude;

    // Include/Exclude util for Pinning Metadata Elements
    private pinMetaElements: IncludeExclude;

    // Include/Exclude util for Loading Data Elements
    private loadDataElements: IncludeExclude;

    // Include/Exclude util for Visibility of Data Elements
    private visibleDataElements: IncludeExclude;

    // Element name configuration
    private elementNameConfig: ElementNameConfig[];

    // Element node naming configuration
    private elementNodeConfig: ElementNodeConfig[];

    // Node naming configuration
    private genericNodeConfig: GenericNodeConfig[];

    // Generic sub header config
    private genericSubHeaderConfig: SubHeaderConfig;

    // Specific element sub header configs
    private elementSubHeaderConfigs: ElementSubHeaderConfig[];

    // Nesting depth of grid
    private nestingDepth;

    // The language used in the config
    private lang: Lang = Lang.ENGLISH;

    // Locally available profiles (might be removed once MR is used)
    private profiles: MDInstanceDefinition[] = [];

    // Function for creating an inclusive array with the specific range
    private range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start);

    // constructor(private metadataService: MetadataService) {
    constructor() {
        this.defaultHeader();
    }

    defaultHeader() {
        this.elementOrder = [];

        this.loadMetaElements = new IncludeExclude([], []);
        this.pinMetaElements = new IncludeExclude([], []);
        this.loadDataElements = new IncludeExclude([], []);
        this.visibleDataElements = new IncludeExclude([], []);

        this.elementNameConfig = [];
        this.elementNodeConfig = [];
        this.genericNodeConfig = [];

        this.genericSubHeaderConfig = new SubHeaderConfig(true);
        this.elementSubHeaderConfigs = [];

        this.nestingDepth = 4;
    }

    // Sets the language
    setLanguage(lang: Lang) {
        this.lang = lang;
    }

    injectProfiles(mdInstances: MDInstanceDefinition[]) {
        this.profiles = mdInstances;
    }

    // Sets the given user profile from the configured MR
    setProfile(configName: string) {
        this.defaultHeader();

        this.loadProfile(configName);
    }

    // Loads the given user configuration
    loadConfig(mdInstance: MDInstanceDefinition) {
        this.defaultHeader();

        this.loadInstance(mdInstance);
    }

    private loadProfile(configName: string) {

        const matchesConfig = (elem) => (elem.name === 'profile-name' && elem.value === configName);

        const localProfile = this.profiles
            .find(profile => profile.elements.some(matchesConfig));

        if (!!localProfile) {
            this.loadInstance(localProfile);
        }

        // This will need to be modified to work with the MR
        // this.metadataService.loadInstance('/metadata/dms/mr/pegasus-configuration/user-configuration', configName)
        //     .subscribe((param) => this.loadInstance(param));
    }

    private loadInstance(mdInstance: MDInstanceDefinition) {

        mdInstance.elements
            .filter(elem => elem.group === 'relationship' && elem.name === 'child-configs')
            .forEach(elem => this.loadProfile(elem.value));

        // TODO: Find a cleaner way of handling this
        for (const element of mdInstance.elements) {

            // Element ordering
            if (element.group === 'element-order' && element.name === 'grid-order') {
                this.elementOrder[Number(element.index) - 1] = element.value;
            }

            // Configuring Include/Exclude for Metadata
            if (element.group === 'pin-meta-elements' && element.name === 'include') {
                this.pinMetaElements.include(element.value);
            }
            if (element.group === 'pin-meta-elements' && element.name === 'exclude') {
                this.pinMetaElements.exclude(element.value);
            }
            if (element.group === 'load-meta-elements' && element.name === 'include') {
                this.loadMetaElements.include(element.value);
            }
            if (element.group === 'load-meta-elements' && element.name === 'exclude') {
                this.loadMetaElements.exclude(element.value);
            }

            // Configuring Include/Exclude for Data
            if (element.group === 'visible-elements' && element.name === 'include') {
                this.visibleDataElements.include(element.value);
            }
            if (element.group === 'visible-elements' && element.name === 'exclude') {
                this.visibleDataElements.exclude(element.value);
            }
            if (element.group === 'load-elements' && element.name === 'include') {
                this.loadDataElements.include(element.value);
            }
            if (element.group === 'load-elements' && element.name === 'exclude') {
                this.loadDataElements.exclude(element.value);
            }

            // Configuring nesting level
            if (element.group === 'nesting' && element.name === 'nesting-depth') {
                this.nestingDepth = Number(element.value);
            }

            // Configuring sub-headers
            if (element.group === 'header' && element.name === 'show-sub-header') {
                this.genericSubHeaderConfig = new SubHeaderConfig(element.value === 'true', element);
            }
            if (element.group === 'header' && element.name === 'element-sub-header') {
                ElementSubHeaderConfig.updateConfig(this.elementSubHeaderConfigs, element);
            }

            // Configuring renaming
            if (element.group === 'node-rename' && element.name === 'node-index') {
                GenericNodeConfig.updateConfig(this.genericNodeConfig, element);
            }
            if (element.group === 'element-node-rename' && element.name === 'element-id') {
                ElementNodeConfig.updateConfig(this.elementNodeConfig, element);
            }
            if (element.group === 'element-rename' && element.name === 'element-id') {
                ElementNameConfig.updateConfig(this.elementNameConfig, element);
            }
        }
    }

    getElementVisibility(elementID: string): ElementVisibility {

        if (!this.loadDataElements.checkIncludeExclude(elementID)) {
            return ElementVisibility.NO_LOAD;
        }

        if (!this.visibleDataElements.checkIncludeExclude(elementID)) {
            return ElementVisibility.HIDDEN;
        }

        if (this.elementOrder.length > 0 && this.elementOrder.indexOf(elementID) === -1) {
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

    getNestingDepth(): number {
        return this.nestingDepth;
    }

    hasElementOrder(): boolean {
        return this.elementOrder.length > 0;
    }

    getElementOrder(): string[] {
        return this.elementOrder;
    }

    getFullFormattedHeader(elementID: string) {
        const main = this.range(2, this.nestingDepth)
            .map(nodeIndex => this.getFormattedNodeName(elementID, nodeIndex))
            .filter(nodeName => nodeName !== '')
            .join(' / ');

        return main + this.getFormattedSubHeader(elementID);
    }

    getFormattedSubHeader(elementID: string): string {
        const subHeader = this.getSubHeader(elementID);

        return (subHeader !== '')
            ? ' (' + subHeader + ')'
            : '';
    }

    getSubHeader(elementID: string): string {
        const headerConfig = this.getSubHeaderConfig(elementID);

        return (headerConfig.displaySubHeader)
            ? this.range(headerConfig.subHeaderStart, headerConfig.subHeaderEnd)
                .map(nodeIndex => this.getNodeName(elementID, nodeIndex))
                .filter(nodeValue => nodeValue !== '')
                .join(',')
            : '';
    }

    getSubHeaderConfig(elementID: string): SubHeaderConfig {
        return this.elementSubHeaderConfigs
                .find((config) => config.elementID === elementID)
            || this.genericSubHeaderConfig;
    }


    getFormattedNodeName(elementID: string, nodeIndex: number): string {
        return this.getNodeName(elementID, nodeIndex)
            .split('_')
            .filter(s => !!s)
            .map((piece: string) => piece[0].toUpperCase() + piece.slice(1))
            .join(' ');
    }

    getNodeName(elementID: string, nodeIndex: number): string {
        const nodeValue = elementID.split('.')[nodeIndex - 1];

        return (nodeValue === '0')
            ? ''
            : this.getByElementName(elementID, nodeIndex)
                || this.getByElementNode(elementID, nodeIndex)
                || this.getByGenericNode(nodeIndex, nodeValue)
                || this.getDefaultNodeName(nodeIndex, nodeValue)
                || '[UNDEFINED]';
    }

    getByElementName(elementID: string, nodeIndex: number = this.getNestingDepth()): string {
        return (nodeIndex === this.nestingDepth)
            ? this.elementNameConfig
                .filter(config => config.elementID === elementID)
                .map(nodeMap => nodeMap.getName(this.lang))
                .shift()
            : '';
    }

    getByElementNode(elementID: string, nodeIndex: number): string {
        return this.elementNodeConfig
            .filter(config => config.elementID === elementID)
            .map(config => config.nodeMap)
            .reduce((a, b) => a.concat(b), [])
            .filter(nodeMap => nodeMap.nodeIndex === nodeIndex)
            .map(nodeMap => nodeMap.getName(this.lang))
            .shift();
    }

    getByGenericNode(nodeIndex: number, nodeValue: string): string {
        return this.genericNodeConfig
            .filter(config => config.nodeIndex === nodeIndex)
            .map(config => config.nodeMap)
            .reduce((a, b) => a.concat(b), [])
            .filter(nodeMap => nodeMap.nodeValue === nodeValue)
            .map(nodeMap => nodeMap.getName(this.lang))
            .shift();
    }

    getDefaultNodeName(nodeIndex: number, nodeValue: string): string {
        return (2 <= nodeIndex && nodeIndex <= 7)
            ? NodeLookups[`node${nodeIndex}`][nodeValue]
            : '';
    }
}
