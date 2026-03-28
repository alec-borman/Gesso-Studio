/**
 * Gesso AST (Abstract Syntax Tree) Interfaces - Sprint 1
 * Strictly represents the parsed data structure for the Gesso DSL.
 */

export type GessoValue =
  | string
  | number
  | boolean
  | GessoDimension
  | GessoArray
  | GessoMap
  | GessoIdentifier
  | GessoFunctionCall;

export interface GessoFunctionCall {
  type: "function_call";
  name: string;
  args: GessoValue[];
}

export interface GessoDimension {
  type: "dimension";
  value: number;
  unit?: string;
}

export interface GessoArray {
  type: "array";
  values: GessoValue[];
}

export interface GessoMap {
  type: "map";
  entries: Record<string, GessoValue>;
}

export interface GessoIdentifier {
  type: "identifier";
  name: string;
}

export interface GessoDocument {
  version: string;
  meta: Record<string, GessoValue>;
  definitions: Def[];
  layers: Layer[];
}

export interface Def {
  id: string;
  label?: string;
  style?: string;
  attributes: Record<string, GessoValue>;
}

export interface Layer {
  id: string;
  primitives: Primitive[];
  controls: ControlLane[];
}

export interface ControlLane {
  property: string;
  values: GessoValue[];
  times?: GessoValue[];
  curve?: string;
}

export interface Primitive {
  type: string;
  id?: string;
  attributes: Record<string, GessoValue>;
}
