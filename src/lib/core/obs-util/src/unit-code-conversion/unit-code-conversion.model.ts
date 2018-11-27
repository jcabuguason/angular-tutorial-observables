export interface CodeSources {
    [codeSource: string]: CodeTypes;
}

export interface CodeTypes {
    [codeType: string]: CodeResult[];
}

export interface CodeResult {
    codeValue: string;
    textValue: string;
    en?: string;
    fr?: string;
}

export interface UnitConversionResult {
    unitConversionResult: FromUnits;
}

export interface FromUnits {
    [fromUnits: string]: ToUnits;
}

export interface ToUnits {
    [toUnits: string]: UnitConversion[];
}

export interface UnitConversion {
    multiplier: number;
    offset: number;
}

export interface ConvertedValues {
    originalValue: string;
    originalUnit: string;
    preferredValue: string;
    preferredUnit: string;
}
