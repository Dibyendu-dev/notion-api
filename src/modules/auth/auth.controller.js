import { createClerkClient } from "@clerk/express";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../../common/errors/base.error.js";
import { sendMagicLinkEmail } from "../../common/services/email.service.js";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const register = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required");
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
      return next(new BadRequestError(clerkError.message || "Registration failed"));
    }
    
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestError("Invalid email format");
    }

    const users = await clerk.users.getUserList({
      emailAddress: email,
      limit: 1,
    });

    if (users.data.length === 0) {
      return res.status(200).json({
        message: "If an account with that email exists, a magic link has been sent",
      });
    }

    const user = users.data[0];

    const signInToken = await clerk.signInTokens.createSignInToken({
      userId: user.id,
      expiresInSeconds: 600,
    });

    const magicLinkUrl = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/verify?token=${signInToken.token}`;

    await sendMagicLinkEmail(email, magicLinkUrl, user.firstName);

    res.json({
      message: "If an account with that email exists, a magic link has been sent",
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      throw new BadRequestError("Token is required");
    }

    const signInToken = await clerk.signInTokens.getSignInToken(token);

    if (!signInToken || signInToken.status !== "pending") {
      throw new UnauthorizedError("Invalid or expired token");
    }

    const user = await clerk.users.getUser(signInToken.userId);

    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res.json({ message: "Logged out successfully" });
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
