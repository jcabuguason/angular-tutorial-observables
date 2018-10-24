import { Injectable } from '@angular/core';

import { FromUnits, UnitConversion, CodeSources, CodeResult, ConvertedValues } from './unit-code-conversion.model';

import { DataElements } from '../dms-observation.model';

const units = require('assets/units.json');
const codes = require('assets/codes.json');

@Injectable()
export class UnitCodeConversionService {

    private unitConvs: FromUnits;
    private codeSubs: CodeSources;
    public usePreferredUnits = false;

    constructor() {
        this.unitConvs = units['unitConversionResult'];
        this.codeSubs = codes['codeSubstitutionResult'];
    }

    setPreferredUnits(element: DataElements) {
        this.usePreferredUnits
        ? (
            element.value = element.preferredValue,
            element.unit = element.preferredUnit
        ) : (
            element.value = element.preciseValue,
            element.unit = element.preciseUnit
        );
    }

    codeSubstitution(value: string, codeSrc: string, codeTyp: string): CodeResult {
        return this.subsList(codeSrc, codeTyp)
                .find(curr => curr['textValue'] === value);
    }

    private subsList(codeSrc: string, codeTyp: string): CodeResult[] {
        return ((this.validCodeSubstitution(codeSrc, codeTyp))
                ? this.codeSubs[codeSrc][codeTyp]
                : []);
    }

    private validCodeSubstitution(codeSrc: string, codeTyp: string): boolean {
        return this.codeSubs.hasOwnProperty(codeSrc)
            && this.codeSubs[codeSrc].hasOwnProperty(codeTyp);
    }

    createConversion(elementID: string,
                     elementValue: string,
                     elementUnit: string,
                     preferredUnit: string,
                     elementPrecision: number): ConvertedValues {

        const applyPrecision = (value: number, base: number): number =>
            Math.round(value * base) / base;

        const convertUnit = (value: number, conversion: UnitConversion[]): number =>
            (value * conversion['multiplier']) + conversion['offset'];

        const converted: ConvertedValues = {
            originalValue: elementValue,
            originalUnit: elementUnit,
            preferredValue: elementValue,
            preferredUnit: elementUnit
        };

        if ('MSNG' === elementValue) {
            if (preferredUnit !== '') {
                converted.preferredUnit = preferredUnit;
            }
            return converted;
        }

        const elementNumericValue = Number(elementValue);
        let preferredNumericValue = elementNumericValue;

        if (isNaN(elementNumericValue)) {
            return converted;
        }

        if (this.validUnitConversion(elementUnit, preferredUnit)) {
            const conversion: UnitConversion[] = this.unitConvs[elementUnit][preferredUnit];

            preferredNumericValue = convertUnit(elementNumericValue, conversion);
            converted.preferredUnit = preferredUnit;
            converted.preferredValue = String(preferredNumericValue);
        }

        if (elementPrecision != null) {
            const base = 10 ** elementPrecision;

            converted.originalValue = String(applyPrecision(elementNumericValue, base));
            converted.preferredValue = String(applyPrecision(preferredNumericValue, base));
        }

        return converted;

    }

    private validUnitConversion(fromUnit: string, toUnit: string): boolean {
        return !!toUnit
            && this.unitConvs.hasOwnProperty(fromUnit)
            && this.unitConvs[fromUnit].hasOwnProperty(toUnit);
    }
}

