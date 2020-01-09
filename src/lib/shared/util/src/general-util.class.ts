export const modifiedOrBlank = (str, callback) => (!!str ? callback(str) : '');

export const range = (start, end) => Array.from({ length: end + 1 - start }, (v, k) => k + start);
