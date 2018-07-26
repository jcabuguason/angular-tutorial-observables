import { MDInstanceElement, MDInstanceDefinition } from '../model';
import { IncludeExclude } from '../include-exclude/include-exclude.class';

// Enum to dictate how an element should be displayed/loaded
export enum ElementVisibility {
    DEFAULT,
    HIDDEN,
    NO_LOAD
}

// Enum to support languages
export enum Lang {
    ENGLISH = 'en',
    FRENCH = 'fr'
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

    private constructor() {
        this.loadMetaElements = new IncludeExclude([], []);
        this.loadDataElements = new IncludeExclude([], []);
        this.visibleDataElements = new IncludeExclude([], []);

        this.subHeader = new SubHeaderConfig(true);

        this.defaultTag = LanguageLabel.createDefaultLanguageLabel('Default');
        this.nestingDepth = 4;

        this.elementGroups = [];
        this.elementUnits = [];
        this.elementConfigs = [];
        this.genericNodes = [];
    }

    public static createConfig(): UserConfig {
        return new UserConfig();
    }

    public static updateConfig(config: UserConfig, definition: MDInstanceDefinition): void {

        for (const element of definition.elements) {


            // Configuring Include/Exclude for Metadata
            if (element.group === 'load-meta-elements' && element.name === 'include') {
                config.loadMetaElements.include(element.value);
            }
            if (element.group === 'load-meta-elements' && element.name === 'exclude') {
                config.loadMetaElements.exclude(element.value);
            }

            // Configuring Include/Exclude for Data
            if (element.group === 'visible-elements' && element.name === 'include') {
                config.visibleDataElements.include(element.value);
            }
            if (element.group === 'visible-elements' && element.name === 'exclude') {
                config.visibleDataElements.exclude(element.value);
            }
            if (element.group === 'load-elements' && element.name === 'include') {
                config.loadDataElements.include(element.value);
            }
            if (element.group === 'load-elements' && element.name === 'exclude') {
                config.loadDataElements.exclude(element.value);
            }

            // Configuring nesting level
            if (element.group === 'nesting' && element.name === 'nesting-depth') {
                config.nestingDepth = Number(element.value);
            }

            // Configuring default tag
            if (element.group === 'default' && element.name === 'default-tag') {
                config.defaultTag = LanguageLabel.createLanguageLabel(element);
            }

            // Configuring element groups
            if (element.group === 'element-groups' && element.name === 'element-group') {
                ElementGroup.updateConfig(config.elementGroups, element);
            }

            // Configuring element groups
            if (element.group === 'element-unit' && element.name === 'element') {
                ElementUnit.updateConfig(config.elementUnits, element);
            }

            // Configuring sub-headers
            if (element.group === 'header' && element.name === 'show-sub-header') {
                config.subHeader = new SubHeaderConfig(element.value === 'true', element);
            }

            // Configuring renaming
            if (element.group === 'node-rename' && element.name === 'node-index') {
                GenericNodeConfig.updateConfig(config.genericNodes, element);
            }

            // Configuring renaming
            if (element.group === 'element-display' && element.name === 'element') {
                ElementConfig.updateConfig(config.elementConfigs, element);
            }
        }

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
    indexTitle: LanguageLabel;
    precision: number;

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
            // Configuring element order
            if (element.group === 'element-order' && element.name === 'grid-order') {
                currentConfig.order = Number(element.value);
            }

            // Configuring nesting level
            if (element.group === 'nesting' && element.name === 'nesting-depth') {
                currentConfig.nestingDepth = Number(element.value);
            }

            // Configuring display unit
            if (element.group === 'element-display' && element.name === 'display-unit') {
                currentConfig.displayUnit = element.value;
            }

            // Configuring index title
            if (element.group === 'element-display' && element.name === 'index-title') {
                currentConfig.indexTitle = LanguageLabel.createLanguageLabel(element);
            }

            // Configuring index title
            if (element.group === 'element-display' && element.name === 'precision') {
                currentConfig.precision = Number(element.value);
            }

            // Configuring sub header
            if (element.group === 'header' && element.name === 'show-sub-header') {
                currentConfig.subHeader = new SubHeaderConfig(element.value === 'true', element);
            }

            // Configuring element name
            if (element.group === 'element-rename' && element.name === 'node-name') {
                currentConfig.elementName =  LanguageLabel.createLanguageLabel(element);
            }

            // Configuring node names
            if (element.group === 'element-node-rename' && element.name === 'node-index') {
                NodeIndexMap.updateConfig(currentConfig.nodeNames, element);
            }
        }
    }
}

export class ElementGroup {
    elementIDs: string[] = [];

    constructor (element: MDInstanceElement) {
        this.update(element);
    }

    public static updateConfig(configs: ElementGroup[], element: MDInstanceElement): void {
        let currentConfig: ElementGroup;

        // for (const elementGroup of configs) {
        //     if (elementBelongsToGroup(elementGroup, element)) {
        //         elementGroup.update(element);
        //         return;
        //     }
        // }

        // configs.push(new ElementGroup(element));

        for (const elemGroup of configs) {
            for (const elementID of elemGroup.elementIDs) {
                for (const instElement of element.instelements) {
                    if (elementID === instElement.value) {
                        currentConfig = elemGroup;
                    }
                }
            }
        }

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new ElementGroup(element));
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

    constructor (element: MDInstanceElement) {
        this.elementRegex = new RegExp(element.value);
        this.update(element);
    }

    public static updateConfig(configs: ElementUnit[], element: MDInstanceElement): void {
        const currentConfig = configs
            .find(config => config.elementRegex === new RegExp(element.value));

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new ElementUnit(element));
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

    protected constructor (element?: MDInstanceElement) {
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

    getName(lang: Lang): string {
        switch (lang) {
            case (Lang.ENGLISH) : {
                return this.englishLabel;
            }
            case (Lang.FRENCH) : {
                return this.frenchLabel;
            }
        }
    }
}

// Container to hold nodeIndex and node names
export class NodeIndexMap extends LanguageLabel {
    nodeIndex: number;

    constructor(element: MDInstanceElement) {
        super(element.instelements
                     .filter(elem => elem.name === 'node-name')
                     .shift()
                    );
        this.nodeIndex = Number(element.value);
    }

    public static updateConfig(configs: NodeIndexMap[], element: MDInstanceElement): void {
        const currentConfig = configs
            .find(conf => conf.nodeIndex === Number(element.value));

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new NodeIndexMap(element));
    }
}

// Container to handle generic node naming
export class GenericNodeConfig {
    nodeIndex: number;
    nodeMap: NodeValueMap[] = [];

    constructor(element: MDInstanceElement) {
        this.nodeIndex = Number(element.value);

        this.nodeMap = element.instelements
            .filter(elem => elem.name === 'node-value')
            .map(elem => new NodeValueMap(elem));
    }

    public static updateConfig(configs: GenericNodeConfig[], element: MDInstanceElement): void {
        const currentConfig = configs
            .find(conf => conf.nodeIndex === Number(element.value));

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new GenericNodeConfig(element));
    }

    update(element: MDInstanceElement) {
        const indexElement: MDInstanceElement = element.instelements
            .find(elem => elem.name === 'node-value');
        NodeValueMap.updateConfig(this.nodeMap, indexElement);
    }
}

// Container to hold node values with their node names
export class NodeValueMap extends LanguageLabel {
    nodeValue: string;

    constructor(element: MDInstanceElement) {
        super(element.instelements
                     .filter(elem => elem.name === 'node-name')
                     .shift()
                    );
        this.nodeValue = element.value;
    }

    public static updateConfig(configs: NodeValueMap[], element: MDInstanceElement): void {
        const currentConfig = configs
            .filter(conf => conf.nodeValue === element.value)
            .shift();

        (!!currentConfig)
            ? currentConfig.update(element.instelements
                                    .filter(elem => elem.name === 'node-name')
                                    .shift())
            : configs.push(new NodeValueMap(element));
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
            .forEach( elem => {
                if (elem.name === 'sub-header-start') {
                    this.subHeaderStart = Number(elem.value);
                } else if (elem.name === 'sub-header-end') {
                    this.subHeaderEnd = Number(elem.value);
                }
            }
        );
    }
}
