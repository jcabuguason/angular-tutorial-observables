import { LanguageService } from 'msc-dms-commons-angular/shared/language';
import { IncludeExclude } from './include-exclude/include-exclude.class';
import {
  SubHeaderConfigOptions,
  NodeValueMapOptions,
  LanguageLabelOptions,
  ElementGroupOptions,
  ElementUnitOptions,
  GenericNodeConfigOptions,
  NodeIndexMapOptions,
  UserConfigOptions,
  ElementConfigOptions,
  LoadVisibleElements,
} from './user-config-options.model';

// Enum to dictate how an element should be displayed/loaded
export enum ElementVisibility {
  Default,
  Hidden,
  NoLoad,
}

// Enum to support languages
export enum Lang {
  English = 'en',
  French = 'fr',
}

export class UserConfig {
  loadMetadata: IncludeExclude = new IncludeExclude([], []);
  visibleMetadata: IncludeExclude = new IncludeExclude([], []);
  loadElements: IncludeExclude = new IncludeExclude([], []);
  visibleElements: IncludeExclude = new IncludeExclude([], []);
  subHeader: SubHeaderConfig = new SubHeaderConfig({ display: 'true' });
  elementGroups: ElementGroup[] = [];
  elementUnits: ElementUnit[] = [];
  defaultTag: LanguageLabel;
  elementConfigs: ElementConfig[] = [];
  genericNodes: GenericNodeConfig[] = [];
  hiddenQaFlags: number[] = [];
  hiddenInstrumentValues: number[] = [];
  nestingDepth = 4;
  loadPreferredUnits = false;
  loadRawData = true;
  visibleRawData = true;
  loadRawHeader = true;
  loadPreferredFormats = false;

  public static createConfig(): UserConfig {
    return new UserConfig();
  }

  public static updateConfig(config: UserConfig, options: UserConfigOptions): void {
    const appendIncludeExcludeList = (list: IncludeExclude, elements: LoadVisibleElements, metadata?: boolean) => {
      elements[metadata ? 'includeAsMetadata' : 'include']?.forEach((element) => list.include(element));
      elements[metadata ? 'excludeAsMetadata' : 'exclude']?.forEach((element) => list.exclude(element));
    };

    // Configuring Include/Exclude for elements
    if (options.allLoadElements != null) {
      appendIncludeExcludeList(config.loadElements, options.allLoadElements);
      appendIncludeExcludeList(config.loadMetadata, options.allLoadElements, true);
    }
    if (options.allVisibleElements != null) {
      appendIncludeExcludeList(config.visibleElements, options.allVisibleElements);
      appendIncludeExcludeList(config.visibleMetadata, options.allVisibleElements, true);
    }

    // Configuring nesting level
    if (options.nestingDepth != null) {
      config.nestingDepth = Number(options.nestingDepth);
    }

    // Configuring default column tag
    if (options.defaultTag != null) {
      config.defaultTag = LanguageLabel.createLanguageLabel(options.defaultTag);
    }

    // Configuring element groups
    if (options.elementGroups != null) {
      options.elementGroups.forEach((group) => ElementGroup.updateConfig(config.elementGroups, group));
    }

    // Configuring element's preferred unit
    if (options.elementUnits != null) {
      options.elementUnits.forEach((unit) => ElementUnit.updateConfig(config.elementUnits, unit));
    }

    // Configuring show/hide sub-headers (i.e. qualifiers)
    if (options.showSubHeader != null) {
      config.subHeader = new SubHeaderConfig(options.showSubHeader);
    }

    // Set preferred name for layers/sensors
    if (options.nodeRename != null) {
      options.nodeRename.forEach((node) => GenericNodeConfig.updateConfig(config.genericNodes, node));
    }

    // Configuring renaming
    if (options.elementConfigs != null) {
      options.elementConfigs.forEach((element) => ElementConfig.updateConfig(config.elementConfigs, element));
    }

    // List of hidden QA values
    if (options.hiddenQaFlags != null) {
      config.hiddenQaFlags = options.hiddenQaFlags.map((value) => Number(value));
    }

    // List of hidden Instrument-summary values
    if (options.hiddenInstrumentValues != null) {
      config.hiddenInstrumentValues = options.hiddenInstrumentValues.map((value) => Number(value));
    }
    // Set preferred units to be converted on load
    if (options.loadPreferredUnits != null) {
      config.loadPreferredUnits = 'true' === options.loadPreferredUnits;
    }

    // Configuring raw data being added to the grid
    if (options?.rawData?.loadRawData != null) {
      config.loadRawData = 'true' === options.rawData.loadRawData;
    }

    // Configuring raw data being visible on initial load
    if (options?.rawData?.visibleRawData != null) {
      config.visibleRawData = 'true' === options.rawData.visibleRawData;
    }

    // Configuring raw header being added to the grid
    if (options?.rawData?.loadRawHeader != null) {
      config.loadRawHeader = 'true' === options.rawData.loadRawHeader;
    }

    // Configure the grid to use preferred format on initial load
    if (options.loadPreferredFormats != null) {
      config.loadPreferredFormats = 'true' === options.loadPreferredFormats;
    }
  }

  instant(key) {
    return LanguageService.translator.instant(`OBS.${key}`);
  }
}

export class ElementConfig {
  elementID: string;
  order: number;
  nestingDepth: number;
  subHeader: SubHeaderConfig;
  nodeNames: NodeIndexMap[];
  elementName: LanguageLabel;
  displayUnit: string;
  officialTitle: LanguageLabel;
  indexTitle: LanguageLabel;
  precision: number;
  elementDescription: LanguageLabel;
  availableDataFlags: string[];
  displayFormat: string;
  sortType: string;

  private constructor(elementID: string) {
    this.nodeNames = [];
    this.elementID = elementID;
  }

  public static updateConfig(configs: ElementConfig[], options: ElementConfigOptions): void {
    let currentConfig = configs.find((config) => config.elementID === options.id);

    // if headers are different for the same ID (multiplicity), then still push the element config
    if (!currentConfig || options.rename.english !== currentConfig.elementName.englishLabel) {
      currentConfig = new ElementConfig(options.id);
      configs.push(currentConfig);
    }

    // Configuring element order
    if (options.order != null) {
      currentConfig.order = Number(options.order);
    }

    // Configuring nesting level
    if (options.nestingDepth != null) {
      currentConfig.nestingDepth = Number(options.nestingDepth);
    }

    // Configuring display unit
    if (options?.displayUnit != null) {
      currentConfig.displayUnit = options.displayUnit;
    }

    // Configuring official index title
    if (options?.officialTitle != null) {
      currentConfig.officialTitle = LanguageLabel.createLanguageLabel(options.officialTitle);
    }

    // Configuring index title
    if (options?.indexTitle != null) {
      currentConfig.indexTitle = LanguageLabel.createLanguageLabel(options.indexTitle);
    }

    // Configuring index title
    if (options?.precision != null) {
      currentConfig.precision = Number(options.precision);
    }

    // Configuring sub header
    if (options.showSubHeader != null) {
      currentConfig.subHeader = new SubHeaderConfig(options.showSubHeader);
    }

    // Configuring element name
    if (options.rename != null) {
      currentConfig.elementName = LanguageLabel.createLanguageLabel(options.rename);
    }

    // Configuring node names
    if (options.nodeRename != null) {
      options.nodeRename.forEach((node) => NodeIndexMap.updateConfig(currentConfig.nodeNames, node));
    }

    // Configuring element description
    if (options?.description) {
      currentConfig.elementDescription = LanguageLabel.createLanguageLabel(options.description);
    }

    // Configuring editable data flags
    if (options?.edit?.availableDataFlag != null) {
      currentConfig.availableDataFlags = options.edit.availableDataFlag.split(',').map((flag) => flag.trim());
    }

    // Configuring display format
    if (options?.displayFormat != null) {
      currentConfig.displayFormat = options.displayFormat;
    }

    // Configuring sort type
    if (options?.sortType != null) {
      currentConfig.sortType = options.sortType;
    }
  }
}

export class ElementGroup {
  groupID: string;
  groupName: LanguageLabel;
  groupDescription: LanguageLabel;
  elementIDs: string[] = [];

  constructor(options: ElementGroupOptions) {
    this.update(options);
  }

  public static updateConfig(configs: ElementGroup[], options: ElementGroupOptions): void {
    const currentConfig: ElementGroup = configs.find((config) => config.groupID === options.id);
    !!currentConfig ? currentConfig.update(options) : configs.push(new ElementGroup(options));
  }

  private update(options: ElementGroupOptions) {
    this.groupID = options.id;
    this.groupName = LanguageLabel.createLanguageLabel(options.name);
    this.groupDescription = LanguageLabel.createLanguageLabel(options.description);
    this.elementIDs.push(
      ...options.elementIDs.filter((newID) => !this.elementIDs.some((existingID) => existingID === newID)),
    );
  }
}

export class ElementUnit {
  elementRegex: RegExp;
  unit: string;

  constructor(options: ElementUnitOptions) {
    this.elementRegex = new RegExp(options.elementRegex);
    this.update(options);
  }

  public static updateConfig(configs: ElementUnit[], options: ElementUnitOptions): void {
    const currentConfig = configs.find((config) => config.elementRegex === new RegExp(options.elementRegex));

    !!currentConfig ? currentConfig.update(options) : configs.push(new ElementUnit(options));
  }

  private update(options: ElementUnitOptions) {
    this.unit = options.displayUnit;
  }
}

// Class used to store language specific values
export class LanguageLabel {
  englishLabel: string;
  frenchLabel: string;

  protected constructor(options?: LanguageLabelOptions) {
    if (options != null) {
      this.update(options);
    }
  }

  public static createDefaultLanguageLabel(label: string): LanguageLabel {
    const langLabel = new LanguageLabel();
    langLabel.englishLabel = label;
    langLabel.frenchLabel = label;
    return langLabel;
  }

  public static createLanguageLabel(options: LanguageLabelOptions): LanguageLabel {
    return new LanguageLabel(options);
  }

  protected update(options: LanguageLabelOptions) {
    this.englishLabel = options.english || options.value;
    this.frenchLabel = options.french || options.value;
  }

  getName(): string {
    return LanguageService.translator.currentLang === 'en' ? this.englishLabel : this.frenchLabel;
  }
}

// Container to hold nodeIndex and node names
export class NodeIndexMap extends LanguageLabel {
  nodeIndex: number;
  nodeName: LanguageLabel;

  constructor(options: NodeIndexMapOptions) {
    super(options.name);
    this.nodeIndex = Number(options.index);
  }

  public static updateConfig(configs: NodeIndexMap[], options: NodeIndexMapOptions): void {
    const currentConfig = configs.find((conf) => conf.nodeIndex === Number(options.index));

    !!currentConfig ? currentConfig.update(options.name) : configs.push(new NodeIndexMap(options));
  }
}

// Container to handle generic node naming
export class GenericNodeConfig {
  nodeIndex: number;
  nodeMap: NodeValueMap[] = [];

  constructor(options: GenericNodeConfigOptions) {
    this.nodeIndex = Number(options.index);

    this.nodeMap = options.map.map((node) => new NodeValueMap(node));
  }

  public static updateConfig(configs: GenericNodeConfig[], options: GenericNodeConfigOptions): void {
    const currentConfig = configs.find((conf) => conf.nodeIndex === Number(options.index));

    !!currentConfig ? currentConfig.update(options) : configs.push(new GenericNodeConfig(options));
  }

  update(options: GenericNodeConfigOptions) {
    options.map.forEach((node) => NodeValueMap.updateConfig(this.nodeMap, node));
  }
}

// Container to hold node values with their node names
export class NodeValueMap {
  nodeValue: string;
  nodeName: LanguageLabel;
  nodeDescription: LanguageLabel;

  constructor(options: NodeValueMapOptions) {
    this.nodeValue = options.value;
    this.update(options);
  }

  public static updateConfig(configs: NodeValueMap[], options: NodeValueMapOptions): void {
    const currentConfig = configs.filter((conf) => conf.nodeValue === options.value).shift();

    !!currentConfig ? currentConfig.update(options) : configs.push(new NodeValueMap(options));
  }

  update(options: NodeValueMapOptions) {
    this.nodeName = LanguageLabel.createLanguageLabel(options.name);
    this.nodeDescription = LanguageLabel.createLanguageLabel(options.description);
  }
}

// Container for the sub header config
export class SubHeaderConfig {
  displaySubHeader: boolean;
  subHeaderStart = 5;
  subHeaderEnd = 7;

  constructor(options: SubHeaderConfigOptions) {
    this.update(options);
  }

  update(options: SubHeaderConfigOptions): void {
    this.displaySubHeader = options.display === 'true';

    this.subHeaderStart = Number(options?.start) || 5;
    this.subHeaderEnd = Number(options?.end) || 7;
  }
}
