import "dotenv/config";
import { createClerkClient } from "@clerk/express";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function getToken() {
  const email = process.argv[2];
  
  if (!email) {
    console.log("Usage: node scripts/get-token.js <email>");
    console.log("\n📋 List of users:");
    const users = await clerk.users.getUserList({ limit: 10 });
    users.data.forEach(u => {
      const emailAddr = u.emailAddresses[0]?.emailAddress;
      console.log(`  ${emailAddr} (${u.id})`);
    });
    return;
  }
  
  const users = await clerk.users.getUserList({ 
    emailAddress: email,
    limit: 1 
  });
  
  if (users.data.length === 0) {
    console.error("User not found!");
    return;
  }
  
  const user = users.data[0];
  const token = await clerk.session.createToken(user.id, {
    expiresInSeconds: 3600
  });
  
  console.log("✅ Token generated!");
  console.log("User ID:", user.id);
  console.log("Email:", email);
  console.log("\n🔑 Token:");
  console.log(token);
  console.log("\n📝 Curl command to test:");
  console.log(`curl -X POST http://localhost:3000/api/workspaces \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{"name": "My Workspace"}'`);
}

getToken();
