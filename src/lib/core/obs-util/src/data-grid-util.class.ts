import { compareRevisionBoolean } from './obs-util.class';

/** Checks if it is the latest obs loaded into the grid */
export function isLatest(params): boolean {
  const current = params.node.data;

  if (!current.revision) {
    return true;
  }

  const allNodes = params.node.rowModel.nodeManager.allNodesMap;
  const all = Object.keys(allNodes).map(node => allNodes[node].data);

  const compareNode = (node, property) => node[property] === current[property];
  const sameObs = (node) => compareNode(node, 'obsDateTime')
    && compareNode(node, 'primaryStationId')
    && compareNode(node, 'taxonomy');

  return all.filter(sameObs)
    .every(node => compareRevisionBoolean(current.revision, node.revision));
}

