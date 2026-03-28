/**
 * Gesso Resolver - Sprint 2
 * Resolves identifiers and dimensions into final values for rendering.
 */

import { GessoValue, Def, GessoDocument } from "./ast.ts";

export type ResolvedValue = string | number | boolean | any[] | Record<string, any>;

export function resolveDocument(doc: GessoDocument): GessoDocument {
  const resolvedLayers = doc.layers.map((layer) => {
    const lastState: Record<string, GessoValue> = {};
    let cursorX = 0;
    let cursorY = 0;
    const padding = 20;

    const resolvedPrimitives = layer.primitives.map((p) => {
      const attrs = { ...p.attributes };

      // Sticky State Resolution
      const stickyKeys = ["fill", "stroke", "stroke_width", "brush"];
      stickyKeys.forEach((key) => {
        if (attrs[key] === undefined && lastState[key] !== undefined) {
          attrs[key] = lastState[key];
        } else if (attrs[key] !== undefined) {
          lastState[key] = attrs[key];
        }
      });

      // Relative Positioning (Flow Layout)
      if (attrs.pos === undefined) {
        attrs.pos = { type: "array", values: [cursorX, cursorY] };
      } else {
        const pos = resolveValue(attrs.pos, doc.definitions) as number[];
        if (Array.isArray(pos)) {
          cursorX = pos[0];
          cursorY = pos[1];
        }
      }

      // Calculate width for next element
      let width = 0;
      if (p.type === "rect") {
        const size = resolveValue(
          attrs.size || { type: "array", values: [100, 100] },
          doc.definitions
        ) as number[];
        width = Array.isArray(size) ? size[0] : 100;
      } else if (p.type === "circle") {
        const radius = resolveValue(
          attrs.radius || { type: "dimension", value: 50 },
          doc.definitions
        ) as number;
        width = (typeof radius === "number" ? radius : 50) * 2;
      } else if (p.type === "path") {
        const points = resolveValue(
          attrs.points || { type: "array", values: [] },
          doc.definitions
        ) as any[];
        if (Array.isArray(points)) {
          let minX = Infinity, maxX = -Infinity;
          points.forEach((seg) => {
            if (Array.isArray(seg)) {
              if (seg.length === 8) {
                minX = Math.min(minX, seg[0], seg[6]);
                maxX = Math.max(maxX, seg[0], seg[6]);
              } else if (seg.length === 2) {
                minX = Math.min(minX, seg[0]);
                maxX = Math.max(maxX, seg[0]);
              }
            }
          });
          width = (maxX - minX) > 0 ? (maxX - minX) : 100;
        } else {
          width = 100;
        }
      }

      // Update cursor for next
      const currentPos = resolveValue(attrs.pos, doc.definitions) as number[];
      if (Array.isArray(currentPos)) {
        cursorX = currentPos[0] + width + padding;
      }

      return { ...p, attributes: attrs };
    });

    return { ...layer, primitives: resolvedPrimitives };
  });

  return { ...doc, layers: resolvedLayers };
}

export function updatePrimitivePos(
  doc: GessoDocument,
  layerId: string,
  primitiveIndex: number,
  newX: number,
  newY: number
): GessoDocument {
  const newLayers = doc.layers.map((layer) => {
    if (layer.id !== layerId) return layer;

    const newPrimitives = layer.primitives.map((p, i) => {
      if (i !== primitiveIndex) return p;
      return {
        ...p,
        attributes: {
          ...p.attributes,
          pos: { type: "array", values: [newX, newY] } as any,
        },
      };
    });

    return { ...layer, primitives: newPrimitives };
  });

  return { ...doc, layers: newLayers };
}

export function resolveValue(
  value: GessoValue,
  definitions: Def[]
): ResolvedValue {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  switch (value.type) {
    case "function_call": {
      if (value.name === "mix") {
        const color1 = resolveValue(value.args[0], definitions);
        const color2 = resolveValue(value.args[1], definitions);
        const ratio = resolveValue(value.args[2], definitions) as number;
        return mixColors(color1, color2, ratio);
      }
      return value;
    }
    case "identifier": {
      // Look up in definitions
      const found = definitions.find((d) => d.id === value.name);
      if (found) {
        // If it's a paint or color-like def, we usually want its 'color' attribute
        if (found.attributes.color) {
          return resolveValue(found.attributes.color, definitions);
        }
        // Fallback to the whole attribute map if no specific 'color'
        return resolveMap(found.attributes, definitions);
      }
      // If not found, return the name as a string (might be a named color or built-in)
      return value.name;
    }
    case "dimension":
      // For Sprint 2, we just return the numeric value
      // In later sprints, we might handle unit conversion
      return value.value;
    case "array":
      return value.values.map((v) => resolveValue(v, definitions));
    case "map":
      return resolveMap(value.entries, definitions);
    default:
      return value;
  }
}

function resolveMap(
  entries: Record<string, GessoValue>,
  definitions: Def[]
): Record<string, any> {
  const resolved: Record<string, any> = {};
  for (const [key, value] of Object.entries(entries)) {
    resolved[key] = resolveValue(value, definitions);
  }
  return resolved;
}

function mixColors(c1: any, c2: any, ratio: number): string {
  const rgb1 = parseColor(c1);
  const rgb2 = parseColor(c2);
  
  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function parseColor(c: any): { r: number; g: number; b: number } {
  const colorStr = typeof c === "string" ? c : (c.color || "#000000");
  
  if (colorStr.startsWith("#")) {
    const hex = colorStr.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b };
  }
  
  const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }
  
  return { r: 0, g: 0, b: 0 };
}
