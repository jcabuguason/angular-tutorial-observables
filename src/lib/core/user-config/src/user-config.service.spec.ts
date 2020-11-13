import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';
import { MRMappingConfig, MR_MAPPING_CONFIG } from './mr-mapping.config';
import { ElementVisibility, ElementGroup } from './user-config.model';
import { UserConfigService } from './user-config.service';
import { UserConfigOptions } from './user-config-options.model';

describe('UserConfigService', () => {
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
    service = getTestBed().inject(UserConfigService);
    LanguageService.translator = <any>{
      currentLang: 'en',
      instant: (key) => key,
    };
  });

  describe('#emptyConfig', () => {
    const emptyConfig: UserConfigOptions = {
      profileName: { value: 'empty', english: '', french: '' },
    };

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
      expect(service.getHiddenQaFlags()).toEqual([]);
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

    it('should load any element', () => {
      const element = '1.2.3.4.5.6.7';
      const metadata = '1.7.3.4.5.6.7';
      expect(service.isLoad(element)).toBeTruthy();
      expect(service.isLoad(metadata, true)).toBeTruthy();
      expect(service.isVisible(element)).toBeTruthy();
      expect(service.isVisible(metadata, true)).toBeTruthy();
      expect(service.getElementVisibility(element)).toBe(ElementVisibility.Default);
      expect(service.getElementVisibility(metadata, true)).toBe(ElementVisibility.Default);
    });
  });

  describe('#orderedConfig', () => {
    const nodeOrderConfig: UserConfigOptions = {
      profileName: { value: 'nodeOrderConfig', english: '', french: '' },
      elementConfigs: [
        { id: '1.19.265.0.66.0.0', order: '1' },
        { id: '1.19.265.7.65.12.0', order: '3' },
        { id: '1.19.265.8.65.12.0', order: '2' },
      ],
    };

    beforeEach(() => {
      service.loadConfig(nodeOrderConfig);
    });

    it('should set elements in the configured order', () => {
      expect(service.getElementOrder()).toEqual(['1.19.265.0.66.0.0', '1.19.265.8.65.12.0', '1.19.265.7.65.12.0']);
    });
  });

  describe('#precisionConfig', () => {
    const precisionConfig: UserConfigOptions = {
      profileName: { value: 'precisionConfig', english: '', french: '' },
      elementConfigs: [{ id: '1.19.265.0.66.0.0', precision: '1' }],
    };

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
      const nestingConfig: UserConfigOptions = {
        profileName: { value: 'nestingConfig', english: '', french: '' },
        nestingDepth: '3',
      };
      service.loadConfig(nestingConfig);
    });

    it('should have a different nesting depth than the default config', () => {
      expect(service.getNestingDepth('')).toBe(3);
    });
  });

  describe('#simpleRenameConfig', () => {
    const simpleRenameConfig: UserConfigOptions = {
      profileName: { value: 'simpleRenameConfig', english: '', french: '' },
      nodeRename: [
        {
          index: '3',
          map: [{ value: '6', name: { value: 'test', english: '', french: '' } }],
        },
      ],
      elementConfigs: [
        {
          id: '1.19.265.8.65.12.0',
          rename: { value: 'Max Temp', english: '', french: '' },
          nodeRename: [{ index: '6', name: { value: 'Max', english: '', french: '' } }],
        },
      ],
    };

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
    const langRenameConfig: UserConfigOptions = {
      profileName: { value: 'langRenameConfig', english: '', french: '' },
      nodeRename: [
        {
          index: '3',
          map: [{ value: '6', name: { value: 'test', english: 'En', french: 'Fr' } }],
        },
      ],
    };

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
    const noSubHeaderConfig: UserConfigOptions = {
      profileName: { value: 'noSubHeaderConfig', english: '', french: '' },
      showSubHeader: {
        display: 'false',
        start: '5',
        end: '7',
      },
    };

    beforeEach(() => {
      service.loadConfig(noSubHeaderConfig);
    });

    it('should not create a sub-header when show-sub-header is false', () => {
      expect(service.getSubHeader('1.19.270.2.1.1.7')).toBe('');
    });
  });

  describe('#subHeaderConfig', () => {
    const subHeaderConfig: UserConfigOptions = {
      profileName: { value: 'subHeaderConfig', english: '', french: '' },
      showSubHeader: {
        display: 'true',
        start: '5',
        end: '6',
      },
      elementConfigs: [
        {
          id: '1.19.270.2.1.1.8',
          showSubHeader: {
            display: 'true',
            start: '6',
            end: '7',
          },
        },
      ],
    };

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
    const parentConfig: UserConfigOptions = {
      profileName: { value: 'parentConfig', english: '', french: '' },
      childConfig: 'child',
      nodeRename: [
        {
          index: '3',
          map: [{ value: '6', name: { value: 'good', english: '', french: '' } }],
        },
      ],
    };

    const childConfig: UserConfigOptions = {
      profileName: { value: 'child', english: '', french: '' },
      nodeRename: [
        {
          index: '3',
          map: [
            { value: '7', name: { value: 'simple', english: '', french: '' } },
            { value: '6', name: { value: 'bad', english: '', french: '' } },
          ],
        },
      ],
    };

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
    const unitConfig: UserConfigOptions = {
      profileName: { value: 'unitConfig', english: '', french: '' },
      elementUnits: [
        { elementRegex: '1.12.207.*', displayUnit: 'K' },
        { elementRegex: '1.19.6.0.66.0.0', displayUnit: 'm' },
      ],
    };

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
    const complexUnitConfig: UserConfigOptions = {
      profileName: { value: 'unitConfig', english: '', french: '' },
      elementUnits: [{ elementRegex: '1.12.207.*', displayUnit: 'K' }],
      elementConfigs: [{ id: '1.12.207.2.1.1.0', displayUnit: 'm' }],
    };

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
    const layerConfig: UserConfigOptions = {
      profileName: { value: 'layerConfig', english: '', french: '' },
      elementConfigs: [
        {
          id: '1.12.207.2.1.1.0',

          indexTitle: { value: 'Cloud Index', english: '', french: '' },
          officialTitle: { value: 'Proper', english: '', french: '' },
        },
      ],
    };

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
    const elementGroupConfig: UserConfigOptions = {
      profileName: { value: 'elementGroupConfig', english: '', french: '' },
      elementGroups: [
        {
          id: 'test group id',
          name: { value: 'test group name', english: '', french: '' },
          description: { value: 'test group tooltip', english: '', french: '' },
          elementIDs: ['1.2.3.4.5.6.7', '1.2.3.4.5.6.75', '1.2.3.4.5.6.70'],
        },
      ],
    };

    beforeEach(() => {
      service.loadConfig(elementGroupConfig);
    });

    it('should return the element group', () => {
      const group: ElementGroup = service.getElementGroup('1.2.3.4.5.6.7');
      expect(group.groupID).toEqual('test group id');
      expect(group.groupName.getName()).toEqual('test group name');
      expect(group.groupDescription.getName()).toEqual('test group tooltip');
      expect(group.elementIDs).toEqual(['1.2.3.4.5.6.7', '1.2.3.4.5.6.75', '1.2.3.4.5.6.70']);
    });

    it('should return undefined element ID does not have a group', () => {
      expect(service.getElementGroup('1.2.3.4.5.6.1')).toBeUndefined();
    });

    it('should show the entire element name with group', () => {
      expect(service.getFullFormattedHeader('1.2.3.4.5.6.7')).toBe(
        'test group name / Diagnostics / Nitrous Oxide Concentration / Instant Max, -5 min, 20 min, -5 cm',
      );
    });
  });

  describe('#parentElementGroupConfig', () => {
    const elementGroupConfig: UserConfigOptions = {
      profileName: { value: 'elementGroupConfig', english: '', french: '' },
      elementGroups: [
        {
          id: 'test group id',
          name: { value: 'test group name', english: '', french: '' },
          description: { value: 'test group tooltip', english: '', french: '' },
          elementIDs: ['1.2.3.4.5.6.7', '1.2.3.4.5.6.75', '1.2.3.4.5.6.70'],
        },
      ],
    };

    const parentElementGroupConfig: UserConfigOptions = {
      profileName: { value: 'parentElementGroupConfig', english: '', french: '' },
      childConfig: 'elementGroupConfig',
      elementGroups: [
        {
          id: 'test group id',
          name: { value: 'test group name', english: '', french: '' },
          description: { value: 'test group tooltip', english: '', french: '' },
          elementIDs: ['1.2.3.4.5.6.7', '1.2.3.4.5.6.8', '1.2.3.4.5.6.9'],
        },
      ],
    };

    beforeEach(() => {
      service.injectProfiles([elementGroupConfig]);
      service.loadConfig(parentElementGroupConfig);
    });

    it('should return a combined element group', () => {
      const groups: ElementGroup[] = service.getAllElementGroups();
      const combinedElements = ['1.2.3.4.5.6.7', '1.2.3.4.5.6.75', '1.2.3.4.5.6.70', '1.2.3.4.5.6.8', '1.2.3.4.5.6.9'];
      expect(groups.length).toEqual(1);
      expect(groups[0].groupID).toEqual('test group id');
      expect(groups[0].elementIDs).toEqual(combinedElements);
      expect(service.getElementGroup('1.2.3.4.5.6.7').elementIDs).toEqual(combinedElements);
    });
  });

  describe('#includeExcludeConfig', () => {
    beforeEach(() => {
      const includeExcludeConfig: UserConfigOptions = {
        profileName: { value: 'includeExcludeConfig', english: '', french: '' },
        allLoadElements: { exclude: ['1.2.8.*'] },
        allVisibleElements: { exclude: ['1.2.9.*'] },
      };

      service.loadConfig(includeExcludeConfig);
    });

    it('should not load the element', () => {
      expect(service.getElementVisibility('1.2.8.0.0.0.0')).toBe(ElementVisibility.NoLoad);
    });

    it('should set element visibility to Hidden', () => {
      expect(service.getElementVisibility('1.2.9.0.0.0.0')).toBe(ElementVisibility.Hidden);
    });

    it('should set element to the default visibility', () => {
      expect(service.getElementVisibility('1.2.0.0.0.0.0')).toBe(ElementVisibility.Default);
    });
  });

  describe('#includeMetadataConfig', () => {
    const includeMetadataConfig: UserConfigOptions = {
      profileName: { value: 'includeMetadataConfig', english: '', french: '' },
      allLoadElements: {
        exclude: ['1.2.8.*'],
        include: ['1.2.0.*'],
        includeAsMetadata: ['1.7.0.*', '1.7.1.*', '1.7.2.*'],
      },
      allVisibleElements: {
        include: ['1.2.0.*'],
        includeAsMetadata: ['1.7.2.*'],
      },
    };

    beforeEach(() => {
      service.loadConfig(includeMetadataConfig);
    });

    it('should not load the elements', () => {
      expect(service.isLoad('1.2.8.0.0.0.0')).toBeFalsy();
      expect(service.isLoad('1.3.4.0.0.0.0')).toBeFalsy();
      expect(service.getElementVisibility('1.2.8.0.0.0.0')).toBe(ElementVisibility.NoLoad);
      expect(service.getElementVisibility('1.3.4.0.0.0.0')).toBe(ElementVisibility.NoLoad);
    });

    it('should load the elements', () => {
      expect(service.isLoad('1.2.0.0.0.0.0')).toBeTruthy();
      expect(service.isLoad('1.7.0.0.0.0.0', true)).toBeTruthy();
      expect(service.isLoad('1.7.1.0.0.0.0', true)).toBeTruthy();
      expect(service.isLoad('1.7.2.0.0.0.0', true)).toBeTruthy();
    });

    it('should load as metadata', () => {
      expect(service.loadAsMetadata('1.2.0.0.0.0.0')).toBeFalsy();
      expect(service.loadAsMetadata('1.7.0.0.0.0.0')).toBeTruthy();
      expect(service.loadAsMetadata('1.7.1.0.0.0.0')).toBeTruthy();
      expect(service.loadAsMetadata('1.7.1.0.0.0.0')).toBeTruthy();
    });

    it('should set element visibility to Hidden', () => {
      expect(service.isVisible('1.7.0.0.0.0.0', true)).toBeFalsy();
      expect(service.isVisible('1.7.0.0.0.0.0', true)).toBeFalsy();
      expect(service.getElementVisibility('1.7.0.0.0.0.0', true)).toBe(ElementVisibility.Hidden);
      expect(service.getElementVisibility('1.7.1.0.0.0.0', true)).toBe(ElementVisibility.Hidden);
    });

    it('should set metadata to the default visibility', () => {
      expect(service.getElementVisibility('1.2.0.0.0.0.0')).toBe(ElementVisibility.Default);
      expect(service.getElementVisibility('1.7.2.0.0.0.0', true)).toBe(ElementVisibility.Default);
    });
  });

  describe('#excludeMetadataConfig', () => {
    const excludeMetadataConfig: UserConfigOptions = {
      profileName: { value: 'excludeMetadataConfig', english: '', french: '' },
      allLoadElements: {
        include: ['1.2.0.*'],
        includeAsMetadata: ['1.7.0.*', '1.7.1.*', '1.7.2.*'],
      },
      allVisibleElements: {
        include: ['1.2.0.*'],
        excludeAsMetadata: ['*'],
      },
    };

    beforeEach(() => {
      service.loadConfig(excludeMetadataConfig);
    });

    it('should load the elements', () => {
      expect(service.isLoad('1.2.0.0.0.0.0')).toBeTruthy();
      expect(service.isLoad('1.7.0.0.0.0.0', true)).toBeTruthy();
      expect(service.isLoad('1.7.1.0.0.0.0', true)).toBeTruthy();
      expect(service.isLoad('1.7.2.0.0.0.0', true)).toBeTruthy();
    });

    it('should set all metadata visibility to Hidden', () => {
      expect(service.isVisible('1.7.0.0.0.0.0', true)).toBeFalsy();
      expect(service.isVisible('1.7.1.0.0.0.0', true)).toBeFalsy();
      expect(service.getElementVisibility('1.7.0.0.0.0.0', true)).toBe(ElementVisibility.Hidden);
      expect(service.getElementVisibility('1.7.1.0.0.0.0', true)).toBe(ElementVisibility.Hidden);
    });

    it('should set element to default visibility', () => {
      expect(service.getElementVisibility('1.2.0.0.0.0.0')).toBe(ElementVisibility.Default);
    });
  });

  describe('#elementDescriptionConfig', () => {
    const elementDescriptionConfig: UserConfigOptions = {
      profileName: { value: 'elementDescriptionConfig', english: '', french: '' },
      elementConfigs: [
        {
          id: '1.12.207.2.1.1.0',
          description: { value: 'Cloud Index', english: '', french: '' },
        },
      ],
    };

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
    const nodeDescriptionConfig: UserConfigOptions = {
      profileName: { value: 'nodeDescriptionConfig', english: '', french: '' },
      nodeRename: [
        {
          index: '3',
          map: [
            {
              value: '4',
              description: { value: 'Cloud Index', english: '', french: '' },
            },
          ],
        },
      ],
    };

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
    const complexDescriptionConfig: UserConfigOptions = {
      profileName: { value: 'complexDescriptionConfig', english: '', french: '' },
      nodeRename: [
        {
          index: '4',
          map: [{ value: '2', description: { value: 'Cloud Index', english: '', french: '' } }],
        },
      ],
      elementConfigs: [
        {
          id: '1.12.207.2.1.1.0',
          description: { value: 'Sensor Index', english: '', french: '' },
        },
      ],
    };

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
    it('should return a list of qa flag toggles', () => {
      const qaFlagConfig: UserConfigOptions = {
        profileName: { value: 'qaFlagConfig', english: '', french: '' },
        hiddenQaFlags: ['100', '10'],
      };

      service.loadConfig(qaFlagConfig);
      expect(service.getHiddenQaFlags()).toEqual([100, 10]);
    });
  });

  describe('#loadPreferredUnitsConfig', () => {
    it('should have default preferred units', () => {
      const loadPreferredUnitsConfig: UserConfigOptions = {
        profileName: { value: 'loadPreferredUnitsConfig', english: '', french: '' },
        loadPreferredUnits: 'true',
      };

      service.loadConfig(loadPreferredUnitsConfig);
      expect(service.isLoadPreferredUnits()).toBeTruthy();
    });
  });

  describe('#noLoadPreferredUnitsConfig', () => {
    it('should not have default preferred units', () => {
      const noLoadPreferredUnitsConfig: UserConfigOptions = {
        profileName: { value: 'noLoadPreferredUnitsConfig', english: '', french: '' },
        loadPreferredUnits: 'false',
      };

      service.loadConfig(noLoadPreferredUnitsConfig);
      expect(service.isLoadPreferredUnits()).toBeFalsy();
    });
  });

  describe('#dataFlagConfig', () => {
    it('should return list of editable data flags for an element', () => {
      const elementDataflagConfig: UserConfigOptions = {
        profileName: { value: 'elementDataflagConfig', english: '', french: '' },
        elementConfigs: [
          {
            id: '1.5.66.2.1.1.0',
            edit: { availableDataFlag: '2,5' },
          },
        ],
      };

      service.loadConfig(elementDataflagConfig);
      expect(service.getElementEditableDataFlags('1.5.66.2.1.1.0')).toEqual(['2', '5']);
    });
  });

  describe('#loadRawDataConfig', () => {
    it('should have raw data', () => {
      const loadRawDataConfig: UserConfigOptions = {
        profileName: { value: 'loadRawDataConfig', english: '', french: '' },
        rawData: { loadRawData: 'true' },
      };

      service.loadConfig(loadRawDataConfig);
      expect(service.isLoadRawData()).toBeTruthy();
    });

    it('should not have raw data', () => {
      const noLoadRawDataConfig: UserConfigOptions = {
        profileName: { value: 'noLoadRawDataConfig', english: '', french: '' },
        rawData: { loadRawData: 'false' },
      };

      service.loadConfig(noLoadRawDataConfig);
      expect(service.isLoadRawData()).toBeFalsy();
    });
  });

  describe('#visibleRawDataConfig', () => {
    it('should show raw data', () => {
      const visibleRawDataConfig: UserConfigOptions = {
        profileName: { value: 'visibleRawDataConfig', english: '', french: '' },
        rawData: { visibleRawData: 'true' },
      };

      service.loadConfig(visibleRawDataConfig);
      expect(service.isVisibleRawData()).toBeTruthy();
    });

    it('should hide raw data', () => {
      const noVisibleRawDataConfig: UserConfigOptions = {
        profileName: { value: 'noVisibleRawDataConfig', english: '', french: '' },
        rawData: { visibleRawData: 'false' },
      };

      service.loadConfig(noVisibleRawDataConfig);
      expect(service.isVisibleRawData()).toBeFalsy();
    });
  });

  describe('#formatConfig', () => {
    it('should return the element format', () => {
      const formatConfig: UserConfigOptions = {
        profileName: { value: 'formatConfig', english: '', french: '' },
        elementConfigs: [{ id: '1.2.3.4.5.6.7', displayFormat: 'DMS' }],
      };

      service.loadConfig(formatConfig);
      expect(service.getElementDisplayFormat('1.2.3.4.5.6.7')).toBe('DMS');
    });

    it('should load formats', () => {
      const loadPreferredFormatsConfig: UserConfigOptions = {
        profileName: { value: 'formatConfig', english: '', french: '' },
        loadPreferredFormats: 'true',
      };

      service.loadConfig(loadPreferredFormatsConfig);
      expect(service.isLoadPreferredFormats()).toBeTruthy();
    });
  });

  describe('#rawHeaderConfig', () => {
    it('should have raw header', () => {
      const loadRawHeaderConfig: UserConfigOptions = {
        profileName: { value: 'loadRawHeaderConfig', english: '', french: '' },
        rawData: { loadRawHeader: 'true' },
      };

      service.loadConfig(loadRawHeaderConfig);
      expect(service.isLoadRawHeader()).toBeTruthy();
    });

    it('should not have raw header', () => {
      const noLoadRawHeaderConfig: UserConfigOptions = {
        profileName: { value: 'noLoadRawHeaderConfig', english: '', french: '' },
        rawData: { loadRawHeader: 'false' },
      };

      service.loadConfig(noLoadRawHeaderConfig);
      expect(service.isLoadRawHeader()).toBeFalsy();
    });
  });

  describe('#sortTypeConfig', () => {
    it('should have a sort type', () => {
      const config: UserConfigOptions = {
        profileName: { value: 'config', english: '', french: '' },
        elementConfigs: [{ id: '1.2.3.4.5.6.7', sortType: 'asc' }],
      };

      service.loadConfig(config);
      expect(service.getSortType('1.2.3.4.5.6.7')).toBe('asc');
    });
  });
});
