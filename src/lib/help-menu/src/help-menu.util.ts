import { Environment, formatDateToString } from 'msc-dms-commons-angular/shared/util';
import { HelpMenuInfo } from './help-menu.model';

export function updateHelpMenuInfo(helpMenuInfo: HelpMenuInfo, environment: Environment) {
  helpMenuInfo.version = environment.version;

  const isUpdated = (property: string) => !environment[property] || environment.production;

  if (isUpdated('dateModified')) {
    helpMenuInfo.dateModified = formatDateToString(environment.dateModified, { includeTime: false });
  }

  if (isUpdated('buildNumber')) {
    helpMenuInfo.buildNumber = environment.buildNumber;
  }

  if (!!environment.commonsVersion) {
    helpMenuInfo.commonsVersion = environment.commonsVersion
      .replace(/^file:msc-dms-commons-angular-/, 'local-')
      .replace(/\.tgz$/, '');
  }
}
