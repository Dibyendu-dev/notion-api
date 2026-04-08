import "dotenv/config";
import { createClerkClient } from "@clerk/express";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function testRegister() {
  const email = "uniqueuser12345@test.com";
  const password = "MySecurePass2024!";
  
  try {
    console.log("Testing registration with:");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("");
    
    const user = await clerk.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: "Test",
      lastName: "User",
    });
    
    console.log("✅ User created successfully!");
    console.log("User ID:", user.id);
    console.log("Email:", user.emailAddresses[0]?.emailAddress);
  } catch (error) {
    console.error("❌ Error occurred:");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Errors:", JSON.stringify(error.errors, null, 2));
    console.error("Full response:", JSON.stringify(error.response?.data, null, 2));
  }
}

testRegister();
