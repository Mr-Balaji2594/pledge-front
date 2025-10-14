import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagePath = path.resolve(__dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

if (!pkg.version) pkg.version = "1.0.0";

const versionParts = pkg.version.split(".").map(Number);
versionParts[2]++; // increment patch
const newVersion = versionParts.join(".");

pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

console.log(`\x1b[32m✔ Application version upgraded to ${newVersion}\x1b[0m`);
