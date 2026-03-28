/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from "react";
import { Parser } from "./parser";
import { GessoCanvas } from "./CanvasRenderer";
import { GessoDocument } from "./ast";
import { resolveDocument, updatePrimitivePos } from "./resolver";
import { eject } from "./eject";
import { verifySpecAlignment, EvidenceReport, CodebaseIndex, CodeChunk } from "./rag_engine";

export default function App() {
  const [source, setSource] = useState<string>(`
rect size: [100, 100], fill: #FF0000
circle radius: 50
path points: [
  [0, 0, 100, -100, 200, 100, 300, 0]
], stroke: #0000FF, stroke_width: 4
  `.trim());
  const [ast, setAst] = useState<GessoDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState<CodebaseIndex | null>(null);
  const [evidence, setEvidence] = useState<EvidenceReport | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "rag">("editor");

  useEffect(() => {
    try {
      const parser = new Parser(source);
      const rawAst = parser.parse();
      const resolved = resolveDocument(rawAst);
      setAst(resolved);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  }, [source]);

  // Fetch the real index from the server
  useEffect(() => {
    fetch("/api/index")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setIndex(data);
        }
      })
      .catch(err => console.error("Failed to fetch index:", err));
  }, []);

  const handleEject = () => {
    if (ast) {
      const explicitSource = eject(ast);
      setSource(explicitSource);
    }
  };

  const handleExport = () => {
    const projectData = {
      name: "Gesso Sketch",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      source,
      ast
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gesso-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrimitiveMove = (layerId: string, index: number, x: number, y: number) => {
    if (!ast) return;
    const updatedAst = updatePrimitivePos(ast, layerId, index, x, y);
    // Immediately eject to sync source
    const newSource = eject(updatedAst);
    setSource(newSource);
  };

  const generateEvidence = () => {
    if (index) {
      const report = verifySpecAlignment("Interactivity", index);
      setEvidence(report);
    }
  };

  const indexCoverage = useMemo(() => {
    if (!index) return 0;
    const chunks = index;
    const totalSymbols = chunks.length;
    const highCriticality = chunks.filter(c => c.criticality === "high").length;
    return Math.round((highCriticality / totalSymbols) * 100);
  }, [index]);

  return (
    <div className="p-8 font-mono bg-zinc-100 min-h-screen text-zinc-900">
      <header className="mb-8 flex justify-between items-end border-b border-zinc-300 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-900">
            Gesso <span className="text-blue-600 font-light">v1.0.0</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">
            Public Release Prep :: The Narrow Waist
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="text-[10px] bg-zinc-200 hover:bg-zinc-300 text-zinc-900 px-4 py-2 rounded uppercase tracking-widest transition-colors font-bold"
          >
            Export Project
          </button>
          <button 
            onClick={handleEject}
            className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded uppercase tracking-widest transition-colors font-bold shadow-md"
          >
            Eject Protocol
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === "editor" ? "rag" : "editor")}
            className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded uppercase tracking-widest transition-colors shadow-lg"
          >
            {activeTab === "editor" ? "Project Health" : "Back to Editor"}
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Realization
          </h2>
          {ast && <GessoCanvas ast={ast} onPrimitiveMove={handlePrimitiveMove} />}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 shadow-lg">
              <h3 className="font-black uppercase text-sm mb-2">Compiler Error</h3>
              <pre className="text-xs whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </section>

        <section className="space-y-6">
          {activeTab === "editor" ? (
            <>
              <div>
                <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">
                  Sketch Editor
                </h2>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-300 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <textarea
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="relative w-full h-[400px] xl:h-[600px] bg-zinc-900 text-zinc-300 p-5 rounded-lg overflow-auto text-[11px] leading-relaxed shadow-2xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 font-mono resize-none"
                    spellCheck={false}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">
                  Resolved State
                </h2>
                <div className="bg-white border border-zinc-200 rounded-lg p-4 text-[10px] overflow-auto max-h-[200px] shadow-sm">
                  {ast?.layers.map(layer => (
                    <div key={layer.id} className="mb-4">
                      <div className="font-bold text-zinc-400 mb-2 uppercase tracking-tighter">Layer: {layer.id}</div>
                      {layer.primitives.map((p, i) => (
                        <div key={i} className="mb-1 pl-2 border-l border-zinc-100">
                          <span className="text-zinc-500">{p.type}</span> pos: {JSON.stringify(p.attributes.pos)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-xl space-y-6">
              <h2 className="text-xs uppercase tracking-widest text-zinc-900 font-black border-b border-zinc-100 pb-2">
                Project Health / RAG
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 p-4 rounded border border-zinc-100">
                  <div className="text-[10px] uppercase text-zinc-400 mb-1">Index Coverage</div>
                  <div className="text-2xl font-black text-zinc-900">{indexCoverage}%</div>
                </div>
                <div className="bg-zinc-50 p-4 rounded border border-zinc-100">
                  <div className="text-[10px] uppercase text-zinc-400 mb-1">Symbols</div>
                  <div className="text-2xl font-black text-zinc-900">{index ? index.length : 0}</div>
                </div>
              </div>

              <div>
                <button 
                  onClick={generateEvidence}
                  className="w-full text-[10px] bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-3 rounded uppercase tracking-widest transition-colors font-bold"
                >
                  Generate Evidence
                </button>
              </div>

              {evidence && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="p-4 bg-green-50 border border-green-100 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase text-green-800">{evidence.feature}</span>
                      <span className="text-[9px] bg-green-200 text-green-900 px-2 py-0.5 rounded-full font-bold uppercase">{evidence.status}</span>
                    </div>
                    <p className="text-[11px] text-green-900 leading-relaxed mb-3">
                      {evidence.evidence}
                    </p>
                    <div className="text-[9px] text-green-700 font-bold uppercase tracking-tighter">
                      Spec Section: {evidence.specSection}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[9px] uppercase text-zinc-400 font-bold">Definitive Evidence</div>
                    {evidence.snippets.map((s, i) => (
                      <div key={i} className="text-[10px] bg-zinc-900 text-zinc-400 p-2 rounded font-mono border border-zinc-800">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-100">
                <div className="text-[9px] uppercase text-zinc-400 font-bold mb-2">Recent Symbols</div>
                <div className="flex flex-wrap gap-1">
                  {index && index.slice(0, 12).map(s => (
                    <span key={s.id} className="text-[8px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded border border-zinc-200">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t border-zinc-200 flex justify-between items-center text-[9px] text-zinc-400 uppercase tracking-widest">
        <div>Deterministic Compositional Logic</div>
        <div>&copy; 2026 Gesso Working Group</div>
      </footer>
    </div>
  );
}
