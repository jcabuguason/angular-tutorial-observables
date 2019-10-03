import {
  compareRevisionBoolean,
  formatElementToColumn,
  MSC_ID_ELEMENT,
  STATION_NAME_ELEMENT,
  STATION_NAME_ELEMENT_REPORT,
  TC_ID_ELEMENT,
} from './obs-util.class';

export const STATION_NAME_FIELD = formatElementToColumn(STATION_NAME_ELEMENT);
export const MSC_ID_FIELD = formatElementToColumn(MSC_ID_ELEMENT);
export const TC_ID_FIELD = formatElementToColumn(TC_ID_ELEMENT);

export const STATION_NAME_FIELD_REPORT = formatElementToColumn(STATION_NAME_ELEMENT_REPORT);

/** Checks if it is the latest obs loaded into the grid */
export function isLatest(params): boolean {
  const current = params.node.data;

  if (!current.revision) {
    return true;
  }

  const allNodes = params.node.rowModel.nodeManager.allNodesMap;
  const all = Object.keys(allNodes).map(node => allNodes[node].data);

  const compareNode = (node, property) => node[property] === current[property];
  const sameObs = node =>
    compareNode(node, 'obsDateTime') && compareNode(node, 'primaryStationId') && compareNode(node, 'taxonomy');

  return all.filter(sameObs).every(node => compareRevisionBoolean(current.revision, node.revision));
}

/** Returns the metadata formatted value with unit */
export function getFormattedMetadata(metadataElement): string {
  if (!!metadataElement && !!metadataElement.value) {
    const unit = metadataElement.unit;
    const value = metadataElement.value;
    return showElementUnit(unit) ? `${value} ${unit}` : value;
  }
  return metadataElement;
}

/** Checks if the unit of a metadata or data element should be displayed */
export function showElementUnit(unit): boolean {
  return unit != null && unit !== 'code' && unit !== 'unitless' && unit !== 'datetime' && unit !== 'boolean';
}
