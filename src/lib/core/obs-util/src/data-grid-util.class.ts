import { compareRevisionBoolean } from './obs-util.class';

export const STN_NAME_FIELD = 'e_1_7_83_0_0_0_0';
export const MSC_ID_FIELD = 'e_1_7_86_0_0_0_0';
export const TC_ID_FIELD = 'e_1_7_84_0_0_0_0';

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
  return unit != null && unit !== 'code' && unit !== 'unitless' && unit !== 'datetime';
}
