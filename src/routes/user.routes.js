import express from "express";

// Utils
import { hashPasswordWithSalt } from "./../utils/hash.js";
import { createUserToken } from "./../utils/token.js";

// Request Validation
import {
  signUpRequestSchema,
  loginRequestSchema,
} from "./../validation/request.validation.js";

// User Service
import { getUserByEmail, createUser } from "./../services/user.service.js";

export const userRouter = express.Router();

// Handle user signup
userRouter.post("/signup", async (req, res) => {
  try {
    // Validate request body
    const validationSignUpRequest = await signUpRequestSchema.parseAsync(
      req.body,
    );
    const { firstname, lastname, email, password } = validationSignUpRequest;

    // Check existing user
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: `User with email ${email} already exists` });
    }

    // Hash password with salt

    const { hashedPassword, salt } = hashPasswordWithSalt(password);

    // Create new user with both hash and salt stored
    const newUser = await createUser(
      firstname,
      lastname,
      email,
      hashedPassword,
      salt,
    );
    res.status(201).json({ data: { userId: newUser.id } });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
});

// Handle user login
userRouter.post("/login", async (req, res) => {
  try {
    const validationLoginRequest = await loginRequestSchema.parseAsync(
      req.body,
    );

    if (validationLoginRequest.error) {
      return res.status(400).json({ error: validationLoginRequest.error });
    }

    const { email, password } = validationLoginRequest;

    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .status(400)
        .json({ error: `User with email ${email} does not exist` });
    }

    const { hashedPassword } = hashPasswordWithSalt(password, user.salt);

    if (hashedPassword !== user.password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token

    const userToken = await createUserToken({ id: user.id });

    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //   expiresIn: "5m",
    // });
    res.status(200).json({ data: { userToken } });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
});
