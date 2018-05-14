import { UserConfigService } from './user-config.service';
import { MetadataService } from '../../metadata/src/service';
import { MDInstanceDefinition } from '../../metadata/src/model';
import { Lang, MetaElementVisibility, ElementVisibility } from './user-config.model';

describe('UserConfigService', () => {

    let service: UserConfigService;

    beforeEach(() => {
        // service = new UserConfigService(new MetadataService(null, null));
        service = new UserConfigService();
    });

    it('should set elements in the configured order', () => {
        service.loadConfig(nodeOrderConfig);
        expect(service.getElementOrder()[0]).toBe('1.19.265.0.66.0.0');
        expect(service.getElementOrder()[1]).toBe('1.19.265.8.65.12.0');
        expect(service.getElementOrder()[2]).toBe('1.19.265.7.65.12.0');
    });

    it('should make an element not in the configured order hidden', () => {
        service.loadConfig(nodeOrderConfig);
        expect(service.getElementVisibility('1.2.3.4.5.6.7')).toBe(ElementVisibility.HIDDEN);
    });

    describe('Element loading', () => {
        beforeEach(() => {
            service.loadConfig(includeExcludeConfig);
        });

        it('Pinned metadata', () => {
            expect(service.getMetaElementVisibility('1.2.6.0.0.0.0')).toBe(MetaElementVisibility.PINNED);
        });

        it('No load metadata', () => {
            expect(service.getMetaElementVisibility('1.2.7.0.0.0.0')).toBe(MetaElementVisibility.NO_LOAD);
        });

        it('Default metadata', () => {
            expect(service.getMetaElementVisibility('1.2.3.0.0.0.0')).toBe(MetaElementVisibility.DEFAULT);
        });

        it('No load element', () => {
            expect(service.getElementVisibility('1.2.8.0.0.0.0')).toBe(ElementVisibility.NO_LOAD);
        });

        it('Hidden element', () => {
            expect(service.getElementVisibility('1.2.9.0.0.0.0')).toBe(ElementVisibility.HIDDEN);
        });

        it('Default element', () => {
            expect(service.getElementVisibility('1.2.3.0.0.0.0')).toBe(ElementVisibility.DEFAULT);
        });
    });

    it('Default nesting level test', () => {
        service.loadConfig(emptyConfig);
        expect(service.getNestingDepth()).toBe(4);
    });

    it('Nesting level test', () => {
        service.loadConfig(nestingConfig);
        expect(service.getNestingDepth()).toBe(3);
    });

    it('Default sub header', () => {
        service.loadConfig(emptyConfig);
        expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('-1 min,1 min,-5 cm');
    });

    it('No sub header', () => {
        service.loadConfig(noSubHeaderConfig);
        expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('');
    });

    it('Global sub header', () => {
        service.loadConfig(subHeaderConfig);
        expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('-1 min,1 min');
    });

    it('Element specific sub header', () => {
        service.loadConfig(subHeaderConfig);
        expect(service.getSubHeader('1.19.270.2.1.1.8')).toBe('1 min,-10 cm');
    });

    it('Default Node', () => {
        expect(service.getNodeName('1.19.265.0.66.0.0', 2)).toBe('temperature');
    });

    it('Default Formatted Node', () => {
        expect(service.getFormattedNodeName('1.19.265.0.66.0.0', 2)).toBe('Temperature');
    });

    it('Node Rename', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('Test');
    });

    it('Element Node Rename', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormattedNodeName('1.19.265.8.65.12.0', 6)).toBe('Max');
    });

    it('Element Rename at nested', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormattedNodeName('1.19.265.8.65.12.0', 4)).toBe('Max Temp');
    });

    it('Element Rename not at nested', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormattedNodeName('1.19.265.8.65.12.0', 3)).toBe('Air Temperature');
    });

    it('Unknown element node', () => {
        service.loadConfig(emptyConfig);
        expect(service.getFormattedNodeName('1.19.100000.0.66.0.0', 3)).toBe('[UNDEFINED]');
    });

    it('Undefined element node', () => {
        service.loadConfig(emptyConfig);
        expect(service.getDefaultNodeName(3, '10000000000')).toBe(undefined);
    });

    it('English Node Rename', () => {
        service.loadConfig(langRenameConfig);
        expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('En');
    });

    it('French Node Rename', () => {
        service.setLanguage(Lang.FRENCH);
        service.loadConfig(langRenameConfig);
        expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('Fr');
    });

    it('should load property from child instance', () => {
        service.injectProfiles([childConfig]);
        service.loadConfig(parentConfig);
        expect(service.getFormattedNodeName('1.19.7.0.66.0.0', 3)).toBe('Simple');
    });

    it('should load overridden property from parent instance', () => {
        service.injectProfiles([childConfig]);
        service.loadConfig(parentConfig);
        expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('Good');
    });

    it('should show the entire element name with zero value sub headers', () => {
        service.loadConfig(emptyConfig);
        expect(service.getFullFormattedHeader('1.12.207.2.1.1.0')).toBe('Pressure / Mean Sea Level Pressure / Average (-1 min,1 min)');
    });

    it('should show the entire element name with zero value headers', () => {
        service.loadConfig(emptyConfig);
        expect(service.getFullFormattedHeader('1.19.6.0.66.0.0')).toBe('Temperature / Ozone Concentration (-12 h)');
    });

    const emptyConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: []
    };

    const includeExcludeConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'pin-meta-elements', name: 'include', value: '1\.2\.6.*', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: []},
            {group: 'load-meta-elements', name: 'exclude', value: '1\.2\.7.*', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: []},
            {group: 'load-elements', name: 'exclude', value: '1\.2\.8.*', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: []},
            {group: 'visible-elements', name: 'exclude', value: '1\.2\.9.*', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: []},
        ]
    };

    const nodeOrderConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'element-order', name: 'grid-order', value: '1.19.265.0.66.0.0', def_id: '', id: '', index: '1', uom: '',
                language: {english: '', french: ''}, instelements: []},
            {group: 'element-order', name: 'grid-order', value: '1.19.265.7.65.12.0', def_id: '', id: '', index: '3', uom: '',
                language: {english: '', french: ''}, instelements: []},
            {group: 'element-order', name: 'grid-order', value: '1.19.265.8.65.12.0', def_id: '', id: '', index: '2', uom: '',
                language: {english: '', french: ''}, instelements: []},
        ]
    };

    const nestingConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'nesting', name: 'nesting-depth', value: '3', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: []},
        ]
    };

    const noSubHeaderConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'header', name: 'show-sub-header', value: 'false', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'header', name: 'sub-header-start', value: '5', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: []},
                {group: 'header', name: 'sub-header-end', value: '7', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: []},
                ]},
        ]
    };

    const subHeaderConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'header', name: 'show-sub-header', value: 'true', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'header', name: 'sub-header-start', value: '5', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: []},
                {group: 'header', name: 'sub-header-end', value: '6', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: []},
                ]
            },
            {group: 'header', name: 'element-sub-header', value: '1.19.270.2.1.1.8', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'header', name: 'sub-header-start', value: '6', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: []},
                {group: 'header', name: 'sub-header-end', value: '7', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: []},
                ]
            },
        ]
    };

    const simpleRenameConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'node-rename', name: 'node-index', value: '3', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'node-rename', name: 'node-value', value: '6', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: [
                    {group: 'node-rename', name: 'node-name', value: 'test', def_id: '', id: '', index: '', uom: '',
                        language: {english: '', french: ''}, instelements: []},
                    ]},
                ]
            },
            {group: 'element-node-rename', name: 'element-id', value: '1.19.265.8.65.12.0', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'element-node-rename', name: 'node-index', value: '6', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: [
                    {group: 'element-node-rename', name: 'node-name', value: 'Max', def_id: '', id: '', index: '', uom: '',
                        language: {english: '', french: ''}, instelements: []},
                    ]},
                ]
            },
            {group: 'element-rename', name: 'element-id', value: '1.19.265.8.65.12.0', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'element-rename', name: 'node-name', value: 'Max Temp', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: []},
                ]
            },
        ]
    };

    const langRenameConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'node-rename', name: 'node-index', value: '3', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'node-rename', name: 'node-value', value: '6', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: [
                    {group: 'node-rename', name: 'node-name', value: 'test', def_id: '', id: '', index: '', uom: '',
                        language: {english: 'En', french: 'Fr'}, instelements: []},
                    ]},
                ]
            },
        ]
    };

    const parentConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'relationship', name: 'child-configs', value: 'child', def_id: '', id: '', index: '1', uom: '',
                language: {english: '', french: ''}, instelements: []},
            {group: 'node-rename', name: 'node-index', value: '3', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'node-rename', name: 'node-value', value: '6', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: [
                    {group: 'node-rename', name: 'node-name', value: 'good', def_id: '', id: '', index: '', uom: '',
                        language: {english: '', french: ''}, instelements: []},
                    ]},
                ]
            },
        ]
    };

    const childConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: [
            {group: 'id', name: 'profile-name', value: 'child', def_id: '', id: '', index: '1', uom: '',
                language: {english: '', french: ''}, instelements: []},
            {group: 'node-rename', name: 'node-index', value: '3', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'node-rename', name: 'node-value', value: '7', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: [
                    {group: 'node-rename', name: 'node-name', value: 'simple', def_id: '', id: '', index: '', uom: '',
                        language: {english: '', french: ''}, instelements: []},
                    ]},
                ]
            },
            {group: 'node-rename', name: 'node-index', value: '3', def_id: '', id: '', index: '', uom: '',
                language: {english: '', french: ''}, instelements: [
                {group: 'node-rename', name: 'node-value', value: '6', def_id: '', id: '', index: '', uom: '',
                    language: {english: '', french: ''}, instelements: [
                    {group: 'node-rename', name: 'node-name', value: 'bad', def_id: '', id: '', index: '', uom: '',
                        language: {english: '', french: ''}, instelements: []},
                    ]},
                ]
            },
        ]
    };
});
