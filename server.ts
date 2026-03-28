import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "1.0.0" });
  });

  // Serve the codebase index
  app.get("/api/index", (req, res) => {
    const indexPath = path.join(process.cwd(), "codebase_index.json");
    if (fs.existsSync(indexPath)) {
      const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
      res.json(index);
    } else {
      res.status(404).json({ error: "Index not found. Run 'npm run index' first." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Gesso Server running on http://localhost:${PORT}`);
  });
}

startServer();
