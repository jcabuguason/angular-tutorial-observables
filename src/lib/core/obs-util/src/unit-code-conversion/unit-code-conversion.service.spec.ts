import { UnitCodeConversionService } from './unit-code-conversion.service';

describe('UnitCodeConversionService', () => {

    let service: UnitCodeConversionService;

    beforeEach(() => {
        service = new UnitCodeConversionService();
    });

    it('should return same value due to non-number element value', () => {
        expect(service.createConversion('1.2.3.4.5.6.7', 'Marlowe', 'm', 'daPa', null).preferredValue).toBe('Marlowe');
    });

    it('should return converted value', () => {
        console.log('test');
        expect(service.createConversion('1.2.3.4.5.6.7', '42', 'Pa', 'daPa', null).preferredValue).toBe('4.2');
        console.log('end test');
    });

    it('should return same value as no conversion exists', () => {
        expect(service.createConversion('1.2.3.4.5.6.7', '42', 'm', 'daPa', null).preferredValue).toBe('42');
    });

    it('should return a rounded value', () => {
        expect(service.createConversion('1.2.3.4.5.6.7', '42.123', 'm', 'm', 1).preferredValue).toBe('42.1');
    });

    it('should return converted code value', () => {
        expect(service.codeSubstitution('E', 'airmet_sigmet', 'compass_direction').codeValue).toBe('E');
        expect(service.codeSubstitution('E', 'airmet_sigmet', 'compass_direction').en).toBe('East');
    });

    it('should return same code value since conversion was invalid', () => {
        expect(service.codeSubstitution('Indiana', 'airmet_sigmet', 'compass_direction')).toBeUndefined();
    });

});
