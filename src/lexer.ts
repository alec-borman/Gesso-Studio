/**
 * Gesso Lexer - Sprint 1
 * Converts raw Gesso source code into a stream of discrete tokens.
 */

export enum TokenType {
  Keyword = "Keyword",
  Identifier = "Identifier",
  StringLiteral = "StringLiteral",
  HexColor = "HexColor",
  Dimension = "Dimension",
  Boolean = "Boolean",
  Punctuation = "Punctuation",
  EOF = "EOF",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export class Lexer {
  private pos = 0;
  private line = 1;
  private column = 1;

  constructor(private source: string) {}

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    while (!this.isAtEnd()) {
      this.skipWhitespaceAndComments();
      if (this.isAtEnd()) break;

      const char = this.peek();

      // String Literals
      if (char === '"') {
        tokens.push(this.readString());
        continue;
      }

      // Hex Colors
      if (char === "#") {
        tokens.push(this.readHexColor());
        continue;
      }

      // Numbers and Dimensions
      if (this.isDigit(char) || (char === "-" && this.isDigit(this.peekNext()))) {
        tokens.push(this.readNumberOrDimension());
        continue;
      }

      // Identifiers, Keywords, Booleans
      if (this.isAlpha(char)) {
        tokens.push(this.readIdentifierOrKeyword());
        continue;
      }

      // Punctuation
      if ("{}@[]:,=()".includes(char)) {
        tokens.push({
          type: TokenType.Punctuation,
          value: this.advance(),
          line: this.line,
          column: this.column - 1,
        });
        continue;
      }

      throw new Error(`Unexpected character '${char}' at line ${this.line}, col ${this.column}`);
    }

    tokens.push({ type: TokenType.EOF, value: "", line: this.line, column: this.column });
    return tokens;
  }

  private readString(): Token {
    const startCol = this.column;
    this.advance(); // Skip opening "
    let value = "";
    while (!this.isAtEnd() && this.peek() !== '"') {
      if (this.peek() === "\n") {
        this.line++;
        this.column = 1;
      }
      value += this.advance();
    }
    if (this.isAtEnd()) throw new Error("Unterminated string literal");
    this.advance(); // Skip closing "
    return { type: TokenType.StringLiteral, value, line: this.line, column: startCol };
  }

  private readHexColor(): Token {
    const startCol = this.column;
    let value = this.advance(); // Skip #
    while (!this.isAtEnd() && this.isHexDigit(this.peek())) {
      value += this.advance();
    }
    return { type: TokenType.HexColor, value, line: this.line, column: startCol };
  }

  private readNumberOrDimension(): Token {
    const startCol = this.column;
    let value = "";
    if (this.peek() === "-") value += this.advance();
    while (!this.isAtEnd() && this.isDigit(this.peek())) value += this.advance();
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      value += this.advance();
      while (!this.isAtEnd() && this.isDigit(this.peek())) value += this.advance();
    }

    // Check for units
    let unit = "";
    const units = ["px", "mm", "in", "pt", "deg", "%", "s"];
    for (const u of units) {
      if (this.source.startsWith(u, this.pos)) {
        unit = u;
        for (let i = 0; i < u.length; i++) this.advance();
        break;
      }
    }

    return {
      type: TokenType.Dimension,
      value: unit ? `${value}${unit}` : value,
      line: this.line,
      column: startCol,
    };
  }

  private readIdentifierOrKeyword(): Token {
    const startCol = this.column;
    let value = "";
    while (!this.isAtEnd() && (this.isAlphaNumeric(this.peek()) || this.peek() === "_")) {
      value += this.advance();
    }

    if (value === "true" || value === "false") {
      return { type: TokenType.Boolean, value, line: this.line, column: startCol };
    }

    const keywords = ["gesso", "meta", "def", "layer", "style", "control"];
    if (keywords.includes(value)) {
      return { type: TokenType.Keyword, value, line: this.line, column: startCol };
    }

    return { type: TokenType.Identifier, value, line: this.line, column: startCol };
  }

  private skipWhitespaceAndComments(): void {
    while (!this.isAtEnd()) {
      const char = this.peek();
      if (char === " " || char === "\r" || char === "\t") {
        this.advance();
      } else if (char === "\n") {
        this.advance();
        this.line++;
        this.column = 1;
      } else if (char === "%" && this.peekNext() === "%") {
        // Line comment
        while (!this.isAtEnd() && this.peek() !== "\n") this.advance();
      } else {
        break;
      }
    }
  }

  private isAtEnd(): boolean {
    return this.pos >= this.source.length;
  }

  private peek(): string {
    return this.source[this.pos] || "";
  }

  private peekNext(): string {
    return this.source[this.pos + 1] || "";
  }

  private advance(): string {
    const char = this.source[this.pos++];
    this.column++;
    return char;
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isHexDigit(c: string): boolean {
    return this.isDigit(c) || (c >= "a" && c <= "f") || (c >= "A" && c <= "F");
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
}
