/**
 * Gesso RAG Engine - Sprint 6
 * Verifies spec alignment using indexed codebase evidence.
 */

export interface CodeChunk {
  id: string;
  file: string;
  name: string;
  type: string;
  content: string;
  startLine: number;
  endLine: number;
  criticality: string;
  domain: string;
  version: string;
}

export type CodebaseIndex = CodeChunk[];

export interface EvidenceReport {
  feature: string;
  specSection: string;
  evidence: string;
  status: "Spec Compliant" | "Partial" | "Missing";
  snippets: string[];
}

const SPEC_MAP: Record<string, { section: string; requirements: string[] }> = {
  "Pigment Mixing": {
    section: "Addendum F.2",
    requirements: ["Implement LERP math for RGB", "Support nested mix() calls"],
  },
  "Variable Strokes": {
    section: "Addendum C.2",
    requirements: ["Segment Bezier curves", "Interpolate lineWidth via control lanes"],
  },
  "Sticky State": {
    section: "Addendum C.3",
    requirements: ["Inherit fill/stroke from previous primitive"],
  },
  "Interactivity": {
    section: "Addendum G",
    requirements: ["Implement hit-testing", "Source-sync mutation via eject()"],
  },
};

export function verifySpecAlignment(
  featureName: string,
  index: CodebaseIndex
): EvidenceReport {
  const spec = SPEC_MAP[featureName];
  if (!spec) {
    return {
      feature: featureName,
      specSection: "Unknown",
      evidence: "No spec definition found for this feature.",
      status: "Missing",
      snippets: [],
    };
  }

  const snippets: string[] = [];
  let evidence = "";

  const findChunk = (name: string) => index.find(c => c.name === name);

  if (featureName === "Pigment Mixing") {
    const mixFunc = findChunk("mixColors");
    const resolveVal = findChunk("resolveValue");
    
    if (mixFunc) {
      snippets.push(`${mixFunc.file} lines ${mixFunc.startLine}-${mixFunc.endLine}`);
      evidence = `${mixFunc.file} lines ${mixFunc.startLine}-${mixFunc.endLine} implement LERP math for RGB.`;
    }
    
    if (resolveVal && resolveVal.content.includes("mix")) {
      evidence += ` Nested mix() support confirmed in resolveValue.`;
    }
  } else if (featureName === "Interactivity") {
    const hitTest = findChunk("getPrimitiveAt");
    const mutation = findChunk("updatePrimitivePos");
    const mouseMove = findChunk("handleMouseMove");

    if (hitTest) {
      snippets.push(`${hitTest.file} lines ${hitTest.startLine}-${hitTest.endLine}`);
      evidence += `Hit-testing logic found in ${hitTest.file}. `;
    }
    if (mutation) {
      snippets.push(`${mutation.file} lines ${mutation.startLine}-${mutation.endLine}`);
      evidence += `AST mutation logic found in ${mutation.file}. `;
    }
    if (mouseMove) {
      snippets.push(`${mouseMove.file} lines ${mouseMove.startLine}-${mouseMove.endLine}`);
      evidence += `Live loop sync found in ${mouseMove.file}. `;
    }
  }

  return {
    feature: featureName,
    specSection: spec.section,
    evidence: evidence || "No direct evidence found in codebase index.",
    status: evidence ? "Spec Compliant" : "Missing",
    snippets,
  };
}
