import { compareTime } from 'msc-dms-commons-angular/shared/util';
import { LanguageService } from 'msc-dms-commons-angular/shared/language';
import { DMSObs, ObsElement } from './dms-observation.model';

// Allows 'bad' element IDs like `1.2.x.0.0.0.0`.
// If 'x' is the only placeholder allowed, this regex should only allow digits or x's
export const esKeyRegex = new RegExp(/^(\w+_){6}\w+$/);

// observation identification elements
export const WMO_ID_ELEMENT = '1.7.82.0.0.0.0';
export const STATION_NAME_ELEMENT = '1.7.83.0.0.0.0';
export const TC_ID_ELEMENT = '1.7.84.0.0.0.0';
export const CLIMATE_ID_ELEMENT = '1.7.85.0.0.0.0';
export const MSC_ID_ELEMENT = '1.7.86.0.0.0.0';
export const ICAO_ID_ELEMENT = '1.7.102.0.0.0.0';
export const PROVINCE_ELEMENT = '1.7.117.0.0.0.0';
export const CORRECTION_ELEMENT = '1.7.105.0.0.0.0';
export const VERSION_ELEMENT = '1.7.408.0.0.0.0';
export const REVISION_ELEMENT = '1.7.371.0.0.0.0';

function removeBadDuplicates(elements: ObsElement[]): ObsElement[] {
  const elementSet = {};

  for (const elem of elements) {
    const key = elem.indexValue || 'N/A';
    if (elementSet[key] == null || elementSet[key].dataType !== 'derived') {
      elementSet[key] = elem;
    }
  }

  return Object.values(elementSet);
}

export function isEsElementKey(key: string): boolean {
  return esKeyRegex.test(key);
}

export function grabElementList(obs: DMSObs): ObsElement[] {
  return Object.entries(obs)
    .filter(([key, elements]) => isEsElementKey(key))
    .map(([key, elements]) => removeBadDuplicates(elements))
    .reduce((acc, val) => acc.concat(val), []); // Flatten
}

export function grabDataElements(obs: DMSObs): ObsElement[] {
  return grabElementList(obs).filter((element) => element.type === 'element');
}

export function grabMetadataElements(obs: DMSObs): ObsElement[] {
  return grabElementList(obs).filter((element) => element.type === 'metadata');
}

export function formatElementToEsKey(elementID: string): string {
  return elementID.replace(/\./g, '_');
}

export function findAllElements(obs: DMSObs, elementID: string): ObsElement[] {
  const key = formatElementToEsKey(elementID);
  return !!obs[key] ? removeBadDuplicates(obs[key]) : [];
}

export function findFirstValue(obs: DMSObs, elementID: string): string {
  const elems = findAllElements(obs, elementID);
  return !!elems.length ? elems[0].value : '';
}

export function findFirstValueNum(obs: DMSObs, elementID: string): number {
  const elems = findAllElements(obs, elementID);

  if (!!elems.length) {
    return elems[0].valueNum;
  }
}

/** Most observations come in with a cor and ver in their metadata, but some come with a rev */
export function findRevision(obs: DMSObs) {
  const find = (elementID) => findFirstValue(obs, elementID);
  const correction = find(CORRECTION_ELEMENT);
  if (!!correction) {
    const version = find(VERSION_ELEMENT);
    return Number(version) > 0 ? `${correction}_v${version}` : correction;
  } else {
    const rev = find(REVISION_ELEMENT);
    return rev || '';
  }
}

export function compareObsTimeFromObs(obs1: DMSObs, obs2: DMSObs) {
  return compareTime(obs1.obsDateTime, obs2.obsDateTime);
}

/** Assumes that alphabetical is okay for non-orig corrections. */
/** Returns 1 if the first revision has a higer value than then second, 0 if same, -1 otherwise. */
export function compareRevision(first, second): number {
  if (first === second) {
    return 0;
  } else if (first == null) {
    return -1;
  } else if (second == null) {
    return 1;
  }
  const rev1 = first.split('_v');
  const rev2 = second.split('_v');
  rev1[1] = rev1.length === 1 ? 0 : Number(rev1[1]);
  rev2[1] = rev2.length === 1 ? 0 : Number(rev2[1]);

  if (rev1[0] === rev2[0] && rev1[1] === rev2[1]) {
    return 0;
  }
  if (rev1[0] === rev2[0]) {
    return rev1[1] - rev2[1];
  }

  rev1[0] = rev1[0] === 'orig' ? '' : rev1[0];
  rev2[0] = rev2[0] === 'orig' ? '' : rev2[0];
  return rev1[0] <= rev2[0] ? -1 : 1;
}

/** Same as compareRevision but returns true instead of 1 if rev1 has a higher or same revision as rev2 */
export function compareRevisionBoolean(rev1, rev2): boolean {
  return compareRevision(rev1, rev2) >= 0;
}

/** Returns true when obs1 has a higher or equal revision to obs2 */
export function compareRevisionFromObs(obs1: DMSObs, obs2: DMSObs) {
  return compareRevision(findRevision(obs1), findRevision(obs2)) >= 0;
}

/** To be used when array-filtering for the latest revision per date */
export function latestFromArray(obs: DMSObs, index, arr) {
  const compareObs = (current, property) => obs[property] === current[property];
  const sameObs = (current) =>
    compareObs(current, 'obsDateTime') && compareObs(current, 'identifier') && compareObs(current, 'taxonomy');

  return arr.filter(sameObs).every((curr) => compareRevisionFromObs(obs, curr));
}

export function formatQAValue(qa: number): string {
  if (qa == null) {
    return 'N/A';
  }
  return String(qa);
}

export function dataFlagTranslationKey(dataFlag: number | string, type?: 'label' | 'description'): string {
  let key: string;

  switch (Number(dataFlag)) {
    case 0:
      key = 'DATA_FLAG.RESERVED';
      break;
    case 1:
      key = 'DATA_FLAG.DERIVED';
      break;
    case 2:
      key = 'DATA_FLAG.ESTIMATED';
      break;
    case 3:
      key = 'DATA_FLAG.ADJUSTED';
      break;
    case 4:
      key = 'DATA_FLAG.INCOMPLETE';
      break;
    case 5:
      key = 'DATA_FLAG.TRACE';
      break;
    case 6:
      key = 'DATA_FLAG.MULTIPLE';
      break;
    case 7:
      key = 'DATA_FLAG.INTERPOLATED';
      break;
    case 8:
      key = 'DATA_FLAG.ACCUMULATED';
      break;
    case 9:
      key = 'DATA_FLAG.PRECIP_UNCERTAIN';
      break;
    case 10:
      key = 'DATA_FLAG.EST_ACCUM';
      break;
    case 11:
      key = 'DATA_FLAG.POSSIBLE_PRECIP';
      break;
    case 12:
      key = 'DATA_FLAG.TEMP_ABV_0';
      break;
    case 13:
      key = 'DATA_FLAG.TEMP_BLW_0';
      break;
    default:
      return 'N/A.FLAG';
  }
  return getKeyType(key, type);
}

export function qofTranslationKey(flag: number | string, type?: 'label' | 'description'): string {
  let key: string;
  switch (Number(flag)) {
    case 0:
      key = 'QA_OVERRIDE.NO_OVERRIDE';
      break;
    case 1:
      key = 'QA_OVERRIDE.SAM_OVERRIDE';
      break;
    case 2:
      key = 'QA_OVERRIDE.SAA_OVERRIDE';
      break;
    case 3:
      key = 'QA_OVERRIDE.SEM_OVERRIDE';
      break;
    case 4:
      key = 'QA_OVERRIDE.SEA_OVERRIDE';
      break;
    case 5:
      key = 'QA_OVERRIDE.ASM_OVERRIDE';
      break;
    case 6:
      key = 'QA_OVERRIDE.ASA_OVERRIDE';
      break;
    default:
      return 'N/A.FLAG';
  }
  return getKeyType(key, type);
}

export function vofTranslationKey(flag: number | string, type?: 'label' | 'description'): string {
  let key: string;
  switch (Number(flag)) {
    case 0:
      key = 'VALUE_OVERRIDE.RESERVED';
      break;
    case 1:
      key = 'VALUE_OVERRIDE.CORRECTED_MANUALLY';
      break;
    case 2:
      key = 'VALUE_OVERRIDE.CORRECTED_AUTOMATICALLY';
      break;
    case 3:
      key = 'VALUE_OVERRIDE.ESTIMATED_MANUALLY';
      break;
    case 4:
      key = 'VALUE_OVERRIDE.ESTIMATED_AUTOMATICALLY';
      break;
    default:
      return 'N/A.FLAG';
  }
  return getKeyType(key, type);
}

export function qaTranslationKey(flag: number | string, type?: 'label' | 'description'): string {
  let key: string;
  switch (Number(flag)) {
    case -10:
      key = 'QA.SUPPRESSED';
      break;
    case -1:
      key = 'QA.MISSING';
      break;
    case 0:
      key = 'QA.ERROR';
      break;
    case 10:
      key = 'QA.DOUBTFUL';
      break;
    case 15:
      key = 'QA.SUSPECT';
      break;
    case 20:
      key = 'QA.INCONSISTENT';
      break;
    case 100:
      key = 'QA.ACCEPTED';
      break;
    case 101:
      key = 'QA.NOT_PERFORMED';
      break;
    case 110:
      key = 'QA.UNAVAILABLE';
      break;
    default:
      key = 'N/A';
      break;
  }
  return getKeyType(key, type);
}

export function instrumentTranslationKey(summary: number | string, type?: 'label' | 'description'): string {
  let key: string;
  switch (Number(summary)) {
    case 195:
      key = 'INSTRUMENT.UNEXPECTED';
      break;
    case 199:
      key = 'INSTRUMENT.MISSING';
      break;
    case 200:
      key = 'INSTRUMENT.ALARM';
      break;
    case 210:
      key = 'INSTRUMENT.WARNING';
      break;
    case 300:
      key = 'INSTRUMENT.NORMAL';
      break;
    default:
      return 'N/A.FLAG';
  }
  return getKeyType(key, type);
}

export function formatElementToColumn(elementID: string): string {
  return !!elementID ? `e_${elementID.split('.').join('_')}` : '';
}

export function formatColumnToElementID(field: string): string {
  return !!field ? field.replace('e_', '').replace(/-L\d+/, '').replace(/_/g, '.') : '';
}

export function getIndexLabelTranslationKey(element: ObsElement): string {
  let label: string;
  switch (element.indexName) {
    case 'sensor_index': /* falls through */
    case 'cloud_layer_index': /* falls through */
    case 'observed_weather_index': {
      label = `${element.indexName.toUpperCase()}_LABEL`;
      break;
    }
    default: {
      label = 'DEFAULT_INDEX_LABEL';
      break;
    }
  }
  return `OBS.${label}`;
}

export function decodeRawMessage(message: string): string {
  const base64Indicator = 'base64: ';
  return !!message && message.includes(base64Indicator) ? atob(message.replace(base64Indicator, '')) : message;
}

/** Converts decimal degrees to degrees minutes seconds
 * https://dms-gitlab.cmc.ec.gc.ca/DMS/MSC-MCWeb-App-QC-Tool/blob/c91ac4fb2ee90c64ec35a0a0e18e13434764fffb/html/js/fn/obs-analysis-shared-fn.js#L219
 */
export function convertDDToDMS(elementValue: number, isLatitude: boolean): string {
  if (isNaN(elementValue)) {
    return String(elementValue);
  }

  const directionLabel = (key) => LanguageService.translator?.instant(`DIRECTION.${key}_SHORT`) || key;
  const padZero = (value) => String(value).padStart(2, '0');

  const absDecimalDegrees = Math.abs(elementValue);
  const degrees = Math.floor(absDecimalDegrees);
  const minutes = Math.floor(60 * (absDecimalDegrees - degrees));
  const seconds = Number(3600 * (absDecimalDegrees - degrees - minutes / 60)).toFixed(3);

  let direction = '';
  if (isLatitude) {
    direction = elementValue < 0 ? directionLabel('SOUTH') : directionLabel('NORTH');
  } else {
    direction = elementValue < 0 ? directionLabel('WEST') : directionLabel('EAST');
  }

  return `${degrees}\xB0 ${padZero(minutes)}' ${padZero(seconds)}" ${direction}`;
}

export function findObsIdentifier(obs: DMSObs, elementID?: string): string {
  return elementID == null ? obs.identifier : findFirstValue(obs, elementID) || obs.identifier;
}

export function updateNodeValue(
  givenElement: string | string[],
  newValue: string | number,
  nodePosition: number,
): string {
  const nodes = givenElement instanceof Array ? givenElement : givenElement.split('.');
  const rejoinElement = (start: number, end?: number) => nodes.slice(start, end).join('.');
  const prefix = rejoinElement(0, nodePosition);
  const suffix = rejoinElement(nodePosition + 1);
  return `${prefix}.${newValue}.${suffix}`;
}

export function grabIndexValue(element: ObsElement): number {
  return element.dataType === 'official' ? 0 : element.indexValue;
}

function getKeyType(key: string, type?: string) {
  switch (type) {
    case 'label':
      return `${key}.LABEL`;
    case 'description':
      return `${key}.DESCRIPTION`;
    default:
      return key;
  }
}
