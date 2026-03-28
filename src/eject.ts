/**
 * Gesso Eject Protocol - Sprint 4
 * Serializes a Gesso AST back into a spec-compliant source string.
 */

import { GessoDocument, GessoValue } from "./ast";

export function eject(doc: GessoDocument): string {
  let output = `gesso "${doc.version}" {\n`;
  
  // Meta
  output += `  meta @{\n`;
  for (const [key, val] of Object.entries(doc.meta)) {
    output += `    ${key}: ${serializeValue(val)},\n`;
  }
  output += `  }\n\n`;

  // Definitions
  for (const def of doc.definitions) {
    output += `  def ${def.id} "${def.label || ""}" ${def.style ? `style=${def.style} ` : ""}@{\n`;
    for (const [key, val] of Object.entries(def.attributes)) {
      output += `    ${key}: ${serializeValue(val)},\n`;
    }
    output += `  }\n\n`;
  }

  // Layers
  for (const layer of doc.layers) {
    output += `  layer "${layer.id}" {\n`;
    for (const p of layer.primitives) {
      output += `    ${p.type}${p.id ? ` "${p.id}"` : ""} @{\n`;
      for (const [key, val] of Object.entries(p.attributes)) {
        output += `      ${key}: ${serializeValue(val)},\n`;
      }
      output += `    }\n`;
    }
    output += `  }\n`;
  }

  output += `}\n`;
  return output;
}

function serializeValue(val: GessoValue): string {
  if (typeof val === "string") {
    if (val.startsWith("#")) return val;
    return `"${val}"`;
  }
  if (typeof val === "number") return val.toString();
  if (typeof val === "boolean") return val.toString();
  
  switch (val.type) {
    case "dimension": return `${val.value}${val.unit || ""}`;
    case "identifier": return val.name;
    case "array": return `[${val.values.map(serializeValue).join(", ")}]`;
    case "map": {
      let s = `@{ `;
      const entries = Object.entries(val.entries);
      entries.forEach(([k, v], i) => {
        s += `${k}: ${serializeValue(v)}${i < entries.length - 1 ? ", " : ""}`;
      });
      return s + ` }`;
    }
    case "function_call": return `${val.name}(${val.args.map(serializeValue).join(", ")})`;
    default: return "";
  }
}
