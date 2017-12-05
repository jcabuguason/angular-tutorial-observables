export class ParseError extends Error {
  constructor(e: string) {
    super("ParseError: " + e);
  }
}