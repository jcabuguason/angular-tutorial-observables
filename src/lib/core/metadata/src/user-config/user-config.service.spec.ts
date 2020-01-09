import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';
import { MDInstanceDefinition } from '../model/MDInstanceDefinition';
import { MRMappingConfig, MR_MAPPING_CONFIG } from './mr-mapping.config';
import { ElementVisibility } from './user-config.model';
import { UserConfigService } from './user-config.service';

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

  describe('#emptyConfig', () => {
    beforeEach(() => {
      service.loadConfig(emptyConfig);
    });

    it('should use the default nesting depth', () => {
      expect(service.getNestingDepth('')).toBe(4);
    });

    it('should retrieve the default node name', () => {
      expect(service.getNodeName('1.19.265.0.66.0.0', 2)).toBe('temperature');
    });

    it('should retrieve the default formatted node name', () => {
      expect(service.getFormattedNodeName('1.19.265.0.66.0.0', 2)).toBe('Temperature');
    });

    it('should build the default sub-header', () => {
      expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('-1 min, 1 min, -5 cm');
    });

    it('should format the subheaders', () => {
      expect(service.getFormattedSubHeader('1.19.270.2.1.1.7')).toBe(', -1 min, 1 min, -5 cm');
    });

    it('should have an undefined default node name for a non-configured value', () => {
      expect(service.getDefaultNodeName(3, '10000000000')).toBeUndefined();
    });

    it('should format an undefined node name as a bad string', () => {
      expect(service.getFormattedNodeName('1.19.100000.0.66.0.0', 3)).toBe('[UNDEFINED]');
    });

    it('should return a bad string when getting a node name for non-M NaN values', () => {
      expect(service.getNodeName('1.2.x.4.5.6.7', 3)).toBe('[UNDEFINED]');
      expect(service.getNodeName('1.2.N.4.5.6.7', 3)).toBe('[UNDEFINED]');
    });

    it('should return a bad string for a numeric but unavailable node value', () => {
      expect(service.getNodeName('1.2.999999999.4.5.6.7', 3)).toBe('[UNDEFINED]');
    });

    it('should return N/A when getting a node with value M', () => {
      expect(service.getNodeName('1.2.M.4.5.6.7', 3)).toBe('N/A');
    });

    it('should return a blank unit', () => {
      expect(service.getElementUnit('1.2.3.4.5.6.7')).toBe('');
    });

    it('should show no preferred units', () => {
      expect(service.hasPreferredUnits()).toBeFalsy();
    });

    it('should return the default official title', () => {
      expect(service.getElementOfficialIndexTitle('1.19.6.0.66.0.0')).toBe('OBS.OFFICIAL');
    });

    it('should return the default layer title', () => {
      expect(service.getElementIndexTitle('1.19.6.0.66.0.0')).toBe('OBS.LAYER');
    });

    it('should return an undefined instead of an element description', () => {
      expect(service.getElementDescription('1.19.265.0.66.0.1')).toBeUndefined();
    });

    it('should return undefined instead of an node description', () => {
      expect(service.getNodeDescription('1.2.4.5.6.7.8', 3)).toBeUndefined();
    });

    it('should return undefined instead of a description', () => {
      expect(service.getDescription('1.2.3.4.5.6.7', 3)).toBeUndefined();
    });

    it('should return an empty qa flag toggle list', () => {
      expect(service.getHideQaFlag()).toEqual([]);
    });

    it('should not have default preferred units by default', () => {
      expect(service.isLoadPreferredUnits()).toBeFalsy();
    });

    it('should return an empty string when getting a node name for value 0', () => {
      expect(service.getNodeName('1.2.0.4.5.6.7', 3)).toBe('');
    });

    it('should show the entire element name with zero value headers', () => {
      expect(service.getFullFormattedHeader('1.19.6.0.66.0.0')).toBe('Temperature / Ozone Concentration, -12 h');
    });

    it('should show the entire element name with zero value sub headers', () => {
      expect(service.getFullFormattedHeader('1.12.207.2.1.1.0')).toBe(
        'Pressure / Mean Sea Level Pressure / Average, -1 min, 1 min',
      );
    });

    it('should have raw data by default', () => {
      expect(service.isLoadRawData()).toBeTruthy();
    });

    it('should show raw data by default', () => {
      expect(service.isVisibleRawData()).toBeTruthy();
    });
  });

  describe('#orderedConfig', () => {
    beforeEach(() => {
      service.loadConfig(nodeOrderConfig);
    });

    it('should set elements in the configured order', () => {
      expect(service.getElementOrder()).toEqual(['1.19.265.0.66.0.0', '1.19.265.8.65.12.0', '1.19.265.7.65.12.0']);
    });

    it('should hide elements not in the config', () => {
      expect(service.getElementVisibility('1.2.3.4.5.6.7')).toBe(ElementVisibility.HIDDEN);
    });
  });

  describe('#precisionConfig', () => {
    beforeEach(() => {
      service.loadConfig(precisionConfig);
    });

    it('should return an undefined precision value for non-configured element', () => {
      expect(service.getElementPrecision('1.19.265.0.66.0.1')).toBeUndefined();
    });

    it('should return an precision value number for a configured element', () => {
      expect(service.getElementPrecision('1.19.265.0.66.0.0')).toBe(1);
    });
  });

  describe('#nestingConfig', () => {
    beforeEach(() => {
      service.loadConfig(nestingConfig);
    });

    it('should have a different nesting depth than the default config', () => {
      expect(service.getNestingDepth('')).toBe(3);
    });
  });

  describe('#simpleRenameConfig', () => {
    beforeEach(() => {
      service.loadConfig(simpleRenameConfig);
    });

    it('should rename configured node using node-rename group element', () => {
      // config specifies node value 6 at index 3 should be renamed to Test
      expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('Test');
      expect(service.getFormattedNodeName('1.1.6.0.0.0.0', 3)).toBe('Test');
    });

    it('should rename configured node using element-display group element', () => {
      // config specifies node value 6 in this element should be Max only for 1.19.265.8.65.12.0
      expect(service.getFormattedNodeName('1.19.265.8.65.12.0', 6)).toBe('Max');
      expect(service.getFormattedNodeName('1.1.1.1.1.12.1', 6)).not.toBe('Max');
    });

    it('should rename element node at max depth using element-display group element', () => {
      const depth = service.getNestingDepth('');
      expect(depth).toBe(4);
      expect(service.getFormattedNodeName('1.19.265.8.65.12.0', depth - 1)).toBe('Air Temperature');
      expect(service.getFormattedNodeName('1.19.265.8.65.12.0', depth)).toBe('Max Temp');
    });
  });

  describe('#langRenameConfig', () => {
    beforeEach(() => {
      service.loadConfig(langRenameConfig);
    });

    it('should provide the configured English node name when in English mode', () => {
      expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('En');
    });

    it('should provide the configured French node name when in French mode', () => {
      LanguageService.translator.currentLang = 'fr';
      expect(service.getFormattedNodeName('1.19.6.0.66.0.0', 3)).toBe('Fr');
    });
  });

  describe('#noSubHeaderConfig', () => {
    beforeEach(() => {
      service.loadConfig(noSubHeaderConfig);
    });

    it('should not create a sub-header when show-sub-header is false', () => {
      expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('');
    });
  });

  describe('#subHeaderConfig', () => {
    beforeEach(() => {
      service.loadConfig(subHeaderConfig);
    });

    it('should use global sub-header depth settings', () => {
      expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('-1 min, 1 min');
    });

    it('should use element-specific sub-header depth settings', () => {
      expect(service.getSubHeader('1.19.270.2.1.1.8')).toBe('1 min, -10 cm');
    });
  });

  describe('#parentChildConfig', () => {
    beforeEach(() => {
      service.injectProfiles([childConfig]);
      service.loadConfig(parentConfig);
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
  });

  describe('#unitConfig', () => {
    beforeEach(() => {
      service.loadConfig(unitConfig);
    });

    it('should return a unit from the generic element-units group element', () => {
      expect(service.getElementUnit('1.12.207.2.1.1.0')).toBe('K');
    });

    it('should return a unit from the specific element-display group element', () => {
      expect(service.getElementUnit('1.19.6.0.66.0.0')).toBe('m');
    });

    it('should show preferred units', () => {
      expect(service.hasPreferredUnits()).toBeTruthy();
    });
  });

  describe('#complexUnitConfig', () => {
    beforeEach(() => {
      service.loadConfig(complexUnitConfig);
    });

    it('should return a unit from the specific units instead of the generic unit', () => {
      expect(service.getElementUnit('1.12.207.2.1.1.0')).toBe('m');
    });

    it('should show preferred units from complex config', () => {
      expect(service.hasPreferredUnits()).toBeTruthy();
    });
  });

  describe('#layerConfig', () => {
    beforeEach(() => {
      service.loadConfig(layerConfig);
    });

    it('should return the configured element-specific official title', () => {
      expect(service.getElementOfficialIndexTitle('1.12.207.2.1.1.0')).toBe('Proper');
    });

    it('should return a configured element-specific layer title', () => {
      expect(service.getElementIndexTitle('1.12.207.2.1.1.0')).toBe('Cloud Index');
    });
  });

  describe('#elementGroupConfig', () => {
    beforeEach(() => {
      service.loadConfig(elementGroupConfig);
    });

    it('should return an array containing the group element IDs', () => {
      expect(service.getElementGroup('1.2.3.4.5.6.7')).toEqual(['1.2.3.4.5.6.7', '1.2.3.4.5.6.75', '1.2.3.4.5.6.70']);
    });

    it('should return an empty array when element ID does not have a group', () => {
      expect(service.getElementGroup('1.2.3.4.5.6.1')).toEqual([]);
    });
  });

  describe('#parentElementGroupConfig', () => {
    beforeEach(() => {
      service.injectProfiles([elementGroupConfig]);
      service.loadConfig(parentElementGroupConfig);
    });

    it('should return a combined element group', () => {
      expect(service.getElementGroup('1.2.3.4.5.6.7')).toEqual([
        '1.2.3.4.5.6.7',
        '1.2.3.4.5.6.75',
        '1.2.3.4.5.6.70',
        '1.2.3.4.5.6.8',
        '1.2.3.4.5.6.9',
      ]);
    });
  });

  describe('#includeExcludeConfig', () => {
    beforeEach(() => {
      service.loadConfig(includeExcludeConfig);
    });

    it('should not load the element', () => {
      expect(service.getElementVisibility('1.2.8.0.0.0.0')).toBe(ElementVisibility.NO_LOAD);
    });

    it('should set element visibility to Hidden', () => {
      expect(service.getElementVisibility('1.2.9.0.0.0.0')).toBe(ElementVisibility.HIDDEN);
    });

    it('should set element to the default visibility', () => {
      expect(service.getElementVisibility('1.2.3.0.0.0.0')).toBe(ElementVisibility.DEFAULT);
    });
  });

  describe('#elementDescriptionConfig', () => {
    beforeEach(() => {
      service.loadConfig(elementDescriptionConfig);
    });

    it('should return an element description', () => {
      expect(service.getElementDescription('1.12.207.2.1.1.0')).toBe('Cloud Index');
    });

    it('should return undefined as this is not the correct nesting level', () => {
      const wrongNestingDepth = 2;
      expect(service.getNestingDepth('')).not.toBe(wrongNestingDepth);
      expect(service.getElementDescription('1.12.207.2.1.1.0', wrongNestingDepth)).toBeUndefined();
    });

    it('should return a description from an element config', () => {
      expect(service.getDescription('1.12.207.2.1.1.0', service.getNestingDepth(''))).toBe('Cloud Index');
    });
  });

  describe('#nodeDescriptionConfig', () => {
    beforeEach(() => {
      service.loadConfig(nodeDescriptionConfig);
    });

    it('should provide a node description from the config', () => {
      expect(service.getNodeDescription('1.2.4.5.6.7.8', 3)).toBe('Cloud Index');
    });

    it('should return undefined if there is no description for a node in the config', () => {
      expect(service.getNodeDescription('1.2.3.5.6.7.8', 3)).toBeUndefined();
    });
  });

  describe('#complexDescriptionConfig', () => {
    beforeEach(() => {
      service.loadConfig(complexDescriptionConfig);
    });

    it('should return a description from the node-rename group element', () => {
      expect(service.getDescription('1.13.207.2.1.1.0', 4)).toBe('Cloud Index');
    });

    it('should return a description from the element-display group element', () => {
      expect(service.getDescription('1.12.207.2.1.1.0', 4)).toBe('Sensor Index');
    });
  });

  describe('#qaFlagConfig', () => {
    beforeEach(() => {
      service.loadConfig(qaFlagConfig);
    });

    it('should return a list of qa flag toggles', () => {
      expect(service.getHideQaFlag().length).toBe(2);
    });
  });

  describe('#loadPreferredUnitsConfig', () => {
    beforeEach(() => {
      service.loadConfig(loadPreferredUnitsConfig);
    });

    it('should have default preferred units', () => {
      expect(service.isLoadPreferredUnits()).toBeTruthy();
    });
  });

  describe('#noLoadPreferredUnitsConfig', () => {
    beforeEach(() => {
      service.loadConfig(noLoadPreferredUnitsConfig);
    });

    it('should not have default preferred units', () => {
      expect(service.isLoadPreferredUnits()).toBeFalsy();
    });
  });

  describe('#dataFlagConfig', () => {
    beforeEach(() => {
      service.loadConfig(elementDataflagConfig);
    });

    it('should return list of editable data flags for an element', () => {
      expect(service.getElementEditableDataFlags('1.5.66.2.1.1.0')).toEqual(['2', '5']);
    });
  });

  describe('#loadRawDataConfig', () => {
    beforeEach(() => {
      service.loadConfig(loadRawDataConfig);
    });

    it('should have raw data', () => {
      expect(service.isLoadRawData()).toBeTruthy();
    });
  });

  describe('#noLoadRawDataConfig', () => {
    beforeEach(() => {
      service.loadConfig(noLoadRawDataConfig);
    });

    it('should not have raw data', () => {
      expect(service.isLoadRawData()).toBeFalsy();
    });
  });

  describe('#visibleRawDataConfig', () => {
    beforeEach(() => {
      service.loadConfig(visibleRawDataConfig);
    });

    it('should show raw data', () => {
      expect(service.isVisibleRawData()).toBeTruthy();
    });
  });

  describe('#noVisibleRawDataConfig', () => {
    beforeEach(() => {
      service.loadConfig(noVisibleRawDataConfig);
    });

    it('should hide raw data', () => {
      expect(service.isVisibleRawData()).toBeFalsy();
    });
  });

  describe('#loadRawHeaderConfig', () => {
    beforeEach(() => {
      service.loadConfig(loadRawHeaderConfig);
    });

    it('should have raw header', () => {
      expect(service.isLoadRawHeader()).toBeTruthy();
    });
  });

  describe('#noLoadRawHeaderConfig', () => {
    beforeEach(() => {
      service.loadConfig(noLoadRawHeaderConfig);
    });

    it('should not have raw header', () => {
      expect(service.isLoadRawHeader()).toBeFalsy();
    });
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

  const elementDataflagConfig: MDInstanceDefinition = {
    dataset: 'stub',
    parent: 'stub',
    identificationElements: [],
    elements: [
      {
        group: 'element-edit',
        name: 'element',
        value: '1.5.66.2.1.1.0',
        def_id: '',
        id: '',
        index: '',
        uom: '',
        language: { english: '', french: '' },
        instelements: [
          {
            group: 'element-edit',
            name: 'available-data-flag',
            value: '2,5',
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
});

const loadRawDataConfig: MDInstanceDefinition = {
  dataset: 'stub',
  parent: 'stub',
  identificationElements: [],
  elements: [
    {
      group: 'raw-data',
      name: 'load-raw-data',
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

const noLoadRawDataConfig: MDInstanceDefinition = {
  dataset: 'stub',
  parent: 'stub',
  identificationElements: [],
  elements: [
    {
      group: 'raw-data',
      name: 'load-raw-data',
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

const visibleRawDataConfig: MDInstanceDefinition = {
  dataset: 'stub',
  parent: 'stub',
  identificationElements: [],
  elements: [
    {
      group: 'raw-data',
      name: 'visible-raw-data',
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

const noVisibleRawDataConfig: MDInstanceDefinition = {
  dataset: 'stub',
  parent: 'stub',
  identificationElements: [],
  elements: [
    {
      group: 'raw-data',
      name: 'visible-raw-data',
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

const loadRawHeaderConfig: MDInstanceDefinition = {
  dataset: 'stub',
  parent: 'stub',
  identificationElements: [],
  elements: [
    {
      group: 'raw-data',
      name: 'load-raw-header',
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

const noLoadRawHeaderConfig: MDInstanceDefinition = {
  dataset: 'stub',
  parent: 'stub',
  identificationElements: [],
  elements: [
    {
      group: 'raw-data',
      name: 'load-raw-header',
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
