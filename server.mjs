import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";
import pg from "pg";
import { createServer as createViteServer } from "vite";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5000);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the local application.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const json = (response, status, payload) => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
};

const readRequestBody = async (request) => {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error("Request body is too large.");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

const handleApi = async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && url.pathname === "/api/health") {
    const result = await pool.query("SELECT NOW() AS database_time");
    return json(response, 200, { ok: true, database: "connected", databaseTime: result.rows[0].database_time });
  }

  if (request.method === "GET" && url.pathname === "/api/events") {
    const requestedLimit = Number(url.searchParams.get("limit") || 50);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
    const result = await pool.query(
      "SELECT id, event_type, view_id, payload, created_at FROM app_events ORDER BY created_at DESC LIMIT $1",
      [limit],
    );
    return json(response, 200, { events: result.rows });
  }

  if (request.method === "POST" && url.pathname === "/api/events") {
    const body = await readRequestBody(request);
    const eventType = typeof body.eventType === "string" ? body.eventType.trim() : "";
    const viewId = typeof body.viewId === "string" ? body.viewId.trim() : "";
    if (!eventType || !viewId) return json(response, 400, { error: "eventType and viewId are required." });

    const payload = body.payload && typeof body.payload === "object" ? body.payload : {};
    const result = await pool.query(
      "INSERT INTO app_events (event_type, view_id, payload) VALUES ($1, $2, $3::jsonb) RETURNING id, event_type, view_id, payload, created_at",
      [eventType, viewId, JSON.stringify(payload)],
    );
    return json(response, 201, { event: result.rows[0] });
  }

  if (request.method === "GET" && url.pathname === "/api/settings") {
    const result = await pool.query("SELECT setting_key, setting_value, updated_at FROM workspace_settings ORDER BY setting_key");
    return json(response, 200, { settings: result.rows });
  }

  if (request.method === "PUT" && url.pathname === "/api/settings") {
    const body = await readRequestBody(request);
    const key = typeof body.key === "string" ? body.key.trim() : "";
    if (!key || !/^[a-z_][a-z0-9_]*$/.test(key)) return json(response, 400, { error: "A valid setting key is required." });

    const value = body.value ?? null;
    const result = await pool.query(
      `INSERT INTO workspace_settings (setting_key, setting_value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW()
       RETURNING setting_key, setting_value, updated_at`,
      [key, JSON.stringify(value)],
    );
    return json(response, 200, { setting: result.rows[0] });
  }

  return json(response, 404, { error: "API route not found." });
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const serveProductionFile = async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.resolve(__dirname, "dist", `.${requestedPath}`);
  if (!filePath.startsWith(path.resolve(__dirname, "dist"))) return json(response, 400, { error: "Invalid path." });

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) return json(response, 404, { error: "Not found." });
    response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(await readFile(filePath));
  } catch {
    json(response, 404, { error: "Not found." });
  }
};

const start = async () => {
  await pool.query("SELECT 1");
  const isProduction = process.env.NODE_ENV === "production";
  const vite = isProduction ? null : await createViteServer({
    server: { middlewareMode: true, hmr: false, host: "0.0.0.0", allowedHosts: true },
  });

  const server = http.createServer(async (request, response) => {
    try {
      if (request.url?.startsWith("/api/")) {
        await handleApi(request, response);
        return;
      }
      if (isProduction) {
        await serveProductionFile(request, response);
        return;
      }
      vite.middlewares(request, response, () => json(response, 404, { error: "Not found." }));
    } catch (error) {
      console.error(error);
      if (!response.headersSent) json(response, 500, { error: "Request failed." });
      else response.end();
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Local application server listening on port ${port}`);
  });
};

start().catch((error) => {
  console.error("Unable to start application:", error);
  process.exitCode = 1;
});