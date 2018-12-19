import { MDInstanceDefinition } from 'msc-dms-commons-angular/core/metadata/';

export const FULL_CONFIG: MDInstanceDefinition = {
  dataset: 'stub',
  parent: 'stub',
  identificationElements: [],
  elements: [
    {group: 'id', name: 'profile-name', value: 'Full', def_id: '', id: '', index: '1', uom: '', language: {english: '', french: ''}, instelements: []},
    {group: 'nesting', name: 'nesting-depth', value: '4', def_id: '', id: '', index: '', uom: '', language: {english: '', french: ''}, instelements: []},
    {group: 'header', name: 'show-sub-header', value: 'true', def_id: '', id: '', index: '', uom: '', language: {english: '', french: ''}, instelements: [
      {group: 'header', name: 'sub-header-start', value: '5', def_id: '', id: '', index: '', uom: '', language: {english: '', french: ''}, instelements: []},
      {group: 'header', name: 'sub-header-end', value: '7', def_id: '', id: '', index: '', uom: '', language: {english: '', french: ''}, instelements: []},
    ]},
    // Use english/french for these
    {group: 'element-display', name: 'official-title', value: 'Official', def_id: '', id: '', index: '', uom: '', language: {english: '', french: ''}, instelements: []},
    {group: 'default', name: 'default-tag', value: 'Default', def_id: '', id: '', index: '', uom: '', language: {english: '', french: ''}, instelements: []},

    {group: 'visible-elements', name: 'exclude', value: '^1\.(7|8|9)', def_id: '', id: '', index: '', uom: '', language: {english: '', french: ''}, instelements: []},
  ]
};
