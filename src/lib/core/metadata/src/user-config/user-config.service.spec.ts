import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserConfigService } from './user-config.service';
import { MDInstanceDefinition } from '../model/MDInstanceDefinition';
import { ElementVisibility } from './user-config.model';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';
import { MR_MAPPING_CONFIG, MRMappingConfig } from './mr-mapping.config';

describe('UserConfigService', () => {
  let injector: TestBed;
  let service: UserConfigService;
  let config: MRMappingConfig;

  beforeEach(() => {
    config = {
      endpoint: 'http://www.test.com',
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserConfigService, { provide: MR_MAPPING_CONFIG, useValue: config }],
    });
    injector = getTestBed();
    service = injector.get(UserConfigService);
    LanguageService.translator = <any>{
      currentLang: 'en',
      instant: key => key,
    };
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
    expect(service.getNestingDepth('')).toBe(4);
  });

  it('Nesting level test', () => {
    service.loadConfig(nestingConfig);
    expect(service.getNestingDepth('')).toBe(3);
  });

  it('Default sub header', () => {
    service.loadConfig(emptyConfig);
    expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('-1 min, 1 min, -5 cm');
  });

  it('No sub header', () => {
    service.loadConfig(noSubHeaderConfig);
    expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('');
  });

  it('Global sub header', () => {
    service.loadConfig(subHeaderConfig);
    expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('-1 min, 1 min');
  });

  it('Element specific sub header', () => {
    service.loadConfig(subHeaderConfig);
    expect(service.getSubHeader('1.19.270.2.1.1.8')).toBe('1 min, -10 cm');
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
    expect(service.getDefaultNodeName(3, '10000000000')).toBeUndefined();
  });

  it('English Node Rename', () => {
    service.loadConfig(langRenameConfig);
    expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('En');
  });

  it('French Node Rename', () => {
    LanguageService.translator.currentLang = 'fr';
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
    expect(service.getFullFormattedHeader('1.12.207.2.1.1.0')).toBe(
      'Pressure / Mean Sea Level Pressure / Average (-1 min, 1 min)'
    );
  });

  it('should show the entire element name with zero value headers', () => {
    service.loadConfig(emptyConfig);
    expect(service.getFullFormattedHeader('1.19.6.0.66.0.0')).toBe('Temperature / Ozone Concentration (-12 h)');
  });

  it('should return a blank unit', () => {
    service.loadConfig(emptyConfig);
    expect(service.getElementUnit('1.2.3.4.5.6.7')).toBe('');
  });

  it('should return a unit from the generic units', () => {
    service.loadConfig(unitConfig);
    expect(service.getElementUnit('1.12.207.2.1.1.0')).toBe('K');
  });

  it('should return a unit from the specific units', () => {
    service.loadConfig(unitConfig);
    expect(service.getElementUnit('1.19.6.0.66.0.0')).toBe('m');
  });

  it('should return a unit from the specific units instead of the generic unit', () => {
    service.loadConfig(complexUnitConfig);
    expect(service.getElementUnit('1.12.207.2.1.1.0')).toBe('m');
  });

  it('should show no preferred units', () => {
    service.loadConfig(emptyConfig);
    expect(service.hasPreferredUnits()).toBeFalsy();
  });

  it('should show preferred units', () => {
    service.loadConfig(unitConfig);
    expect(service.hasPreferredUnits()).toBeTruthy();
  });

  it('should show preferred units from complex config', () => {
    service.loadConfig(complexUnitConfig);
    expect(service.hasPreferredUnits()).toBeTruthy();
  });

  it('should return the default official title', () => {
    service.loadConfig(emptyConfig);
    expect(service.getElementOfficialIndexTitle('1.19.6.0.66.0.0')).toBe('GRID.OFFICIAL');
  });

  it('should return the specific official title', () => {
    service.loadConfig(layerConfig);
    expect(service.getElementOfficialIndexTitle('1.12.207.2.1.1.0')).toBe('Proper');
  });

  it('should return the default layer title', () => {
    service.loadConfig(emptyConfig);
    expect(service.getElementIndexTitle('1.19.6.0.66.0.0')).toBe('GRID.LAYER');
  });

  it('should return a specific layer title', () => {
    service.loadConfig(layerConfig);
    expect(service.getElementIndexTitle('1.12.207.2.1.1.0')).toBe('Cloud Index');
  });

  it('should return an element group', () => {
    service.loadConfig(elementGroupConfig);
    expect(service.getElementGroup('1.2.3.4.5.6.7')[0]).toBe('1.2.3.4.5.6.7');
    expect(service.getElementGroup('1.2.3.4.5.6.7')[1]).toBe('1.2.3.4.5.6.75');
    expect(service.getElementGroup('1.2.3.4.5.6.7')[2]).toBe('1.2.3.4.5.6.70');
  });

  it('should not return an element group', () => {
    service.loadConfig(elementGroupConfig);
    expect(service.getElementGroup('1.2.3.4.5.6.1').length).toBe(0);
  });

  it('should return a combined element group', () => {
    service.injectProfiles([elementGroupConfig]);
    service.loadConfig(parentElementGroupConfig);
    expect(service.getElementGroup('1.2.3.4.5.6.7')[0]).toBe('1.2.3.4.5.6.7');
    expect(service.getElementGroup('1.2.3.4.5.6.7')[1]).toBe('1.2.3.4.5.6.75');
    expect(service.getElementGroup('1.2.3.4.5.6.7')[2]).toBe('1.2.3.4.5.6.70');
    expect(service.getElementGroup('1.2.3.4.5.6.7')[3]).toBe('1.2.3.4.5.6.8');
    expect(service.getElementGroup('1.2.3.4.5.6.7')[4]).toBe('1.2.3.4.5.6.9');
  });

  it('should return undefined instead of a precision', () => {
    service.loadConfig(precisionConfig);
    expect(service.getElementPrecision('1.19.265.0.66.0.1')).toBeUndefined();
  });

  it('should return a precision', () => {
    service.loadConfig(precisionConfig);
    expect(service.getElementPrecision('1.19.265.0.66.0.0')).toBe(1);
  });

  it('should return an empty string', () => {
    service.loadConfig(precisionConfig);
    expect(service.getElementPrecision('1.19.265.0.66.0.1')).toBeUndefined();
  });

  it('should return an undefined instead of an element description', () => {
    service.loadConfig(emptyConfig);
    expect(service.getElementDescription('1.19.265.0.66.0.1')).toBeUndefined();
  });

  it('should return an element description', () => {
    service.loadConfig(elementDescriptionConfig);
    expect(service.getElementDescription('1.12.207.2.1.1.0')).toBe('Cloud Index');
  });

  it('should return undefined as this is not the correct nesting level', () => {
    service.loadConfig(elementDescriptionConfig);
    expect(service.getElementDescription('1.12.207.2.1.1.0', 2)).toBeUndefined();
  });

  it('should return undefined instead of an node description', () => {
    service.loadConfig(emptyConfig);
    expect(service.getNodeDescription('1.2.4.5.6.7.8', 3)).toBeUndefined();
  });

  it('should return a node description', () => {
    service.loadConfig(nodeDescriptionConfig);
    expect(service.getNodeDescription('1.2.4.5.6.7.8', 3)).toBe('Cloud Index');
  });

  it('should return undefined instead of a node description', () => {
    service.loadConfig(nodeDescriptionConfig);
    expect(service.getNodeDescription('1.2.3.5.6.7.8', 3)).toBeUndefined();
  });

  it('should return undefined instead of a description', () => {
    service.loadConfig(emptyConfig);
    expect(service.getDescription('1.2.3.4.5.6.7', 3)).toBeUndefined();
  });

  it('should return a description from an element config', () => {
    service.loadConfig(elementDescriptionConfig);
    expect(service.getDescription('1.12.207.2.1.1.0', 4)).toBe('Cloud Index');
  });

  it('should return a description from a node config', () => {
    service.loadConfig(complexDescriptionConfig);
    expect(service.getDescription('1.13.207.2.1.1.0', 4)).toBe('Cloud Index');
  });

  it('should return a description from a complex description config', () => {
    service.loadConfig(complexDescriptionConfig);
    expect(service.getDescription('1.12.207.2.1.1.0', 4)).toBe('Sensor Index');
  });

  it('should return an empty qa flag toggle list', () => {
    service.loadConfig(emptyConfig);
    expect(service.getHideQaFlag().length).toBe(0);
  });

  it('should return a list of qa flag toggles', () => {
    service.loadConfig(qaFlagConfig);
    expect(service.getHideQaFlag().length).toBe(2);
  });

  it('should not have default preferred units by default', () => {
    service.loadConfig(emptyConfig);
    expect(service.isLoadPreferredUnits()).toBeFalsy();
  });

  it('should have default preferred units', () => {
    service.loadConfig(loadPreferredUnitsConfig);
    expect(service.isLoadPreferredUnits()).toBeTruthy();
  });

  it('should not have default preferred units', () => {
    service.loadConfig(noLoadPreferredUnitsConfig);
    expect(service.isLoadPreferredUnits()).toBeFalsy();
  });

  it('should return an empty string when getting a node name for value 0', () => {
    service.loadConfig(emptyConfig);
    expect(service.getNodeName('1.2.0.4.5.6.7', 3)).toBe('');
  });

  it('should return N/A when getting a node with value M', () => {
    service.loadConfig(emptyConfig);
    expect(service.getNodeName('1.2.M.4.5.6.7', 3)).toBe('N/A');
  });

  it('should return a bad string when getting a node name for non-M NaN values', () => {
    service.loadConfig(emptyConfig);
    expect(service.getNodeName('1.2.x.4.5.6.7', 3)).toBe('[UNDEFINED]');
    expect(service.getNodeName('1.2.N.4.5.6.7', 3)).toBe('[UNDEFINED]');
  });

  it('should return a bad string for a numeric but unavailable node value', () => {
    service.loadConfig(emptyConfig);
    expect(service.getNodeName('1.2.999999999.4.5.6.7', 3)).toBe('[UNDEFINED]');
  });

  const emptyConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [],
  };

  const includeExcludeConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'pin-meta-elements',
        name: 'include',
        value: '1.2.6.*',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'load-meta-elements',
        name: 'exclude',
        value: '1.2.7.*',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'load-elements',
        name: 'exclude',
        value: '1.2.8.*',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'visible-elements',
        name: 'exclude',
        value: '1.2.9.*',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
    ],
  };

  const nodeOrderConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-display',
        name: 'element',
        value: '1.19.265.0.66.0.0',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-order',
            name: 'grid-order',
            value: '1',
            def_id: '',
            id: '',
            index: '1',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
      {
        group: 'element-display',
        name: 'element',
        value: '1.19.265.7.65.12.0',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-order',
            name: 'grid-order',
            value: '3',
            def_id: '',
            id: '',
            index: '1',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
      {
        group: 'element-display',
        name: 'element',
        value: '1.19.265.8.65.12.0',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-order',
            name: 'grid-order',
            value: '2',
            def_id: '',
            id: '',
            index: '1',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const nestingConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'nesting',
        name: 'nesting-depth',
        value: '3',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
    ],
  };

  const noSubHeaderConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'header',
        name: 'show-sub-header',
        value: 'false',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'header',
            name: 'sub-header-start',
            value: '5',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
          {
            group: 'header',
            name: 'sub-header-end',
            value: '7',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const subHeaderConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'header',
        name: 'show-sub-header',
        value: 'true',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'header',
            name: 'sub-header-start',
            value: '5',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
          {
            group: 'header',
            name: 'sub-header-end',
            value: '6',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
      {
        group: 'element-display',
        name: 'element',
        value: '1.19.270.2.1.1.8',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'header',
            name: 'show-sub-header',
            value: 'true',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'header',
                name: 'sub-header-start',
                value: '6',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
              {
                group: 'header',
                name: 'sub-header-end',
                value: '7',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const simpleRenameConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'node-rename',
        name: 'node-index',
        value: '3',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'node-rename',
            name: 'node-value',
            value: '6',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'node-rename',
                name: 'node-name',
                value: 'test',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
        ],
      },
      {
        group: 'element-display',
        name: 'element',
        value: '1.19.265.8.65.12.0',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-node-rename',
            name: 'node-index',
            value: '6',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'element-node-rename',
                name: 'node-name',
                value: 'Max',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
          {
            group: 'element-rename',
            name: 'node-name',
            value: 'Max Temp',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const langRenameConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'node-rename',
        name: 'node-index',
        value: '3',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'node-rename',
            name: 'node-value',
            value: '6',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'node-rename',
                name: 'node-name',
                value: 'test',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: 'En', french: 'Fr' },
                instelements: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const parentConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'relationship',
        name: 'child-configs',
        value: 'child',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'node-rename',
        name: 'node-index',
        value: '3',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'node-rename',
            name: 'node-value',
            value: '6',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'node-rename',
                name: 'node-name',
                value: 'good',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const childConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'id',
        name: 'profile-name',
        value: 'child',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'node-rename',
        name: 'node-index',
        value: '3',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'node-rename',
            name: 'node-value',
            value: '7',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'node-rename',
                name: 'node-name',
                value: 'simple',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
        ],
      },
      {
        group: 'node-rename',
        name: 'node-index',
        value: '3',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'node-rename',
            name: 'node-value',
            value: '6',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'node-rename',
                name: 'node-name',
                value: 'bad',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const layerConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-display',
        name: 'element',
        value: '1.12.207.2.1.1.0',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-display',
            name: 'index-title',
            value: 'Cloud Index',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
          {
            group: 'element-display',
            name: 'official-title',
            value: 'Proper',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const unitConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-unit',
        name: 'element',
        value: '1.12.207.*',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-unit',
            name: 'display-unit',
            value: 'K',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
      {
        group: 'element-display',
        name: 'element',
        value: '1.19.6.0.66.0.0',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-display',
            name: 'display-unit',
            value: 'm',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const complexUnitConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-unit',
        name: 'element',
        value: '1.12.207.*',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-unit',
            name: 'display-unit',
            value: 'K',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
      {
        group: 'element-display',
        name: 'element',
        value: '1.12.207.2.1.1.0',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-display',
            name: 'display-unit',
            value: 'm',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const elementGroupConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'id',
        name: 'profile-name',
        value: 'child',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'element-groups',
        name: 'element-group',
        value: 'wind',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-groups',
            name: 'element',
            value: '1.2.3.4.5.6.7',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
          {
            group: 'element-groups',
            name: 'element',
            value: '1.2.3.4.5.6.75',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
          {
            group: 'element-groups',
            name: 'element',
            value: '1.2.3.4.5.6.70',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const parentElementGroupConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'relationship',
        name: 'child-configs',
        value: 'child',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'element-groups',
        name: 'element-group',
        value: 'wind',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-groups',
            name: 'element',
            value: '1.2.3.4.5.6.7',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
          {
            group: 'element-groups',
            name: 'element',
            value: '1.2.3.4.5.6.8',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
          {
            group: 'element-groups',
            name: 'element',
            value: '1.2.3.4.5.6.9',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const precisionConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-display',
        name: 'element',
        value: '1.19.265.0.66.0.0',
        def_id: '',
        id: '',
        index: '1',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-display',
            name: 'precision',
            value: '1',
            def_id: '',
            id: '',
            index: '1',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const elementDescriptionConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-display',
        name: 'element',
        value: '1.12.207.2.1.1.0',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-display',
            name: 'element-description',
            value: 'Cloud Index',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const nodeDescriptionConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'node-rename',
        name: 'node-index',
        value: '3',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'node-rename',
            name: 'node-value',
            value: '4',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'node-rename',
                name: 'node-description',
                value: 'Cloud Index',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const complexDescriptionConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'node-rename',
        name: 'node-index',
        value: '4',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'node-rename',
            name: 'node-value',
            value: '2',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [
              {
                group: 'node-rename',
                name: 'node-description',
                value: 'Cloud Index',
                def_id: '',
                id: '',
                index: '',
                uom: '',
                language: { english: '', french: '' },
                instelements: [],
              },
            ],
          },
        ],
      },
      {
        group: 'element-display',
        name: 'element',
        value: '1.12.207.2.1.1.0',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-display',
            name: 'element-description',
            value: 'Sensor Index',
            def_id: '',
            id: '',
            index: '',
            uom: '',
            language: { english: '', french: '' },
            instelements: [],
          },
        ],
      },
    ],
  };

  const qaFlagConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-display',
        name: 'hide-qa-flag',
        value: '100',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
      {
        group: 'element-display',
        name: 'hide-qa-flag',
        value: '10',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
    ],
  };

  const loadPreferredUnitsConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-display',
        name: 'load-preferred-units',
        value: 'true',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
    ],
  };

  const noLoadPreferredUnitsConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-display',
        name: 'load-preferred-units',
        value: 'false',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [],
      },
    ],
  };
});
