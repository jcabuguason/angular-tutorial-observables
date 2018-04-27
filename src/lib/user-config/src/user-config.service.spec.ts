import { UserConfigService } from './user-config.service';
import { MetadataService } from '../../metadata/src/service';
import { MDInstanceDefinition } from '../../metadata/src/model';

describe('UserConfigService', () => {

    let service: UserConfigService;

    const emptyConfig: MDInstanceDefinition = {
        dataset: 'stub',
        parent: 'stub',
        identificationElements: [],
        elements: []
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

    const nestedConfig: MDInstanceDefinition = {
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

    beforeEach(() => {
        service = new UserConfigService(new MetadataService(null, null));
    });

    it('Element order', () => {
        service.loadConfig(nodeOrderConfig);
        expect(service.getElementOrder()[0]).toBe('1.19.265.0.66.0.0');
        expect(service.getElementOrder()[1]).toBe('1.19.265.8.65.12.0');
        expect(service.getElementOrder()[2]).toBe('1.19.265.7.65.12.0');
    });

    it('Default nesting level test', () => {
        service.loadConfig(emptyConfig);
        expect(service.getNestingDepth()).toBe(4);
    });

    it('Nesting level test', () => {
        service.loadConfig(nestedConfig);
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
        expect(service.getFormatedNodeName('1.19.265.0.66.0.0', 2)).toBe('Temperature');
    });

    it('Node Rename', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormatedNodeName('1.19.6.0.66.0.0', 3)).toBe('Test');
    });

    it('Element Node Rename', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormatedNodeName('1.19.265.8.65.12.0', 6)).toBe('Max');
    });

    it('Element Rename at nested', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormatedNodeName('1.19.265.8.65.12.0', 4)).toBe('Max Temp');
    });

    it('Element Rename not at nested', () => {
        service.loadConfig(simpleRenameConfig);
        expect(service.getFormatedNodeName('1.19.265.8.65.12.0', 3)).toBe('Air Temperature');
    });

});
