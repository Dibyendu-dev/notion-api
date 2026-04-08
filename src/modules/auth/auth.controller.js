import { createClerkClient } from "@clerk/express";
import { BadRequestError, UnauthorizedError } from "../../common/errors/base.error.js";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    if (password.length < 8) {
      throw new BadRequestError("Password must be at least 8 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestError("Invalid email format");
    }

    const existingUsers = await clerk.users.getUserList({
      emailAddress: email,
      limit: 1,
    });

    if (existingUsers.data.length > 0) {
      throw new BadRequestError("User with this email already exists");
    }

    const user = await clerk.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: firstName || "User",
      lastName: lastName || "",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.errors && error.errors.length > 0) {
      const clerkError = error.errors[0];
      if (clerkError.code === "form_identifier_exists") {
        return next(new BadRequestError("User with this email already exists"));
      }
      if (clerkError.code === "form_password_length_too_short") {
        return next(new BadRequestError("Password must be at least 8 characters"));
      }
      if (clerkError.code === "form_password_requirement_not_met") {
        return next(new BadRequestError("Password must contain at least one uppercase letter, lowercase letter, and number"));
      }
      if (clerkError.code === "form_password_pwned") {
        return next(new BadRequestError("Password has been found in a data breach. Please choose a different password"));
      }
      return next(new BadRequestError(clerkError.message || "Registration failed"));
    }
    
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const users = await clerk.users.getUserList({
      emailAddress: email,
      limit: 1,
    });

    if (users.data.length === 0) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const user = users.data[0];

    try {
      const signInAttempt = await clerk.signIns.createSignInAttempt({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status !== "complete" || !signInAttempt.createdSessionId) {
        throw new UnauthorizedError("Invalid email or password");
      }

      const session = await clerk.sessions.createSession(signInAttempt.createdSessionId);

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token: session.token,
        sessionId: session.id,
      });
    } catch (signInError) {
      throw new UnauthorizedError("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    
    if (sessionId) {
      await clerk.sessions.revokeSession(sessionId);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await clerk.users.getUser(userId);

    res.json({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    next(error);
  }
};
