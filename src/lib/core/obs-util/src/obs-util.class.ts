import { getTime } from 'date-fns';

export function findMetadataValue(obs, name) {
  return obs.metadataElements.filter(md => md.name === name).map(md => md.value)[0];
}

/** Most observations come in with a cor and ver in their metadata, but some come with a rev */
export function findRevision(obs) {
  const find = name => findMetadataValue(obs, name);
  const correction = find('cor');
  if (correction !== undefined) {
    const version = find('ver');
    return Number(version) > 0 ? `${correction}_v${version}` : correction;
  } else {
    const rev = find('rev');
    return rev || '';
  }
}

/** Takes in a Date or a formatted string (see getTime) */
export function compareObsTime(date1, date2): number {
  const date1Time = getTime(date1);
  const date2Time = getTime(date2);
  if (isNaN(date1Time) && isNaN(date2Time)) {
    return 0;
  }
  if (isNaN(date1Time)) {
    return -1;
  }
  if (isNaN(date2Time)) {
    return 1;
  }
  return date1Time - date2Time;
}

export function compareObsTimeFromObs(obs1, obs2) {
  return compareObsTime(obs1.obsDateTime, obs2.obsDateTime);
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
export function compareRevisionFromObs(obs1, obs2) {
  return compareRevision(findRevision(obs1), findRevision(obs2)) >= 0;
}

/** To be used when array-filtering for the latest revision per date */
export function latestFromArray(obs, index, arr) {
  const compareObs = (current, property) => obs[property] === current[property];
  const sameObs = current =>
    compareObs(current, 'obsDateTime') && compareObs(current, 'identifier') && compareObs(current, 'taxonomy');

  return arr.filter(sameObs).every(curr => compareRevisionFromObs(obs, curr));
}

export function formatQAValue(qa: number): string {
  if (qa == null) {
    return 'N/A';
  }
  return String(qa);
}

export function qaTranslationKey(qa: number | string): string {
  switch (Number(qa)) {
    case -10: {
      return 'QA.SUPRESSED';
    }
    case -1: {
      return 'QA.MISSING';
    }
    case 0: {
      return 'QA.ERROR';
    }
    case 10: {
      return 'QA.DOUBTFUL';
    }
    case 15: {
      return 'QA.SUSPECT';
    }
    case 20: {
      return 'QA.INCONSISTENT';
    }
    case 100: {
      return 'QA.ACCEPTED';
    }
    case 101: {
      return 'QA.NO_QA_TEST';
    }
    case 110: {
      return 'QA.NO_OPTIMIZED_RANGE_TEST';
    }
    default: {
      return 'N/A';
    }
  }
}

export function formatElementToColumn(elementID: string): string {
  return !!elementID ? 'e_' + elementID.split('.').join('_') : '';
}

export function formatElementID(elementID: string): string {
  return !!elementID
    ? elementID
        .replace('e_', '')
        .split('_')
        .join('.')
    : '';
}

export function formatDateToISO(date: string): string {
  return !!date ? date + ':00.000Z' : '';
}

export function formatDateRemoveSeconds(date: string): string {
  return !!date ? date.replace(':00.000Z', '') : '';
}
