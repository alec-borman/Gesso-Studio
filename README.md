<div align="center">
  <h1>Gesso Studio 1.0: The Semantic Brush</h1>
  <p><b>The Definitive System of Record for Visual Intent</b></p>
  <p><i>A PLM (Product Lifecycle Management) for Generative Art</i></p>
  <br/>
</div>

---

## 🎨 The Vision: System of Record for Visual Space

What if you could capture every nuance of a visual masterpiece—the brush stiffness, paint viscosity, pigment mixing ratios, light reflectance, and even the directional flow of a palette knife—in a single, human‑readable text file? What if that same file could be instantly rendered as a high‑performance WebGL preview, a production-grade 8k raster, or a set of precise coordinates for a robotic painting arm?

**Gesso is that file.** It is a deterministic, declarative domain‑specific language designed to be the **standard output format for AI vision models**, providing a transparent, editable, and versionable alternative to "Black Box" latent space generation. It unifies the discrete logic of geometric primitives with the continuous physics of material mediums into a single, human-readable "Narrow Waist" protocol. Like a CAD system consolidates engineering intent, Gesso consolidates every aspect of a visual work—from the substrate texture to the specular glint of metallic threads—into a single, version‑controllable format.

### The "Narrow Waist" Philosophy
Gesso Studio 1.0 is built on a philosophy of **strict decoupling** between the pure-function parser and the physical realization layers. 
* **The Compiler**: Operates as a pure function, taking a Gesso source string and deterministically outputting an Abstract Syntax Tree (AST) and a resolved material map. It has no concept of pixels, shaders, or screens.
* **The Physics & Rendering Layers**: The WebGL/WebGPU Profile A engine and the high-fidelity Rust Profile C engine act purely as consumers of the compiler's output. They never assume the internal state of the compiler, ensuring memory safety, immutability, and infinite scalability.

### 🏗️ The Ecosystem Architecture
- **gessoc (The Brain):** A pure-function Rust compiler (wasm32) that transforms Gesso source into a mathematical representation of visual intent.
- **Gesso Studio Web (The Interface):** A high-performance Projectional IDE utilizing React, Monaco, and a bi-directional "Projectional Loop" for live direct manipulation.
- **gessod (The Muscle):** A Rust-based daemon for real-world realization, orchestrating CNC routers, robotic painting arms, and external path-tracing renderers.
- **Profile A Renderer (The Pixels):** A browser-native WebGL implementation for real-time 60fps interaction and "Sketch Mode" verification.

---

## 🧠 Intelligence Layer: Addendum H (RAG)

To maintain a 10x development velocity and ensure architectural consistency, Gesso Studio implements **Retrieval-Augmented Generation (RAG)**. The local LanceDB indexer is now **LIVE**.

- **Semantic Indexing:** AST-aware chunking via Tree-sitter ensures logical blocks (definitions, layers, and material resolvers) remain intact for AI analysis.
- **Spec-Traceability:** The built-in Audit Engine fetches definitive evidence from the codebase to prove adherence to the Gesso v1.0.0 Specification.
- **Domain Tagging:** Every code vector is tagged by architectural domain (`compiler`, `renderer`, `physics`, `ui`), ensuring the AI collaborator remains focused on the relevant layer.

### Using the Semantic Console

**Note:** A valid `GEMINI_API_KEY` must be present in the `.env` file in the root directory for these scripts to function.

```bash
# To map the current codebase to the vector database:
npm run index

# To search the database for context before writing new code:
npm run search "How does the resolver handle LERP math for the mix() function?"
```

---

## 🏗️ Current State: The Iterative Hybrid Architecture

We are currently in an active, pragmatic, and highly iterative development phase governed by the **Dual-Track Mandate**:

* **TypeScript Scaffolding (Live Web Preview):** Currently, the TypeScript frontend handles the heavy lifting of AST parsing and "Profile A" rendering. This is intentional *scaffolding* that allows us to rapidly prototype material physics and immediately visualize the results in the browser.
* **Rust Core (`gessoc`) (The Steel):** The high-performance Rust core (compiled to WebAssembly) acts as our robust engine for "Profile C" rendering. It is the absolute single source of truth for the Gesso language and the material physics engine.
* **Projectional Loop:** The bi-directional sync is fully operational. Dragging a shape on the canvas performs a real-time mutation of the Abstract Syntax Tree, which is then "Ejected" back into the source code, closing the loop between human intuition and code-based precision.

---

## 🗺️ The Roadmap: Turning Scaffolding into Steel

As we transition from our v1.0.0 release to the final production suite, we are systematically replacing our rapid-prototyping scaffolding with enterprise-grade infrastructure:

* **Phase 1: The Rust Port:** Migrating the finalized TypeScript LL(1) parser entirely into the Rust `gessoc` crate. This maximizes performance for massive-scale files and establishes Rust as the sovereign authority.
* **Phase 2: Volumetric Shaders:** Expanding the "Profile A" renderer to support PBR (Physically Based Rendering), utilizing normal maps to simulate 3D paint ridges (Impasto) and metallic reflectance.
* **Phase 3: Daemon Orchestration:** Hardening the `gessod` daemon for CNC/Robotic delegation, allowing Gesso to transition from the screen to physical canvas.
* **Phase 4: Semantic Decompiler:** Implementing Addendum D to allow for the decompilation of existing raster images into editable, low-token Gesso intent files.

---

## 🚀 Deployment & Sovereignty: High-Fidelity Distribution

Gesso Studio 1.0 is designed for **Zero-Cost, High-Fidelity Distribution**:

* **Hosting:** Distributed via Cloudflare Pages with native COOP/COEP headers to unlock high-performance multi-threaded rendering.
* **Sovereignty:** 100% client-side execution via Wasm; no server-side "Gatekeepers" are required for compilation or rendering.

### Embedding Gesso Canvases (Web Component)

You can easily embed interactive Gesso artworks on any webpage using the framework-agnostic `<gesso-canvas>` Web Component.

```html
<script type="module" src="[https://gesso.dev/gesso-canvas.js](https://gesso.dev/gesso-canvas.js)"></script>

<gesso-canvas src="[https://my-art.gesso](https://my-art.gesso)"></gesso-canvas>
```

---

## 💻 Language in Action

Gesso 1.0 introduces stateful material logic and powerful pigment mixing for precise control over artistic expression.

```gesso
gesso "1.0" {
  meta @{ title: "Crimson Swirl", lighting: 315deg }
  
  def crimson "Heavy Oil" style=paint @{ color: #E30022, medium: oil, flow: 0.05 }
  def gold "Gold Thread" style=paint @{ color: #FFD700, medium: metallic, gloss: high }
  
  layer "Impasto" {
    %% The .mix() function resolves to deterministic pigment math
    circle pos: [50%, 50%], radius: 30%, fill: mix(crimson, gold, 0.2)
    
    %% Control lanes handle variable thickness along paths
    path "Gold Streak" @{
      points: [[20%, 80%, 80%, 20%]],
      stroke: gold,
      control: stroke_width = [2, 10, 2]
    }
  }
}
```

---

## 🤖 The AI Bridge: From Intent to Infrastructure

Because Gesso is a text-based DSL, it is natively "fluent" in LLM (Large Language Model) contexts. Unlike a flattened PNG, an AI can read, write, and refactor Gesso code to perform complex visual tasks that would take hours in a traditional GUI.

### Producer Interaction Example

**Prompt:** *"Give me a dark minimalist canvas with a single neon blue streak that starts thin and gets thick. Add a rough linen texture to the substrate."*

**Gesso Output:**
```gesso
// AI-Generated minimalist structure
def substrate "Rough Linen" style=surface @{ texture: linen, color: #111 }
def neon_blue "Blue Glow" style=paint @{ color: #00F, gloss: luminous }

layer "Main" {
  path "Streak" @{
    points: [[10%, 50%, 90%, 50%]],
    stroke: neon_blue,
    control: stroke_width = [1, 25] // Creates the swelling width effect
  }
}
```

---

## 🚀 Advanced Development Setup

#### 1. General Prerequisites
* **Node.js** (v18+ LTS)
* **Rust** (Stable) via [rustup.rs](https://rustup.rs)
* **wasm-pack**: `cargo install wasm-pack`

#### 2. Local Build Flow
```bash
# 1. Compile the Rust Core
cd gessoc
wasm-pack build --target web --out-dir ../public/pkg

# 2. Launch the Studio
cd ..
npm install
npm run dev
```

---

## 📜 License

Gesso Studio is released under the MIT License.

&copy; 2026 Gesso Working Group
