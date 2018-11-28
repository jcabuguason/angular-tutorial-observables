import { Injectable } from '@angular/core';

import { MetadataService } from '../service';

import {
    SubHeaderConfig,
    ElementVisibility,
    Lang,
    UserConfig,
} from './user-config.model';

import { NodeLookups } from './node.const';
import { MDInstanceDefinition, MDInstanceElement } from '../model/';

@Injectable()
export class UserConfigService {

    private userConfig: UserConfig;

    // The language used in the config
    private lang: Lang = Lang.ENGLISH;

    // Locally available profiles (might be removed once MR is used)
    private profiles: MDInstanceDefinition[] = [];

    // Function for creating an inclusive array with the specific range
    private range = (start, end) => Array.from({length: (end + 1 - start)}, (v, k) => k + start);

    private nodeValueAt = (elementID, i) => elementID.split('.')[i - 1];

    // constructor(private metadataService: MetadataService) {
    constructor() {
        this.defaultHeader();
    }

    defaultHeader() {
        this.userConfig = UserConfig.createConfig();
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

        UserConfig.updateConfig(this.userConfig, mdInstance);

    }

    hasPreferredUnits(): boolean {
        return !!this.userConfig.elementUnits
                .map(config => config.unit)
                .shift()
            ||
            !!this.userConfig.elementConfigs
                .map(config => config.displayUnit)
                .shift();
    }

    getElementVisibility(elementID: string): ElementVisibility {

        if (!this.userConfig.loadDataElements.checkIncludeExclude(elementID)) {
            return ElementVisibility.NO_LOAD;
        }

        if (!this.userConfig.visibleDataElements.checkIncludeExclude(elementID)) {
            return ElementVisibility.HIDDEN;
        }

        if (this.hasElementOrder() && this.getElementOrder().indexOf(elementID) === -1) {
            return ElementVisibility.HIDDEN;
        }

        return ElementVisibility.DEFAULT;
    }

    getNestingDepth(elementID: string): number {
        return this.userConfig.elementConfigs
                .filter(elemConf => elemConf.elementID === elementID)
                .map(elemConfig => elemConfig.nestingDepth)
                .shift()
            || this.userConfig.nestingDepth;
    }

    hasElementOrder(): boolean {
        return this.getElementOrder().length > 0;
    }

    getElementOrder(): string[] {
        const elementOrder: string[] = [];

        this.userConfig.elementConfigs
                .filter(config => config.order != null)
                .forEach(config => elementOrder[Number(config.order) - 1 ] = config.elementID);

        return elementOrder;
    }

    getDefaultTag(): string {
        return !!this.userConfig.defaultTag
          ? this.userConfig.defaultTag.getName()
          : this.userConfig.instant('DEFAULT');
    }

    getHideQaFlag(): number[] {
        return this.userConfig.qaHideFlags;
    }

    getElementGroup(elementID: string): string[] {
        return this.userConfig.elementGroups
            .filter(elemGroup => elemGroup.elementIDs.some(elemID => elemID === elementID))
            .map(elemGroup => elemGroup.elementIDs)
            .shift()
            || [];
    }

    getElementUnit(elementID: string): string {
        return this.getSpecificElementUnit(elementID)
                || this.getGenericElementUnit(elementID)
                || '';
    }

    getSpecificElementUnit(elementID: string): string {
        return this.userConfig.elementConfigs
            .filter(config => config.elementID === elementID)
            .map(config => config.displayUnit)
            .shift();
    }

    getGenericElementUnit(elementID: string): string {
        const configElement = this.userConfig.elementUnits
                                  .find(config => config.elementRegex.test(elementID));
        if (configElement) { return configElement.unit; }
    }

    getDescription(elementID: string, nodeIndex: number = this.getNestingDepth(elementID)): string {
        return this.getElementDescription(elementID, nodeIndex)
            || this.getNodeDescription(elementID, nodeIndex);
    }

    getElementDescription(elementID: string, nodeIndex: number = this.getNestingDepth(elementID)): string {
        if (nodeIndex === this.getNestingDepth(elementID)) {
            return this.userConfig.elementConfigs
                .filter(config => config.elementID === elementID)
                .map(config => config.elementDescription)
                .filter(elemConfig => elemConfig !== undefined)
                .map(elemConfig => elemConfig.getName())
                .shift();
        }
    }

    getNodeDescription(elementID: string, nodeIndex: number): string {
        return this.userConfig.genericNodes
            .filter(config => config.nodeIndex === nodeIndex)
            .map(config => config.nodeMap)
            .reduce((a, b) => a.concat(b), [])
            .filter(nodeMap => nodeMap.nodeValue === this.nodeValueAt(elementID, nodeIndex))
            .map(nodeMap => nodeMap.nodeDescription)
            .map(nodeDescription => nodeDescription.getName())
            .shift();
    }

    getElementOfficialIndexTitle(elementID: string): string {
        return this.userConfig.elementConfigs
            .filter(config => config.elementID === elementID)
            .map(config => config.officialTitle)
            .filter(officialTitle => officialTitle !== undefined)
            .map(officialTitle => officialTitle.getName())
            .shift()
            || this.userConfig.instant('OFFICIAL');
    }

    getElementIndexTitle(elementID: string): string {
        return this.userConfig.elementConfigs
            .filter(config => config.elementID === elementID)
            .map(config => config.indexTitle)
            .filter(indexTitle => indexTitle !== undefined)
            .map(indexTitle => indexTitle.getName())
            .shift()
            || this.userConfig.instant('LAYER');
    }

    getElementPrecision(elementID: string): number {
        return this.userConfig.elementConfigs
            .filter(config => config.elementID === elementID)
            .map(config => config.precision)
            .shift();
    }

    getFullFormattedHeader(elementID: string) {
        const main = this.range(2, this.getNestingDepth(elementID))
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
        return this.userConfig.elementConfigs
                .filter(elemConf => elemConf.elementID === elementID)
                .map(elemConfig => elemConfig.subHeader)
                .shift()
            || this.userConfig.subHeader;
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

    getByElementName(elementID: string, nodeIndex: number = this.getNestingDepth(elementID)): string {
        return (nodeIndex === this.getNestingDepth(elementID))
            ? this.userConfig.elementConfigs
                .filter(config => config.elementID === elementID)
                .map(config => config.elementName)
                .map(elementName => elementName.getName())
                .shift()
            : '';
    }

    getByElementNode(elementID: string, nodeIndex: number): string {
        return this.userConfig.elementConfigs
            .filter(config => config.elementID === elementID)
            .map(config => config.nodeNames)
            .reduce((a, b) => a.concat(b), [])
            .filter(nodeNames => nodeNames.nodeIndex === nodeIndex)
            .map(nodeMap => nodeMap.getName())
            .shift();
    }

    getByGenericNode(nodeIndex: number, nodeValue: string): string {
        return this.userConfig.genericNodes
            .filter(config => config.nodeIndex === nodeIndex)
            .map(config => config.nodeMap)
            .reduce((a, b) => a.concat(b), [])
            .filter(nodeMap => nodeMap.nodeValue === nodeValue)
            .map(nodeMap => nodeMap.nodeName)
            .map(nodeName => nodeName.getName())
            .shift();
    }

    getDefaultNodeName(nodeIndex: number, nodeValue: string): string {
        return (2 <= nodeIndex && nodeIndex <= 7)
            ? NodeLookups[`node${nodeIndex}`][nodeValue]
            : '';
    }
}
