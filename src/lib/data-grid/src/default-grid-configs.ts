import { UserConfigOptions } from 'msc-dms-commons-angular/core/user-config';

export const FULL_CONFIG: UserConfigOptions = {
  profileName: {
    value: 'Full',
    english: 'All Users',
    french: 'Tous les utilisateurs',
  },
  nestingDepth: '5',
  showSubHeader: {
    display: 'true',
    start: '6',
    end: '7',
  },
  rawData: {
    loadRawData: 'true',
  },
  allVisibleElements: {
    excludeAsMetadata: ['*'],
  },
};
