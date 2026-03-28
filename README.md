# Gesso v1.0.0: The Narrow Waist for Visual Space

Gesso is a high-fidelity, bi-directional generative art DSL (Domain Specific Language) and sandbox. It serves as a "Narrow Waist" between high-level artistic intent and low-level rendering primitives, providing a unified interface for both human creators and AI collaborators.

## 🎨 The Vision

Gesso is built on the principle of **Frictionless Sketching**. It allows artists to move from raw ideas to spec-compliant code through a projectional loop where the canvas and the editor are one.

- **Sketch Mode**: Start typing primitives without headers. Gesso scaffolds the document for you.
- **Sticky State**: Attributes like `fill` and `brush` inherit from previous elements, reducing boilerplate.
- **The Eject Protocol**: One-click transformation from a "sketch" to a professional, spec-compliant Gesso source file.

## 🏗️ Ecosystem Architecture

Gesso follows a **Dual-Track Mandate**:

1.  **TypeScript Sandbox (Simulation)**: This repository. A high-speed iteration environment for verifying features, hit-testing, and interactivity.
2.  **Rust Core (Steel)**: The production-grade rendering engine (forthcoming), designed for high-performance exports and native integration.

## 🧠 The Intelligence Layer (RAG)

Gesso v1.0.0 features a built-in **AST-Aware RAG (Retrieval-Augmented Generation)** system. Every function, interface, and primitive in the codebase is semantically indexed.

- **Project Health Audit**: Real-time verification of feature implementation against the Gesso v1.0.0 Specification.
- **Evidence Engine**: Generates "Proof of Work" reports by retrieving the exact lines of code responsible for specific features.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

### Key Scripts

- `npm run dev`: Start the interactive sandbox.
- `npm run index`: Re-index the codebase for the RAG engine.
- `npm run search`: Query the codebase using semantic search.

## 📜 License

Gesso is released under the MIT License.

---

&copy; 2026 Gesso Working Group
