import { IncludeExclude } from './include-exclude.class';

describe('IncludeExclude', () => {
    let blankInclExcl: IncludeExclude;
    let onlyIncl: IncludeExclude;
    let onlyExcl: IncludeExclude;
    let inclExcl: IncludeExclude;

    beforeEach(() => {
        blankInclExcl = new IncludeExclude([], []);
        onlyIncl = new IncludeExclude(['1\.2\.3.*'], []);
        onlyExcl = new IncludeExclude([], ['1\.2\.3.*']);
        inclExcl = new IncludeExclude(['1\.2.*'], ['1\.2\.3.*']);
    });

    it('Test no include/exclude lists', () => {
        expect(blankInclExcl.checkIncludeExclude('1.2.3.4.5.6.1')).toBeTruthy();
    });

    it('Test include with include lists', () => {
        expect(onlyIncl.checkIncludeExclude('1.2.3.4.5.6.2')).toBeTruthy();
    });

    it('Test exclude with include lists', () => {
        expect(onlyIncl.checkIncludeExclude('1.2.8.4.5.6.3')).toBeFalsy();
    });

    it('Test include with exclude lists', () => {
        expect(onlyExcl.checkIncludeExclude('1.2.8.4.5.6.4')).toBeTruthy();
    });

    it('Test exclude with exclude lists', () => {
        expect(onlyExcl.checkIncludeExclude('1.2.3.4.5.6.5')).toBeFalsy();
    });

    it('Test include with include/exclude lists', () => {
        expect(inclExcl.checkIncludeExclude('1.2.8.4.5.6.6')).toBeTruthy();
    });

    it('Test exclude with include/exclude lists', () => {
        expect(inclExcl.checkIncludeExclude('1.2.3.4.5.6.7')).toBeFalsy();
    });
});
