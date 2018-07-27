import { getTime } from 'date-fns';

export function findMetadataValue(obs, name) {
    return obs.metadataElements.filter(md => md.name === name).map(md => md.value)[0];
}

/** Most observations come in with a cor and ver in their metadata, but some come with a rev */
export function findRevision(obs) {
    const find = (name) => findMetadataValue(obs, name);
    const correction = find('cor');
    if (correction !== undefined) {
        const version = find('ver');
        return (Number(version) > 0) ? `${correction}_v${version}` : correction;
    } else {
        const rev = find('rev');
        return rev || '';
    }
}

/** Takes in a Date or a formatted string (see getTime) */
export function compareObsTime(date1, date2): number {
    const date1Time = getTime(date1);
    const date2Time = getTime(date2);
    if (isNaN(date1Time) && isNaN(date2Time)) { return 0; }
    if (isNaN(date1Time)) { return -1; }
    if (isNaN(date2Time)) { return 1; }
    return date1Time - date2Time;
}

export function compareObsTimeFromObs(obs1, obs2) {
    return compareObsTime(obs1.obsDateTime, obs2.obsDateTime);
}

/** Assumes that alphabetical is okay for non-orig corrections. */
/** Returns 1 if cor1 has a higer revision than cor2, 0 if same, -1 if cor1 is lower than cor2. */
export function compareRevision(cor1, cor2): number {
    const rev1 = cor1.split('_v');
    const rev2 = cor2.split('_v');
    rev1[1] = (rev1.length === 1) ? 0 : Number(rev1[1]);
    rev2[1] = (rev2.length === 1) ? 0 : Number(rev2[1]);

    if (rev1[0] === rev2[0] && rev1[1] === rev2[1]) { return 0; }
    if (rev1[0] === rev2[0]) { return rev1[1] - rev2[1]; }

    rev1[0] = (rev1[0] === 'orig') ? '' : rev1[0];
    rev2[0] = (rev2[0] === 'orig') ? '' : rev2[0];
    return (rev1[0] <= rev2[0]) ? -1 : 1;
}

/** Same as compareRevision but returns true instead of 1 if cor1 has a higher or same revision as cor2 */
export function compareRevisionBoolean(cor1, cor2): boolean {
    return compareRevision(cor1, cor2) >= 0;
}

/** Returns true iff obs1 has a higher revision than obs2 */
export function compareRevisionFromObs(obs1, obs2) {
    return compareRevision(
        findRevision(obs1),
        findRevision(obs2)
    ) > 0;
}

/** To be used when array-filtering for the latest revision per date */
export function latestFromArray(obs, index, arr) {
    const compareObs = (current, property) => obs[property] === current[property];
    const sameObs = (current) => compareObs(current, 'obsDateTime')
        && compareObs(current, 'identifier')
        && compareObs(current, 'taxonomy');

    return arr.filter(sameObs)
        .every(curr => compareRevisionFromObs(obs, curr));
}

export function formatQAValue(qa: number): string {
    if (qa == null) { return 'N/A'; }
    return String(qa);
}

