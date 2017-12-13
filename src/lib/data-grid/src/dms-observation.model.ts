export interface DMSObs {
    identity: string;
    obsDate: string;
    location: Location;
    receivedDate: string;
    parentIdentity: string;
    author: Author;
    jsonVersion: string;
    rawMessage: RawMessage;
    metadataElements: MetadataElements[];
    dateElements: DataElements[];
}

export interface Author {
    build: string;
    name: string;
    version: number;
}

export interface Location {
    type: string;
    coordinates: string;
}

export interface RawMessage {
    header: string;
    message: string;
}

export interface MetadataElements {
    name: string;
    value: string;
    unit: string;
}

export interface DataElements {
    name: string;
    value: string;
    unit: string;
    elementID: string;
    index: number;
}
