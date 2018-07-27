import { Injectable } from '@angular/core';

import { FromUnits, UnitConversion, CodeSources, CodeResult } from './unit-code-conversion.model';

const units = require('./units.json');
const codes = require('./codes.json');

@Injectable()
export class UnitCodeConversionService {

    private unitConvs: FromUnits;
    private codeSubs: CodeSources;

    constructor() {
        this.unitConvs = units['unitConversionResult'];
        this.codeSubs = codes['codeSubstitutionResult'];
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

    unitConversion(value: string, fromUnit: string, toUnit: string): string {

        if (isNaN(Number(value))) {
            return value;
        }

        if (this.validUnitConversion(fromUnit, toUnit)) {

            const conversion: UnitConversion[] = this.unitConvs[fromUnit][toUnit];

            return String((Number(value) * conversion['multiplier']) + conversion['offset']);

        } else {
            return value;
        }

    }

    private validUnitConversion(fromUnit: string, toUnit: string): boolean {
        return this.unitConvs.hasOwnProperty(fromUnit)
            && this.unitConvs[fromUnit].hasOwnProperty(toUnit);
    }
}

