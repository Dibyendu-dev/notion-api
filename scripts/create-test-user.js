import "dotenv/config";
import { createClerkClient } from "@clerk/express";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function createTestUser() {
  const email = process.argv[2] || "test@example.com";
  const password = process.argv[3] || "testpassword123";
  
  try {
    const user = await clerk.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: "Test",
      lastName: "User",
    });
    
    console.log("✅ User created!");
    console.log("User ID:", user.id);
    console.log("Email:", email);
    console.log("Password:", password);
    
    const token = await clerk.session.createToken(user.id, {
      expiresInSeconds: 3600
    });
    
    console.log("\n🔑 Session Token:");
    console.log(token);
    
    console.log("\n📝 Use in Postman:");
    console.log(`Authorization: Bearer ${token}`);
  } catch (error) {
    console.error("Error:", error.errors || error.message);
  }
}

createTestUser();
