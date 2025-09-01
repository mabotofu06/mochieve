import express, { Express } from "express";

const app: Express = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, message: "wip-share server running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// サンプル: WorkGroup 詳細を返す（フロントと連携するための例）
app.get("/api/workgroup/:id", (req, res) => {
  const id = req.params.id;
  res.json({ id, title: "sample group", images: [], note: "" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});