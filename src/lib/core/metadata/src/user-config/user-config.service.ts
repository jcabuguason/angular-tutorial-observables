import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MR_MAPPING_CONFIG, MRMappingConfig } from './mr-mapping.config';
import { Observable } from 'rxjs/Observable';
import { first, publishLast, refCount, tap, catchError } from 'rxjs/operators';

import { SubHeaderConfig, ElementVisibility, Lang, UserConfig } from './user-config.model';

import { NodeLookups } from './node.const';
import { MDInstanceDefinition, MDInstanceElement } from '../model/';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';

@Injectable()
export class UserConfigService {
  public nodeInfo$: Observable<any>;

  private userConfig: UserConfig;

  private nodeInfo;

  // The language used in the config
  private lang: Lang = Lang.ENGLISH;

  // Locally available profiles (might be removed once MR is used)
  private profiles: MDInstanceDefinition[] = [];

  // Function for creating an inclusive array with the specific range
  private range = (start, end) => Array.from({ length: end + 1 - start }, (v, k) => k + start);

  private nodeValueAt = (elementID, i) => elementID.split('.')[i - 1];

  // constructor(private metadataService: MetadataService) {
  constructor(
    @Inject(MR_MAPPING_CONFIG)
    private config: MRMappingConfig,
    private http: HttpClient
  ) {
    this.defaultHeader();

    const infoUrl = `${this.config.endpoint}/metadata/mapping/v1.0/element_taxonomy/commons_element_identification`;
    this.nodeInfo$ = this.http.get<any>(infoUrl).pipe(
      tap(info => (this.nodeInfo = info)),
      first(),
      publishLast(),
      refCount(),
      catchError(e => Observable.throw(e))
    );
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
    const matchesConfig = elem => elem.name === 'profile-name' && elem.value === configName;

    const localProfile = this.profiles.find(profile => profile.elements.some(matchesConfig));

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

  isLoadPreferredUnits(): boolean {
    return this.userConfig.loadPreferredUnits;
  }

  hasPreferredUnits(): boolean {
    return (
      !!this.userConfig.elementUnits.map(config => config.unit).shift() ||
      !!this.userConfig.elementConfigs.map(config => config.displayUnit).shift()
    );
  }

  getElementVisibility(elementID: string): ElementVisibility {
    if (this.isNoLoad(elementID)) {
      return ElementVisibility.NO_LOAD;
    }
    if (this.isHidden(elementID)) {
      return ElementVisibility.HIDDEN;
    }
    return ElementVisibility.DEFAULT;
  }

  isNoLoad(elementID) {
    return !this.userConfig.loadDataElements.checkIncludeExclude(elementID);
  }

  isHidden(elementID) {
    return (
      !this.userConfig.visibleDataElements.checkIncludeExclude(elementID) ||
      (this.hasElementOrder() && this.getElementOrder().indexOf(elementID) === -1)
    );
  }

  getNestingDepth(elementID: string): number {
    return (
      this.userConfig.elementConfigs
        .filter(elemConf => elemConf.elementID === elementID)
        .map(elemConfig => elemConfig.nestingDepth)
        .shift() || this.userConfig.nestingDepth
    );
  }

  hasElementOrder(): boolean {
    return this.getElementOrder().length > 0;
  }

  getElementOrder(): string[] {
    const elementOrder: string[] = [];

    this.userConfig.elementConfigs
      .filter(config => config.order != null)
      .forEach(config => (elementOrder[Number(config.order) - 1] = config.elementID));

    return elementOrder;
  }

  getDefaultTag(): string {
    return !!this.userConfig.defaultTag ? this.userConfig.defaultTag.getName() : this.userConfig.instant('DEFAULT');
  }

  getHideQaFlag(): number[] {
    return this.userConfig.qaHideFlags;
  }

  getElementGroup(elementID: string): string[] {
    return (
      this.userConfig.elementGroups
        .filter(elemGroup => elemGroup.elementIDs.some(elemID => elemID === elementID))
        .map(elemGroup => elemGroup.elementIDs)
        .shift() || []
    );
  }

  getElementUnit(elementID: string): string {
    return this.getSpecificElementUnit(elementID) || this.getGenericElementUnit(elementID) || '';
  }

  getSpecificElementUnit(elementID: string): string {
    return this.userConfig.elementConfigs
      .filter(config => config.elementID === elementID)
      .map(config => config.displayUnit)
      .shift();
  }

  getGenericElementUnit(elementID: string): string {
    const configElement = this.userConfig.elementUnits.find(config => config.elementRegex.test(elementID));
    if (configElement) {
      return configElement.unit;
    }
  }

  getDescription(elementID: string, nodeIndex: number = this.getNestingDepth(elementID)): string {
    return this.getElementDescription(elementID, nodeIndex) || this.getNodeDescription(elementID, nodeIndex);
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
    return (
      this.userConfig.elementConfigs
        .filter(config => config.elementID === elementID)
        .map(config => config.officialTitle)
        .filter(officialTitle => officialTitle !== undefined)
        .map(officialTitle => officialTitle.getName())
        .shift() || this.userConfig.instant('OFFICIAL')
    );
  }

  getElementIndexTitle(elementID: string): string {
    return (
      this.userConfig.elementConfigs
        .filter(config => config.elementID === elementID)
        .map(config => config.indexTitle)
        .filter(indexTitle => indexTitle !== undefined)
        .map(indexTitle => indexTitle.getName())
        .shift() || this.userConfig.instant('LAYER')
    );
  }

  getElementPrecision(elementID: string): number {
    return this.userConfig.elementConfigs
      .filter(config => config.elementID === elementID)
      .map(config => config.precision)
      .shift();
  }

  getFullDefaultHeader(elementID: string, depth: number = this.getNestingDepth(elementID)): string {
    const split = elementID.split('.');
    return this.range(2, depth)
      .map(nodeIndex => this.getDefaultNodeName(nodeIndex, split[nodeIndex - 1]))
      .filter(nodeName => nodeName !== '')
      .join(' / ');
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

    return subHeader !== '' ? ' (' + subHeader + ')' : '';
  }

  getSubHeader(elementID: string): string {
    const headerConfig = this.getSubHeaderConfig(elementID);

    return headerConfig.displaySubHeader
      ? this.range(headerConfig.subHeaderStart, headerConfig.subHeaderEnd)
          .map(nodeIndex => this.getNodeName(elementID, nodeIndex))
          .filter(nodeValue => nodeValue !== '')
          .join(', ')
      : '';
  }

  getSubHeaderConfig(elementID: string): SubHeaderConfig {
    return (
      this.userConfig.elementConfigs
        .filter(elemConf => elemConf.elementID === elementID)
        .map(elemConfig => elemConfig.subHeader)
        .shift() || this.userConfig.subHeader
    );
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

    if (nodeValue === '0') {
      return '';
    } else if (nodeValue === 'M') {
      return 'N/A';
    }

    return (
      this.getByElementName(elementID, nodeIndex) ||
      this.getByElementNode(elementID, nodeIndex) ||
      this.getByGenericNode(nodeIndex, nodeValue) ||
      this.getDefaultNodeName(nodeIndex, nodeValue) ||
      '[UNDEFINED]'
    );
  }

  getSpecificNodeValue(nodeIndex: number, nodeValue: string): string {
    const name = this.getByGenericNode(nodeIndex, nodeValue) || this.getDefaultNodeName(nodeIndex, nodeValue);
    return !!name ? name[0].toUpperCase() + name.slice(1) : '';
  }

  getByElementName(elementID: string, nodeIndex: number = this.getNestingDepth(elementID)): string {
    return nodeIndex === this.getNestingDepth(elementID)
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

  getDefaultNodeName(nodeIndex: number | string, nodeValue: string): string {
    const capitalize = lang => lang.charAt(0).toUpperCase() + lang.slice(1);
    try {
      nodeIndex = String(nodeIndex);
      return !!this.nodeInfo
        ? this.nodeInfo[nodeIndex][nodeValue][`displayValue${capitalize(LanguageService.translator.currentLang)}`]
        : NodeLookups.info[nodeIndex][nodeValue];
    } catch (e) {
      console.warn(`Missing configuration for node value ${nodeValue} at index ${nodeIndex}`);
    }
  }

  buildFullNodeName(elem) {
    if (this.isNoLoad(elem)) {
      return elem
        .split('.')
        .slice(1)
        .map((nv, i) => this.getFormattedNodeName(elem, i + 2))
        .filter(n => n !== '')
        .join(' / ');
    } else {
      return this.getFullFormattedHeader(elem);
    }
  }
}
