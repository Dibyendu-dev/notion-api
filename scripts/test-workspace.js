import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

const testCreateWorkspace = async () => {
  const testUserId = "test-user-" + Date.now();
  const token = generateTestToken(testUserId);

  try {
    const response = await fetch("http://localhost:3000/api/workspaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Test Workspace " + new Date().toISOString(),
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\n✓ Workspace created successfully!");
    } else {
      console.log("\n✗ Failed to create workspace");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

testCreateWorkspace();
