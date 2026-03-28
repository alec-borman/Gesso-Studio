<div align="center">
  <h1>Gesso Studio 1.0: The Visual Blueprint</h1>
  <p><b>The Sovereign System of Record for Visual Intent</b></p>
  <p><i>A Deterministic Substrate Protocol for the Generative Era</i></p>
</div>

---

## 👁️ The Vision: Recovering Atomic Intent

In the current generative landscape, visual assets are treated as **Implicit State** (bitmaps). A PNG or JPEG stores only the resulting color of a coordinate, stripping away the forces, geometry, and material physics that created it. This "Flattening Problem" results in a total loss of **Visual Provenance**, making surgical editing, version control, and cross-platform realization impossible without destructive re-processing.

**Gesso is the recovery of Explicit State.** It is a deterministic, declarative Domain-Specific Language (DSL) that defines visual space as a sequence of **Material Negotiations**. Instead of storing flattened pixels, Gesso stores pigment chemistry, brush dynamics, and volumetric logic. By shifting the "Source of Truth" from the resulting image to the underlying instruction set, Gesso provides a universal "Narrow Waist" between high-level AI imagination and physical/computational execution.

-----
## ⛓️ The Blockchain Implementation: Intent as a Hard Asset

Current Non-Fungible Token (NFT) standards rely on "Implicit Pointers"—the token contains a URL pointing to a static bitmap stored on a centralized server or IPFS. If the storage provider fails or the link breaks, the visual asset is lost.

**Gesso transforms the NFT from a pointer to a protocol.** Because Gesso source files are lightweight and deterministic, the fundamental logic of the artwork is stored directly in the smart contract’s state, ensuring the work exists as long as the blockchain itself.

### 1. On-Chain Logic & Atomic Storage
A high-fidelity 8k PNG can exceed 50MB, making on-chain storage economically impossible. A Gesso source file representing the same work typically averages **2KB to 10KB**. This allows the "Source of Truth" (the AST) to be stored in calldata or contract state, providing true **Atomic Provenance**.

### 2. Forensic Provenance & Deterministic Verification
Gesso enables **Mathematical Witnessing**. Since the realization engine is deterministic, a smart contract or third-party auditor can verify that a specific visual output is the unique, bit-identical result of a specific on-chain instruction set. This eliminates "Generative Hallucination" and establishes a verifiable chain of custody for every pigment negotiation and brush stroke.

### 3. Renderer-Agnostic Longevity
Digital art is traditionally "trapped" in the resolution and color space of its creation era. Gesso assets are immune to technological obsolescence.
* **2026:** Realized as a 2D Canvas preview via the Simulation Track.
* **2030:** Realized in a VR environment with full PBR volumetric lighting.
* **2035:** Realized by a 6-axis robotic arm into a physical oil painting.
The **Intent** (the token) remains immutable; only the power of the **Realizer** grows.

### 4. Dynamic Substrates & Programmable Mutation
Through the **Projectional Loop**, a Gesso NFT can be "Living Infrastructure." A smart contract can allow the owner to mutate specific variables—such as shifting the `viscosity` of the paint or the `lighting` azimuth—by interacting with the chain. The AST mutates on-chain, and the realization updates across all platforms instantly, governed by the artist’s original logical constraints.

---

## 💎 The Substrate License Model

Gesso shifts the value proposition from "Owning a Result" to **"Stewardship of Intent."** Owning a Gesso-based asset acts as a **Substrate License**. It grants the holder the sovereign right to "Eject" the realization into any format—digital, volumetric, or physical—without losing the mathematical connection to the original artist’s specification. It moves digital art from a speculative commodity to a professional **Product Lifecycle Management (PLM)** asset.

## ⚖️ The Sovereignty Mandate

Current generative pipelines rely on centralized "Black Box" SaaS providers, creating existential risks for professional creators regarding **Data Residency**, **Copyright Traceability**, and **Platform Lock-in**.

Gesso restores the **Ownership Chain** through a three-pillared mandate:

1.  **Local-First Execution**: Gesso Studio utilizes a Rust-based compiler targeting WebAssembly (Wasm). All parsing, material resolution, and rendering happen on the client side. Your intent never leaves your machine.
2.  **Archival Determinism**: A Gesso file is not a suggestion; it is a mandate. It yields bit-identical results regardless of the rendering hardware, ensuring that visual assets are archival and legally defensible.
3.  **Sovereign Distribution**: Designed for decentralized deployment (Cloudflare Pages/R2), ensuring the infrastructure remains operational independent of any single corporate entity or cloud gatekeeper.

-----

## 🏗️ Ecosystem Architecture: The Dual-Track Mandate

Gesso is engineered to maintain absolute parity between rapid browser-based prototyping and production-grade realization.

### 1\. The Simulation Track (TypeScript / `/src`)

A high-speed iteration environment designed for the **Projectional DAW** workflow.

  * **LL(1) Recursive Descent Parser**: A zero-latency engine that validates Gesso grammar against the EBNF spec in real-time.
  * **Projectional Mutation**: A bi-directional loop where UI interactions (dragging, scaling) perform real-time mutations on the Abstract Syntax Tree (AST).
  * **Profile A Renderer**: A browser-native implementation utilizing the HTML5 Canvas and WebGL for 60fps creative feedback.

### 2\. The Production Track (Rust / `/gessoc`)

The "Steel" layer of the project, designed for heavy computation and high-fidelity output.

  * **gessoc**: A pure-function Rust core used for headless exports and CLI-based automation.
  * **Profile C (Volumetric)**: A Physically Based Rendering (PBR) engine that simulates light interaction with paint height (Impasto), metallic reflectance, and substrate porosity.
  * **gessod**: A master daemon for physical realization, delegating instructions to CNC plotters and robotic painting arms via the **Visual Delegation Protocol (VDP)**.

-----

## 🧠 Intelligence Layer: Addendum H (RAG)

To ensure high-velocity development and architectural consistency, Gesso Studio features a built-in **Semantic Knowledge Layer**.

  * **AST-Aware Indexing**: The project uses `web-tree-sitter` to index the codebase by logical symbols (functions, interfaces, material definitions) rather than raw text. This ensures AI assistants understand the project's "nervous system."
  * **Architectural Traceability**: The Audit Engine maps specific code blocks to the Gesso v1.0.0 Specification, providing "Definitive Evidence" of feature compliance.
  * **Semantic Console**: Contributors can query the project’s internal logic using `npm run search`.

-----

## 💻 Language in Action

Gesso strictly decouples the **Physics** (The Medium) from the **Logic** (The Composition).

```gesso
gesso "1.0" {
  meta @{ 
    title: "Sovereign Study No. 1", 
    format: "8000x8000px",
    provenance: "local-first-wasm"
  }

  %% 1. DEFINE THE PHYSICS (Materials)
  def charcoal "Willow" style=brush @{ hardness: 0.2, texture: gritty }
  def oil_crimson "Alizarin" style=paint @{ color: #E30022, flow: 0.05, gloss: 0.8 }

  %% 2. DEFINE THE LOGIC (Layers)
  layer "Substrate" {
    rect size: [100%, 100%], fill: #E9E5CE %% Heavy Linen
  }

  layer "Intent" {
    %% mix() resolves to deterministic pigment math
    circle pos: [50%, 50%], radius: 25%, fill: mix(oil_crimson, #FFFFFF, 0.2)
    
    %% Control lanes: Dynamic modulation along a path
    path "Main Contour" @{
      points: [[10%, 10%, 90%, 90%]],
      stroke: charcoal,
      control: stroke_width = [2, 15, 5]
    }
  }
}
```

-----

## 🚀 Getting Started

### Prerequisites

  * **Node.js** (v20+ LTS)
  * **Rust** (Stable) + `wasm-pack` (for core modifications)

### Installation & Launch

```bash
# Clone the repository
git clone https://github.com/your-org/gesso-studio.git
cd gesso-studio

# Build the sovereign core
npm run build:wasm

# Start the interactive studio
npm install
npm run dev
```

### Knowledge Management

```bash
# Refresh the semantic database for the RAG assistant
npm run index

# Query architectural context
npm run search "How does the Eject Protocol handle relative coordinates?"
```

-----

## 🗺️ Roadmap: The Realization Horizon

  * **Phase 1 (Released)**: Base Geometry, Material Specification, and Bi-directional Sync.
  * **Phase 2 (Q3 2026)**: Volumetric Impasto Engine (Normal-mapped WebGL shaders for paint depth).
  * **Phase 3 (Q4 2026)**: Hardware Delegation (VDP support for 6-axis robotic painters).
  * **Phase 4 (Q1 2027)**: Semantic Decompiler (Reverse-inference engine for raster-to-Gesso migration).

-----

## 📜 Standards & Contribution

We maintain a **Zero-Warning Policy**. All pull requests must pass strict TypeScript and Rust linter checks with no errors. Every new feature must be semantically tagged to maintain RAG traceability.

### License

Released under the **MIT License**.

-----


## 👤 Creator & Maintainer

Gesso Studio 1.0 was conceived and built by **Alec Borman** – a systems architect, Rust/Wasm engineer, and the creator of the Tenuto language. Gesso extends the same deterministic, archival‑first philosophy from music notation to visual art.

- **LinkedIn:** [Alec Borman](https://www.linkedin.com/in/alec-borman-9680b3160/)
- **GitHub:** [@alec-borman](https://github.com/alec-borman)

For inquiries, collaborations, or to discuss the future of sovereign creative infrastructure, reach out directly.
© 2026 Gesso Working Group. **Deterministic Intent. Sovereign Execution. Explicit Logic.**
