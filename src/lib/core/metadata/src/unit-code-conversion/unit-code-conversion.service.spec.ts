import { UnitCodeConversionService } from './unit-code-conversion.service';

describe('UnitCodeConversionService', () => {

    let service: UnitCodeConversionService;

    beforeEach(() => {
        service = new UnitCodeConversionService();
    });

    it('should return same value due to same unit', () => {
        expect(service.unitConversion('Marlowe', 'm', 'm')).toBe('Marlowe');
    });

    it('should return converted value by units', () => {
        expect(service.unitConversion('42', 'Pa', 'daPa')).toBe('4.2');
    });

    it('should return same value due to a non-number input', () => {
        expect(service.unitConversion('Indiana', 'Pa', 'daPa')).toBe('Indiana');
    });

    it('should return converted code value', () => {
        expect(service.codeSubstitution('E', 'airmet_sigmet', 'compass_direction').codeValue).toBe('E');
        expect(service.codeSubstitution('E', 'airmet_sigmet', 'compass_direction').en).toBe('East');
    });

    it('should return same code value since conversion was invalid', () => {
        expect(service.codeSubstitution('Indiana', 'airmet_sigmet', 'compass_direction')).toBe(undefined);
    });

});
