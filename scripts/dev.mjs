// Runs the API (port 5000) and the website (port 5173) together. Ctrl+C stops both.
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const procs = [
  spawn("npm run dev", { cwd: path.join(root, "server"), stdio: "inherit", shell: true }),
  spawn("npm run dev", { cwd: path.join(root, "client"), stdio: "inherit", shell: true })
];
const stop = () => procs.forEach((p) => { try { p.kill(); } catch { /* already stopped */ } });
process.on("SIGINT", () => { stop(); process.exit(0); });
process.on("SIGTERM", () => { stop(); process.exit(0); });
procs.forEach((p) => p.on("exit", (code) => { if (code) { stop(); process.exit(code); } }));
