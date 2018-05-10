import { MDInstanceElement } from '../../metadata/src/model';

// Enum to dictate how an element should be displayed/loaded
export enum ElementVisibility {
    DEFAULT,
    HIDDEN,
    NO_LOAD
}

// Enum to dictate how a metadata element should be displayed/pinned
export enum MetaElementVisibility {
    DEFAULT,
    PINNED,
    NO_LOAD
}

// Enum to support languages
export enum Lang {
    ENGLISH = 'en',
    FRENCH = 'fr'
}

// Class used to store language specific values
export class ElementName {
    nodeNameEnglish: string;
    nodeNameFrench: string;

    constructor (element: MDInstanceElement) {
        this.update(element);
    }

    update(element: MDInstanceElement) {
        const nameNode = element.instelements
            .filter(elem => elem.name === 'node-name')
            .shift();

        this.nodeNameEnglish = nameNode.language.english ? nameNode.language.english : nameNode.value;
        this.nodeNameFrench = nameNode.language.french ? nameNode.language.french : nameNode.value;
    }

    getName(lang: Lang): string {
        switch (lang) {
            case (Lang.ENGLISH) : {
                return this.nodeNameEnglish;
            }
            case (Lang.FRENCH) : {
                return this.nodeNameFrench;
            }
        }
    }
}

// Container for specific element names
export class ElementNameConfig extends ElementName {
    elementID: string;

    constructor(element: MDInstanceElement) {
        super(element);
        this.elementID = element.value;
    }

    public static updateConfig(configs: ElementNameConfig[], element: MDInstanceElement): void {
        const currentConfig = configs
            .filter(conf => conf.elementID === element.value)
            .shift();

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new ElementNameConfig(element));
    }
}

// Container for element ID's to node index map
export class ElementNodeConfig {
    elementID: string;
    nodeMap: NodeIndexMap[] = [];

    constructor(element: MDInstanceElement) {
        this.elementID = element.value;

        this.update(element);
    }

    public static updateConfig(configs: ElementNodeConfig[], element: MDInstanceElement): void {
        const currentConfig = configs
            .filter(conf => conf.elementID === element.value)
            .shift();

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new ElementNodeConfig(element));
    }

    update(element: MDInstanceElement) {
        const indexElement: MDInstanceElement = element.instelements
            .filter(elem => elem.name === 'node-index')
            .shift();
        NodeIndexMap.updateConfig(this.nodeMap, indexElement);
    }
}

// Container to hold nodeIndex and node names
export class NodeIndexMap extends ElementName {
    nodeIndex: number;

    constructor(element: MDInstanceElement) {
        super(element);
        this.nodeIndex = Number(element.value);
    }

    public static updateConfig(configs: NodeIndexMap[], element: MDInstanceElement): void {
        const currentConfig = configs
            .filter(conf => conf.nodeIndex === Number(element.value))
            .shift();

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new NodeIndexMap(element));
    }

    update(element: MDInstanceElement) {
        super.update(element);
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
            .filter(conf => conf.nodeIndex === Number(element.value))
            .shift();

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new GenericNodeConfig(element));
    }

    update(element: MDInstanceElement) {
        const indexElement: MDInstanceElement = element.instelements
            .filter(elem => elem.name === 'node-value')
            .shift();
        NodeValueMap.updateConfig(this.nodeMap, indexElement);
    }
}

// Container to hold node values with their node names
export class NodeValueMap extends ElementName {
    nodeValue: string;

    constructor(element: MDInstanceElement) {
        super(element);
        this.nodeValue = element.value;
    }

    public static updateConfig(configs: NodeValueMap[], element: MDInstanceElement): void {
        const currentConfig = configs
            .filter(conf => conf.nodeValue === element.value)
            .shift();

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new NodeValueMap(element));
    }

    update(element: MDInstanceElement) {
        super.update(element);
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
                if (elem.group === 'header' && elem.name === 'sub-header-start') {
                    this.subHeaderStart = Number(elem.value);
                } else if (elem.group === 'header' && elem.name === 'sub-header-end') {
                    this.subHeaderEnd = Number(elem.value);
                }
            }
        );
    }
}

// Container for specific element sub header config
export class ElementSubHeaderConfig extends SubHeaderConfig {
    elementID: string;

    constructor(element: MDInstanceElement) {
        super(true, element);
        this.elementID = element.value;
    }

    public static updateConfig(configs: ElementSubHeaderConfig[], element: MDInstanceElement): void {
        const currentConfig = configs
            .filter(conf => conf.elementID === element.value)
            .shift();

        (!!currentConfig)
            ? currentConfig.update(element)
            : configs.push(new ElementSubHeaderConfig(element));
    }
}
