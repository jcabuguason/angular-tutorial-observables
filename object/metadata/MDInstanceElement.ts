export interface MDInstanceElement {
    def_id: string;
    group: string;
    id: string;
    index: string;
    name: string;
    uom: string;
    value: string;
    language: {
        english: string,
        french: string
    }
    instelements: MDInstanceElement[];
}
