/**
 * Gesso Parser - Sprint 1
 * Recursive Descent (LL1) parser for the Gesso DSL.
 */

import { GessoDocument, Def, GessoValue } from "./ast.ts";
import { Lexer, Token, TokenType } from "./lexer.ts";

export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(source: string) {
    const processed = this.preprocess(source);
    const lexer = new Lexer(processed);
    this.tokens = lexer.tokenize();
  }

  private preprocess(source: string): string {
    const trimmed = source.trim();
    if (trimmed.startsWith("gesso")) {
      return source;
    }

    // Auto-scaffold raw primitives into a default document structure
    return `
gesso "1.0" {
  meta @{
    title: "Gesso Sketch",
    format: "1200x800px",
    background: #ffffff
  }
  
  def canvas "Canvas" style=surface @{
    type: digital,
    size: [1200px, 800px],
    color: #ffffff
  }

  layer "Sketch" {
    ${source}
  }
}
    `;
  }

  public parse(): GessoDocument {
    this.consume(TokenType.Keyword, "gesso", "Expected 'gesso' keyword at start of document");
    const version = this.consume(TokenType.StringLiteral, null, "Expected version string literal").value;
    this.consume(TokenType.Punctuation, "{", "Expected '{' after gesso version");

    const doc: GessoDocument = {
      version,
      meta: {},
      definitions: [],
      layers: [],
    };

    while (!this.isAtEnd() && !this.checkPunctuation("}")) {
      const token = this.peek();
      
      if (token.type === TokenType.Keyword && token.value === "meta") {
        this.advance();
        doc.meta = this.parseMap();
      } else if (token.type === TokenType.Keyword && token.value === "def") {
        this.advance();
        doc.definitions.push(this.parseDef());
      } else if (token.type === TokenType.Keyword && token.value === "layer") {
        this.advance();
        doc.layers.push(this.parseLayer());
      } else if (
        token.type === TokenType.Punctuation && token.value === "@" && this.peekNext().value === "target"
      ) {
        // Still halt on target for now as it's not in Sprint 2 scope
        return doc;
      } else {
        throw new Error(`Unexpected token '${token.value}' at line ${token.line}, col ${token.column}`);
      }
    }

    this.consume(TokenType.Punctuation, "}", "Expected '}' at end of document");
    return doc;
  }

  private parseDef(): Def {
    const id = this.consume(TokenType.Identifier, null, "Expected identifier for def block").value;
    
    let label: string | undefined;
    if (this.check(TokenType.StringLiteral)) {
      label = this.advance().value;
    }

    let style: string | undefined;
    if (this.matchKeyword("style")) {
      this.consume(TokenType.Punctuation, "=", "Expected '=' after style");
      style = this.consume(TokenType.Identifier, null, "Expected identifier after style=").value;
    }

    const attributes = this.parseMap();

    return { id, label, style, attributes };
  }

  private parseMap(): Record<string, GessoValue> {
    this.consume(TokenType.Punctuation, "@", "Expected '@' before map '{'");
    this.consume(TokenType.Punctuation, "{", "Expected '{' for map start");

    const entries: Record<string, GessoValue> = {};

    if (!this.checkPunctuation("}")) {
      while (true) {
        const key = this.consume(TokenType.Identifier, null, "Expected identifier as map key").value;
        this.consume(TokenType.Punctuation, ":", "Expected ':' after map key");
        entries[key] = this.parseValue();
        
        if (!this.matchPunctuation(",")) break;
        if (this.checkPunctuation("}")) break; // Handle trailing comma
      }
    }

    this.consume(TokenType.Punctuation, "}", "Expected '}' at end of map");
    return entries;
  }

  private parseValue(): GessoValue {
    const token = this.peek();

    if (token.type === TokenType.StringLiteral) {
      return this.advance().value;
    }

    if (token.type === TokenType.HexColor) {
      return this.advance().value;
    }

    if (token.type === TokenType.Boolean) {
      return this.advance().value === "true";
    }

    if (token.type === TokenType.Dimension) {
      const val = this.advance().value;
      const match = val.match(/^([\d.-]+)([a-z%]+)?$/);
      if (match) {
        const num = parseFloat(match[1]);
        const unit = match[2];
        return { type: "dimension", value: num, unit };
      }
      return val;
    }

    if (token.type === TokenType.Identifier) {
      const name = this.advance().value;
      if (this.checkPunctuation("(")) {
        this.advance(); // consume (
        const args: GessoValue[] = [];
        if (!this.checkPunctuation(")")) {
          do {
            args.push(this.parseValue());
          } while (this.matchPunctuation(","));
        }
        this.consume(TokenType.Punctuation, ")", "Expected ')' after function arguments");
        return { type: "function_call", name, args };
      }
      return { type: "identifier", name };
    }

    if (token.type === TokenType.Punctuation && token.value === "[") {
      return { type: "array", values: this.parseArray() };
    }

    if (token.type === TokenType.Punctuation && token.value === "@") {
      return { type: "map", entries: this.parseMap() };
    }

    throw new Error(`Unexpected value token '${token.value}' at line ${token.line}, col ${token.column}`);
  }

  private parseArray(): GessoValue[] {
    this.advance(); // consume [
    const values: GessoValue[] = [];

    if (!this.checkPunctuation("]")) {
      while (true) {
        values.push(this.parseValue());
        if (!this.matchPunctuation(",")) break;
        if (this.checkPunctuation("]")) break; // Handle trailing comma
      }
    }

    this.consume(TokenType.Punctuation, "]", "Expected ']' at end of array");
    return values;
  }

  private parseLayer(): any {
    const id = this.consume(TokenType.StringLiteral, null, "Expected layer name string").value;
    this.consume(TokenType.Punctuation, "{", "Expected '{' after layer name");

    const primitives: any[] = [];
    const controls: any[] = [];
    while (!this.isAtEnd() && !this.checkPunctuation("}")) {
      if (this.matchKeyword("control")) {
        controls.push(this.parseControlLane());
      } else {
        primitives.push(this.parsePrimitive());
      }
    }

    this.consume(TokenType.Punctuation, "}", "Expected '}' at end of layer");
    return { id, primitives, controls };
  }

  private parseControlLane(): any {
    this.consume(TokenType.Punctuation, ":", "Expected ':' after control keyword");
    const property = this.consume(TokenType.Identifier, null, "Expected property name for control lane").value;
    this.consume(TokenType.Punctuation, "=", "Expected '=' in control lane");
    
    let values: any[] = [];
    if (this.checkPunctuation("[")) {
      values = (this.parseValue() as any).values;
    } else {
      values = [this.parseValue()];
    }

    // Optional times and curve
    let times: any[] | undefined;
    let curve: string | undefined;

    while (this.matchPunctuation(",")) {
      const key = this.consume(TokenType.Identifier, null, "Expected key (time, curve) in control lane").value;
      this.consume(TokenType.Punctuation, "=", "Expected '=' after control key");
      if (key === "time") {
        times = (this.parseValue() as any).values;
      } else if (key === "curve") {
        curve = (this.parseValue() as any).name || (this.parseValue() as any);
      }
    }

    return { property, values, times, curve };
  }

  private parsePrimitive(): any {
    const type = this.consume(TokenType.Identifier, null, "Expected primitive type (rect, circle, path, etc.)").value;
    
    let id: string | undefined;
    if (this.check(TokenType.StringLiteral)) {
      id = this.advance().value;
    }

    let attributes: Record<string, GessoValue> = {};
    if (this.checkPunctuation("@")) {
      attributes = this.parseMap();
    } else {
      attributes = this.parseInlineAttributes();
    }

    return { type, id, attributes };
  }

  private parseInlineAttributes(): Record<string, GessoValue> {
    const attributes: Record<string, GessoValue> = {};
    
    // Inline attributes are Identifier ":" Value ("," Identifier ":" Value)*
    // We check if the next token is an identifier followed by a colon
    while (this.check(TokenType.Identifier) && this.peekNext().value === ":") {
      const key = this.advance().value;
      this.consume(TokenType.Punctuation, ":", "Expected ':' after attribute key");
      attributes[key] = this.parseValue();
      
      this.matchPunctuation(",");
    }

    return attributes;
  }

  private matchKeyword(val: string): boolean {
    if (this.check(TokenType.Keyword) && this.peek().value === val) {
      this.advance();
      return true;
    }
    return false;
  }

  private consume(type: TokenType, value: string | null, message: string): Token {
    if (this.check(type) && (value === null || this.peek().value === value)) {
      return this.advance();
    }
    const token = this.peek();
    throw new Error(`${message} (Found '${token.value}' at line ${token.line}, col ${token.column})`);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private checkPunctuation(val: string): boolean {
    return this.check(TokenType.Punctuation) && this.peek().value === val;
  }

  private matchPunctuation(val: string): boolean {
    if (this.checkPunctuation(val)) {
      this.advance();
      return true;
    }
    return false;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private peekNext(): Token {
    return this.tokens[this.current + 1] || this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
