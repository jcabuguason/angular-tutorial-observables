import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FromUnits, UnitConversion, CodeSources, CodeResult, UnitConversionResult } from './unit-code-conversion.model';
import { UNIT_CODE_CONVERSION_CONFIG, UnitCodeConversionConfig } from './unit-code-conversion.config';

import { ObsElement } from '../dms-observation.model';

import { Observable } from 'rxjs';

@Injectable()
export class UnitCodeConversionService {
  public unitConvs: Observable<UnitConversionResult>;
  public codeSubs: CodeSources;
  public usePreferredUnits = false;

  constructor(
    @Inject(UNIT_CODE_CONVERSION_CONFIG)
    private config: UnitCodeConversionConfig,
    private http: HttpClient,
  ) {
    this.unitConvs = this.http.get<any>(`${this.config.endpoint}/units.json`);
    // Old static codes file removed. Either use client-provided list (i.e. MIDAS) or grab from Core
    // this.codeSubs = this.http.get<any>(`${this.config.endpoint}/codes.json`);
  }

  setPreferredUnits(element: ObsElement, options?: any) {
    this.usePreferredUnits
      ? ((element.value = element.preferredValue), (element.unit = element.preferredUnit))
      : ((element.value = element.preciseValue), (element.unit = element.preciseUnit));
  }

  findMatchingCode(
    value: string,
    codeSrc: string,
    codeTyp: string,
    fromValue: 'textValue' | 'codeValue' = 'textValue',
  ): CodeResult {
    return this.getCodesFromSrcType(codeSrc, codeTyp).find((curr) => curr[fromValue] === value);
  }

  getCodesFromSrcType(codeSrc: string, codeTyp: string): CodeResult[] {
    return this.isValidCodeSub(codeSrc, codeTyp) ? this.codeSubs[codeSrc][codeTyp] : [];
  }

  private isValidCodeSub(codeSrc: string, codeTyp: string): boolean {
    return this.codeSubs.hasOwnProperty(codeSrc) && this.codeSubs[codeSrc].hasOwnProperty(codeTyp);
  }

  convertElement(element: ObsElement, unitConversions: FromUnits, preferredUnit: string, elementPrecision?: number) {
    const applyPrecision = (value: number, base: number): number => Math.round(value * base) / base;

    const convertUnit = (value: number, conversion: UnitConversion): number =>
      value * conversion['multiplier'] + conversion['offset'];

    const validUnitConversion = (fromUnit: string, toUnit: string): boolean =>
      !!toUnit && unitConversions.hasOwnProperty(fromUnit) && unitConversions[fromUnit].hasOwnProperty(toUnit);

    element.preciseValue = element.value;
    element.preciseUnit = element.unit;
    element.preferredValue = element.value;
    element.preferredUnit = element.unit;

    if ('MSNG' === element.value) {
      if (preferredUnit !== '') {
        element.preferredUnit = preferredUnit;
      }
      return;
    }

    const elementNumericValue = Number(element.value);
    let preferredNumericValue = elementNumericValue;

    if (isNaN(elementNumericValue)) {
      return;
    }

    if (validUnitConversion(element.unit, preferredUnit)) {
      const conversion: UnitConversion = unitConversions[element.unit][preferredUnit];

      preferredNumericValue = convertUnit(elementNumericValue, conversion);
      element.preferredUnit = preferredUnit;
      element.preferredValue = String(preferredNumericValue);
    }

    if (elementPrecision != null) {
      const base = 10 ** elementPrecision;

      element.preciseValue = String(applyPrecision(elementNumericValue, base));
      element.preferredValue = String(applyPrecision(preferredNumericValue, base));
    }
  }
}
