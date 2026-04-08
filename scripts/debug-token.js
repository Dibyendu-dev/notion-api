import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecretKey";
console.log("Using:", JWT_SECRET);

const testUserId = "test-user-" + Date.now();
const token = jwt.sign({ id: testUserId }, JWT_SECRET, { expiresIn: "1h" });
console.log("Token:", token);
console.log("Decoded:", jwt.verify(token, JWT_SECRET));
