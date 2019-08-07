import { MDInstanceElement } from '../model/MDInstanceElement';
import { MDInstanceDefinition } from '../model/MDInstanceDefinition';
import { IncludeExclude } from '../include-exclude/include-exclude.class';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';

// Enum to dictate how an element should be displayed/loaded
export enum ElementVisibility {
  DEFAULT,
  HIDDEN,
  NO_LOAD,
}

// Enum to support languages
export enum Lang {
  ENGLISH = 'en',
  FRENCH = 'fr',
}

export class UserConfig {
  loadMetaElements: IncludeExclude;
  loadDataElements: IncludeExclude;
  visibleDataElements: IncludeExclude;
  nestingDepth: number;
  subHeader: SubHeaderConfig;
  elementGroups: ElementGroup[];
  elementUnits: ElementUnit[];
  defaultTag: LanguageLabel;
  elementConfigs: ElementConfig[];
  genericNodes: GenericNodeConfig[];
  qaHideFlags: number[];
  loadPreferredUnits: boolean;

  private constructor() {
    this.loadMetaElements = new IncludeExclude([], []);
    this.loadDataElements = new IncludeExclude([], []);
    this.visibleDataElements = new IncludeExclude([], []);

    this.subHeader = new SubHeaderConfig(true);
    this.nestingDepth = 4;

    this.elementGroups = [];
    this.elementUnits = [];
    this.elementConfigs = [];
    this.genericNodes = [];
    this.qaHideFlags = [];
    this.loadPreferredUnits = false;
  }

  public static createConfig(): UserConfig {
    return new UserConfig();
  }

  public static updateConfig(config: UserConfig, definition: MDInstanceDefinition): void {
    for (const element of definition.elements) {
      const checkElementGroupAndName = (group, name) => element.group === group && element.name === name;

      // Configuring Include/Exclude for Metadata
      if (checkElementGroupAndName('load-meta-elements', 'include')) {
        config.loadMetaElements.include(element.value);
      } else if (checkElementGroupAndName('load-meta-elements', 'exclude')) {
        config.loadMetaElements.exclude(element.value);
      }

      // Configuring Include/Exclude for Data
      else if (checkElementGroupAndName('visible-elements', 'include')) {
        config.visibleDataElements.include(element.value);
      } else if (checkElementGroupAndName('visible-elements', 'exclude')) {
        config.visibleDataElements.exclude(element.value);
      } else if (checkElementGroupAndName('load-elements', 'include')) {
        config.loadDataElements.include(element.value);
      } else if (checkElementGroupAndName('load-elements', 'exclude')) {
        config.loadDataElements.exclude(element.value);
      }

      // Configuring nesting level
      else if (checkElementGroupAndName('nesting', 'nesting-depth')) {
        config.nestingDepth = Number(element.value);
      }

      // Configuring default tag
      else if (checkElementGroupAndName('default', 'default-tag')) {
        config.defaultTag = LanguageLabel.createLanguageLabel(element);
      }

      // Configuring element groups
      else if (checkElementGroupAndName('element-groups', 'element-group')) {
        ElementGroup.updateConfig(config.elementGroups, element);
      }

      // Configuring element groups
      else if (checkElementGroupAndName('element-unit', 'element')) {
        ElementUnit.updateConfig(config.elementUnits, element);
      }

      // Configuring sub-headers
      else if (checkElementGroupAndName('header', 'show-sub-header')) {
        config.subHeader = new SubHeaderConfig(element.value === 'true', element);
      }

      // Configuring renaming
      else if (checkElementGroupAndName('node-rename', 'node-index')) {
        GenericNodeConfig.updateConfig(config.genericNodes, element);
      }

      // Configuring renaming
      else if (checkElementGroupAndName('element-display', 'element')) {
        ElementConfig.updateConfig(config.elementConfigs, element);
      }

      // Configuring renaming
      else if (checkElementGroupAndName('element-display', 'hide-qa-flag')) {
        config.qaHideFlags.push(Number(element.value));
      }

      // Configuring renaming
      else if (checkElementGroupAndName('element-display', 'load-preferred-units')) {
        config.loadPreferredUnits = 'true' === element.value;
      }

      // Configuring element editing
      else if (checkElementGroupAndName('element-edit', 'element')) {
        ElementConfig.updateConfig(config.elementConfigs, element);
      }
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

  private constructor(elementID: string) {
    this.nodeNames = [];
    this.elementID = elementID;
  }

  public static updateConfig(configs: ElementConfig[], configElement: MDInstanceElement): void {
    let currentConfig = configs.find(config => config.elementID === configElement.value);

    if (!currentConfig) {
      currentConfig = new ElementConfig(configElement.value);
      configs.push(currentConfig);
    }

    for (const element of configElement.instelements) {
      const checkElementGroupAndName = (group, name) => element.group === group && element.name === name;

      // Configuring element order
      if (checkElementGroupAndName('element-order', 'grid-order')) {
        currentConfig.order = Number(element.value);
      }

      // Configuring nesting level
      else if (checkElementGroupAndName('nesting', 'nesting-depth')) {
        currentConfig.nestingDepth = Number(element.value);
      }

      // Configuring display unit
      else if (checkElementGroupAndName('element-display', 'display-unit')) {
        currentConfig.displayUnit = element.value;
      }

      // Configuring official index title
      else if (checkElementGroupAndName('element-display', 'official-title')) {
        currentConfig.officialTitle = LanguageLabel.createLanguageLabel(element);
      }

      // Configuring index title
      else if (checkElementGroupAndName('element-display', 'index-title')) {
        currentConfig.indexTitle = LanguageLabel.createLanguageLabel(element);
      }

      // Configuring index title
      else if (checkElementGroupAndName('element-display', 'precision')) {
        currentConfig.precision = Number(element.value);
      }

      // Configuring sub header
      else if (checkElementGroupAndName('header', 'show-sub-header')) {
        currentConfig.subHeader = new SubHeaderConfig(element.value === 'true', element);
      }

      // Configuring element name
      else if (checkElementGroupAndName('element-rename', 'node-name')) {
        currentConfig.elementName = LanguageLabel.createLanguageLabel(element);
      }

      // Configuring node names
      else if (checkElementGroupAndName('element-node-rename', 'node-index')) {
        NodeIndexMap.updateConfig(currentConfig.nodeNames, element);
      }

      // Configuring element description
      else if (checkElementGroupAndName('element-display', 'element-description')) {
        currentConfig.elementDescription = LanguageLabel.createLanguageLabel(element);
      }

      // Configuring editable data flags
      else if (checkElementGroupAndName('element-edit', 'available-data-flag')) {
        currentConfig.availableDataFlags = element.value.split(',').map(flag => flag.trim());
      }
    }
  }
}

export class ElementGroup {
  elementIDs: string[] = [];

  constructor(element: MDInstanceElement) {
    this.update(element);
  }

  public static updateConfig(configs: ElementGroup[], element: MDInstanceElement): void {
    let currentConfig: ElementGroup;

    for (const elemGroup of configs) {
      for (const elementID of elemGroup.elementIDs) {
        for (const instElement of element.instelements) {
          if (elementID === instElement.value) {
            currentConfig = elemGroup;
          }
        }
      }
    }

    !!currentConfig ? currentConfig.update(element) : configs.push(new ElementGroup(element));
  }

  private update(element: MDInstanceElement) {
    element.instelements
      .map(elem => elem.value)
      .filter(elementID => !this.elementIDs.some(elemID => elemID === elementID))
      .forEach(elem => this.elementIDs.push(elem));
  }
}

export class ElementUnit {
  elementRegex: RegExp;
  unit: string;

  constructor(element: MDInstanceElement) {
    this.elementRegex = new RegExp(element.value);
    this.update(element);
  }

  public static updateConfig(configs: ElementUnit[], element: MDInstanceElement): void {
    const currentConfig = configs.find(config => config.elementRegex === new RegExp(element.value));

    !!currentConfig ? currentConfig.update(element) : configs.push(new ElementUnit(element));
  }

  private update(element: MDInstanceElement) {
    this.unit = element.instelements
      .filter(elem => elem.name === 'display-unit')
      .map(elem => elem.value)
      .shift();
  }
}

// Class used to store language specific values
export class LanguageLabel {
  englishLabel: string;
  frenchLabel: string;

  protected constructor(element?: MDInstanceElement) {
    if (element != null) {
      this.update(element);
    }
  }

  public static createDefaultLanguageLabel(label: string): LanguageLabel {
    const langLabel = new LanguageLabel();
    langLabel.englishLabel = label;
    langLabel.frenchLabel = label;
    return langLabel;
  }

  public static createLanguageLabel(element: MDInstanceElement): LanguageLabel {
    return new LanguageLabel(element);
  }

  protected update(element: MDInstanceElement) {
    this.englishLabel = element.language.english ? element.language.english : element.value;
    this.frenchLabel = element.language.french ? element.language.french : element.value;
  }

  getName(): string {
    return LanguageService.translator.currentLang === 'en' ? this.englishLabel : this.frenchLabel;
  }
}

// Container to hold nodeIndex and node names
export class NodeIndexMap extends LanguageLabel {
  nodeIndex: number;

  constructor(element: MDInstanceElement) {
    super(element.instelements.filter(elem => elem.name === 'node-name').shift());
    this.nodeIndex = Number(element.value);
  }

  public static updateConfig(configs: NodeIndexMap[], element: MDInstanceElement): void {
    const currentConfig = configs.find(conf => conf.nodeIndex === Number(element.value));

    !!currentConfig ? currentConfig.update(element) : configs.push(new NodeIndexMap(element));
  }
}

// Container to handle generic node naming
export class GenericNodeConfig {
  nodeIndex: number;
  nodeMap: NodeValueMap[] = [];

  constructor(element: MDInstanceElement) {
    this.nodeIndex = Number(element.value);

    this.nodeMap = element.instelements.filter(elem => elem.name === 'node-value').map(elem => new NodeValueMap(elem));
  }

  public static updateConfig(configs: GenericNodeConfig[], element: MDInstanceElement): void {
    const currentConfig = configs.find(conf => conf.nodeIndex === Number(element.value));

    !!currentConfig ? currentConfig.update(element) : configs.push(new GenericNodeConfig(element));
  }

  update(element: MDInstanceElement) {
    const indexElement: MDInstanceElement = element.instelements.find(elem => elem.name === 'node-value');
    NodeValueMap.updateConfig(this.nodeMap, indexElement);
  }
}

// Container to hold node values with their node names
export class NodeValueMap {
  nodeValue: string;
  nodeName: LanguageLabel;
  nodeDescription: LanguageLabel;

  constructor(element: MDInstanceElement) {
    this.nodeValue = element.value;
    this.update(element);
  }

  public static updateConfig(configs: NodeValueMap[], element: MDInstanceElement): void {
    const currentConfig = configs.filter(conf => conf.nodeValue === element.value).shift();

    !!currentConfig ? currentConfig.update(element) : configs.push(new NodeValueMap(element));
  }

  update(element: MDInstanceElement) {
    this.nodeName = LanguageLabel.createLanguageLabel(element.instelements.find(elem => elem.name === 'node-name'));
    this.nodeDescription = LanguageLabel.createLanguageLabel(
      element.instelements.find(elem => elem.name === 'node-description')
    );
  }
}

// Container for the sub header config
export class SubHeaderConfig {
  displaySubHeader: boolean;
  subHeaderStart = 5;
  subHeaderEnd = 7;

  constructor(displaySubHeader: boolean, element?: MDInstanceElement) {
    this.displaySubHeader = displaySubHeader;

    if (element !== undefined) {
      this.update(element);
    }
  }

  update(element: MDInstanceElement): void {
    element.instelements
      .filter(elem => elem.group === 'header')
      .forEach(elem => {
        if (elem.name === 'sub-header-start') {
          this.subHeaderStart = Number(elem.value);
        } else if (elem.name === 'sub-header-end') {
          this.subHeaderEnd = Number(elem.value);
        }
      });
  }
}
