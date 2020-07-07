export interface LanguageLabelOptions {
  value: string;
  english: string;
  french: string;
}

export interface GenericNodeConfigOptions {
  index: string;
  map: NodeValueMapOptions[];
}

export interface NodeValueOptions {
  value: string;
  name?: LanguageLabelOptions;
  description?: LanguageLabelOptions;
}

export interface NodeValueMapOptions {
  value: string;
  name?: LanguageLabelOptions;
  description?: LanguageLabelOptions;
}

export interface NodeIndexMapOptions {
  index: string;
  name: LanguageLabelOptions;
}

export interface SubHeaderConfigOptions {
  display: string;
  start?: string;
  end?: string;
}

export interface ElementUnitOptions {
  elementRegex: string;
  displayUnit: string;
}

export interface ElementGroupOptions {
  id: string;
  name: LanguageLabelOptions;
  description?: LanguageLabelOptions;
  elementIDs: string[];
}

export interface RawDataOptions {
  loadRawData?: string;
  loadRawHeader?: string;
  visibleRawData?: string;
}

export interface ElementConfigOptions {
  id: string;
  order?: string;
  description?: LanguageLabelOptions;
  rename?: LanguageLabelOptions;
  nodeRename?: NodeIndexMapOptions[];
  edit?: {
    availableDataFlag: string; // will there be other values that can be edited?
  };
  indexTitle?: LanguageLabelOptions;
  officialTitle?: LanguageLabelOptions;
  displayFormat?: string;
  displayUnit?: string;
  precision?: string;
  nestingDepth?: string;
  showSubHeader?: SubHeaderConfigOptions;
}

export interface LoadVisibleElements {
  include?: string[];
  includeAsMetadata?: string[];
  exclude?: string[];
  excludeAsMetadata?: string[];
}

export interface UserConfigOptions {
  profileName: LanguageLabelOptions;
  childConfig?: string;
  // grid header/nesting
  showSubHeader?: SubHeaderConfigOptions;
  nestingDepth?: string;
  // values to load or make visible
  allLoadElements?: LoadVisibleElements;
  allVisibleElements?: LoadVisibleElements;
  loadPreferredUnits?: string;
  loadPreferredFormats?: string;
  hiddenQaFlags?: string[];
  hiddenInstrumentValues?: string[];
  rawData?: RawDataOptions;
  // specific element naming and grouping
  elementConfigs?: ElementConfigOptions[];
  elementGroups?: ElementGroupOptions[];
  // units for elements (supports regex). Are there configs that would want to use regex over the specific element ID for units?
  elementUnits?: ElementUnitOptions[];
  // generic naming
  defaultTag?: LanguageLabelOptions;
  nodeRename?: GenericNodeConfigOptions[];
}
