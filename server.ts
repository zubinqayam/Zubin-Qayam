import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Provider Proxy Routes
  app.post("/api/ai/chat", async (req, res) => {
    const { provider, model, messages, prompt } = req.body;
    
    // In a real production app, we would look up keys from a secure vault
    // Here we simulate the proxying to external providers
    console.log(`[Proxy] Routing request to ${provider} (${model})`);

    try {
      // Mocking provider response for the orchestration demo
      // In a real implementation, you would use SDKs like 'openai' or '@google/genai'
      // using process.env.OPENAI_API_KEY, etc.
      
      const startTime = Date.now();
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));

      const latency = Date.now() - startTime;

      // This is a simplified normalization for the demo
      const mockResponse = {
        model,
        content: `[Architectural Proxy Response via ${provider}] I've processed your request using localized routing governance. Operational integrity is maintained.`,
        usage: {
          prompt_tokens: 124,
          completion_tokens: 45,
          total_cost: 0.002
        },
        latency
      };

      res.json(mockResponse);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false 
      },
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
    console.log(`[Enterprise Orchestrator] Server running on http://localhost:${PORT}`);
  });
}

startServer();
