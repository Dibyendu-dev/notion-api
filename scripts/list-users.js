import "dotenv/config";
import { createClerkClient } from "@clerk/express";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function listUsers() {
  try {
    const users = await clerk.users.getUserList({ limit: 50 });
    
    console.log(`📋 Found ${users.data.length} users:\n`);
    
    users.data.forEach((u, i) => {
      const email = u.emailAddresses[0]?.emailAddress || "No email";
      const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "No name";
      console.log(`${i + 1}. ${name}`);
      console.log(`   ID: ${u.id}`);
      console.log(`   Email: ${email}`);
      console.log(`   Created: ${u.createdAt}`);
      console.log("");
    });
  } catch (error) {
    console.error("Error:", error.errors || error.message);
  }
}

listUsers();
