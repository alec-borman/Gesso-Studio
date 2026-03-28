# Contributing to Gesso v1.0.0

Welcome to the Gesso Working Group. We are building a professional, visitor-focused project with high architectural standards.

## 🌟 The Gesso Standard

Every contribution must adhere to the following principles:

1.  **Zero-Warning Policy**: All code must pass `npm run lint` and `npm run build` without warnings.
2.  **Spec Alignment**: Every new feature must be mapped to a specific Addendum in the Gesso v1.0.0 Specification.
3.  **Testing Rules**: All core logic (parsing, resolving, rendering, ejecting) must be verified in the TypeScript Sandbox before being proposed for the Rust Core.
4.  **Semantic Documentation**: Use JSDoc for all public functions and interfaces to ensure the RAG indexer can correctly categorize them.

## 🛠️ Development Workflow

1.  **Fork and Clone**: Standard GitHub flow.
2.  **Feature Branching**: Use descriptive names like `feature/addendum-g-interactivity`.
3.  **The Projectional Loop**: When adding UI features, ensure they support the "Live Loop" (canvas-to-editor mutation).
4.  **Audit Verification**: Run `npm run index` after significant changes and verify that the **Project Health / RAG** panel reflects the new implementation.

## 🏗️ Project Structure

- `src/`: Core TypeScript Sandbox logic.
- `infra/`: Infrastructure for indexing and RAG.
- `docs/`: Specification and design documents.

## 📜 Code of Conduct

We are committed to a welcoming and inclusive community. Please be respectful and constructive in all interactions.

---

&copy; 2026 Gesso Working Group
