import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';
import { modifiedOrBlank, range } from 'msc-dms-commons-angular/shared/util';
import { BehaviorSubject, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, first, publishLast, refCount, tap } from 'rxjs/operators';
import { MRMappingConfig, MR_MAPPING_CONFIG } from './mr-mapping.config';
import { NodeLookups } from './node.const';
import { ElementVisibility, Lang, SubHeaderConfig, UserConfig, ElementGroup } from './user-config.model';
import { UserConfigOptions } from './user-config-options.model';

@Injectable()
export class UserConfigService {
  public nodeInfo$: Observable<any>;
  public profileLoading$ = new BehaviorSubject(undefined);

  private userConfig: UserConfig;
  private nodeInfo;
  // The language used in the config
  private lang: Lang = Lang.ENGLISH;
  // Locally available profiles (might be removed once MR is used)
  private profiles: UserConfigOptions[] = [];
  private nodeValueAt = (elementID, i) => elementID.split('.')[i - 1];

  constructor(
    @Inject(MR_MAPPING_CONFIG)
    private config: MRMappingConfig,
    private http: HttpClient,
  ) {
    this.defaultHeader();

    const infoUrl = `${this.config.endpoint}/metadata/mapping/v1.0/element_taxonomy/commons_element_identification`;
    this.nodeInfo$ = this.http.get<any>(infoUrl).pipe(
      tap((info) => (this.nodeInfo = info)),
      first(),
      publishLast(),
      refCount(),
      catchError((e) => observableThrowError(e)),
    );
  }

  defaultHeader() {
    this.userConfig = UserConfig.createConfig();
  }

  injectProfiles(config: UserConfigOptions[]) {
    this.profiles = config;
  }

  // Sets the given user profile from the configured MR
  setProfile(configName: string) {
    this.defaultHeader();

    this.loadProfile(configName);
  }

  // Loads the given user configuration
  loadConfig(config: UserConfigOptions) {
    this.profileLoading$.next(true);

    this.defaultHeader();

    this.loadInstance(config);

    this.profileLoading$.next(false);
  }

  private loadProfile(configName: string) {
    const localProfile = this.profiles.find((profile) => profile.profileName.value === configName);

    if (!!localProfile) {
      this.loadInstance(localProfile);
    }

    // This will need to be modified to work with the MR
    // this.metadataService.loadInstance('/metadata/dms/mr/pegasus-configuration/user-configuration', configName)
    //     .subscribe((param) => this.loadInstance(param));
  }

  private loadInstance(config: UserConfigOptions) {
    if (!!config?.childConfig) {
      this.loadProfile(config.childConfig);
    }

    UserConfig.updateConfig(this.userConfig, config);
  }

  isLoadPreferredUnits(): boolean {
    return this.userConfig.loadPreferredUnits;
  }

  hasPreferredUnits(): boolean {
    return (
      !!this.userConfig.elementUnits.map((config) => config.unit).shift() ||
      !!this.userConfig.elementConfigs.map((config) => config.displayUnit).shift()
    );
  }

  getElementVisibility(elementID: string, isMetadata?: boolean): ElementVisibility {
    if (!this.isLoad(elementID, isMetadata)) {
      return ElementVisibility.NO_LOAD;
    }
    if (!this.isVisible(elementID, isMetadata)) {
      return ElementVisibility.HIDDEN;
    }

    return ElementVisibility.DEFAULT;
  }

  isLoad(elementID: string, isMetadata?: boolean): boolean {
    return isMetadata && !this.userConfig.loadMetadata.hasEmptyLists()
      ? this.userConfig.loadMetadata.checkIncludeExclude(elementID)
      : this.userConfig.loadElements.checkIncludeExclude(elementID);
  }

  isVisible(elementID: string, isMetadata?: boolean): boolean {
    return isMetadata && !this.userConfig.visibleMetadata.hasEmptyLists()
      ? this.userConfig.visibleMetadata.checkIncludeExclude(elementID)
      : this.userConfig.visibleElements.checkIncludeExclude(elementID);
  }

  loadAsMetadata(elementID: string): boolean {
    return !this.userConfig.loadMetadata.hasEmptyLists() && this.userConfig.loadMetadata.checkIncludeExclude(elementID);
  }

  getNestingDepth(elementID: string): number {
    return (
      this.userConfig.elementConfigs
        .filter((elemConf) => elemConf.elementID === elementID)
        .map((elemConfig) => elemConfig.nestingDepth)
        .shift() || this.userConfig.nestingDepth
    );
  }

  hasElementOrder(): boolean {
    return this.getElementOrder().length > 0;
  }

  getElementOrder(): string[] {
    const elementOrder: string[] = [];

    this.userConfig.elementConfigs
      .filter((config) => config.order != null)
      .forEach((config) => (elementOrder[Number(config.order) - 1] = config.elementID));

    return elementOrder;
  }

  getDefaultTag(): string {
    return !!this.userConfig.defaultTag ? this.userConfig.defaultTag.getName() : this.userConfig.instant('DEFAULT');
  }

  getHiddenQaFlags(): number[] {
    return this.userConfig.hiddenQaFlags;
  }

  getHiddenInstrumentValues(): number[] {
    return this.userConfig.hiddenInstrumentValues;
  }

  getElementGroup(elementID: string): ElementGroup {
    return this.userConfig.elementGroups.find((elemGroup) =>
      elemGroup.elementIDs.some((elemID) => elemID === elementID),
    );
  }

  getAllElementGroups(): ElementGroup[] {
    return this.userConfig.elementGroups;
  }

  getElementUnit(elementID: string): string {
    return this.getSpecificElementUnit(elementID) || this.getGenericElementUnit(elementID) || '';
  }

  getSpecificElementUnit(elementID: string): string {
    return this.userConfig.elementConfigs
      .filter((config) => config.elementID === elementID)
      .map((config) => config.displayUnit)
      .shift();
  }

  getGenericElementUnit(elementID: string): string {
    const configElement = this.userConfig.elementUnits.find((config) => config.elementRegex.test(elementID));
    if (configElement) {
      return configElement.unit;
    }
  }

  getElementEditableDataFlags(elementID: string): string[] {
    return this.userConfig.elementConfigs
      .filter((config) => config.elementID === elementID)
      .map((config) => config.availableDataFlags)
      .shift();
  }

  getDescription(elementID: string, nodeIndex: number = this.getNestingDepth(elementID)): string {
    return this.getElementDescription(elementID, nodeIndex) || this.getNodeDescription(elementID, nodeIndex);
  }

  getElementDescription(elementID: string, nodeIndex: number = this.getNestingDepth(elementID)): string {
    if (nodeIndex === this.getNestingDepth(elementID)) {
      return this.userConfig.elementConfigs
        .filter((config) => config.elementID === elementID)
        .map((config) => config.elementDescription)
        .filter((elemConfig) => elemConfig !== undefined)
        .map((elemConfig) => elemConfig.getName())
        .shift();
    }
  }

  getNodeDescription(elementID: string, nodeIndex: number): string {
    return this.userConfig.genericNodes
      .filter((config) => config.nodeIndex === nodeIndex)
      .map((config) => config.nodeMap)
      .reduce((a, b) => a.concat(b), [])
      .filter((nodeMap) => nodeMap.nodeValue === this.nodeValueAt(elementID, nodeIndex))
      .map((nodeMap) => nodeMap.nodeDescription)
      .map((nodeDescription) => nodeDescription.getName())
      .shift();
  }

  getElementOfficialIndexTitle(elementID: string): string {
    return (
      this.userConfig.elementConfigs
        .filter((config) => config.elementID === elementID)
        .map((config) => config.officialTitle)
        .filter((officialTitle) => officialTitle !== undefined)
        .map((officialTitle) => officialTitle.getName())
        .shift() || this.userConfig.instant('OFFICIAL')
    );
  }

  getElementIndexTitle(elementID: string): string {
    return (
      this.userConfig.elementConfigs
        .filter((config) => config.elementID === elementID)
        .map((config) => config.indexTitle)
        .filter((indexTitle) => indexTitle !== undefined)
        .map((indexTitle) => indexTitle.getName())
        .shift() || this.userConfig.instant('LAYER')
    );
  }

  getElementPrecision(elementID: string): number {
    return this.userConfig.elementConfigs
      .filter((config) => config.elementID === elementID)
      .map((config) => config.precision)
      .shift();
  }

  getFullDefaultHeader(elementID: string, depth: number = this.getNestingDepth(elementID)): string {
    const split = elementID.split('.');
    return range(2, depth)
      .map((nodeIndex) => this.getDefaultNodeName(nodeIndex, split[nodeIndex - 1]))
      .filter((nodeName) => nodeName !== '')
      .join(' / ');
  }

  getFullFormattedHeader(elementID: string, separator: string = ' / '): string {
    const group = this.getElementGroup(elementID);
    const groupName = group == null ? '' : modifiedOrBlank(group.groupName.getName(), (s) => `${s}${separator}`);
    const main = range(2, this.getNestingDepth(elementID))
      .map((nodeIndex) => this.getFormattedNodeName(elementID, nodeIndex))
      .filter((nodeName) => nodeName !== '')
      .join(separator);

    return `${groupName}${main}${this.getFormattedSubHeader(elementID)}`;
  }

  getFormattedSubHeader(elementID: string): string {
    const subHeader = this.getSubHeader(elementID);
    return modifiedOrBlank(subHeader, (s) => `, ${s}`);
  }

  getSubHeader(elementID: string): string {
    const headerConfig = this.getSubHeaderConfig(elementID);

    return headerConfig.displaySubHeader
      ? range(headerConfig.subHeaderStart, headerConfig.subHeaderEnd)
          .map((nodeIndex) => this.getNodeName(elementID, nodeIndex))
          .filter((nodeValue) => nodeValue !== '')
          .join(', ')
      : '';
  }

  getSubHeaderConfig(elementID: string): SubHeaderConfig {
    return (
      this.userConfig.elementConfigs
        .filter((elemConf) => elemConf.elementID === elementID)
        .map((elemConfig) => elemConfig.subHeader)
        .shift() || this.userConfig.subHeader
    );
  }

  getFormattedNodeName(elementID: string, nodeIndex: number): string {
    return this.getNodeName(elementID, nodeIndex)
      .split('_')
      .filter((s) => !!s)
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
          .filter((config) => config.elementID === elementID)
          .map((config) => config.elementName)
          .map((elementName) => elementName.getName())
          .shift()
      : '';
  }

  getByElementNode(elementID: string, nodeIndex: number): string {
    return this.userConfig.elementConfigs
      .filter((config) => config.elementID === elementID)
      .map((config) => config.nodeNames)
      .reduce((a, b) => a.concat(b), [])
      .filter((nodeNames) => nodeNames.nodeIndex === nodeIndex)
      .map((nodeMap) => nodeMap.getName())
      .shift();
  }

  getByGenericNode(nodeIndex: number, nodeValue: string): string {
    return this.userConfig.genericNodes
      .filter((config) => config.nodeIndex === nodeIndex)
      .map((config) => config.nodeMap)
      .reduce((a, b) => a.concat(b), [])
      .filter((nodeMap) => nodeMap.nodeValue === nodeValue)
      .map((nodeMap) => nodeMap.nodeName)
      .map((nodeName) => nodeName.getName())
      .shift();
  }

  getDefaultNodeName(nodeIndex: number | string, nodeValue: string): string {
    const capitalize = (lang) => lang.charAt(0).toUpperCase() + lang.slice(1);
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
    if (!this.isLoad(elem)) {
      return elem
        .split('.')
        .slice(1)
        .map((nv, i) => this.getFormattedNodeName(elem, i + 2))
        .filter((n) => n !== '')
        .join(' / ');
    } else {
      return this.getFullFormattedHeader(elem);
    }
  }

  isLoadRawData(): boolean {
    return this.userConfig.loadRawData;
  }

  isVisibleRawData(): boolean {
    return this.userConfig.visibleRawData;
  }

  isLoadRawHeader(): boolean {
    return this.userConfig.loadRawHeader;
  }

  isLoadPreferredFormats(): boolean {
    return this.userConfig.loadPreferredFormats;
  }

  getElementDisplayFormat(elementID: string): string {
    return this.userConfig.elementConfigs
      .filter((config) => config.elementID === elementID)
      .map((config) => config.displayFormat)
      .shift();
  }
}
