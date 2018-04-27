import { MDInstanceElement } from '../../metadata/src/model';

export enum ElementVisibility {
    DEFAULT,
    HIDDEN,
    NO_LOAD
}

export enum MetaElementVisibility {
    DEFAULT,
    PINNED,
    NO_LOAD
}

export enum Lang {
    ENGLISH = 'en',
    FRENCH = 'fr'
}

export class ElementName {
    nodeNameEnglish: string;
    nodeNameFrench: string;

    constructor (element: MDInstanceElement) {
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

export class ElementNameConfig extends ElementName {
    elementID: string;

    constructor(element: MDInstanceElement) {
        super(element);
        this.elementID = element.value;
    }
}

export class ElementNodeConfig {
    elementID: string;
    nodeMap: ElementMap[] = [];

    constructor(element: MDInstanceElement) {
        this.elementID = element.value;

        this.nodeMap = element.instelements
            .filter(elem => elem.name === 'node-index')
            .map(elem => new ElementMap(elem));
    }
}

export class ElementMap extends ElementName {
    nodeIndex: number;

    constructor(element: MDInstanceElement) {
        super(element);
        this.nodeIndex = Number(element.value);
    }
}

export class GenericNodeConfig {
    nodeIndex: number;
    nodeMap: NodeMap[] = [];

    constructor(element: MDInstanceElement) {
        this.nodeIndex = Number(element.value);

        this.nodeMap = element.instelements
            .filter(elem => elem.name === 'node-value')
            .map(elem => new NodeMap(elem));
    }
}

export class NodeMap extends ElementName {
    nodeValue: string;

    constructor(element: MDInstanceElement) {
        super(element);
        this.nodeValue = element.value;
    }
}

export class SubHeaderConfig {
    displaySubHeader: boolean;
    subHeaderStart: number;
    subHeaderEnd: number;

    constructor(displaySubHeader: boolean, element: MDInstanceElement) {
        this.displaySubHeader = displaySubHeader;
        this.subHeaderStart = 5;
        this.subHeaderEnd = 7;

        for (const elem of element.instelements) {
            if (elem.group === 'header' && elem.name === 'sub-header-start') {
                this.subHeaderStart = Number(elem.value);
            }
            if (elem.group === 'header' && elem.name === 'sub-header-end') {
                this.subHeaderEnd = Number(elem.value);
            }
        }
    }
}

export class ElementSubHeaderConfig extends SubHeaderConfig {
    elementID: string;

    constructor(element: MDInstanceElement) {
        super(true, element);
        this.elementID = element.value;
    }
}
