// Associate these words together

export class EquivalentKeywords {
    /**
     * Constructor for EquivalentKeywords
     * @param key Main keyword to refer it to
     * @param equivalents The other equivalent words
     */
    constructor(
        private key: string,
        private equivalents: string[]
    ) { }

    getKey(): string {
        return this.key;
    }

    getEquivalents(): string[] {
        return this.equivalents;
    }

}
